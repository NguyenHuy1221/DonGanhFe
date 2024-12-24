import axios from 'axios';
const token = localStorage.getItem("token"); // Lấy token từ localStorage

// export const getBanners = async () => {
//   try {
//     const response = await axios.get("/api/banner/banners", {
//       headers: {
//         Authorization: `Bearer ${token}`, // Truyền token vào headers
//       },
//     });
//     return response.data; // Trả về dữ liệu banner
//   } catch (error) {
//     console.error("Error fetching banners:", error);
//     throw error; // Ném lỗi để xử lý bên ngoài
//   }
// };

export const getBanners = async () => {
  try {
    const response = await axios.get("/api/banner/banners", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Truyền token vào headers
      },
    });

    // Đảm bảo trả về đúng `banners`
    return Array.isArray(response.data.banners) ? response.data.banners : [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};

