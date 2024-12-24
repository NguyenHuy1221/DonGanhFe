import axios from "axios";

const API_URL = "/api/danhgia";
const token = localStorage.getItem("token");
export const getListDanhGiaInSanPhamById = async (IDSanPham, userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/getListDanhGiaInSanPhamById/${IDSanPham}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      }
    );

    console.log("Đánh giá :", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API: ", error);
    throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi hàm
  }
};

export const getDanhGiaForAdmin = async (userId) => {
  try {
    const response = await axios.get(
      `/api/danhgia/getListDanhGiaAdmin/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
    throw new Error("Không thể lấy dữ liệu đánh giá");
  }
};

// Hàm gọi API thêm phản hồi
export const addPhanHoi = async (currentDanhGiaId, userId, binhLuan) => {
  try {
    const response = await axios.post(
      `/api/danhgia/addPhanHoi/${currentDanhGiaId}`,
      {
        userId,
        BinhLuan: binhLuan,
      } , {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm phản hồi:", error);
    throw new Error("Không thể thêm phản hồi");
  }
};

// Hàm gọi API cập nhật phản hồi
export const updatePhanHoi = async (
  currentDanhGiaId,
  currentPhanHoiId,
  binhLuan
) => {
  try {
    const response = await axios.post(
      `/api/danhgia/updatePhanHoi/${currentDanhGiaId}/${currentPhanHoiId}`,
      { BinhLuan: binhLuan }
      , {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật phản hồi:", error);
    throw new Error("Không thể cập nhật phản hồi");
  }
};

// Hàm gọi API xóa phản hồi
export const deletePhanHoi = async (danhGiaId, phanHoiId) => {
  try {
    await axios.delete(`/api/danhgia/deletePhanHoi/${danhGiaId}/${phanHoiId}` , {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
  } catch (error) {
    console.error("Lỗi khi xóa phản hồi:", error);
    throw new Error("Không thể xóa phản hồi");
  }
};
