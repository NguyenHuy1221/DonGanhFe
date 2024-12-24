import axios from 'axios';
const token = localStorage.getItem("token");

export const createDiaChi = async (userId, addressData) => {
  try {
    const response = await axios.post(`/api/diachi/createDiaChi/${userId}`, addressData , {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    throw new Error("Không thể thêm địa chỉ");
  }
};
