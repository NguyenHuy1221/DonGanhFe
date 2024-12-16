import axios from "axios";

export const loginGoogle = async () => {
  try {
    const response = await axios.get(
      "https://imp-model-widely.ngrok-free.app/auth/google"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// export const getAllUser = async (userId) => {
//   try {
//     const response = await axios.get(`/api/user/showAllUser/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error("không có người dùng :", error);
//     throw error;
//   }
// };

export const getAllUser = async (userId, token) => {
  try {
    const response = await axios.get(`/api/user/showAllUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("không có người dùng :", error);
    throw error;
  }
};

export const login = async (gmail, matKhau) => {
  try {
    const response = await axios.post("/api/user/login", { gmail, matKhau });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const fetchUserById = async (_id) => {
  try {
    const response = await axios.get(`/api/user/showUserID/${_id}`);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const showDiaChiByIdUser = async (userId) => {
  try {
    const response = await axios.get(`/api/diachi/getDiaChiByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching address by user ID:", error);
    throw error;
  }
};

export const creatDiaChi = async (userId, address) => {
  try {
    const response = await axios.post(
      `/api/diachi/createDiaChi/${userId}`,
      address
    );
    return response.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};

export const updateUserDiaChi = async (userId, newAddress) => {
  try {
    const response = await axios.put("api/user/updateUserDiaChi", {
      UserID: userId,
      diaChiMoi: newAddress,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user address:", error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, formData) => {
  try {
    const response = await axios.post(
      `/api/user/createAnhDaiDien/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo rằng nội dung được gửi là multipart
        },
      }
    );

    // Trả về URL ảnh mới sau khi tải lên thành công
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải lên ảnh:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong component
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `/api/user/updateUser12/${userId}`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật hồ sơ:", error);
    throw error;
  }
};

// export const updateUserRoleAndPermissions = async (userId, data) => {
//   return axios
//     .post(`/api/admin/updateUserRoleAndPermissions/${userId}`, data)
//     .then((response) => response.data)
//     .catch((error) => {
//       throw error.response.data;
//     });
// };

export const updateUserRoleAndPermissions = async (userId, data, token) => {
  return axios
    .post(`/api/admin/updateUserRoleAndPermissions/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data || "Có lỗi xảy ra";
    });
};