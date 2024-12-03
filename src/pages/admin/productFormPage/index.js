import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Card,
  Checkbox,
  Spin,
  Table,
  Space,
  Popconfirm,
  Modal,
  InputNumber,
} from "antd";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { layDanhSachThuocTinh } from "../../../api/thuocTinhService";
import { getDanhMucList } from "../../../api/danhMucService";
import {
  fetchProductsById,
  updateProduct,
  createProduct,
} from "../../../api/productService";

import { getGiaTriThuocTinh } from "../../../api/giaTriThuocTinhService";

import { formatter, numberFormatter } from "../../../utils/fomater";

const { Option } = Select;

const ProductFormPage = ({ onQuayLaiProduct }) => {
  const [form] = Form.useForm();
  const { _id } = useParams();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thuocTinhList, setThuocTinhList] = useState([]); // State cho thuộc tính
  const [selectedThuocTinh, setSelectedThuocTinh] = useState([]); // Lưu thuộc tính được chọn
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [extraImagePreviews, setExtraImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [thuocTinhGiaTri, setThuocTinhGiaTri] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([
    { thuocTinhSKU: null, giaTri: null },
  ]); // Khởi tạo với 2 thuộc tính

  const [luachon, setLuachon] = useState(0);
  const [variants, setVariants] = useState([]);

  const onThuocTinhSelect = async (value, index) => {
    // Cập nhật thuộc tính đã chọn
    const updatedAttributes = [...selectedAttributes];
    updatedAttributes[index].thuocTinhSKU = value;
    setSelectedAttributes(updatedAttributes);
    setThuocTinhGiaTri([]); // Reset giá trị thuộc tính

    // Gọi hàm để lấy giá trị thuộc tính tương ứng
    await fetchGiaTriThuocTinh(value);
  };

  const addAttribute = () => {
    setSelectedAttributes((prev) => [
      ...prev,
      { thuocTinhSKU: null, giaTri: null },
    ]);
  };

  const handleAttributeChange = (index, thuocTinhSKU, values) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes[index] = {
      ...newSelectedAttributes[index],
      thuocTinhSKU,
      giaTri: values,
    };
    setSelectedAttributes(newSelectedAttributes);
  };

  const getAvailableAttributes = (currentIndex) => {
    // Lọc thuộc tính đã được chọn
    return thuocTinhList.filter((thuocTinh, index) =>
      selectedAttributes.every(
        (attribute, i) =>
          i === currentIndex || attribute.thuocTinhSKU !== thuocTinh._id
      )
    );
  };

  const removeAttribute = (index) => {
    if (index === 0) {
      return;
    }

    const updatedAttributes = selectedAttributes.filter(
      (attribute, idx) => idx !== index
    );
    setSelectedAttributes(updatedAttributes);
  };

  useEffect(() => {
    // Lấy danh mục và thuộc tính khi form được mở
    const fetchCategories = async () => {
      try {
        // const response = await axios.get("api/danhmuc/getlistDanhMuc");
        // setCategories(response.data);
        const categories = await getDanhMucList();
        setCategories(categories);
      } catch (error) {
        message.error("Lỗi khi lấy danh mục");
      }
    };

    const fetchThuocTinh = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await layDanhSachThuocTinh(userId);
        setThuocTinhList(data);
      } catch (error) {
        // message.error("Lỗi khi lấy danh sách thuộc tính");
        console.log("Lỗi khi lấy danh sách thuộc tính");
      }
    };

    fetchCategories();
    fetchThuocTinh();

    fetchProduct();
  }, []);

  // Hàm gọi API để lấy danh sách giá trị thuộc tính theo ID
  const fetchGiaTriThuocTinh = async (id) => {
    try {
      // const response = await axios.get(
      //   `/api/thuoctinhgiatri/findThuocTinhGiaTri/${id}`
      // );
      // setThuocTinhGiaTri(response.data); // Cập nhật state với dữ liệu từ API
      const giaTri = await getGiaTriThuocTinh(id);
      setThuocTinhGiaTri(giaTri);
    } catch (error) {
      message.error("Lỗi khi tải giá trị thuộc tính!");
    }
  };

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category._id === form.getFieldValue("IDDanhMuc")
    );
    setSubCategories(selectedCategory?.DanhMucCon || []);
  }, [form.getFieldValue("IDDanhMuc")]);

  const fetchProduct = async () => {
    const productId = localStorage.getItem("productId"); // Lấy _id từ localStorage

    if (!productId) return; // Nếu không có _id thì không làm gì cả

    if (productId) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }

    try {
      // const response = await axios.get(
      //   `/api/sanpham/findSanPhambyID/${productId}`
      // );
      // const productData = response.data;
      const productData = await fetchProductsById(productId);
      console.log("vaclcl ", productData);

      // Set hình ảnh chính và hình ảnh bổ sung
      setImagePreview(productData.HinhSanPham); // Hình ảnh chính
      setExtraImagePreviews(productData.HinhBoSung.map((img) => img.UrlAnh));

      setProduct(productData);
      form.setFieldsValue(productData); // Đặt dữ liệu vào form
      localStorage.removeItem("productId"); // Xóa _id sau khi sử dụng

      // Thiết lập dữ liệu cho thuộc tính
      if (productData.DanhSachThuocTinh) {
        const ids = productData.DanhSachThuocTinh.map((item) => item._id);
        setSelectedThuocTinh(ids.map((id) => ({ _id: id }))); // Lưu trữ danh sách ID dưới dạng đối tượng
        form.setFieldsValue(productData); // Đặt dữ liệu vào form
      }

      console.log(productData.DanhSachThuocTinh);
    } catch (error) {
      message.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find(
      (category) => category._id === value
    );
    setSubCategories(selectedCategory?.DanhMucCon || []);
    form.setFieldsValue({ IDDanhMucCon: undefined });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      message.error("Không có tệp nào được chọn.");
    }
  };

  const handleExtraFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Kiểm tra nếu số lượng ảnh phụ vượt quá 4
    if (files.length > 4) {
      message.error("Bạn chỉ có thể chọn tối đa 4 ảnh phụ.");
      return;
    }

    if (files.length > 0) {
      // Cập nhật lại danh sách ảnh phụ và ảnh preview
      setExtraImages(files);
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setExtraImagePreviews(previewUrls);
    } else {
      message.error("Không có tệp nào được chọn");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const productId = product ? product._id : null;

    // if (!imageFile) {
    //   message.error("Vui lòng chọn ảnh chính.");
    //   setLoading(false);
    //   return;
    // }

    // if (extraImages.length === 0) {
    //   message.error("Vui lòng chọn ít nhất một ảnh phụ.");
    //   setLoading(false);
    //   return;
    // }

    if (luachon === 1) {
      for (let i = 0; i < selectedAttributes.length; i++) {
        const attribute = selectedAttributes[i];

        if (
          !attribute.thuocTinhSKU ||
          !Array.isArray(attribute.giaTri) ||
          attribute.giaTri.length === 0
        ) {
          message.error(
            `Vui lòng chọn thuộc tính và giá trị cho biến thể sản phẩm ${i + 1}`
          );
          return;
        }
      }
    }

    try {
      const values = await form.validateFields();
      console.log("Form values before sending:", values);
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        message.error("Bạn chưa đăng nhập");
        return;
      }

      const formData = new FormData();
      formData.append("userId", storedUserId);
      formData.append("IDSanPham", values.IDSanPham);
      formData.append("TenSanPham", values.TenSanPham);
      formData.append("DonGiaNhap", values.DonGiaNhap);
      formData.append("DonGiaBan", values.DonGiaBan);
      formData.append("SoLuongNhap", values.SoLuongNhap);
      formData.append("SoLuongHienTai", values.SoLuongHienTai);
      formData.append("PhanTramGiamGia", values.PhanTramGiamGia);
      formData.append("TinhTrang", values.TinhTrang);
      formData.append("MoTa", values.MoTa);
      formData.append("Unit", values.Unit);
      formData.append("IDDanhMuc", values.IDDanhMuc);
      formData.append("IDDanhMucCon", values.IDDanhMucCon);

      formData.append("luachon", luachon);

      if (luachon !== 0) {
        // Chỉ thêm các giá trị này nếu lựa chọn khác 0

        formData.append("sku", values.sku);
        formData.append("gia", values.gia);
        formData.append("soLuong", values.soLuong);

        selectedAttributes.forEach((attribute, index) => {
          // Gửi thuộc tính SKU
          formData.append(
            `DanhSachThuocTinh[${index}][thuocTinh]`,
            attribute.thuocTinhSKU
          );

          // Gửi từng giá trị của thuộc tính
          attribute.giaTri.forEach((value, i) => {
            formData.append(
              `DanhSachThuocTinh[${index}][giaTriThuocTinh][${i}]`,
              value
            );
          });
        });
      }

      if (productId) {
      } else {
        if (!imageFile) {
          message.error("Vui lòng chọn ảnh chính.");
          setLoading(false);
          return;
        }

        if (extraImages.length === 0) {
          message.error("Vui lòng chọn ít nhất một ảnh phụ.");
          setLoading(false);
          return;
        }
      }

      console.log("Form data to be sent:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      formData.append("file", imageFile);
      extraImages.forEach((file) => {
        formData.append("files", file);
      });

      let response;
      // if (productId) {
      //   response = await axios.put(
      //     `/api/sanpham/updateSanPham/${productId}`,
      //     formData
      //   );
      //   message.success("Cập nhật sản phẩm thành công");
      //   onQuayLaiProduct();
      // } else {
      //   response = await axios.post("/api/sanpham/createSanPham", formData);
      //   message.success("Thêm sản phẩm mới thành công");
      //   onQuayLaiProduct();
      //   const newProductId = response.data._id;
      // }

      if (productId) {
        // Nếu có productId, gọi API cập nhật sản phẩm
        response = await updateProduct(productId, formData);
        message.success("Cập nhật sản phẩm thành công");
      } else {
        // Nếu không có productId, gọi API thêm mới sản phẩm
        response = await createProduct(formData);
        message.success("Thêm sản phẩm mới thành công");
      }

      // Quay lại danh sách sản phẩm
      onQuayLaiProduct();

      // Lưu ID của sản phẩm mới tạo
      const newProductId = response._id;
      localStorage.setItem("productId", newProductId);
    } catch (error) {
      console.error(
        "Error during form submission:",
        error.response?.data || error.message
      );
      message.error("Trùng Id sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      <Card
        style={{ borderRadius: "8px" }}
        title={isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Hình Ảnh Sản Phẩm"
                rules={[
                  { required: true, message: "Vui lòng tải lên hình ảnh!" },
                ]}
              >
                <Input type="file" onChange={handleFileChange} />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    style={{
                      marginTop: "10px",
                      maxWidth: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hình Ảnh Bổ Sung">
                <Input type="file" multiple onChange={handleExtraFileChange} />
                <div
                  style={{ display: "flex", marginTop: "10px", gap: "10px" }}
                >
                  {extraImagePreviews.map((previewUrl, index) => (
                    <img
                      key={index}
                      src={previewUrl}
                      alt={`Extra Preview ${index}`}
                      style={{
                        maxWidth: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="IDSanPham"
                label="ID Sản Phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập ID sản phẩm!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="TenSanPham"
                label="Tên Sản Phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="IDDanhMuc"
                label="Danh Mục"
                rules={[
                  { required: true, message: "Vui lòng chọn danh mục cha!" },
                ]}
              >
                <Select
                  placeholder="Chọn danh mục cha"
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.TenDanhMuc}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="IDDanhMucCon"
                label="Danh Mục Con"
                rules={[
                  { required: true, message: "Vui lòng chọn danh mục con!" },
                ]}
              >
                <Select placeholder="Chọn danh mục con">
                  {subCategories.map((subCategory) => (
                    <Option key={subCategory._id} value={subCategory._id}>
                      {subCategory.TenDanhMucCon}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="DonGiaBan"
                label="Giá Bán"
                rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={numberFormatter}
                  parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="DonGiaNhap"
                label="Giá Nhập"
                rules={[{ required: true, message: "Vui lòng nhập giá nhập!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={numberFormatter}
                  parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Unit"
                label="Unit"
                rules={[{ required: true, message: "Vui lòng nhập Unit!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="SoLuongNhap"
                label="Số Lượng Nhập"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={numberFormatter}
                  parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="SoLuongHienTai"
                label="Số Lượng Hiện Tại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng hiện tại!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={numberFormatter}
                  parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="PhanTramGiamGia" label="Phần Trăm Giảm Giá">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={numberFormatter}
                  parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="TinhTrang"
                label="Tình Trạng"
                rules={[
                  { required: true, message: "Vui lòng chọn tình trạng!" },
                ]}
              >
                <Select placeholder="Chọn tình trạng">
                  <Option value="Còn hàng">Còn hàng</Option>
                  <Option value="Hết hàng">Hết hàng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!isEditMode && (
            <Select value={luachon} onChange={setLuachon}>
              <Option value={0}>Sản Phẩm Đơn Giản</Option>
              <Option value={1}>Tổ Hợp Biến Thể</Option>
            </Select>
          )}

          {luachon === 1 && !isEditMode && (
            <Card>
              <h1>Biến Thể Sản Phẩm</h1>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="sku"
                    label="SKU"
                    rules={[{ required: true, message: "Vui lòng nhập SKU!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="gia"
                    label="Giá"
                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      formatter={numberFormatter}
                      parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="soLuong"
                    label="Số Lượng"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng!" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      formatter={numberFormatter}
                      parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {selectedAttributes.map((attribute, index) => (
                <Row gutter={16} key={index}>
                  <Col span={11}>
                    <Form.Item
                      label="Chọn Thuộc Tính"
                      name={`thuocTinhSKU_${index}`}
                      rules={[
                        {
                          required: true,
                          message: `Vui lòng chọn thuộc tính cho biến thể ${
                            index + 1
                          }`,
                        },
                      ]}
                    >
                      <Select
                        value={attribute.thuocTinhSKU}
                        onChange={(value) => onThuocTinhSelect(value, index)}
                      >
                        {getAvailableAttributes(index).map((thuocTinh) => (
                          <Option key={thuocTinh._id} value={thuocTinh._id}>
                            {thuocTinh.TenThuocTinh}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      label="Giá Trị"
                      name={`giaTri_${index}`}
                      rules={[
                        {
                          required: true,
                          message: `Vui lòng chọn giá trị cho thuộc tính ${
                            attribute.thuocTinhSKU ? attribute.thuocTinhSKU : ""
                          }`,
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        value={attribute.giaTri}
                        onChange={(value) =>
                          handleAttributeChange(
                            index,
                            attribute.thuocTinhSKU,
                            value
                          )
                        }
                        disabled={!attribute.thuocTinhSKU}
                      >
                        {thuocTinhGiaTri.map((item) => (
                          <Option key={item._id} value={item._id}>
                            {item.GiaTri}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  {index !== 0 && (
                    <Col span={2}>
                      <Button
                        type="danger"
                        onClick={() => removeAttribute(index)}
                        style={{
                          width: "100%",
                          marginTop: 30,
                        }}
                      >
                        Xóa
                      </Button>
                    </Col>
                  )}
                </Row>
              ))}

              <Row gutter={16}>
                <Col span={24}>
                  <Button type="dashed" onClick={addAttribute}>
                    Thêm Thuộc Tính
                  </Button>
                </Col>
              </Row>
            </Card>
          )}

          <Row gutter={16} style={{ marginTop: "16px" }}>
            <Col span={12}>
              <Form.Item
                name="MoTa"
                label="Mô Tả"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ paddingTop: "40px" }}>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Cập nhật" : "Thêm "}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductFormPage;
