import React, { useState, useEffect, memo } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Layout, Menu, Row, Typography } from "antd";
import { theme } from "antd";
import "./style.scss";
import TableList from "../TableList";
import ThuocTinhPage from "../thuocTinhPage/index";
import GiaTriThuocTinhPage from "../giaTriThuocTinhPage";
import ProductsPage from "../productsPage";
import CategoriesPage from "../categoriesPage";
import ProductFormPage from "../productFormPage";
import HoaDonPage from "../hoaDonPage";
import ChiTietHoaDonPage from "../chiTietHoaDonPage";
import ChatApp from "../chatAppPage";
import BienThePage from "../bienThePage";
import UserListPage from "../userListPage";
import DetailUserPage from "../DetailUserPage";
import BannerManagement from "../bannerPage";
import DoanhThuPage from "../doanhThuPage";
import KhuyenMaiPage from "../khuyenMaiPage";
import DanhSachDanhGiaPage from "../danhSachDanhGiaPage";
import BaiVietPage from "../baiVietPage";
import XacNhanKinhDoanhPage from "../xacNhanKinhDoanhPage";
import UserXacNhanPage from "../userXacNhanPage";
import YeuCauRutTienPage from "../yeuCauRutTienPage";
import ThongSoPage from "../thongSoPage";
import { fetchUserById } from "api/userService";
import { Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { SubMenu } = Menu;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const [user, setUser] = useState(null);

  // Get the selectedNav state from local storage or default to "thuocTinh"
  const [selectedNav, setSelectedNav] = useState(
    localStorage.getItem("selectedNav") || "thuocTinh"
  );

  const clearProductId = () => {
    localStorage.removeItem("productId");
  };

  useEffect(() => {
    // Save the selectedNav state to local storage whenever it changes
    localStorage.setItem("selectedNav", selectedNav);
    const userId = localStorage.getItem("userId");
    fetchUserData(userId);
  }, [selectedNav]);

  const fetchUserData = async (userId) => {
    try {
      const userData = await fetchUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleMenuClick = (e) => {
    clearProductId();
    setSelectedNav(e.key);
  };

  const handleAddProduct = () => {
    setSelectedNav("productFormPage");
  };

  const handleUpdateProduct = (productId) => {
    console.log("Đang cập nhật sản phẩm:", productId);
    setSelectedNav("productFormPage");
    localStorage.setItem("productId", productId._id);
  };

  const handleclickHoaDon = (hoaDonId) => {
    setSelectedNav("cthoadon");
    localStorage.setItem("hoadonId", hoaDonId);
    console.log("Đang cập nhật sản phẩm:", hoaDonId._id);
  };

  const handleClickXemBienThe = (productId) => {
    setSelectedNav("bienthe");
    localStorage.setItem("productId", productId._id);
  };

  const quayLaiHoaDon = () => {
    setSelectedNav("hoadon");
  };

  const quayLaiListUser = () => {
    setSelectedNav("listUser");
  };

  const handlChat = (userId) => {
    console.log("User ID:", userId); // Kiểm tra giá trị userId
    setSelectedNav("chat");
    localStorage.setItem("userId", userId);
  };

  const handlXacNhanUser = (userId) => {
    console.log("User ID:", userId); // Kiểm tra giá trị userId
    setSelectedNav("xnkinhdoanh");
    localStorage.setItem("userIdxn", userId);
  };

  const quayLaiSanPham = () => {
    setSelectedNav("products");
  };

  const quayLaiListUserXacNhan = () => {
    setSelectedNav("userxnkinhdoanh");
  };

  const handUserDetail = (userId) => {
    setSelectedNav("userdetail");
    localStorage.setItem("userIdDetail", userId);
    console.log("User ID:", userId);
  };

  const renderContent = () => {
    switch (selectedNav) {
      case "danhSachThuocTinh":
        return <ThuocTinhPage key="thuocTinh" />;
      case "giaTriThuocTinh":
        return <GiaTriThuocTinhPage key="giaTri" />;
      case "3":
        return <TableList key="tableList" />;
      case "products":
        return (
          <ProductsPage
            key="products"
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onClickBT={handleClickXemBienThe}
          />
        );
      case "productFormPage":
        return (
          <ProductFormPage
            key="productForm"
            onQuayLaiProduct={quayLaiSanPham}
          />
        );
      case "categories":
        return <CategoriesPage key="categories" />;
      case "hoadon":
        return <HoaDonPage key="hoadon" onClickHoaDon={handleclickHoaDon} />;
      case "cthoadon":
        return (
          <ChiTietHoaDonPage
            key="cthoadon"
            quayLaiHoaDon={quayLaiHoaDon}
            onClickChat={handlChat}
          />
        );
      case "chat":
        return <ChatApp key="chat" />;
      case "bienthe":
        return <BienThePage key="bienthe" />;
      case "listUser":
        return <UserListPage key="listUser" onClickUser={handUserDetail} />;
      case "userdetail":
        return (
          <DetailUserPage key="userdetail" quayLaiListUser={quayLaiListUser} />
        );
      case "banner":
        return <BannerManagement key="banner" />;
      case "doanhthu":
        return <DoanhThuPage key="doanhthu" />;
      case "khuyenmai":
        return <KhuyenMaiPage key="khuyenmai" />;
      case "danhgia":
        return <DanhSachDanhGiaPage key="danhgia" />;
      case "baiviet":
        return <BaiVietPage key="baiviet" />;
      case "xnkinhdoanh":
        return (
          <XacNhanKinhDoanhPage
            key="xnkinhdoanh"
            quayLaiUserXacNhan={quayLaiListUserXacNhan}
          />
        );
      case "userxnkinhdoanh":
        return (
          <UserXacNhanPage
            key="userxnkinhdoanh"
            onClickXacNhan={handlXacNhanUser}
          />
        );

      case "ruttien":
        return <YeuCauRutTienPage key="ruttien" />;
      case "thongso":
        return <ThongSoPage key="thongso" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedNav]}
          onClick={handleMenuClick}
        >
          <SubMenu
            key="thuocTinh"
            icon={<DeploymentUnitOutlined />}
            title="Thuộc tính"
          >
            <Menu.Item key="danhSachThuocTinh">Danh sách thuộc tính</Menu.Item>
            <Menu.Item key="giaTriThuocTinh">Giá trị thuộc tính</Menu.Item>
          </SubMenu>
          {user && user.role !== "hokinhdoanh" && (
            <Menu.Item key="listUser" icon={<UploadOutlined />}>
              Danh sách người dùng
            </Menu.Item>
          )}
          {/* <Menu.Item key="listUser" icon={<UploadOutlined />}>
            Danh sách người dùng
          </Menu.Item> */}
          {user && user.role !== "hokinhdoanh" && (
            <Menu.Item key="categories" icon={<UploadOutlined />}>
              Danh mục
            </Menu.Item>
          )}
          {/* <Menu.Item key="categories" icon={<UploadOutlined />}>
            Danh mục
          </Menu.Item> */}
          <SubMenu
            key="products"
            icon={<DeploymentUnitOutlined />}
            title="Sản phẩm"
          >
            <Menu.Item key="products">Danh sách sản phẩm</Menu.Item>
            <Menu.Item key="productFormPage">Thêm sản phẩm</Menu.Item>
          </SubMenu>
          <Menu.Item key="hoadon" icon={<UploadOutlined />}>
            Hóa đơn
          </Menu.Item>
          <Menu.Item key="chat" icon={<UploadOutlined />}>
            Nhắn tin
          </Menu.Item>
          {user && user.role !== "hokinhdoanh" && (
            <Menu.Item key="banner" icon={<UploadOutlined />}>
              Banner
            </Menu.Item>
          )}
          {/* <Menu.Item key="banner" icon={<UploadOutlined />}>
            Banner
          </Menu.Item> */}
          <Menu.Item key="doanhthu" icon={<UploadOutlined />}>
            Doanh thu
          </Menu.Item>
          <Menu.Item key="khuyenmai" icon={<UploadOutlined />}>
            Khuyến mãi
          </Menu.Item>
          <Menu.Item key="danhgia" icon={<UploadOutlined />}>
            Đánh giá
          </Menu.Item>
          <Menu.Item key="baiviet" icon={<UploadOutlined />}>
            Bài viết
          </Menu.Item>
          <Menu.Item key="thongso" icon={<UploadOutlined />}>
            Thông số
          </Menu.Item>
          {user && user.role !== "hokinhdoanh" && (
            <Menu.Item key="userxnkinhdoanh" icon={<UploadOutlined />}>
              Xác nhận kinh doanh user
            </Menu.Item>
          )}
          {/* <Menu.Item key="userxnkinhdoanh" icon={<UploadOutlined />}>
            Xác nhận kinh doanh user
          </Menu.Item> */}

          {user && user.role !== "hokinhdoanh" && (
            <Menu.Item key="ruttien" icon={<UploadOutlined />}>
              Xác nhận rút tiền
            </Menu.Item>
          )}
          {/* <Menu.Item key="ruttien" icon={<UploadOutlined />}>
            Xác nhận rút tiền
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: token.colorBgContainer,
          }}
        >
          <Row align="middle" style={{ height: "100%" }}>
            <Col flex={1}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col>
              <Row align="middle">
                <Col>
                  <Avatar size="default" icon={<UserOutlined />} />
                </Col>
                <Col>
                  <Text style={{ marginLeft: 8, marginRight: 20 }}>
                    {user ? user.tenNguoiDung : "Loading..."}
                  </Text>
                </Col>
                <Col>
                  <Text style={{ marginLeft: 8, marginRight: 20 }}>
                    <Link to="/">Lướt web</Link>
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            overflowY: "auto",
            maxHeight: "calc(100vh - 64px)",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(DashboardPage);
