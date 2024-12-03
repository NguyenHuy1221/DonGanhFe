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
  const response = await axios.get(`${API_URL}/getlistBienThe/${sanPhamId}`);
  return response.data; // Giả sử dữ liệu trả về là một mảng
};
// Thêm biến thể
export const themBienThe = async (IDSanPham, bienThe) => {
  const response = await axios.post(
    `${API_URL}/createBienTheThuCong/${IDSanPham}`,
    bienThe
  );
  return response.data; // Có thể trả về dữ liệu đã thêm
};
// Sửa biến thể
export const suaBienThe = async (bienThe) => {
  const response = await axios.put(
    `${API_URL}/updateBienTheThuCong/${bienThe.id}`,
    bienThe
  );
  return response.data; // Có thể trả về dữ liệu đã sửa
};

// Xóa biến thể
export const xoaBienThe = async (id) => {
  const response = await axios.delete(`${API_URL}/deleteBienTheThuCong/${id}`);
  return response.data; // Có thể trả về một thông báo thành công
};
