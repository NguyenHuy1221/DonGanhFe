import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";
import { fetchRevenueData } from "../../../api/thongSoService";
const ThongSoPage = () => {
  const [data, setData] = useState({});
  const [totalData, setTotalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState(""); // Lọc từ ngày
  const [toDate, setToDate] = useState(""); // Lọc đến ngày
  const [filter, setFilter] = useState(""); // Lọc theo ngày/tuần/tháng

  // Hàm tải dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // const params = new URLSearchParams();

      // if (fromDate) params.append("fromDate", fromDate);
      // if (toDate) params.append("toDate", toDate);
      // if (filter) params.append("filter", filter);
      // const userId = localStorage.getItem("userId");

      // const response = await axios.get(
      //   `/api/doanhthu/getData/${userId}/?${params.toString()}`
      // );
      // setData(response.data.result);
      // setTotalData(response.data.totalData);
      const userId = localStorage.getItem("userId");
      const filterParams = { fromDate, toDate, filter }; // Các tham số lọc

      const response = await fetchRevenueData(userId, filterParams); // Gọi API lấy dữ liệu doanh thu

      setData(response.result); // Cập nhật state dữ liệu
      setTotalData(response.totalData); // Cập nhật tổng dữ liệu
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải dữ liệu doanh thu.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []); // Gọi fetchData lần đầu khi load trang

  // Khi nhấn nút Lọc
  const handleFilter = () => {
    fetchData(); // Gọi lại hàm tải dữ liệu
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-4">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Ngăn trang tải lại
          handleFilter(); // Gọi hàm lọc dữ liệu
        }}
        className="mb-4"
      >
        <div className="d-flex align-items-center">
          <label className="form-label">Từ ngày:</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center">
          <label className="form-label">Đến ngày:</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center">
          <label className="form-label">Lọc theo:</label>
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Mặc định (Ngày)</option>
            <option value="tuan">Tuần</option>
            <option value="thang">Tháng</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Lọc dữ liệu
        </button>
      </form>

      {/* Bảng dữ liệu */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Ngày</th>
              <th>Tổng Doanh Thu</th>
              <th>Tổng Khuyến Mãi Đã Sử Dụng</th>
              <th>Tổng Đang Chờ</th>
              <th>Tổng Khuyến Mãi Sắp Sử Dụng</th>
              <th>Tổng Hủy</th>
              <th>Tổng Hóa Đơn</th>
              <th>Tổng Biến Thể Bán</th>
              <th>Đơn Hàng Chờ</th>
              <th>Đơn Hàng Xác Nhận</th>
              <th>Đơn Hàng Hủy</th>
            </tr>
          </thead>
          <tbody>
            {/* Dòng Tổng */}
            <tr className="table-primary fw-bold">
              <td>Tổng</td>
              <td>{totalData.TongDoanhThu.toLocaleString()} VNĐ</td>
              <td>{totalData.TongKhuyenMaidasudung}</td>
              <td>{totalData.TongDangCho.toLocaleString()} VNĐ</td>
              <td>{totalData.TongKhuyenMaisapsudung}</td>
              <td>{totalData.TongHuy}</td>
              <td>{totalData.TongHoaDon}</td>
              <td>{totalData.TongBienTheBan}</td>
              <td>{totalData.DonHangCho}</td>
              <td>{totalData.DonHangXacNhan}</td>
              <td>{totalData.DonHangHuy}</td>
            </tr>

            {/* Dữ liệu từng ngày */}
            {Object.keys(data).map((date) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{data[date].TongDoanhThu.toLocaleString()} VNĐ</td>
                <td>{data[date].TongKhuyenMaidasudung}</td>
                <td>{data[date].TongDangCho.toLocaleString()} VNĐ</td>
                <td>{data[date].TongKhuyenMaisapsudung}</td>
                <td>{data[date].TongHuy}</td>
                <td>{data[date].TongHoaDon}</td>
                <td>{data[date].TongBienTheBan}</td>
                <td>{data[date].DonHangCho}</td>
                <td>{data[date].DonHangXacNhan}</td>
                <td>{data[date].DonHangHuy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ThongSoPage;
