import React, { useState, memo } from "react";
import "./style.scss";
import HoSoPage from "../hoSoPage";
import DiaChiPage from "../diaChiPage";
import HoaDonUserPage from "../hoaDonPage";
import ChiTietHoaDonUserPage from "../chiTietHoaDonPage";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("hoso");
  const navigate = useNavigate();
  const [showChiTiet, setShowChiTiet] = useState(false);

  const handleShowChiTietHoaDon = () => {
    setShowChiTiet(true);
  };

  const handleBackToHoaDon = () => {
    setShowChiTiet(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "hoso":
        return <HoSoPage key="hoso" />;
      case "diachi": // Thêm trường hợp cho địa chỉ
        return <DiaChiPage key="diachi" />;
      case "hoadon":
        return showChiTiet ? (
          <ChiTietHoaDonUserPage quayLaiHoaDon={handleBackToHoaDon} />
        ) : (
          <HoaDonUserPage onShowChiTietHoaDon={handleShowChiTietHoaDon} />
        );
      default:
        return null;
    }
  };
  const handleLogout = () => {
    // Xóa userId khỏi localStorage khi đăng xuất
    localStorage.removeItem("userId");

    // Chuyển hướng đến trang đăng nhập
    navigate("/login"); // Sử dụng navigate để chuyển hướng
  };
  return (
    <div className="container">
      <div className="container_profile">
        <div className="sidebar">
          <ul>
            <li onClick={() => setActiveTab("hoso")}>Hồ Sơ</li>
            <li onClick={() => setActiveTab("diachi")}>Địa Chỉ</li>
            <li onClick={() => setActiveTab("hoadon")}>Hóa Đơn</li>
            <li onClick={handleLogout}>Đăng Xuất</li>
          </ul>
        </div>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default memo(ProfilePage);
