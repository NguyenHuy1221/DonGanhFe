import axios from "axios";

// Thiết lập URL API
const API_URL = "/api/sanpham"; // Địa chỉ base URL cho API

// Lấy danh sách biến thể theo sản phẩm
export const layDanhSachSanPham = async (sanPhamId) => {
  const response = await axios.get(`${API_URL}/findSanPhambyID/${sanPhamId}`);
  return response.data; // Giả sử dữ liệu trả về là một mảng
};

// Lấy danh sách biến thể theo sản phẩm
export const layDanhSachBienThe = async (sanPhamId) => {
  const response = await axios.get(`${API_URL}/getlistBienTheAdmin/${sanPhamId}`);
  return response.data; // Giả sử dữ liệu trả về là một mảng
};
// Thêm biến thể
// export const themBienThe = async (IDSanPham, bienThe) => {
//   const response = await axios.post(
//     `${API_URL}/createBienTheThuCong/${IDSanPham}`,
//     bienThe
//   );
//   return response.data; // Có thể trả về dữ liệu đã thêm
// };
export const themBienThe = async (IDSanPham, bienThe, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/createBienTheThuCong/${IDSanPham}`,
      bienThe,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu đã thêm
  } catch (error) {
    console.error("Lỗi khi thêm biến thể:", error.message);
    throw new Error("Lỗi khi thêm biến thể");
  }
};
// Sửa biến thể
// export const suaBienThe = async (bienThe) => {
//   const response = await axios.put(
//     `${API_URL}/updateBienTheThuCong/${bienThe.id}`,
//     bienThe
//   );
//   return response.data; // Có thể trả về dữ liệu đã sửa
// };
export const suaBienThe = async (bienThe, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/updateBienTheThuCong/${bienThe.id}`,
      bienThe,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu đã sửa
  } catch (error) {
    console.error("Lỗi khi sửa biến thể:", error.message);
    throw new Error("Lỗi khi sửa biến thể");
  }
};

// Xóa biến thể
// export const xoaBienThe = async (id) => {
//   const response = await axios.delete(`${API_URL}/deleteBienTheThuCong/${id}`);
//   return response.data; // Có thể trả về một thông báo thành công
// };
export const xoaBienThe = async (id, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/deleteBienTheThuCong/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về một thông báo thành công
  } catch (error) {
    console.error("Lỗi khi xóa biến thể:", error.message);
    throw new Error("Lỗi khi xóa biến thể");
  }
};
