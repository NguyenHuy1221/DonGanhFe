import axios from "axios";

const API_BASE_URL = "/api/khuyenmai";
const API_URL = "/api/khuyenmaimanage";

export const layDanhSachKhuyenMai = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getlistKhuyenMaiforadmin`
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách khuyễn mãi");
  }
};

export const addKhuyenMai = async (khuyenMaiData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/createKhuyenMai`,
      khuyenMaiData
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi thêm khuyễn mãi");
  }
};

export const updateKhuyenMai = async (khuyenMaiData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateKhuyenMai/${khuyenMaiData._id}`,
      khuyenMaiData
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi sửa khuyễn mãi");
  }
};

export const deleteKhuyenMai = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteKhuyenMai/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi xóa khuyễn mãi");
  }
};

export const layDanhSachLoaiKhuyenMai = async () => {
  try {
    const response = await axios.get(`${API_URL}/getlistLoaiKhuyenMai`);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách khuyễn mãi");
  }
};
