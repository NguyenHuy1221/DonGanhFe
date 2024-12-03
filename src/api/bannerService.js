import axios from 'axios';

export const getBanners = async () => {
  try {
    const response = await axios.get("/api/banner/banners");
    return response.data; // Trả về dữ liệu banner
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};
