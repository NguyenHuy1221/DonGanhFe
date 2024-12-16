import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { getHoaDonsByUserId } from '../../../api/hoaDonService';

const HoaDonUserPage = ({ onShowChiTietHoaDon  }) => {
  const [hoaDons, setHoaDons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userIdFromUrl = queryParams.get("user");
    const storedUserId = localStorage.getItem("userId");

    const userId = userIdFromUrl || storedUserId;

    if (userId) {
      localStorage.setItem("userId", userId);
      fetchHoaDons(userId);
    }
  }, [location]);

  const handleViewDetails = (hoaDonId) => {
    localStorage.setItem("hoadonId", hoaDonId); // Lưu ID hóa đơn
    onShowChiTietHoaDon (); // Gọi hàm callback từ ProfilePage
  };

  const fetchHoaDons = async (userId) => {
    try {
      const data = await getHoaDonsByUserId(userId);
      const sortedHoaDons = data.sort(
        (a, b) => new Date(b.NgayTao) - new Date(a.NgayTao)
      );
      setHoaDons(sortedHoaDons);
    } catch (error) {
      setError("Không thể lấy danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="hoa-don-container">
      <h1>Hóa Đơn</h1>
      <table className="hoa-don-table">
        <thead>
          <tr>
            <th>Ngày Tạo</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th className="actions-column">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {hoaDons.map((hoaDon) => (
            <tr key={hoaDon._id}>
              <td>{new Date(hoaDon.NgayTao).toLocaleDateString()}</td>
              <td>{hoaDon.TongTien.toLocaleString()} VND</td>
              <td>
                <span className={`status_new-${hoaDon.TrangThai}`}>
                  {hoaDon.TrangThai === 0
                    ? "Đặt hàng"
                    : hoaDon.TrangThai === 1
                    ? "Đóng gói"
                    : hoaDon.TrangThai === 2
                    ? "Bắt đầu giao"
                    : hoaDon.TrangThai === 3
                    ? "Hoàn thành đơn hàng"
                    : "Hủy đơn hàng"}
                </span>
              </td>
              
              <td className="actions-cell">
               
              <button className="btn detail" onClick={() => handleViewDetails(hoaDon._id)}>
              Xem chi tiết
            </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoaDonUserPage;
