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
} from "antd";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { layDanhSachThuocTinh } from "../../../api/thuocTinhService";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Column from "antd/es/table/Column";

const { Option } = Select;

const ProductFormPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [isEditing, setIsEditing] = useState(false); // Xác định thêm hay sửa
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

  const [thuocTinhGiaTriBienThe, setThuocTinhGiaTriBienThe] = useState([]);
  const [selectedBienThe, setSelectedBienThe] = useState([
    { thuocTinhBienThe: null, giaTriBienThe: null },
  ]); // Khởi tạo với 2 thuộc tính

  const onThuocTinhSelectBienThe = async (value, index) => {
    // Cập nhật thuộc tính đã chọn
    const updatedAttributes = [...selectedAttributes];
    updatedAttributes[index].thuocTinhBienThe = value;
    setSelectedBienThe(updatedAttributes);
    setThuocTinhGiaTriBienThe([]);

    // Gọi hàm để lấy giá trị thuộc tính tương ứng
    await fetchGiaTriThuocTinh(value);
  };

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

  const handleAttributeChangeBienThe = (index, thuocTinhBienThe, values) => {
    const newSelectedAttributes = [...selectedBienThe];
    newSelectedAttributes[index] = {
      ...newSelectedAttributes[index],
      thuocTinhBienThe,
      giaTriBienThe: values,
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

  const getAvailableAttributesBienThe = () => {
    if (!product || !product.DanhSachThuocTinh) return [];
  
    return product.DanhSachThuocTinh.map((attribute) => {
      const thuocTinhId = attribute.thuocTinh._id; // Lấy đúng _id từ thuộc tính bên trong
      return {
        thuocTinhId: thuocTinhId,
        TenThuocTinh: attribute.thuocTinh.TenThuocTinh,
        giaTriThuocTinh: attribute.giaTriThuocTinh,
      };
    });
  };
  

  useEffect(() => {
    // Lấy danh mục và thuộc tính khi form được mở
    const fetchCategories = async () => {
      try {
        const response = await axios.get("api/danhmuc/getlistDanhMuc");
        setCategories(response.data);
      } catch (error) {
        message.error("Lỗi khi lấy danh mục");
      }
    };

    const fetchThuocTinh = async () => {
      try {
        const data = await layDanhSachThuocTinh();
        setThuocTinhList(data);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách thuộc tính");
      }
    };

    fetchCategories();
    fetchThuocTinh();

    fetchProduct();
  }, []);

  // Hàm gọi API để lấy danh sách giá trị thuộc tính theo ID
  const fetchGiaTriThuocTinh = async (id) => {
    try {
      const response = await axios.get(
        `/api/thuoctinhgiatri/findThuocTinhGiaTri/${id}`
      );
      setThuocTinhGiaTri(response.data); // Cập nhật state với dữ liệu từ API
      setThuocTinhGiaTriBienThe(response.data);
    } catch (error) {
      message.error("Lỗi khi tải giá trị thuộc tính!");
    }
  };

  const fetchProduct = async () => {
    const productId = localStorage.getItem("productId"); // Lấy _id từ localStorage

    if (!productId) return; // Nếu không có _id thì không làm gì cả

    if (productId) {
      setIsEditMode(true);
      fetchProductVariants(productId);
    } else {
      setIsEditMode(false);
    }

    try {
      const response = await axios.get(
        `/api/sanpham/findSanPhambyID/${productId}`
      );
      const productData = response.data;
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
    if (files.length > 0) {
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

    try {
      const values = await form.validateFields();
      console.log("Form values before sending:", values);

      const formData = new FormData();
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

      console.log("Form data to be sent:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      formData.append("file", imageFile);
      extraImages.forEach((file) => {
        formData.append("files", file);
      });

      let response;
      if (productId) {
        response = await axios.put(
          `/api/sanpham/updateSanPham/${productId}`,
          formData
        );
        message.success("Cập nhật sản phẩm thành công");
      } else {
        response = await axios.post("/api/sanpham/createSanPham", formData);
        message.success("Thêm sản phẩm mới thành công");

        const newProductId = response.data._id;
        fetchProductVariants(newProductId);
      }
    } catch (error) {
      console.error(
        "Error during form submission:",
        error.response?.data || error.message
      );
      message.error("Form submission failed");
    } finally {
      setLoading(false);
    }
  };

  // Fetch product variants from API
  const fetchProductVariants = async (productId) => {
    setLoading(true); // Bắt đầu hiển thị trạng thái tải
    try {
      const response = await axios.get(
        `/api/sanpham/getlistBienThe/${productId}`
      );
      console.log("Danh sách biến thể:", response.data); // Ghi log danh sách biến thể

      setVariants(response.data); // Cập nhật state với dữ liệu biến thể
      message.success(`Đã tải ${response.data.length} biến thể thành công!`);
    } catch (error) {
      console.error("Lỗi khi tải danh sách biến thể:", error);
      message.error("Không thể tải danh sách biến thể.");
    } finally {
      setLoading(false); // Dừng trạng thái tải
    }
  };

  const [isModalVisibleBienThe, setIsModalVisibleBienThe] = useState(false); // Trạng thái modal
  const [isEditingBienThe, setIsEditingBienThe] = useState(false); // Xác định thêm hay sửa
  const [editingRecord, setEditingRecord] = useState(null); // Biến thể đang chỉnh sửa
  const [formBienThe] = Form.useForm(); // Đối tượng form để quản lý biểu mẫu

  const openBienTheModal = () => {
    setIsModalVisibleBienThe(true);
    setIsEditingBienThe(false); // Đặt mặc định là thêm mới, không phải sửa
    setEditingRecord(null); // Xóa dữ liệu đang chỉnh sửa
  };

  const closeBienTheModal = () => {
    setIsModalVisibleBienThe(false);
  };

  const cotDuLieu = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Giá",
      dataIndex: "gia",
      key: "gia",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Biến thể",
      key: "variants",
      render: (text, record) => (
        <>
          {record.KetHopThuocTinh.map((variant) => (
            <div key={variant.IDGiaTriThuocTinh._id}>
              {variant.IDGiaTriThuocTinh.GiaTri}
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa biến thể này không?">
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="DonGiaNhap"
                label="Giá Nhập"
                rules={[{ required: true, message: "Vui lòng nhập giá nhập!" }]}
              >
                <Input type="number" min={0} />
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
                <Input type="number" min={0} />
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
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="PhanTramGiamGia" label="Phần Trăm Giảm Giá">
                <Input type="number" min={0} />
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

          <Select value={luachon} onChange={setLuachon}>
            <Option value={0}>Sản Phẩm Đơn Giản</Option>
            <Option value={1}>Tổ Hợp Biến Thể</Option>
          </Select>

          {luachon === 1 && (
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
                    <Input type="number" min={0} />
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
                    <Input type="number" min={0} />
                  </Form.Item>
                </Col>
              </Row>

              {selectedAttributes.map((attribute, index) => (
                <Row gutter={16} key={index}>
                  <Col span={12}>
                    <Form.Item label="Chọn Thuộc Tính">
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
                  <Col span={12}>
                    <Form.Item label="Giá Trị">
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

      {/* Hiển thị danh sách biến thể */}
      <h1>Quản lý biến thể </h1>

      <Button type="primary" onClick={openBienTheModal}>
        Thêm Biến Thể
      </Button>

      {/* Table */}
      <Table columns={cotDuLieu} dataSource={variants} pagination={false} />

      {/* Modal */}
      <Modal
        title={isEditingBienThe ? "Sửa biến thể" : "Thêm biến thể"}
        visible={isModalVisibleBienThe}
        onCancel={closeBienTheModal}
        okText={isEditingBienThe ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" name="thuoc_tinh_form">
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Vui lòng nhập SKU!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gia"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="soLuong"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <Input type="number" />
          </Form.Item>

          {selectedBienThe.map((attribute, index) => (
            <Row gutter={16} key={index}>
              <Col span={12}>
                {getAvailableAttributesBienThe().map((attribute, index) => (
                  <Form.Item
                    key={attribute.thuocTinhId}
                    label={`Thuộc Tính:`}
                  >
                    <Select
                      value={
                        selectedAttributes[index]?.thuocTinhBienThe || null
                      }
                      disabled // Tắt tính năng chọn
                    >
                      <Option
                        value={selectedAttributes[index]?.thuocTinhBienThe}
                      >
                        {attribute.TenThuocTinh} {/* Hiển thị TenThuocTinh */}
                      </Option>
                    </Select>
                  </Form.Item>
                ))}
              </Col>
              <Col span={12}>
                <Form.Item label="Giá Trị">
                  <Select
                    mode="multiple"
                    value={attribute.giaTriBienThe || []} // Giá trị hiện tại
                    onChange={(value) =>
                      handleAttributeChangeBienThe(
                        index,
                        attribute.thuocTinhBienThe,
                        value
                      )
                    }
                    disabled={!attribute.thuocTinhBienThe} // Tắt nếu không có thuộc tính
                  >
                    {thuocTinhGiaTriBienThe.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.GiaTri} {/* Hiển thị giá trị */}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal>
    </div>
  );
};

export default ProductFormPage;
