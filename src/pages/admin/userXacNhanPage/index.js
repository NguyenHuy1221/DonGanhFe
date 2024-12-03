import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchYeuCauDangKyData } from "../../../api/yeuCauDangKyService";
const UserListPage = ({ onClickXacNhan }) => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsersData, setFilteredUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTrangThai, setFilterTrangThai] = useState("cho"); // Mặc định là "cho" (Đang chờ xác nhận)

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(
        //   "/api/yeucaudangky/getListYeuCauDangKy"
        // );
        // // Sắp xếp theo ngày tạo (mới nhất lên đầu)
        // const sortedData = response.data.sort(
        //   (a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)
        // );
        // setUsersData(sortedData); // Lưu dữ liệu đã sắp xếp vào state
        // filterUsersByTrangThai("cho", sortedData); // Áp dụng bộ lọc mặc định "cho"
        const data = await fetchYeuCauDangKyData(); // Gọi API lấy dữ liệu yêu cầu đăng ký

        // Sắp xếp theo ngày tạo (mới nhất lên đầu)
        const sortedData = data.sort(
          (a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)
        );

        setUsersData(sortedData); // Lưu dữ liệu đã sắp xếp vào state
        filterUsersByTrangThai("cho", sortedData); // Áp dụng bộ lọc mặc định "cho"
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu!");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm lọc người dùng theo trạng thái
  const filterUsersByTrangThai = (trangThaiValue, data = usersData) => {
    let filtered = [...data];

    if (trangThaiValue !== "all") {
      filtered = filtered.filter((user) => user.trangThai === trangThaiValue);
    }

    setFilteredUsersData(filtered);
  };

  // Tính toán dữ liệu cho trang hiện tại
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredUsersData.slice(firstIndex, lastIndex);

  // Tổng số trang
  const totalPages = Math.ceil(filteredUsersData.length / itemsPerPage);

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Xử lý thay đổi bộ lọc trạng thái
  const handleTrangThaiFilterChange = (e) => {
    const value = e.target.value;
    setFilterTrangThai(value);
    filterUsersByTrangThai(value); // Lọc lại danh sách người dùng
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-4">
      <div className="mb-3 d-flex justify-content-end ms-auto align-items-center gap-2">
        <label htmlFor="filterTrangThai" className="form-label mb-0">
          Lọc theo trạng thái:
        </label>
        <select
          id="filterTrangThai"
          className="form-select w-auto"
          value={filterTrangThai}
          onChange={handleTrangThaiFilterChange}
        >
          <option value="all">Tất cả</option>
          <option value="cho">Đang chờ xác nhận</option>
          <option value="xacnhan">Đã xác nhận</option>
          <option value="huy">Đã hủy</option> {/* Thêm lựa chọn "Đã hủy" */}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user._id} style={{ cursor: "pointer" }}>
                <td>{firstIndex + index + 1}</td>
                <td>{user.diaChi?.Name || "N/A"}</td>
                <td>{user.diaChi?.Email || "Không có email"}</td>
                <td>{user.diaChi?.SoDienThoai || "Không có số"}</td>
                <td>
                  <span className="badge bg-warning text-dark">
                    {user.trangThai === "cho"
                      ? "Đang chờ xác nhận"
                      : user.trangThai === "huy"
                      ? "Đã hủy" // Hiển thị "Đã hủy" khi trạng thái là "huy"
                      : user.trangThai}
                  </span>
                </td>
                <td>
                  <button
                    className="approve-btn btn btn-success"
                    onClick={() => {
                      // Lấy _id đầu tiên hoặc tất cả _id từ mảng userId
                      const extractedId =
                        Array.isArray(user.userId) && user.userId.length > 0
                          ? user.userId[0]._id // Hoặc sử dụng `.map` để lấy toàn bộ _id
                          : user.userId?._id || "Không có ID";

                      onClickXacNhan(extractedId); // Gửi _id tới hàm xử lý
                    }}
                  >
                    Xác nhận
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default UserListPage;
