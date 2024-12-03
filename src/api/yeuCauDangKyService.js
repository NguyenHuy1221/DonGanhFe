import axios from "axios";

export const fetchYeuCauDangKyData = async () => {
  try {
    const response = await axios.get("/api/yeucaudangky/getListYeuCauDangKy");
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
  try {
    const response = await axios.put(
      `/api/yeucaudangky/updateYeuCauDangKy/${id}`,
      {
        TrangThai: trangThai,
      }
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi gọi API updateYeuCauDangKy:", error.message);
    throw error;
  }
};
