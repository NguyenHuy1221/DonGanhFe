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
    const response = await axios.put(`/api/cart/gioHang/${cartId}`, {
      chiTietGioHang: updatedCartItems,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart:", error);
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
