import axios from "axios";

const API_BASE_URL = "/api/thuoctinhgiatri";

export const layDanhSachThuocTinhGiaTri = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getlistThuocTinhGiaTri`);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách thuộc tính giá trị");
  }
};

export const themThuocTinhGiaTri = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/createThuocTinhGiaTri`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Lỗi khi thêm thuộc tính giá trị"
    );
  }
};

export const suaThuocTinhGiaTri = async (data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateThuocTinhGiaTri`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Lỗi khi cập nhật thuộc tính giá trị"
    );
  }
};

export const xoaThuocTinhGiaTri = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteThuocTinhGiaTri/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Lỗi khi xóa thuộc tính giá trị"
    );
  }
};
