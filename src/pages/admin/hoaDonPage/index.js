import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";
import { getHoaDons, updateHoaDonStatus } from "../../../api/hoaDonService";
const HoaDonPage = ({ onClickHoaDon }) => {
  const [hoaDons, setHoaDons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // Thêm trạng thái lọc

  const fetchHoaDons = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // const response = await axios.get(`/api/hoadon/getlistHoaDon/${userId}`);
      // const sortedHoaDons = response.data.sort(
      //   (a, b) => new Date(b.NgayTao) - new Date(a.NgayTao)
      // );
      // setHoaDons(sortedHoaDons);
      const hoaDons = await getHoaDons(userId);

      // Sắp xếp danh sách hóa đơn theo ngày tạo
      // const sortedHoaDons = hoaDons.sort(
      //   (a, b) => new Date(b.NgayTao) - new Date(a.NgayTao)
      // );

      setHoaDons(hoaDons);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      setError("Không thể lấy danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      // await axios.post(`/api/hoadon/updatetrangthaiHoaDOn/${id}`, {
      //   TrangThai: status,
      // });
      setHoaDons((prevHoaDons) =>
        prevHoaDons.map((hoaDon) =>
          hoaDon._id === id ? { ...hoaDon, TrangThai: status } : hoaDon
        )
      );
      await updateHoaDonStatus(id, status,token);

      // Cập nhật trạng thái trong state
      setHoaDons((prevHoaDons) =>
        prevHoaDons.map((hoaDon) =>
          hoaDon._id === id ? { ...hoaDon, TrangThai: status } : hoaDon
        )
      );
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại.");
    }
  };

  // const deleteHoaDon = async (id) => {
  //   try {
  //     await axios.delete(`/api/hoadon/${id}`);
  //     setHoaDons((prevHoaDons) =>
  //       prevHoaDons.filter((hoaDon) => hoaDon._id !== id)
  //     );
  //     alert("Đã xóa hóa đơn thành công!");
  //   } catch (error) {
  //     console.error("Lỗi khi xóa hóa đơn:", error);
  //     alert("Xóa hóa đơn thất bại.");
  //   }
  // };

  useEffect(() => {
    fetchHoaDons();
  }, []);

  const handleStatusChange = (hoaDonId, status) => {
    setNewStatus(status);
    updateStatus(hoaDonId, status);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredHoaDons =
    filterStatus === "all"
      ? hoaDons
      : hoaDons.filter((hoaDon) => hoaDon.TrangThai === Number(filterStatus));

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="hoa-don-container">
      <h1>Quản Lý Hóa Đơn</h1>

      <div className="filter-container">
        <label>Lọc theo trạng thái:</label>
        <select value={filterStatus} onChange={handleFilterChange}>
          <option value="all">Tất cả</option>
          <option value="0">Đặt hàng</option>
          <option value="1">Đóng gói</option>
          <option value="2">Bắt đầu giao</option>
          <option value="3">Hoàn thành đơn hàng</option>
          <option value="4">Hủy đơn hàng</option>
        </select>
      </div>

      <table className="hoa-don-table">
        <thead>
          <tr>
            <th>Ngày Tạo</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th>Hình Thức Thanh Toán</th>
            <th>Thanh toán</th>
            <th className="actions-column">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredHoaDons.map((hoaDon) => (
            <tr key={hoaDon._id}>
              <td>{new Date(hoaDon.NgayTao).toLocaleDateString()}</td>
              <td>{hoaDon.TongTien.toLocaleString()} VND</td>
              <td>
                <select
                  value={hoaDon.TrangThai}
                  onChange={(e) =>
                    handleStatusChange(hoaDon._id, Number(e.target.value))
                  }
                  className={`status-${hoaDon.TrangThai}`}
                >
                  {[0, 1, 2, 3, 4].map((status) => (
                    <option
                      key={status}
                      value={status}
                      className={`status-${status}`}
                    >
                      {status === 0
                        ? "Đặt hàng"
                        : status === 1
                        ? "Đóng gói"
                        : status === 2
                        ? "Bắt đầu giao"
                        : status === 3
                        ? "Hoàn thành đơn hàng"
                        : "Hủy đơn hàng"}
                    </option>
                  ))}
                </select>
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
              <td>
                <span
                  className={`transfer-status ${
                    hoaDon.tienDaCong ? "transfer-true" : "transfer-false"
                  }`}
                >
                  {hoaDon.tienDaCong ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </td>
              <td className="actions-cell">
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
