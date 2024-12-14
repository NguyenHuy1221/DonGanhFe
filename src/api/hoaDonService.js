import axios from "axios";

export const fetchHoaDon = async () => {
  try {
    const response = await axios.get("/api/hoadon/getlistHoaDon");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getHoaDonsByUserId = async (userId) => {
  try {
    const response = await axios.get(`/api/hoadon/getHoaDonByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    throw new Error("Không thể lấy danh sách hóa đơn");
  }
};

export const getHoaDonById = async (hoaDonId) => {
  try {
    const response = await axios.get(
      `/api/hoadon/getHoaDonByHoaDonIdFullVersion/${hoaDonId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin hóa đơn:", error);
    throw new Error("Không thể lấy thông tin hóa đơn");
  }
};

export const getHoaDons = async (userId) => {
  try {
    const response = await axios.get(`/api/hoadon/getlistHoaDon/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    throw new Error("Không thể lấy danh sách hóa đơn");
  }
};

// Hàm gọi API cập nhật trạng thái hóa đơn
export const updateHoaDonStatus = async (id, status) => {
  try {
    await axios.post(`/api/hoadon/updatetrangthaiHoaDOn/${id}`, {
      TrangThai: status,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    throw new Error("Cập nhật trạng thái thất bại.");
  }
};

export const createInvoiceAPI = async (invoiceData) => {
  try {
    const response = await axios.post(
      "/api/hoadon/createUserDiaChivaThongTinGiaoHang",
      invoiceData
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi tạo hóa đơn:", error);
    throw new Error("Không thể tạo hóa đơn");
  }
};

export const updateTransactionAPI = async (transactionId, hoadonIds) => {
  try {
    const response = await axios.post(
      "/api/hoadon/updateTransactionListHoaDon",
      // updateTransactionListHoaDonCOD
      {
        transactionId,
        hoadon: hoadonIds,
      }
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi cập nhật giao dịch:", error);
    throw new Error("Không thể cập nhật giao dịch");
  }
};

export const updateTransactionAPICOD = async (transactionId, hoadonIds) => {
  try {
    const response = await axios.post(
      "/api/hoadon/updateTransactionListHoaDonCOD",
      // updateTransactionListHoaDonCOD
      {
        transactionId,
        hoadon: hoadonIds,
      }
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi cập nhật giao dịch:", error);
    throw new Error("Không thể cập nhật giao dịch");
  }
};