import axios from "axios";

export const fetchCartById = async (_id) => {
  try {
    const response = await axios.get(`/api/cart/gioHang/user/${_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (userId, productDetails) => {
  try {
    const response = await axios.post("/api/cart/gioHang", {
      userId,
      chiTietGioHang: [productDetails],
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
};

export const updateCart = async (cartId, updatedCartItems) => {
  try {
    // Đảm bảo đường dẫn API chính xác
    const response = await axios.put(`/api/cart/gioHang/${cartId}`, {
      chiTietGioHang: updatedCartItems, // Gửi đúng dữ liệu cần thiết
    });

    // Trả về dữ liệu từ API
    return response.data;
  } catch (error) {
    console.error("Error updating cart:", error);

    // In chi tiết lỗi ra console để bạn có thể dễ dàng debug
    if (error.response) {
      // Nếu có lỗi từ server, in chi tiết lỗi
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // Nếu không có phản hồi từ server
      console.error("No response from server:", error.request);
    } else {
      // Các lỗi khác
      console.error("Error Message:", error.message);
    }

    // Ném lỗi ra ngoài để xử lý
    throw error;
  }
};

export const deleteCartItem = async (cartId, idBienThe) => {
  try {
    await axios.delete(`/api/cart/gioHang/${cartId}`, {
      data: { idBienThe },
    });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    throw error;
  }
};
