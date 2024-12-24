import axios from "axios";

const API_BASE_URL = "/api/thuoctinhgiatri";
const token = localStorage.getItem("token");

export const layDanhSachThuocTinhGiaTri = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getlistThuocTinhGiaTri/${userId}`
      , {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      });
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách thuộc tính giá trị");
  }
};

// export const themThuocTinhGiaTri = async (data) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/createThuocTinhGiaTri`,
//       data
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response.data.message || "Lỗi khi thêm thuộc tính giá trị"
//     );
//   }
// };

export const themThuocTinhGiaTri = async (data, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/createThuocTinhGiaTri`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi thêm thuộc tính giá trị"
    );
  }
};

// export const suaThuocTinhGiaTri = async (data) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/updateThuocTinhGiaTri`,
//       data
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response.data.message || "Lỗi khi cập nhật thuộc tính giá trị"
//     );
//   }
// };

export const suaThuocTinhGiaTri = async (data, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateThuocTinhGiaTri`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật thuộc tính giá trị"
    );
  }
};

// export const xoaThuocTinhGiaTri = async (id) => {
//   try {
//     const response = await axios.delete(
//       `${API_BASE_URL}/deleteThuocTinhGiaTri/${id}`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response.data.message || "Lỗi khi xóa thuộc tính giá trị"
//     );
//   }
// };

export const xoaThuocTinhGiaTri = async (id, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteThuocTinhGiaTri/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi xóa thuộc tính giá trị"
    );
  }
};

export const getGiaTriThuocTinh = async (id) => {
  try {
    const response = await axios.get(
      `/api/thuoctinhgiatri/findThuocTinhGiaTri/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      }
    );
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Lỗi khi lấy giá trị thuộc tính:", error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};
