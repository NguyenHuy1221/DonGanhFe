import { memo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import { fetchProductsById, fetchBienThe } from "../../../api/productService";
import Bredcrumb from "../bredcrumb";
import { addToCart } from "api/cartService";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMainImage, setCurrentMainImage] = useState("");
  const [bienThe, setBienThe] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1); // Số lượng người dùng muốn mua

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProductsById(_id);
        setProduct(productData);
        setCurrentMainImage(productData.HinhSanPham);

        const bienTheData = await fetchBienThe(_id);
        setBienThe(bienTheData);
        setPrice(productData.DonGiaBan);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [_id]);

  useEffect(() => {
    // Đặt số lượng là 1 khi chọn biến thể mới
    if (selectedVariant) {
      setQuantity(1);
    }
  }, [selectedVariant]);

  if (loading) {
    return <p className="loading">Đang tải...</p>;
  }

  if (!product) {
    return <p className="error">Sản phẩm không được tìm thấy!</p>;
  }

  const handleSizeSelection = (variant) => {
    setSelectedVariant(variant);
    setPrice(variant.gia || product.DonGiaBan); // Cập nhật giá theo giá của biến thể
    setQuantity(1); // Đặt số lượng là 1 khi chọn biến thể mới
  };

  const handleQuantityChange = (amount) => {
    if (!selectedVariant) return; // Đảm bảo đã chọn một biến thể

    setQuantity((prevQuantity) => {
      // Tính số lượng mới
      const newQuantity = Math.max(1, prevQuantity + amount);

      // Đảm bảo số lượng không vượt quá số lượng tối đa của biến thể
      return newQuantity <= selectedVariant.soLuong
        ? newQuantity
        : prevQuantity;
    });
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn kích thước trước khi thêm vào giỏ hàng");
      return;
    }

    const productDetails = {
      idBienThe: selectedVariant._id,
      soLuong: quantity,
      donGia: price, // Giá hiện tại của sản phẩm
    };

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        if (
          window.confirm("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.")
        ) {
          navigate("/login");
        }
        setLoading(false);
        return;
      }

      const response = await addToCart(userId, productDetails);
      alert("Đã thêm vào giỏ hàng thành công!");
      console.log("Cart Response:", response);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  const handleBuyNow = () => {
    console.log("Mua ngay:", product.TenSanPham, "Số lượng:", quantity);
  };

  return (
    <div className="product-detail-page">
      <Bredcrumb name="Chi tiết sản phẩm" />
      <div className="product-detail">
        <div className="product-detail__images">
          <div className="product-detail__main-image">
            <img src={currentMainImage} alt={product.TenSanPham} />
          </div>
          <div className="product-detail__thumbnail-images">
            {product.HinhBoSung.map((image, index) => (
              <img
                key={index}
                src={image.UrlAnh}
                alt={`Hình thu nhỏ ${index + 1}`}
                onClick={() => setCurrentMainImage(image.UrlAnh)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail__info">
          <h1>{product.TenSanPham}</h1>
          <p className="product-detail__price">
            {price ? price.toLocaleString() : "Giá không có sẵn"} VND
          </p>
          {/* <p className="product-detail__quantity">
            Số lượng: {selectedVariant ? selectedVariant.soLuong : 0}
          </p> */}
          <p className="product-detail__quantity">
            Số lượng:
            {selectedVariant ? selectedVariant.soLuong : product.SoLuongHienTai}
          </p>
          <div className="product-specifications">
            <h2>Kích thước</h2>
            <ul className="size-options">
              {bienThe.length > 0 ? (
                bienThe.map((variant) => (
                  <li
                    key={variant._id}
                    className={`size-option ${
                      selectedVariant && selectedVariant._id === variant._id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleSizeSelection(variant)}
                  >
                    {variant.KetHopThuocTinh.map((item) => (
                      <span key={item._id}>
                        {item.IDGiaTriThuocTinh.GiaTri}
                      </span>
                    ))}
                  </li>
                ))
              ) : (
                <li>Không có kích thước nào</li>
              )}
            </ul>
          </div>

          <div className="product-quantity">
            <h2>Số lượng</h2>
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          <div className="product-buttons">
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
            <button className="buy-now-button" onClick={handleBuyNow}>
              Mua ngay
            </button>
          </div>
          <p className="product-detail__description">
            <h2>Mô tả :</h2>
            <p>{product.MoTa}</p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetailPage);
