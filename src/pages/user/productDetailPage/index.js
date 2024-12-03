import { memo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import { fetchProductsById, fetchBienThe } from "../../../api/productService";
import Bredcrumb from "../bredcrumb";
import { addToCart } from "api/cartService";
import ChatComponent from "../chatComponentPage";
import {
  Avatar,
  Button,
  Image,
  List,
  Modal,
  Pagination,
  Rate,
  Space,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getListDanhGiaInSanPhamById } from "../../../api/danhGiaService";
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
/>;

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

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [rating, setRating] = useState(4.3);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isChatMo, setIsChatMo] = useState(false);

  const toggleChat = (newState) => {
    if (product.userId && product.userId._id) {
      localStorage.setItem("userId", product.userId._id); // Lưu userId vào localStorage
      console.log("User ID đã lưu vào localStorage:", product.userId._id);
    }

    // Cập nhật trạng thái mở/đóng chat
    setIsChatMo(newState);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getListDanhGiaInSanPhamById(_id, userId);
        console.log("dữ liệu đánh giá ", response);
        // Xử lý dữ liệu đánh giá
        const fetchedReviews = response.map((review) => ({
          id: review._id,
          user: review.userId.tenNguoiDung || "Người dùng ẩn danh",
          rating: review.XepHang,
          date: new Date(review.NgayTao).toLocaleDateString("vi-VN"),
          content: review.BinhLuan,
          images: review.HinhAnh || [],
          likes: review.likes.length,
        }));

        setReviews(fetchedReviews);
        setFilteredReviews(fetchedReviews);

        // Tính tổng sao trung bình
        const averageRating = fetchedReviews.length
          ? fetchedReviews.reduce((total, review) => total + review.rating, 0) /
            fetchedReviews.length
          : 0;

        // Cập nhật rating với điểm trung bình
        setRating(averageRating.toFixed(1)); // Làm tròn đến 1 chữ số thập phân
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
      }
    };

    fetchReviews();
  }, [_id]);

  const handleFilter = (stars) => {
    setCurrentPage(1);
    if (stars === "all") {
      setFilteredReviews(reviews);
    } else if (stars === "image") {
      setFilteredReviews(reviews.filter((review) => review.images.length > 0));
    } else {
      setFilteredReviews(reviews.filter((review) => review.rating === stars));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

      <div className="shop-infor">
        <div className="row">
          <div className="col-4 shop-image">
            <img
              src={
                product.userId.anhDaiDien || "https://via.placeholder.com/80"
              }
              alt="Shop Avatar"
              className="avatar-img"
            />
            <div className="shop-details">
              <h3 className="shop-name">
                {product.userId ? product.userId.tenNguoiDung : "Lali_store99"}
              </h3>
              <p className="shop-status">
                {product.ngayTao
                  ? `Online ${Math.floor(
                      (new Date() - new Date(product.ngayTao)) / 1000 / 60 / 60
                    )} Giờ Trước`
                  : "Online"}
              </p>
              <div className="row">
                <div className="shop-actions">
                  {/* {product.userId && product.userId._id} */}
                  {/* <button
                    className="btn-chat"
                    onClick={() => toggleChat(!isChatMo)}
                  >
                    Chat Ngay
                  </button> */}
                  <button className="btn-view-shop">Xem Shop</button>
                </div>
              </div>
            </div>
            <span className="gach"></span>
          </div>
          <div className="col-8 shop-tt">
            <div className="shop-stats">
              <div className="shop-box">
                <div className="stat">
                  <span>Đánh Giá :</span>
                  <strong>{reviews.length ? reviews.length : "0"}</strong>
                </div>
                <div className="stat">
                  <span>Sản Phẩm : </span>
                  <strong>{product.SoLuongHienTai || "0"}</strong>
                </div>
              </div>
              <div className="shop-box">
                <div className="stat">
                  <span>Tỉ Lệ Phản Hồi : </span>
                  <strong>{product.PhanTramGiamGia || "0"}%</strong>
                </div>
                <div className="stat">
                  <span>Thời Gian Phản Hồi : </span>
                  <strong className="text-highlight">{"Vài phút"}</strong>
                </div>
              </div>
              <div className="shop-box">
                <div className="stat">
                  <span>Tham Gia : </span>
                  <strong className="text-highlight">
                    {new Date(product.NgayTao).toLocaleDateString() ||
                      "Chưa rõ"}
                  </strong>
                </div>
                <div className="stat">
                  <span>Người Theo Dõi : </span>
                  <strong>{product.followers?.length || "0"}</strong>{" "}
                  {/* Dùng optional chaining */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="review-section">
        <h2>Đánh Giá Sản Phẩm</h2>
        <div className="review-summary">
          <div className="average-rating">
            <h1>{rating}</h1>
            <Rate disabled value={parseFloat(rating)} allowHalf />
            <span>trên 5</span>
          </div>
          <div className="rating-filters">
            <Button onClick={() => handleFilter("all")}>Tất Cả</Button>
            <Button onClick={() => handleFilter(5)}>5 Sao</Button>
            <Button onClick={() => handleFilter(4)}>4 Sao</Button>
            <Button onClick={() => handleFilter(3)}>3 Sao</Button>
            <Button onClick={() => handleFilter(2)}>2 Sao</Button>
            <Button onClick={() => handleFilter(1)}>1 Sao</Button>
            <Button onClick={() => handleFilter("image")}>
              Có Hình Ảnh / Video
            </Button>
          </div>
        </div>

        {filteredReviews.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={paginatedReviews}
            renderItem={(review) => (
              <List.Item key={review.id}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<span>{review.user}</span>}
                  description={
                    <>
                      <Rate disabled value={review.rating} />
                      <span className="review-date">{review.date}</span>
                    </>
                  }
                />
                <p>{review.content}</p>

                <div className="review-images">
                  {review.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      // onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
                <span className="review-likes">👍 {review.likes}</span>
              </List.Item>
            )}
          />
        ) : (
          <p className="no-reviews">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredReviews.length}
          onChange={handlePageChange}
          style={{ textAlign: "center", marginTop: 20 }}
        />
      </div>
      {/* <ChatComponent /> */}
      {/* <ChatComponent isChatMo={isChatMo} toggleChatMo={toggleChat} /> */}
      <ChatComponent isChatMo={isChatMo} toggleChatMo={toggleChat} />
    </div>
  );
};

export default memo(ProductDetailPage);
