import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.scss";
import {
  fetchAdminYeuCauRutTien,
  updateYeuCauRutTienAdmin,
  rejectRequestApi
} from "../../../api/yeuCauRutTienService";
const YeuCauRutTienPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // Bộ lọc trạng thái xử lý: 'all', 'processed', 'pending'
  const [xacThucFilter, setXacThucFilter] = useState("true"); // Bộ lọc Xác Thực: 'true' hoặc 'false'

  const fetchRequests = async () => {
    try {
      
      const requests = await fetchAdminYeuCauRutTien();
      setRequests(requests);
      setFilteredRequests(requests.filter((req) => req.XacThuc === true));
      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải yêu cầu rút tiền.");
      setLoading(false);
    }
  };

  useEffect(() => {
   

    fetchRequests();
  }, []);

  // Hàm lọc yêu cầu
  const filterRequests = (
    filterValue,
    xacThucValue,
    allRequests = requests
  ) => {
    let filtered = allRequests;

    // Lọc theo trạng thái xử lý
    if (filterValue === "processed") {
      filtered = filtered.filter((req) => req.daXuLy);
    } else if (filterValue === "pending") {
      filtered = filtered.filter((req) => !req.daXuLy);
    }

    // Lọc theo trạng thái XacThuc
    if (xacThucValue === "true") {
      filtered = filtered.filter((req) => req.XacThuc === true);
    } else if (xacThucValue === "false") {
      filtered = filtered.filter((req) => req.XacThuc === false);
    }

    setFilteredRequests(filtered);
  };

  // Hàm thay đổi trạng thái bộ lọc xử lý
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    filterRequests(value, xacThucFilter); 
  };

  // Hàm thay đổi trạng thái bộ lọc XacThuc
  const handleXacThucFilterChange = (e) => {
    const value = e.target.value;
    setXacThucFilter(value);
    filterRequests(filter, value); 
  };

  // Hàm phê duyệt yêu cầu
  const handleApprove = async (id) => {
    if (!id) {
      alert("ID yêu cầu không hợp lệ.");
      return;
    }

    try {
      // Gửi API và lấy phản hồi
      const responseData = await updateYeuCauRutTienAdmin(id, "xacnhan");

      // Kiểm tra phản hồi và xử lý thành công
      if (responseData) {
        alert("Yêu cầu rút tiền đã được phê duyệt.");

        // Cập nhật state requests
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id
              ? { ...req, daXuLy: true, TrangThai: "xacnhan" }
              : req
          )
        );

        // Lọc lại dữ liệu hiển thị
        filterRequests(filter, xacThucFilter);
        fetchRequests();

      } else {
        alert("Không thể phê duyệt yêu cầu. Đã xảy ra lỗi.");
      }
    } catch (error) {
      console.error("Lỗi khi phê duyệt yêu cầu:", error);
      alert("Không thể phê duyệt yêu cầu.");
    }
  };

  // Từ chối yêu cầu
  const handleReject = async (id) => {
    if (!id) {
      alert("ID yêu cầu không hợp lệ.");
      return;
    }
  
    try {
      // Gửi yêu cầu từ chối thông qua hàm API
      const response = await rejectRequestApi(id);
  
      // Kiểm tra nếu phản hồi thành công
      if (response.status === 200) {
        alert("Yêu cầu rút tiền đã được cập nhật.");
  
        // Cập nhật state requests
        const updatedRequests = requests.map((req) =>
          req._id === id ? { ...req, daXuLy: true, thatBai: true } : req
        );
        setRequests(updatedRequests);
  
        // Lọc lại dữ liệu hiển thị
        filterRequests(filter, xacThucFilter, updatedRequests);
      } else {
        alert("Không thể từ chối yêu cầu.");
      }
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu:", error);
      alert("Không thể từ chối yêu cầu.");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-4">
      <div className="mb-3 d-flex justify-content-end ms-auto align-items-center gap-2">
        {/* Bộ lọc theo trạng thái xử lý */}
        <label htmlFor="filter" className="form-label mb-0">
          Lọc theo trạng thái:
        </label>
        <select
          id="filter"
          className="form-select w-auto"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="all">Tất cả</option>
          <option value="processed">Đã xử lý</option>
          <option value="pending">Chờ xử lý</option>
        </select>

        {/* Bộ lọc theo trạng thái Xác Thực */}
        <label htmlFor="xacThucFilter" className="form-label mb-0">
          Lọc theo Xác Thực:
        </label>
        <select
          id="xacThucFilter"
          className="form-select w-auto"
          value={xacThucFilter}
          onChange={handleXacThucFilterChange}
        >
          <option value="true">Đã Xác Thực</option>
          <option value="false">Chưa Xác Thực</option>
        </select>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Tên ngân hàng</th>
              <th>Số tài khoản</th>
              <th>Số tiền</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr key={request._id}>
                <td>{index + 1}</td>
                <td>{request.userId.tenNguoiDung}</td>
                <td>{request.userId.gmail}</td>
                <td>{request.tenNganHang}</td>
                <td>{request.soTaiKhoan}</td>
                <td>{request.soTien.toLocaleString()} VNĐ</td>
                <td>{request.ghiChu}</td>
                <td>
                  <span
                    className={`badge ${
                      request.daXuLy ? "bg-success" : "bg-warning"
                    } text-dark`}
                  >
                    {request.daXuLy ? "Đã xử lý" : "Chờ xử lý"}
                  </span>
                </td>
                <td>
                  {!request.daXuLy && (
                    <div className="action-buttons-nng">
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(request._id)}
                      >
                        Phê duyệt
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(request._id)}
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YeuCauRutTienPage;
