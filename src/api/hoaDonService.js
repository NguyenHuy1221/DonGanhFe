import axios from "axios";

export const fetchHoaDon = async () => {
    try {
      const response = await axios.get("/api/hoadon/getlistHoaDon");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
};