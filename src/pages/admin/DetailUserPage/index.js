import React, { useState, useEffect } from "react";
import {
  fetchUserById,
  updateUserRoleAndPermissions,
} from "../../../api/userService";
import "./style.scss";

const defaultPermissions = [
  { entity: "sanpham", actions: ["them", "sua", "xoa"] },
  { entity: "khuyenmai", actions: ["them", "sua", "xoa"] },
  { entity: "hoadon", actions: ["them", "sua", "xoa"] },
];

// Đối tượng ánh xạ tên quyền và hành động sang tiếng Việt có dấu
const translationMap = {
  sanpham: "Sản phẩm",
  khuyenmai: "Khuyến mãi",
  hoadon: "Hóa đơn",
  them: "Thêm",
  sua: "Sửa",
  xoa: "Xóa",
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

    try {
      await updateUserRoleAndPermissions(user._id, {
        role: selectedRole,
        permissions: updatedPermissions,
      });
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Đã xảy ra lỗi khi cập nhật quyền hạn.");
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
                  <h3>{`Quản lý ${translationMap[perm.entity] || perm.entity}`}</h3>
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
