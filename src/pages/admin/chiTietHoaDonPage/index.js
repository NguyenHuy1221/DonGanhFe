import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";

const ChiTietHoaDonPage = ({ quayLaiHoaDon }) => {
  const { id } = useParams(); // Lấy ID hóa đơn từ URL
  const navigate = useNavigate(); // Điều hướng quay lại
  const [hoaDon, setHoaDon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin chi tiết hóa đơn từ API
  const fetchHoaDon = async () => {
    try {
      const hoaDonId = localStorage.getItem("hoadonId");
      const response = await axios.get(
        `http://localhost:3000/api/hoadon/getHoaDonByHoaDonIdFullVersion/${hoaDonId}`
      );
      setHoaDon(response.data);
      localStorage.removeItem("hoadonId");
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hóa đơn:", error);
      setError("Không thể lấy thông tin hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoaDon();
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="chi-tiet-hoa-don-container">
      <h1>Chi Tiết Hóa Đơn</h1>

      <div className="order-info">
        <p>
          <strong>Mã Đơn Hàng:</strong> {hoaDon.order_id}
        </p>
        <p>
          <strong>Ngày Tạo:</strong>{" "}
          {new Date(hoaDon.NgayTao).toLocaleDateString()}
        </p>
        <p>
          <strong>Trạng Thái:</strong>
          <span
            className={`status ${
              hoaDon.TrangThai === 0
                ? "pending-approval"
                : hoaDon.TrangThai === 1
                ? "paid"
                : hoaDon.TrangThai === 2
                ? "pending-payment"
                : hoaDon.TrangThai === 3
                ? "failed"
                : "canceled"
            }`}
          >
            {hoaDon.TrangThai === 0
              ? "Đang chờ duyệt"
              : hoaDon.TrangThai === 1
              ? "Đã thanh toán"
              : hoaDon.TrangThai === 2
              ? "Đang chờ thanh toán"
              : hoaDon.TrangThai === 3
              ? "Thanh toán thất bại"
              : "Hủy"}
          </span>
        </p>
        <p>
          <strong>Ghi Chú:</strong> {hoaDon.GhiChu}
        </p>
      </div>

      <div className="address-info">
        <h2>Địa Chỉ Giao Hàng</h2>
        <p>
          <strong>Người Nhận:</strong> {hoaDon.diaChi.Name}
        </p>
        <p>
          <strong>Số Điện Thoại:</strong> {hoaDon.diaChi.SoDienThoai}
        </p>
        <p>
          <strong>Địa Chỉ:</strong>
          {`${hoaDon.diaChi.duongThon}, ${hoaDon.diaChi.phuongXa}, 
          ${hoaDon.diaChi.quanHuyen}, ${hoaDon.diaChi.tinhThanhPho}`}
        </p>
      </div>

      <h2>Chi Tiết Sản Phẩm</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Đơn Giá</th>
            <th>Tổng</th>
            <th>Hình Ảnh</th>
          </tr>
        </thead>
        <tbody>
          {hoaDon.chiTietHoaDon.map((item) => (
            <tr key={item._id}>
              <td>{item.idBienThe.IDSanPham.TenSanPham}</td>
              <td>{item.soLuong}</td>
              <td>{item.donGia.toLocaleString()} VND</td>
              <td>{(item.soLuong * item.donGia).toLocaleString()} VND</td>
              <td>
                <img
                  src={item.idBienThe.IDSanPham.HinhSanPham}
                  alt={item.idBienThe.IDSanPham.TenSanPham}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-amount">
        <strong>Tổng Tiền:</strong> {hoaDon.TongTien.toLocaleString()} VND
      </div>

      <a
        className="payment-link"
        href={hoaDon.payment_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Thanh Toán Ngay
      </a>

      <button className="btn-back" onClick={quayLaiHoaDon}>
        Quay Lại
      </button>
    </div>
  );
};

export default ChiTietHoaDonPage;
