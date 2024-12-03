import axios from 'axios';

export const createDiaChi = async (userId, addressData) => {
  try {
    const response = await axios.post(`/api/diachi/createDiaChi/${userId}`, addressData);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    throw new Error("Không thể thêm địa chỉ");
  }
};
