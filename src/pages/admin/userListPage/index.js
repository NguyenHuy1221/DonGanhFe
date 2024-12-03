import React, { useEffect, useState } from "react";
import { getAllUser } from "../../../api/userService";
import "./style.scss";

const UserListPage = ({ onClickUser }) => {
  const [users, setUsers] = useState([]); // Dữ liệu từ API
  const [filteredUsers, setFilteredUsers] = useState([]); // Dữ liệu đã lọc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Filter state
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getAllUser(userId);
        setUsers(response.users);
        setFilteredUsers(response.users);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách người dùng.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Lọc dữ liệu theo tên, trạng thái và vai trò (role)
    let filtered = users;

    if (searchName.trim()) {
      filtered = filtered.filter((user) =>
        user.tenNguoiDung?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (user) => user.isVerified === (statusFilter === "verified")
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  }, [searchName, statusFilter, roleFilter, users]);

  // Xác định dữ liệu trên mỗi trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(filteredUsers) ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser) : [];
  // Chuyển trang
  const totalPages = Array.isArray(filteredUsers) ? Math.ceil(filteredUsers.length / usersPerPage) : 0;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-4">
      {/* Bộ lọc */}
      <form
        className="row g-3 mb-4 justify-content-end"
        onSubmit={(e) => e.preventDefault()} // Ngăn tải lại trang
      >
        <div className="col-md-4 d-flex gap-2">
          <input
            type="text"
            className="form-control custom-width flex-grow-1" // Thêm flex-grow-1 để làm dài input
            placeholder="Tìm theo tên người dùng"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="hokinhdoanh">Hộ kinh doanh</option>
            <option value="khachhang">Khách hàng</option>
            <option value="nhanvien">Nhân viên</option>
          </select>
        </div>
      </form>

      {/* Bảng danh sách */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Ảnh đại diện</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} onClick={() => onClickUser(user._id)}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>
                  <img
                    src={
                      user.anhDaiDien
                        ? user.anhDaiDien
                        : "https://via.placeholder.com/40"
                    }
                    alt="avatar"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                </td>
                <td>{user.tenNguoiDung || "Không rõ"}</td>
                <td>{user.gmail}</td>
                <td>{user.isVerified ? "Đã xác minh" : "Chưa xác minh"}</td>
                <td>{new Date(user.ngayTao).toLocaleDateString("vi-VN")}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(totalPages).keys()].map((page) => (
            <li
              key={page + 1}
              className={`page-item ${
                currentPage === page + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserListPage;
