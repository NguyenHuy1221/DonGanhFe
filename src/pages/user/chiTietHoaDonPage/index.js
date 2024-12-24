import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import { getHoaDonById } from "../../../api/hoaDonService";
import icon1_1 from "../../../image/icon_1.png";
import icon1_2 from "../../../image/icon_2.png";
import baokim from "../../../image/baokim.jpg";
import { Modal } from "antd";

const ChiTietHoaDonUserPage = ({ quayLaiHoaDon, onClickChat }) => {
  const { id } = useParams(); // Lấy ID hóa đơn từ URL
  const navigate = useNavigate(); // Điều hướng quay lại
  const [hoaDon, setHoaDon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentWebview, setShowPaymentWebview] = useState(false);
  const [error, setError] = useState(null);
  const hoaDonId = localStorage.getItem("hoadonId");
  const [showExtendDialog, setShowExtendDialog] = useState(false);

  // Lấy thông tin chi tiết hóa đơn từ API
  const fetchHoaDon = async () => {
    try {
      if (!hoaDonId) {
        setError("Không tìm thấy ID hóa đơn trong localStorage");
        return;
      }
      const token = localStorage.getItem("token");
      // Gọi hàm API đã tách ra
      const hoaDonData = await getHoaDonById(hoaDonId, token);
      console.log("Dữ liệu hóa đơn:", hoaDonData);
      setHoaDon(hoaDonData);
      // localStorage.removeItem("hoadonId");
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hóa đơn:", error);
      setError("Không thể lấy thông tin hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoaDon();
    // handleCheckOrderStatus();

  }, [id]);

  useEffect(() => {
    if (hoaDon && hoaDon.DaThanhToan !== true) {
      handleCheckOrderStatus();
    }
  }, [hoaDon]);

  const handleCheckOrderStatus = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      const response = await axios.get(
        `/api/hoadon/Checkdonhangbaokim/${hoaDonId}` , {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        }
      );
      if (response.data.message === "Đơn hàng đã hết hạn") {
        setShowExtendDialog(true);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đơn hàng:", error);
    }
  };

  const handleExtendOrder = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      const response = await axios.post(
        `/api/hoadon/updateTransactionHoaDon/${hoaDonId}` , {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        }
      );
      alert("Đơn hàng đã được gia hạn thành công!");
      setShowExtendDialog(false);
      fetchHoaDon(); // Cập nhật lại thông tin hóa đơn
    } catch (error) {
      console.error("Lỗi khi gia hạn đơn hàng:", error);
      alert("Lỗi khi gia hạn đơn hàng");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  // const handleThanhToanClick = () => {
  //   setShowPaymentWebview(true); // Hiển thị Webview khi nhấn "Thanh Toán"
  // };

  const handleThanhToanClick = () => {
    if (hoaDon.payment_url) {
      window.open(hoaDon.payment_url, "_blank"); // Mở URL trong một tab mới
    } else {
      alert("Không tìm thấy URL thanh toán.");
    }
  };

  const renderBankInfo = (transactionId) => {
    const idString = String(transactionId); // Chuyển transactionId thành chuỗi
    switch (idString) {
      case "295":
        return { icon: icon1_2, name: "VietQR" };
      case "297":
        return { icon: icon1_1, name: "VNPay" };
      case "151":
        return { icon: baokim, name: "ATM" };
      case "111":
        return null; // Không hiển thị nếu transactionId là "111"
      default:
        return { icon: null, name: "Ngân hàng không xác định" };
    }
  };

  const bankInfo = renderBankInfo(hoaDon.transactionId);
  console.log("Thông tin ngân hàng:", bankInfo);
  return (
    <div className="chi-tiet-hoa-don-container nuane">
      <div className="box_l_ct">
        <button className="btn-back" onClick={quayLaiHoaDon}>
          Quay Lại
        </button>
        <h1>Chi Tiết Hóa Đơn</h1>
        {/* <button
          className="btn-message"
          onClick={() => onClickChat(hoaDon.userId._id)}
        >
          Chát
        </button> */}
      </div>

      {/* Webview Payment URL */}
      {bankInfo && (
        <div className="payment-info">
          <h2>Thông Tin Thanh Toán</h2>
          <div className="bank-info">
            {bankInfo.icon && (
              <img
                src={bankInfo.icon}
                alt={bankInfo.name}
                className="bank-icon"
              />
            )}
            <span className="bank-name">{bankInfo.name}</span>
            {!hoaDon.DaThanhToan && (
              <button className="btn-pay" onClick={handleThanhToanClick}>
                Thanh Toán
              </button>
            )}
          </div>
        </div>
      )}

      {/* Webview Payment */}
      {showPaymentWebview && hoaDon.payment_url && (
        <div className="payment-webview">
          <h2>Thanh Toán Trực Tuyến</h2>
          <iframe
            src={hoaDon.payment_url} // Lấy URL thanh toán động từ API
            title="Thanh Toán Trực Tuyến"
            style={{
              width: "100%",
              height: "600px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {/* {showExtendDialog && (
        <div className="extend-dialog">
          {" "}
          <p>Đơn hàng đã hết hạn. Bạn có muốn gia hạn không?</p>{" "}
          <button onClick={handleExtendOrder}>Có</button>{" "}
          <button onClick={() => setShowExtendDialog(false)}>Không</button>{" "}
        </div>
      )} */}

      <Modal
        title="Gia hạn đơn hàng"
        visible={showExtendDialog}
        onOk={handleExtendOrder}
        onCancel={() => setShowExtendDialog(false)}
        okText="Có"
        cancelText="Không"
      >
        <p>Đơn hàng đã hết hạn. Bạn có muốn gia hạn không?</p>{" "}
      </Modal>

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

export default ChiTietHoaDonUserPage;
