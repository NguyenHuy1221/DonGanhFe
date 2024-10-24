import React, { useState, useEffect, memo } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Tooltip,
  Select,
  Button,
  Pagination,
  Popconfirm,
} from "antd";
import axios from "axios";
import moment from "moment";
import "./style.scss";
import { fetchCategories } from "../../../api/categoriesService";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProductsPage = ({ onAddProduct ,onUpdateProduct}) => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleEdit = (productId) => {
    onUpdateProduct(productId); // Gọi hàm xử lý với ID sản phẩm
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesData();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("api/sanpham/getlistSanPham");
      const productsWithKeys = response.data
        .filter((product) => product.TinhTrang !== "Đã xóa") 
        .map((product) => ({
          ...product,
          key: product._id,
        }));
      setProducts(productsWithKeys);
    } catch (error) {
      message.error("Lỗi khi truy xuất sản phẩm");
      console.error("Error during data fetch:", error);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      message.error("Lỗi khi truy xuất danh mục");
      console.error("Error during category fetch:", error);
    }
  };

  const handleCategoryChange = (value) => {
    console.log("Danh mục đã chọn:", value);
  };


  const deleteProductHandler = async (id) => {
    console.log("ID sản phẩm để xóa:", id);
    try {
      await axios.put(`/api/sanpham/deleteSanPham/${id}`);
      fetchProducts();
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      message.error("Xóa sản phẩm thất bại");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        await axios.put(`/api/updateProduct/${editRecord._id}`, values);
        message.success("Cập nhật sản phẩm thành công");
      } else {
        // Nếu không chỉnh sửa, xử lý việc thêm sản phẩm ở đây nếu cần
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi gửi biểu mẫu:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  const expandedRowRender = (record) => {
    return (
      <div className="expanded-row-actions">
        <span>ID: {record.IDSanPham}</span> |
        <a onClick={() => handleEdit(record)}>Chỉnh sửa</a> |
        <a href={`/detail/${record._id}`} rel="noopener noreferrer">
          Xem thử
        </a>| 
        <a onClick={() => message.info("Sao chép ID")}>Sao chép</a> |
        <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            onConfirm={() => deleteProductHandler(record._id)}
          >
            <Button icon={<DeleteOutlined />} style={{ marginLeft: '8px' }} />
          </Popconfirm>
      </div>
    );
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "HinhSanPham",
      key: "HinhSanPham",
      render: (text) => (
        <img
          src={text}
          alt="Sản phẩm"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "TenSanPham",
      key: "TenSanPham",
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              maxWidth: "150px",
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "DonGiaBan",
      key: "DonGiaBan",
    },
    {
      title: "Số lượng hiện tại",
      dataIndex: "SoLuongHienTai",
      key: "SoLuongHienTai",
    },
    {
      title: "Tình trạng",
      dataIndex: "TinhTrang",
      key: "TinhTrang",
      render: (text) => (
        <span
          style={{
            color: text === "Còn hàng" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Lần sửa gần nhất",
      dataIndex: "NgayTao",
      key: "NgayTao",
      render: (date) =>
        moment(date)
          .format("DD/MM/YYYY [lúc] hh:mm A")
          .replace("AM", "sáng")
          .replace("PM", "chiều"),
    },
  ];

  const displayedProducts = products
    .filter((product) => product.TinhTrang !== "Đã xóa")
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <h1>Sản phẩm</h1>

      <Button
        type="primary"
        style={{ marginLeft: "16px", marginBottom: "16px" }}
        onClick={onAddProduct}
      >
        Thêm sản phẩm
      </Button>

      <div className="filter-section">
        <Select
          placeholder="Chọn danh mục"
          style={{ width: 200, marginLeft: "16px" }}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.TenDanhMuc}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo loại sản phẩm"
          style={{ width: 200, marginLeft: "16px" }}
          // onChange={(value) => handleFilterChange(value, "productType")}
        >
          <Option value="type1">Sản phẩm đơn giản</Option>
          <Option value="type2">Sản phẩm có biến thể</Option>
        </Select>

        <Select
          placeholder="Lọc theo trạng thái kho"
          style={{ width: 200, marginLeft: "16px" }}
          // onChange={(value) => handleFilterChange(value, "stockStatus")}
        >
          <Option value="inStock">Còn hàng</Option>
          <Option value="outOfStock">Hết hàng</Option>
        </Select>

        <Button type="primary" style={{ marginLeft: "8px" }}>
          Lọc
        </Button>

        <div className="custom-search">
          <Input.Search placeholder="Tìm sản phẩm" style={{ width: 250 }} />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={displayedProducts}
        pagination={false}
        rowClassName={(record, index) => {
          return index === hoveredRow ? "hovered-row" : "";
        }}
        onRow={(record, rowIndex) => {
          return {
            onMouseEnter: () => {
              setHoveredRow(rowIndex);
            },
            onMouseLeave: () => {
              setHoveredRow(null);
            },
          };
        }}
        expandable={{
          expandedRowRender,
        }}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={products.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "16px" }}
      />
      <Modal
        title={isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="TenSanPham"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Giá bán" name="DonGiaBan">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Số lượng hiện tại" name="SoLuongHienTai">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Tình trạng" name="TinhTrang">
            <Select>
              <Option value="Còn hàng">Còn hàng</Option>
              <Option value="Hết hàng">Hết hàng</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Hình ảnh" name="HinhSanPham">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(ProductsPage);
