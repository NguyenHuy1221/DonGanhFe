import axios from "axios";

export const fetchYeuCauDangKyData = async () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  try {
    const response = await axios.get(
      "/api/yeucaudangky/getListYeuCauDangKy",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu yêu cầu đăng ký
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu yêu cầu đăng ký:", error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};

// Hàm lấy thông tin yêu cầu đăng ký theo userId
export const fetchYeuCauDangKyByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `/api/yeucaudangky/getYeuCauDangKyByUserId/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy yêu cầu đăng ký:", error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

export const updateYeuCauDangKy = async (id, trangThai) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  try {
    const response = await axios.put(
      `/api/yeucaudangky/updateYeuCauDangKy/${id}`,
      {
        TrangThai: trangThai,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi gọi API updateYeuCauDangKy:", error.message);
    throw error;
  }
};

