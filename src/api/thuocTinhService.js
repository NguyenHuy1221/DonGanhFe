import axios from "axios";

const API_BASE_URL = "/api/thuoctinh";

// Lấy danh sách thuộc tính
export const layDanhSachThuocTinh = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getlistThuocTinh/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách thuộc tính");
  }
};

// Thêm thuộc tính
export const themThuocTinh = async (data,userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createThuocTinh/${userId}`, data);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi thêm thuộc tính");
  }
};

// Cập nhật thuộc tính
export const suaThuocTinh = async (data,userId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateThuocTinh/${data._id}/${userId}`, // Truyền _id
      { ThuocTinhID: data.ThuocTinhID, TenThuocTinh: data.TenThuocTinh } // Truyền cả hai trường
    );
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
