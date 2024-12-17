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
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import "./style.scss";
import { fetchCategories } from "../../../api/categoriesService";
import {
  fetchProductListAdmin,
  deleteProduct,
} from "../../../api/productService";
import ImportExcel from "../ImportExcelPage";
import { DeleteOutlined } from "@ant-design/icons";
import { formatter, numberFormatter } from "../../../utils/fomater";

const { Option } = Select;

const ProductsPage = ({ onAddProduct, onUpdateProduct, onClickBT }) => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu lựa chọn danh mục
  const [stockStatus, setStockStatus] = useState(null);
  const pageSize = 10;

  const handleEdit = (productId) => {
    onUpdateProduct(productId);
  };

  const handleClickBienThe = (productId) => {
    onClickBT(productId);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesData();
  }, [currentPage, selectedCategory, stockStatus]);

  const fetchProducts = async () => {
    try {
      const userId = localStorage.getItem("userId");
      // const response = await axios.get(
      //   `api/sanpham/getlistSanPhamAdmin/${userId}`
      // );
      const products = await fetchProductListAdmin(userId);
      const productsWithKeys = products
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
      // await axios.put(`/api/sanpham/deleteSanPham/${id}`);
      const token = localStorage.getItem("token");
      await deleteProduct(id, token);
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

  // Lọc sản phẩm theo tên
  const filteredProducts = products.filter((product) =>
    product.TenSanPham.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleToggleChange = async (id, isActive) => {
    console.log(`Product ID: ${id}, Active: ${isActive}`);
    try {
      // Sử dụng POST thay vì PUT cho API toggleSanPhamMoi
      const token = localStorage.getItem("token");

      // await axios.post(`/api/sanpham/toggleSanPhamMoi/${id}`);
      await axios.post(
        `/api/sanpham/toggleSanPhamMoi/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      message.success("Cập nhật trạng thái thành công!");
      fetchProducts(); // Làm mới danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      message.error("Không thể cập nhật trạng thái.");
    }
  };

  const expandedRowRender = (record) => {
    return (
      <div className="expanded-row-actions">
        <span>ID: {record.IDSanPham}</span> |
        <a onClick={() => handleEdit(record)}>Chỉnh sửa</a> |
        <a href={`/detail/${record._id}`} rel="noopener noreferrer">
          Xem thử
        </a>
        |<a onClick={() => message.info("Sao chép ID")}>Sao chép</a> |
        <a onClick={() => handleClickBienThe(record)}>Xem biến thể</a> |
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
          onConfirm={() => deleteProductHandler(record._id)}
        >
          <Button icon={<DeleteOutlined />} style={{ marginLeft: "8px" }} />
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
      render: (value) => formatter(value),
    },
    {
      title: "Số lượng hiện tại",
      dataIndex: "SoLuongHienTai",
      key: "SoLuongHienTai",
      render: (value) => numberFormatter(value),
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
      title: "Đăng bán",
      dataIndex: "SanPhamMoi", // Sử dụng đúng tên của field
      key: "SanPhamMoi",
      render: (isNew, record) => (
        <span style={{ marginLeft: "8px" }}>
          <Switch
            checked={isNew} // Dựa vào giá trị `SanPhamMoi`
            onChange={(checked) => handleToggleChange(record._id, checked)}
            checkedChildren="Bán"
            unCheckedChildren="Tắt"
          />
        </span>
      ),
    },
  ];

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <>
      <h1>Sản phẩm</h1>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        {/* Nút Thêm sản phẩm */}
        <Button
          type="primary"
          // style={{ marginRight: "16px" }}
          onClick={onAddProduct}
        >
          Thêm sản phẩm
        </Button>

        {/* Component ImportExcel */}
        <ImportExcel onSuccess={fetchProducts} />
      </div>

      <div className="filter-section">
        {/* <Select
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
          placeholder="Lọc theo trạng thái kho"
          style={{ width: 200, marginLeft: "16px" }}
          // onChange={(value) => handleFilterChange(value, "stockStatus")}
        >
          <Option value="inStock">Còn hàng</Option>
          <Option value="outOfStock">Hết hàng</Option>
        </Select>

        <Button type="primary" style={{ marginLeft: "8px" }}>
          Lọc
        </Button> */}

        <div className="custom-search">
          <Input.Search
            value={searchName}
            placeholder="Tìm sản phẩm"
            style={{ width: 250 }}
            onChange={(e) => setSearchName(e.target.value)}
          />
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
    </>
  );
};

export default memo(ProductsPage);
