import axios from "axios";
const token = localStorage.getItem("token");

// Hàm lấy doanh thu từ API
export const getDoanhThu = async (userId, filter) => {
  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const response = await axios.get(`/api/doanhthu/GetDoanhThu12/${userId}`, {
      params: {
        fromDate: filter.startDate,
        toDate: filter.endDate,
        filter: filter.transactionType,
      },
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });

    const data = response.data;
    console.log("Dữ liệu trả về từ API: ", data);

    // Chuyển đối tượng thành mảng và đổi tên các trường để hiển thị phù hợp
    const revenueData = Object.entries(data).map(([date, values]) => ({
      ngay: date,
      doanhThu: values.totalRevenue,
      soLuongChuaThanhToan: values.totalPending, // Đổi tên trường ở đây
      soLuongDaHuy: values.totalCanceled, // Đổi tên trường ở đây
    }));

    return revenueData;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    throw error;
  }
};
