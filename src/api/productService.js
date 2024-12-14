import axios from "axios";

export const fetchProductListAdmin = async (userId) => {
  try {
    const response = await axios.get(
      `api/sanpham/getlistSanPhamAdmin/${userId}`
    );
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};

export const fetchProductsById = async (_id) => {
  try {
    const response = await axios.get(`/api/sanpham/findSanPhambyID/${_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/sanpham/getlistSanPham");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// export const fetchProductsByDanhMuc = async (IDDanhMuc) => {
//   try {
//     const response = await axios.get(`/api/sanpham/findSanPham/${IDDanhMuc}`);
//     const products = response.data;

//     return products;
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       console.warn(`Không tìm thấy sản phẩm cho ID danh mục: ${IDDanhMuc}`);
//       return [];
//     } else {
//       console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
//       throw error;
//     }
//   }
// };

export const fetchProductsByDanhMuc = async (IDDanhMuc) => {
  try {
    const response = await axios.get(`/api/sanpham/findSanPham/${IDDanhMuc}`);
    const products = response.data;

    // Lọc sản phẩm không có TinhTrang là "Đã xóa"
    return products.filter((product) => product.TinhTrang !== "Đã xóa");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Không tìm thấy sản phẩm cho ID danh mục: ${IDDanhMuc}`);
      return [];
    } else {
      console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      throw error;
    }
  }
};

export const fetchBienThe = async (id) => {
  try {
    const response = await axios.get(`/api/sanpham/getlistBienThe/${id}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching product variants:", error);
    return [];
  }
};

export const sapXepSanPhamTheoGia = async () => {
  try {
    const response = await axios.get("/api/sanpham/sapXepSanPhamTheoGia");
    return response.data;
  } catch (error) {
    console.error("Error products:", error);
    throw error;
  }
};

export const sapXepSanPhamTheoGiaGiamDan = async () => {
  try {
    const response = await axios.get(
      "/api/sanpham/sapXepSanPhamTheoGiaGiamDan"
    );
    return response.data;
  } catch (error) {
    console.error("Error products:", error);
    throw error;
  }
};

export const sapXepSanPhamTheoNgayTao = async () => {
  try {
    const response = await axios.get("/api/sanpham/sapXepSanPhamTheoNgayTao");
    return response.data;
  } catch (error) {
    console.error("Error products:", error);
    throw error;
  }
};

export const sapXepSanPhamNgayTaoGiamDan = async () => {
  try {
    const response = await axios.get(
      "/api/sanpham/sapXepSanPhamNgayTaoGiamDan"
    );
    return response.data;
  } catch (error) {
    console.error("Error products:", error);
    throw error;
  }
};

export const sapXepSanPhamBanChayNhat = async () => {
  try {
    const response = await axios.get("/api/sanpham/sapXepSanPhamBanChayNhat");
    return response.data;
  } catch (error) {
    console.error("Error products:", error);
    throw error;
  }
};

export const sapXepSanPhamCoGiamGia = async () => {
  try {
    const response = await axios.get("/api/sanpham/sapXepSanPhamCoGiamGia");
    return response.data;
  } catch (error) {
    console.error("Error products:", error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post("/api/sanpham/createSanPham", formData);
    return response.data; // Trả về dữ liệu của sản phẩm mới tạo
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm mới:", error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};

export const updateProduct = async (productId, formData) => {
  try {
    const response = await axios.put(
      `/api/sanpham/updateSanPham/${productId}`,
      formData
    );
    return response.data; // Trả về dữ liệu của sản phẩm sau khi cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.put(`/api/sanpham/deleteSanPham/${productId}`);
    return response.data; // Trả về phản hồi từ API
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};

// Cập nhật thuộc tính cho sản phẩm
export const updateThuocTinh = async (sanPhamId, data) => {
  try {
    const response = await axios.put(
      `/api/sanpham/updateThuocTinhForSanPham/${sanPhamId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thuộc tính:", error);
    throw error;
  }
};

// Thêm thuộc tính cho sản phẩm
export const addThuocTinh = async (sanPhamId, data) => {
  try {
    const response = await axios.post(
      `/api/sanpham/addThuocTinhForSanPham/${sanPhamId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm thuộc tính:", error);
    throw error;
  }
};
