import axios from "axios";

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

export const fetchProductsByDanhMuc = async (IDDanhMuc) => {
  try {
    const response = await axios.get(`/api/sanpham/findSanPham/${IDDanhMuc}`);
    const products = response.data;

    return products;
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
    const response = await axios.get(
      `/api/sanpham/getlistBienThe/${id}`
    );
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
