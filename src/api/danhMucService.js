import axios from "axios";
const token = localStorage.getItem("token"); // Lấy token từ localStorage
export const getDanhMucList = async () => {
  try {
    const response = await axios.get("/api/danhmuc/getlistDanhMuc", {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};

// Hàm xóa danh mục cha
export const deleteDanhMucCha = async (id) => {
  try {
    const response = await axios.delete(`/api/danhmuc/deleteDanhMucCha/${id}` , {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào headers
      },
    });
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
      `/api/danhmuc/deleteDanhMucCon/${parentId}/${subCategoryId}` , {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục con:", error);
    throw error;
  }
};

// Hàm cập nhật danh mục cha
// export const updateDanhMucCha = async (categoryId, formData) => {
//     try {
//       const response = await axios.put(
//         `/api/danhmuc/updateDanhMucCha/${categoryId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//         , {
//           headers: {
//             Authorization: `Bearer ${token}`, // Truyền token vào headers
//           },
//         });
//       return response.data;
//     } catch (error) {
//       console.error("Lỗi khi cập nhật danh mục cha:", error);
//       throw error;
//     }
//   };
  
export const updateDanhMucCha = async (categoryId, formData) => {
  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const response = await axios.put(
      `/api/danhmuc/updateDanhMucCha/${categoryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Content-Type cho multipart
          Authorization: `Bearer ${token}`, // Truyền token vào headers
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
  // export const createDanhMucCha = async (formData) => {
  //   try {
  //     const response = await axios.post(
  //       "/api/danhmuc/createDanhMucCha",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //       , {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Truyền token vào headers
  //         },
  //       });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Lỗi khi thêm danh mục cha:", error);
  //     throw error;
  //   }
  // };

  export const createDanhMucCha = async (formData) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.post(
        "/api/danhmuc/createDanhMucCha",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Content-Type cho multipart
            Authorization: `Bearer ${token}`, // Truyền token vào headers
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
        , {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        });
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
        , {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm danh mục con:", error);
      throw error;
    }
  };