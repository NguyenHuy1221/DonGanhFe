import axios from "axios";

const API_BASE_URL = "/api/thuoctinh";

// Lấy danh sách thuộc tính
export const layDanhSachThuocTinh = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getlistThuocTinh`);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách thuộc tính");
  }
};

// Thêm thuộc tính
export const themThuocTinh = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createThuocTinh`, data);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi thêm thuộc tính");
  }
};

// Cập nhật thuộc tính
export const suaThuocTinh = async (data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateThuocTinh`, data);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi cập nhật thuộc tính");
  }
};

// Xóa thuộc tính
export const xoaThuocTinh = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteThuocTinh/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi xóa thuộc tính");
  }
};

export const findThuocTinh = async (query) => {
  try {
    // Gửi query với các tham số có giá trị
    const response = await axios.get("/api/thuocTinh/findThuocTinh", {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm thuộc tính:", error);
    throw error;
  }
};
