import axios from "axios";
const token = localStorage.getItem("token");
export const fetchCategories = async () => {
  try {
    const response = await axios.get("/api/danhmuc/getlistDanhMuc", {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
