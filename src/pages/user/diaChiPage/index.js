import React, { useEffect, useState } from "react";
import "./style.scss";
import { fetchUserById, showDiaChiByIdUser } from "api/userService";
import { useLocation } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import AddAddressForm from "../addAddressForm"; // Giả định bạn đã tạo component này

const DiaChiPage = () => {
  const location = useLocation();
  const [addressList, setAddressList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // State để quản lý dialog

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userIdFromUrl = queryParams.get("user");
    const storedUserId = localStorage.getItem("userId");

    const userId = userIdFromUrl || storedUserId;

    if (userId) {
      localStorage.setItem("userId", userId);
      fetchUserData(userId);
    }
  }, [location]);

  const fetchUserData = async (userId) => {
    try {
      const userData = await fetchUserById(userId);
      console.log("Dữ liệu người dùng đã lấy:", userData);

      const addressResponse = await showDiaChiByIdUser(userId);
      console.log("Danh sách địa chỉ đã lấy:", addressResponse.diaChiList);

      const formattedAddresses = addressResponse.diaChiList
        .filter((address) => !address.isDeleted)
        .map((address) => ({
          id: address._id,
          name: address.Name,
          phone: address.SoDienThoai,
          city: `${address.tinhThanhPho}, ${address.quanHuyen}, ${address.phuongXa}, ${address.duongThon}`,
          isDefault: false,
        }));

      setAddressList(formattedAddresses);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
  };

  const handleAddNewAddress = () => {
    setDialogOpen(true); // Mở dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Đóng dialog
  };

  const handleAddressAdded = () => {
    fetchUserData(localStorage.getItem("userId")); // Tải lại danh sách địa chỉ
    handleCloseDialog(); // Đóng dialog sau khi thêm địa chỉ
  };

  // Các hàm handleUpdateAddress, handleDeleteAddress, handleSetDefault...

  return (
    <div className="diachi-container">
      <div className="header-address">
        <h2>Địa chỉ của tôi</h2>
        <button className="add-address-btn" onClick={handleAddNewAddress}>
          + Thêm địa chỉ mới
        </button>
      </div>
      <div className="address-list">
        {addressList.map((address, index) => (
          <div key={address.id} className="address-item">
            <h3>{address.name} <span>({address.phone})</span></h3>
            <p>{address.city}</p>
            {address.isDefault && <span className="default-label">Mặc định</span>}
            <div className="address-actions">
              <button >Cập nhật</button>
              <button>Xóa</button>
              {!address.isDefault && (
                <button>Thiết lập mặc định</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Thêm Địa Chỉ Mới</DialogTitle>
        <DialogContent>
          <AddAddressForm onAddressAdded={handleAddressAdded} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DiaChiPage;
