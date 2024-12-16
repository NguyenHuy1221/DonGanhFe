import axios from "axios";

// Hàm lấy danh sách yêu cầu rút tiền
// export const fetchAdminYeuCauRutTien = async () => {
//   try {
//     const response = await axios.get("/api/admin/getAdminYeuCauRutTien");
//     return response.data.requests;
//   } catch (error) {
//     console.error("Lỗi khi gọi API fetchAdminYeuCauRutTien:", error.message);
//     throw error;
//   }
// };

export const fetchAdminYeuCauRutTien = async (token) => {
  try {
    const response = await axios.get("/api/admin/getAdminYeuCauRutTien", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.requests;
  } catch (error) {
    console.error("Lỗi khi gọi API fetchAdminYeuCauRutTien:", error.message);
    throw error;
  }
};

// export const updateYeuCauRutTienAdmin = async (id, trangThai) => {
//   try {
//     const response = await axios.put(`/api/admin/updateYeuCauRutTien/${id}`, {
//       trangThai,
//     });

//     // Kiểm tra trạng thái phản hồi từ server
//     if (response.status === 200) {
//       return response.data; // Trả về dữ liệu cần thiết từ phản hồi
//     } else {
//       throw new Error("Cập nhật yêu cầu thất bại");
//     }
//   } catch (error) {
//     console.error("Lỗi khi cập nhật yêu cầu rút tiền:", error);
//     throw error; // Ném lỗi để xử lý ở cấp cao hơn
//   }
// };

export const updateYeuCauRutTienAdmin = async (id, trangThai, token) => {
  try {
    const response = await axios.put(
      `/api/admin/updateYeuCauRutTien/${id}`,
      { trangThai }, // Body gửi lên server
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
          "Content-Type": "application/json", // Đảm bảo đúng kiểu dữ liệu
        },
      }
    );

    // Kiểm tra trạng thái phản hồi từ server
    if (response.status === 200) {
      return response.data; // Trả về dữ liệu từ phản hồi
    } else {
      throw new Error("Cập nhật yêu cầu thất bại");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật yêu cầu rút tiền:", error.message);
    throw error; // Ném lỗi để xử lý ở cấp cao hơn
  }
};

// export const rejectRequestApi = async (id) => {
//     try {
//       const response = await axios.put(
//         `/api/admin/updateYeuCauRutTien/${id}`,
//         { trangThai: "huy" },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return response; // Trả về phản hồi từ API
//     } catch (error) {
//       console.error("Lỗi khi từ chối yêu cầu:", error);
//       throw error; // Ném lỗi để xử lý ở hàm gọi
//     }
//   };

export const rejectRequestApi = async (id, token) => {
  try {
    const response = await axios.put(
      `/api/admin/updateYeuCauRutTien/${id}`,
      { trangThai: "huy" }, // Body của request
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data; // Trả về dữ liệu từ phản hồi API
  } catch (error) {
    console.error("Lỗi khi từ chối yêu cầu:", error.message);
    throw error; // Ném lỗi để xử lý ở hàm gọi
  }
};
