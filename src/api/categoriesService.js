import axios from "axios";

export const fetchCategories = async () => {
  try {
    const response = await axios.get("/api/danhmuc/getlistDanhMuc");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
