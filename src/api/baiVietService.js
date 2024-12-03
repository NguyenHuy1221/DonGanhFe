import axios from "axios";

const API_URL = "/api/baiviet";

export const getListBaiViet = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getListBaiViet/${userId}`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API: ", error);
    throw error;
  }
};

export const createBaiViet = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/createBaiViet`, formData);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi thêm khuyễn mãi");
  }
};

export const deleteBaiViet = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteBaiViet/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa bài viết: ", error);
    throw error;
  }
};

export const updateBaiViet = async (baivietId, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/updateBaiViet/${baivietId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bài viết: ", error);
    throw error;
  }
};
