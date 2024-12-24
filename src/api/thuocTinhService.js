import axios from "axios";

const API_BASE_URL = "/api/thuoctinh";
const token = localStorage.getItem("token");

// Lấy danh sách thuộc tính
export const layDanhSachThuocTinh = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getlistThuocTinh/${userId}` , {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách thuộc tính");
  }
};

// Thêm thuộc tính
// export const themThuocTinh = async (data,userId) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/createThuocTinh/${userId}`, data);
//     return response.data;
//   } catch (error) {
//     throw new Error("Lỗi khi thêm thuộc tính");
//   }
// };

export const themThuocTinh = async (data, userId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/createThuocTinh/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu đã thêm
  } catch (error) {
    console.error("Lỗi khi thêm thuộc tính:", error.message);
    throw new Error("Lỗi khi thêm thuộc tính");
  }
};

// Cập nhật thuộc tính
// export const suaThuocTinh = async (data,userId) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/updateThuocTinh/${data._id}/${userId}`, // Truyền _id
//       { ThuocTinhID: data.ThuocTinhID, TenThuocTinh: data.TenThuocTinh } // Truyền cả hai trường
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error("Lỗi khi cập nhật thuộc tính");
//   }
// };

export const suaThuocTinh = async (data, userId, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateThuocTinh/${data._id}/${userId}`, // Truyền _id
      { ThuocTinhID: data.ThuocTinhID, TenThuocTinh: data.TenThuocTinh }, // Truyền cả hai trường
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu đã cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật thuộc tính:", error.message);
    throw new Error("Lỗi khi cập nhật thuộc tính");
  }
};


// Xóa thuộc tính
// export const xoaThuocTinh = async (id) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/deleteThuocTinh/${id}`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error("Lỗi khi xóa thuộc tính");
//   }
// };

export const xoaThuocTinh = async (id, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/deleteThuocTinh/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về phản hồi từ API
  } catch (error) {
    console.error("Lỗi khi xóa thuộc tính:", error.message);
    throw new Error("Lỗi khi xóa thuộc tính");
  }
};

export const findThuocTinh = async (query) => {
  try {
    // Gửi query với các tham số có giá trị
    const response = await axios.get("/api/thuocTinh/findThuocTinh", {
      params: query,
    } , {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm thuộc tính:", error);
    throw error;
  }
};
