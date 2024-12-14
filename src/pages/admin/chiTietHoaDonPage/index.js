import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import { getHoaDonById } from "../../../api/hoaDonService";

const ChiTietHoaDonPage = ({ quayLaiHoaDon, onClickChat }) => {
  const { id } = useParams(); // Lấy ID hóa đơn từ URL
  const navigate = useNavigate(); // Điều hướng quay lại
  const [hoaDon, setHoaDon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin chi tiết hóa đơn từ API
  const fetchHoaDon = async () => {
    try {
      const hoaDonId = localStorage.getItem("hoadonId");
      // const response = await axios.get(
      //   `/api/hoadon/getHoaDonByHoaDonIdFullVersion/${hoaDonId}`
      // );
      // setHoaDon(response.data);

      // localStorage.removeItem("hoadonId");
      const hoaDonData = await getHoaDonById(hoaDonId);

      // Cập nhật dữ liệu hóa đơn vào state
      setHoaDon(hoaDonData);
      console.log("Dữ liệu hóa đơn:", hoaDonData);
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
      <div className="box_l_ct">
        <button className="btn-back" onClick={quayLaiHoaDon}>
          Quay Lại
        </button>
        <h1>Chi Tiết Hóa Đơn</h1>
        <button
          className="btn-message"
          onClick={() => onClickChat(hoaDon.userId._id)}
        >
          Chat
        </button>
      </div>

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
                ? "ordered"
                : hoaDon.TrangThai === 1
                ? "packaging"
                : hoaDon.TrangThai === 2
                ? "shipping"
                : hoaDon.TrangThai === 3
                ? "completed"
                : "canceled"
            }`}
          >
            {hoaDon.TrangThai === 0
              ? "Đặt hàng"
              : hoaDon.TrangThai === 1
              ? "Đóng gói"
              : hoaDon.TrangThai === 2
              ? "Bắt đầu giao"
              : hoaDon.TrangThai === 3
              ? "Hoàn thành đơn hàng"
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
          {hoaDon.chiTietHoaDon.map((item) => {
            // Kiểm tra nếu IDSanPham có tồn tại
            const sanPham = item.idBienThe?.IDSanPham;
            if (!sanPham) {
              return null; // Nếu không có sản phẩm, bỏ qua mục này
            }

            return (
              <tr key={item._id}>
                <td>{sanPham.TenSanPham || "Không có tên sản phẩm"}</td>
                <td>{item.soLuong}</td>
                <td>{item.donGia.toLocaleString()} VND</td>
                <td>{(item.soLuong * item.donGia).toLocaleString()} VND</td>
                <td>
                  <img
                    src={sanPham.HinhSanPham || "/default-image.jpg"} // Hiển thị ảnh mặc định nếu không có ảnh
                    alt={sanPham.TenSanPham}
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="total-amount">
        <strong>Tổng Tiền:</strong> {hoaDon.TongTien.toLocaleString()} VND
      </div>
    </div>
  );
};

export default ChiTietHoaDonPage;
