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
