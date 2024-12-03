import axios from "axios";

export const getDanhMucList = async () => {
  try {
    const response = await axios.get("/api/danhmuc/getlistDanhMuc");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};

// Hàm xóa danh mục cha
export const deleteDanhMucCha = async (id) => {
  try {
    const response = await axios.delete(`/api/danhmuc/deleteDanhMucCha/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục cha:", error);
    throw error;
  }
};

// Hàm xóa danh mục con
export const deleteDanhMucCon = async (parentId, subCategoryId) => {
  try {
    const response = await axios.delete(
      `/api/danhmuc/deleteDanhMucCon/${parentId}/${subCategoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục con:", error);
    throw error;
  }
};

// Hàm cập nhật danh mục cha
export const updateDanhMucCha = async (categoryId, formData) => {
    try {
      const response = await axios.put(
        `/api/danhmuc/updateDanhMucCha/${categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục cha:", error);
      throw error;
    }
  };
  
  // Hàm thêm danh mục cha mới
  export const createDanhMucCha = async (formData) => {
    try {
      const response = await axios.post(
        "/api/danhmuc/createDanhMucCha",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm danh mục cha:", error);
      throw error;
    }
  };

  export const updateDanhMucCon = async (categoryId, subCategoryId, data) => {
    try {
      const response = await axios.put(
        `/api/danhmuc/updateDanhMucCon/${categoryId}/${subCategoryId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục con:", error);
      throw error;
    }
  };

  export const createDanhMucCon = async (categoryId, data) => {
    try {
      const response = await axios.post(
        `/api/danhmuc/createDanhMucCon/${categoryId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm danh mục con:", error);
      throw error;
    }
  };