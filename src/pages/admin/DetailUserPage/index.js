import React, { useState, useEffect } from "react";
import {
  fetchUserById,
  updateUserRoleAndPermissions,
} from "../../../api/userService";
import "./style.scss";

const defaultPermissions = [
  { entity: "sanpham", actions: ["them", "sua", "xoa",'update', 'xem'] },
  { entity: "khuyenmai", actions: ["them", "sua", "xoa",'update', 'xem'] },
  { entity: "hoadon", actions: ["them", "sua", "xoa",'update', 'xem'] },
  { entity: "baiviet", actions: ["them", "sua", "xoa",'update', 'xem'] },
  { entity: "thuoctinh", actions: ["them", "sua", "xoa",'update', 'xem'] },
  { entity: "giatrithuoctinh", actions: ["them", "sua", "xoa",'update', 'xem'] },
  { entity: "nguoidung", actions: ["them", "sua", "xoa",'update', 'xem'] },
  { entity: "yeucaudangky", actions: ["them", "sua", "xoa",'update', 'xem'] },

];

// Đối tượng ánh xạ tên quyền và hành động sang tiếng Việt có dấu
const translationMap = {
  sanpham: "Sản phẩm",
  khuyenmai: "Khuyến mãi",
  hoadon: "Hóa đơn",
  baiviet: "Bài viết",
  thuoctinh: "Thuộc tính",
  giatrithuoctinh: "Giá trị thuộc tính",
  nguoidung: "Người dùng",
  yeucaudangky: "Yêu cầu đăng ký",
  them: "Thêm",
  sua: "Sửa",
  xoa: "Xóa",
  update: "Cập nhật",
  xem: "Xem",

};

const DetailUserPage = ({ quayLaiListUser }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userIdDetail");
    const fetchUserDetail = async () => {
      try {
        const data = await fetchUserById(userId);
        setUser(data);
        setSelectedRole(data.role);

        const userPermissions = data.permissions || [];
        const initialPermissions = defaultPermissions.map((perm) => {
          const userPerm = userPermissions.find(
            (p) => p.entity === perm.entity
          );
          return {
            entity: perm.entity,
            actions: perm.actions
              .map((action) =>
                userPerm?.actions.includes(action) ? action : null
              )
              .filter(Boolean),
          };
        });

        setPermissions(initialPermissions);
        setLoading(false);
      } catch (error) {
        setError("Không thể tải thông tin người dùng.");
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, []);

  const handleRoleChange = (e) => setSelectedRole(e.target.value);

  const handlePermissionsChange = (entity, action) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.entity === entity
          ? {
              ...perm,
              actions: perm.actions.includes(action)
                ? perm.actions.filter((act) => act !== action)
                : [...perm.actions, action],
            }
          : perm
      )
    );
  };

  const handleUpdateRoleAndPermissions = async () => {
    const updatedPermissions = defaultPermissions.map((perm) => {
      const existingPerm = permissions.find((p) => p.entity === perm.entity);
      return existingPerm || perm;
    });

    console.log("Payload gửi lên server:", {
      role: selectedRole,
      permissions: updatedPermissions,
    });
    const token = localStorage.getItem("token");

    try {
      await updateUserRoleAndPermissions(user._id, {
        role: selectedRole,
        permissions: updatedPermissions,
      },token);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert(
        "User này chưa tạo yêu cầu đăng ký làm hộ kinh doanh phải đăng ký và admin xác nhận thì mới được phân quyền."
      );
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-detail">
      <div className="box_l_ct">
        <button className="btn-back" onClick={quayLaiListUser}>
          Quay Lại
        </button>
        <h1>Chi Tiết Người Dùng</h1>
      </div>

      {user && (
        <div className="user-detail-info">
          {user.anhDaiDien && (
            <div className="user-avatar">
              <img
                src={user.anhDaiDien}
                alt="Ảnh đại diện"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "16px",
                }}
              />
            </div>
          )}
          <p>
            <strong>Tên người dùng:</strong> {user.tenNguoiDung}
          </p>
          <p>
            <strong>Email:</strong> {user.gmail}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
          </p>

          <label>
            <strong>Vai trò:</strong>
          </label>
          <select value={selectedRole} onChange={handleRoleChange}>
            <option value="khachhang">Khách hàng</option>
            <option value="hokinhdoanh">Hộ kinh doanh</option>
            <option value="nhanvien">Nhân viên</option>
            <option value="admin">Admin</option>
          </select>

          <h2>Quyền hạn</h2>
          {selectedRole === "nhanvien" && (
            <>
              {defaultPermissions.map((perm) => (
                <div key={perm.entity} className="permission-group">
                  <h3>{`Quản lý ${
                    translationMap[perm.entity] || perm.entity
                  }`}</h3>
                  {perm.actions.map((action) => (
                    <label key={action}>
                      <input
                        type="checkbox"
                        checked={
                          permissions
                            .find((p) => p.entity === perm.entity)
                            ?.actions.includes(action) || false
                        }
                        onChange={() =>
                          handlePermissionsChange(perm.entity, action)
                        }
                      />
                      {translationMap[action] || action}
                    </label>
                  ))}
                </div>
              ))}
            </>
          )}

          <button onClick={handleUpdateRoleAndPermissions}>Lưu thay đổi</button>
        </div>
      )}
    </div>
  );
};

export default DetailUserPage;
