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

  const fetchCartData = async () => {
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

      const cartData = await fetchCartById(userId);
      console.log("Dữ liệu giỏ hàng từ API:", cartData);

      if (
        !cartData.mergedCart ||
        !Array.isArray(cartData.mergedCart) ||
        cartData.mergedCart.length === 0
      ) {
        console.error("Giỏ hàng không có dữ liệu hợp lệ:", cartData);
        setCartItems([]);
        setLoading(false);
        return;
      }

      setCartId(cartData.gioHangId);

      const groupedByStore = cartData.mergedCart.map((store) => {
        const allProducts = store.sanPhamList.flatMap(
          (sanPham) => sanPham.chiTietGioHang
        );

        const productPromises = allProducts.map((item) =>
          fetchProductsById(item.idBienThe.IDSanPham)
        );
        return Promise.all(productPromises).then((products) => {
          return {
            storeName: store.user.tenNguoiDung, 
            storeOwnerId: store.user._id, 
            products: allProducts.map((item, index) => ({
              idBt: item.idBienThe._id,
              id: item._id,
              name: products[index].TenSanPham,
              price: item.donGia,
              quantity: item.soLuong,
              image:
                products[index].HinhSanPham ||
                "https://via.placeholder.com/150",
              originalPrice: item.donGia,
              variation: item.idBienThe.KetHopThuocTinh.map(
                (attr) => attr.IDGiaTriThuocTinh.GiaTri
              ).join(", "),
              soLuong: item.idBienThe.soLuong,
              isChecked: false,
            })),
          };
        });
      });

      const storesWithProducts = await Promise.all(groupedByStore);

      setCartItems(storesWithProducts);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [navigate]);

  const handleCheckboxChange = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((store) => ({
        ...store,
        products: store.products.map((item) =>
          item.id === id ? { ...item, isChecked: !item.isChecked } : item
        ),
      }))
    );
  };

  const handleMasterCheckboxChange = (e, storeIndex) => {
    const checked = e.target.checked;
    setCartItems((prevItems) =>
      prevItems.map((store, index) =>
        index === storeIndex
          ? {
              ...store,
              products: store.products.map((item) => ({
                ...item,
                isChecked: checked,
              })),
            }
          : store
      )
    );
  };

  const removeItem = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng không?"
      );
  
      if (isConfirmed) {
        await deleteCartItem(cartId, id);
        setCartItems((prevItems) =>
          prevItems.map((store) => ({
            ...store,
            products: store.products.filter((item) => item.idBt !== id), 
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };
  

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, store) =>
        store.products.reduce(
          (subTotal, item) =>
            item.isChecked ? subTotal + item.price * item.quantity : subTotal,
          total
        ),
      0
    );
  };

  const getTotalSelectedItemsCount = () => {
    return cartItems.reduce(
      (count, store) =>
        count + store.products.filter((item) => item.isChecked).length,
      0
    );
  };

  const handleQuantityChange = async (id, amount) => {
    setCartItems((prevItems) => {
      return prevItems.map((store) => ({
        ...store,
        products: store.products.map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + amount;

            // Kiểm tra nếu số lượng mới vượt quá tồn kho
            if (newQuantity < 1 || newQuantity > item.soLuong) {
              console.warn("Số lượng không hợp lệ:", {
                id,
                newQuantity,
                soLuong: item.soLuong,
              });
              return item;
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        }),
      }));
    });

    const updatedCartItems = cartItems.map((store) => ({
      ...store,
      products: store.products.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    }));

    const updatedProduct = updatedCartItems
      .flatMap((store) => store.products)
      .find((item) => item.id === id);

    const requestBody = [
      {
        _id: updatedProduct.id,
        soLuong: updatedProduct.quantity,
        donGia: updatedProduct.price,
      },
    ];

    try {
      if (cartId) {
        const response = await updateCart(cartId, requestBody);
      } else {
        console.error("cartId không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  };

  if (loading) {
    return <p>Đang tải...</p>; // Hiển thị trạng thái tải
  }

  

  return (
    <div className="cart-page">
      <h2>Giỏ Hàng</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div>
          {cartItems.map((store, index) => (
            <div key={index} className="store-card">
              <h3>{store.storeName}</h3> {/* Tên cửa hàng */}
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={(e) => handleMasterCheckboxChange(e, index)}
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
                  {store.products.map((item) => (
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
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            -
                          </button>
                          <input type="text" value={item.quantity} readOnly />
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        {(item.price * item.quantity).toLocaleString()} VND
                      </td>
                      <td>
                        <button onClick={() => removeItem(item.idBt)}>
                          Xóa
                        </button>
                        <a href="#" className="find-similar">
                          Tìm sản phẩm tương tự
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div className="cart-voucher">
            <p>
              Voucher giảm đến 45k <a href="#">Xem thêm voucher</a>
            </p>
          </div>
          <div className="cart-total">
            <h3>
              Tổng thanh toán ({getTotalSelectedItemsCount()} Sản phẩm):{" "}
              {getTotalPrice().toLocaleString()} VND
            </h3>
            <button
              className="checkout-button"
              onClick={() => {
                const selectedItems = cartItems
                  .flatMap((store) => store.products)
                  .filter((item) => item.isChecked);

                if (selectedItems.length === 0) {
                  alert("Bạn chưa chọn sản phẩm nào.");
                  return;
                }

                const selectedStores = cartItems
                .filter((store) =>
                  store.products.some((item) => item.isChecked)
                )
                .map((store) => ({
                  storeName: store.storeName,
                  storeOwnerId: store.storeOwnerId,
                  storeProducts: store.products.filter((item) => item.isChecked),
                }));

                navigate("/payment", {
                  state: {
                    cartItems: selectedItems,
                    selectedStores: selectedStores,
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
