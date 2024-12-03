import axios from "axios";

// Lấy dữ liệu doanh thu với các tham số lọc
export const fetchRevenueData = async (userId, filterParams) => {
  try {
    const params = new URLSearchParams();

    if (filterParams.fromDate) params.append("fromDate", filterParams.fromDate);
    if (filterParams.toDate) params.append("toDate", filterParams.toDate);
    if (filterParams.filter) params.append("filter", filterParams.filter);

    const response = await axios.get(
      `/api/doanhthu/getData/${userId}/?${params.toString()}`
    );
    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu doanh thu:", error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};
