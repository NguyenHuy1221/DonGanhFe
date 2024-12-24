import React, { useEffect, useState } from "react";
import "./style.scss";
import { fetchUserById, showDiaChiByIdUser,deleteAddressById } from "api/userService";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AddAddressForm from "../addAddressForm"; // Giả định bạn đã tạo component này

const DiaChiPage = () => {
  const location = useLocation();
  const [addressList, setAddressList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // State để quản lý dialog
  const [editingAddress, setEditingAddress] = useState(null);

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setDialogOpen(true); // Mở dialog chỉnh sửa
  };
  const handleEditCompleted = () => {
    fetchUserData(localStorage.getItem("userId")); // Tải lại danh sách địa chỉ
    handleCloseDialog();
  };

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

  const handleDeleteAddress = async (addressId) => {
    const userId = localStorage.getItem("userId");
  
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        const response = await deleteAddressById(userId, addressId); // Gọi API
        console.log(response.message);
  
        // Cập nhật danh sách địa chỉ từ phản hồi
        // setAddressList(response.updatedAddressList);
        fetchUserData(userId);
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        alert("Xóa địa chỉ thất bại.");
      }
    }
  };
  
  

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
            <h3>
              {address.name} <span>({address.phone})</span>
            </h3>
            <p>{address.city}</p>
            {address.isDefault && (
              <span className="default-label">Mặc định</span>
            )}
            <div className="address-actions">
              <button onClick={() => handleEditAddress(address)}>
                Chỉnh sửa
              </button>
              <button onClick={() => handleDeleteAddress(address.id)}>Xóa</button>
              {/* {!address.isDefault && <button>Thiết lập mặc định</button>} */}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingAddress ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
        </DialogTitle>
        <DialogContent>
          <AddAddressForm
            onAddressAdded={handleAddressAdded}
            editingAddress={editingAddress}
            onEditCompleted={handleEditCompleted}
          />
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
