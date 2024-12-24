import axios from "axios";

const API_URL = "/api/baiviet";
const token = localStorage.getItem("token");
// export const getListBaiViet = async (userId) => {
//   try {
//     const response = await axios.get(`${API_URL}/getListBaiVietAdmin/${userId}`);

//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi gọi API: ", error);
//     throw error;
//   }
// };

export const getListBaiViet = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/getListBaiVietAdmin/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API: ", error.message);
    throw error;
  }
};

export const createBaiViet = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/createBaiViet`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi thêm khuyễn mãi");
  }
};

export const deleteBaiViet = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteBaiViet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa bài viết: ", error.message);
    throw error;
  }
};

export const updateBaiViet = async (baivietId, formData) => {
  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const response = await axios.put(
      `${API_URL}/updateBaiViet/${baivietId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bài viết: ", error);
    throw error;
  }
};

