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

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { SubMenu } = Menu;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  // Get the selectedNav state from local storage or default to "thuocTinh"
  const [selectedNav, setSelectedNav] = useState(
    localStorage.getItem("selectedNav") || "thuocTinh"
  );

  useEffect(() => {
    // Save the selectedNav state to local storage whenever it changes
    localStorage.setItem("selectedNav", selectedNav);
  }, [selectedNav]);

  const handleMenuClick = (e) => {
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

  const quayLaiHoaDon = () => {
    setSelectedNav("hoadon");
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
          />
        );
      case "productFormPage":
        return <ProductFormPage key="productForm" />;
      case "categories":
        return <CategoriesPage key="categories" />;
      case "hoadon":
        return <HoaDonPage key="hoadon" onClickHoaDon={handleclickHoaDon} />;
      case "cthoadon":
        return (
          <ChiTietHoaDonPage key="cthoadon" quayLaiHoaDon={quayLaiHoaDon} />
        );
      case "chat":
        return <ChatApp key="chat" />;

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
          <Menu.Item key="3" icon={<UploadOutlined />}>
            Danh sách bảng
          </Menu.Item>
          <Menu.Item key="categories" icon={<UploadOutlined />}>
            Danh mục
          </Menu.Item>
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
                    John Doe
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
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(DashboardPage);
