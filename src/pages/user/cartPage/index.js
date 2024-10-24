import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { fetchCartById, updateCart, deleteCartItem } from "api/cartService";
import { fetchProductsById } from "api/productService";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]); // Trạng thái lưu các sản phẩm trong giỏ hàng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [cartId, setCartId] = useState(null); // Lưu ID của giỏ hàng
  const navigate = useNavigate(); // Điều hướng trang

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Lấy ID người dùng từ localStorage
        if (!userId) {
          if (
            window.confirm(
              "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục."
            )
          ) {
            navigate("/login"); // Điều hướng tới trang đăng nhập nếu người dùng chưa đăng nhập
          }
          setLoading(false);
          return;
        }

        const cartData = await fetchCartById(userId); // Lấy dữ liệu giỏ hàng từ API
        const cartId = cartData._id;
        setCartId(cartId);

        const productPromises = cartData.chiTietGioHang.map((item) =>
          fetchProductsById(item.idBienThe.IDSanPham)
        );
        const products = await Promise.all(productPromises); // Lấy thông tin sản phẩm từ API

        const updatedCartItems = cartData.chiTietGioHang.map((item, index) => ({
          id: item.idBienThe._id,
          name: products[index].TenSanPham,
          price: item.donGia,
          quantity: item.soLuong,
          image:
            products[index].HinhSanPham || "https://via.placeholder.com/150",
          originalPrice: item.donGia,
          variation: item.idBienThe.KetHopThuocTinh.map(
            (attr) => attr.IDGiaTriThuocTinh.GiaTri
          ).join(", "),
          soLuong: item.idBienThe.soLuong,
          isChecked: false,
        }));

        setCartItems(updatedCartItems); // Cập nhật danh sách sản phẩm trong giỏ hàng
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
      } finally {
        setLoading(false); // Ngừng hiển thị trạng thái tải dữ liệu
      }
    };

    fetchCartData(); // Gọi hàm lấy dữ liệu giỏ hàng
  }, [navigate]);

  const handleCheckboxChange = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleMasterCheckboxChange = (e) => {
    const checked = e.target.checked;
    setCartItems((prevItems) =>
      prevItems.map((item) => ({ ...item, isChecked: checked }))
    );
  };

  const removeItem = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng không?"
      );

      if (isConfirmed) {
        await deleteCartItem(cartId, id);
        setCartItems(cartItems.filter((item) => item.id !== id)); // Cập nhật danh sách sau khi xóa
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) =>
        item.isChecked ? total + item.price * item.quantity : total,
      0
    );
  };

  // Hàm cập nhật số lượng sản phẩm
  const handleQuantityChange = async (id, amount) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;

          // Kiểm tra nếu số lượng mới vượt quá tồn kho
          if (newQuantity < 1 || newQuantity > item.soLuong) {
            return item; // Ngăn không cho giảm xuống dưới 1 hoặc vượt quá số lượng tồn kho
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });

    const updatedCartItem = cartItems.find((item) => item.id === id);
    if (updatedCartItem) {
      try {
        const updatedCartItems = cartItems.map((item) => ({
          idBienThe: item.id,
          soLuong: item.id === id ? item.quantity + amount : item.quantity,
          donGia: item.price,
        }));

        // Cập nhật giỏ hàng trên server
        await updateCart(cartId, updatedCartItems);
        console.log("Giỏ hàng đã được cập nhật");
      } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
      }
    }
  };

  if (loading) {
    return <p>Đang tải...</p>; // Hiển thị trạng thái tải
  }

  return (
    <div className="cart-page">
      <h2>Giỏ Hàng</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p> // Hiển thị thông báo nếu giỏ hàng trống
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleMasterCheckboxChange}
                  />
                </th>
                <th>Sản Phẩm</th>
                <th>Đơn Giá</th>
                <th>Số Lượng</th>
                <th>Số Tiền</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className="cart-item-details">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <p>{item.name}</p>
                      <p className="cart-item-variation">
                        Phân Loại Hàng: {item.variation}
                      </p>
                      <p className="cart-item-original-price">
                        <s>{item.originalPrice.toLocaleString()} VND</s>
                      </p>
                    </div>
                  </td>
                  <td>{item.price.toLocaleString()} VND</td>
                  <td>
                    <div className="quantity-control">
                      <button onClick={() => handleQuantityChange(item.id, -1)}>
                        -
                      </button>
                      <input type="text" value={item.quantity} readOnly />
                      <button onClick={() => handleQuantityChange(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                  <td>
                    <button onClick={() => removeItem(item.id)}>Xóa</button>
                    <a href="#" className="find-similar">
                      Tìm sản phẩm tương tự
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-voucher">
            <p>
              Voucher giảm đến 45k <a href="#">Xem thêm voucher</a>
            </p>
          </div>
          <div className="cart-total">
            <h3>
              Tổng thanh toán (
              {cartItems.filter((item) => item.isChecked).length} Sản phẩm):{" "}
              {getTotalPrice().toLocaleString()} VND
            </h3>
            <button
              className="checkout-button"
              onClick={() => {
                const selectedItems = cartItems.filter(
                  (item) => item.isChecked
                ); // Lọc các sản phẩm đã chọn

                if (selectedItems.length === 0) {
                  alert("Bạn chưa chọn sản phẩm nào."); // Hiển thị thông báo nếu không có sản phẩm nào được chọn
                  return;
                }

                // Điều hướng đến trang thanh toán nếu có sản phẩm được chọn
                navigate("/payment", {
                  state: {
                    cartItems: selectedItems,
                    totalAmount: getTotalPrice(),
                  },
                });
              }}
            >
              Mua Hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CartPage);
