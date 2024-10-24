import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";

const HoaDonPage = ({ onClickHoaDon }) => {
  const [hoaDons, setHoaDons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách hóa đơn từ API
  const fetchHoaDons = async () => {
    try {
      const response = await axios.get("/api/hoadon/getlistHoaDon");
      // Sắp xếp hóa đơn theo Ngày Tạo giảm dần
      const sortedHoaDons = response.data.sort((a, b) => new Date(b.NgayTao) - new Date(a.NgayTao));
      setHoaDons(sortedHoaDons);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      setError("Không thể lấy danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };
  

  // Xóa hóa đơn
  const deleteHoaDon = async (id) => {
    try {
      await axios.delete(`/api/hoadon/${id}`);
      setHoaDons(hoaDons.filter((hoaDon) => hoaDon._id !== id));
      alert("Đã xóa hóa đơn thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      alert("Xóa hóa đơn thất bại.");
    }
  };

  useEffect(() => {
    fetchHoaDons();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="hoa-don-container">
      <h1>Quản Lý Hóa Đơn</h1>
      <table className="hoa-don-table">
        <thead>
          <tr>
            {/* <th>Mã Hóa Đơn</th> */}
            <th>Ngày Tạo</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th>Hình Thức Thanh Toán</th>
            <th className="actions-column">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {hoaDons.map((hoaDon) => (
            <tr key={hoaDon._id}>
              {/* <td>{hoaDon.order_id}</td> */}
              <td>{new Date(hoaDon.NgayTao).toLocaleDateString()}</td>
              <td>{hoaDon.TongTien.toLocaleString()} VND</td>
              <td>
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
              </td>
              <td>
                <span
                  className={`payment-status ${
                    hoaDon.transactionId === 111
                      ? "cash-payment"
                      : hoaDon.transactionId === 0 || !hoaDon.transactionId
                      ? "canceled"
                      : "card-payment"
                  }`}
                >
                  {hoaDon.transactionId === 111
                    ? "Thanh toán tiền mặt"
                    : hoaDon.transactionId === 0 || !hoaDon.transactionId
                    ? "Chưa chọn phương thức thanh toán"
                    : "Thanh toán qua thẻ ngân hàng"}
                </span>
              </td>
              <td className="actions-cell">
                <button
                  className="btn delete"
                  onClick={() => deleteHoaDon(hoaDon._id)}
                >
                  Xóa
                </button>
                <button
                  className="btn detail"
                  onClick={() => onClickHoaDon(hoaDon._id)}
                >
                  Chi Tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoaDonPage;
