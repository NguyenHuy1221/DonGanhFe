import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./style.scss";
import { fetchUserById, showDiaChiByIdUser } from "api/userService";

const PaymentPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [user, setUser] = useState(null);
  // API-related states
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // CART-ITEM
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;

  const [addresses, setAddresses] = useState([]);
  const [displayedAddress, setDisplayedAddress] = useState(null);

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

      // Định dạng dữ liệu địa chỉ theo định dạng sử dụng trong component
      const formattedAddresses = addressResponse.diaChiList
        .filter((address) => !address.isDeleted) // Lọc địa chỉ có isDeleted là false
        .map((address, index) => ({
          id: index + 1,
          name: address.Name,
          phone: address.SoDienThoai,
          city: `${address.tinhThanhPho}, ${address.quanHuyen}, ${address.phuongXa}, ${address.duongThon}`,
        }));

      setAddresses(formattedAddresses);
      setUser(userData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
  };

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    specificAddress: "",
    type: "Nhà Riêng",
  });

  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  const address = displayedAddress || {}; // Gán giá trị rỗng nếu displayedAddress không tồn tại
  const [tinhThanhPho = "", quanHuyen = "", phuongXa = "", duongThon = ""] = (
    address.city || ""
  )
    .split(",")
    .map((part) => part.trim());

  // Define the missing function here
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Fetch cities on component mount
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách thành phố:", error)
      );
  }, []);

  // Fetch districts when a city is selected
  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setNewAddress((prevState) => ({
      ...prevState,
      city: cityCode,
      district: "", // Reset district and ward when city changes
      ward: "",
    }));

    axios
      .get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`)
      .then((response) => {
        setDistricts(response.data.districts);
        setWards([]); // Clear wards when a new city is selected
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách quận/huyện:", error)
      );
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setNewAddress((prevState) => ({
      ...prevState,
      district: districtCode,
      ward: "", // Reset ward when district changes
    }));

    axios
      .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((response) => {
        setWards(response.data.wards);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách xã/phường:", error)
      );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (selectedAddress !== null) {
      const selected = addresses.find(
        (address) => address.id === parseInt(selectedAddress)
      );
      setDisplayedAddress(selected);
    }
    setShowNewAddressForm(false);
    setOpen(false);
  };

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
  };

  const handleCancelNewAddress = () => {
    setShowNewAddressForm(false);
    setNewAddress({
      name: "",
      phone: "",
      city: "",
      district: "",
      ward: "",
      specificAddress: "",
      type: "Nhà Riêng",
    });
  };

  const handleSubmit = async () => {
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.city ||
      !newAddress.district ||
      !newAddress.ward ||
      !newAddress.specificAddress
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    const addressData = {
      Name: newAddress.name,
      SoDienThoai: newAddress.phone,
      tinhThanhPho: cities.find((city) => city.code === newAddress.city)?.name,
      quanHuyen: districts.find(
        (district) => district.code === newAddress.district
      )?.name,
      phuongXa: wards.find((ward) => ward.code === newAddress.ward)?.name,
      duongThon: newAddress.specificAddress,
    };

    const userId = localStorage.getItem("userId");
    console.log(userId);

    try {
      const response = await axios.post(
        `/api/diachi/createDiaChi/${userId}`,
        addressData
      );
      alert("Thêm địa chỉ thành công!");

      // Gọi lại hàm fetchUserData để cập nhật danh sách địa chỉ
      fetchUserData(userId);

      // Reset form
      setShowNewAddressForm(false);
      setNewAddress({
        name: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        specificAddress: "",
        type: "Nhà Riêng",
      });
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      alert("Không thể thêm địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
  };

  const createInvoice = async () => {
    const userId = localStorage.getItem("userId");
  
    const invoiceData = {
      userId,
      diaChiMoi: {
        tinhThanhPho: tinhThanhPho || "",
        quanHuyen: quanHuyen || "",
        phuongXa: phuongXa || "",
        duongThon: duongThon || "",
        Name: displayedAddress.name,
        SoDienThoai: displayedAddress.phone,
      },
      ghiChu: "GỬI HÀNG NHANH LÊN",
      khuyenmaiId: null,
      TongTien: totalAmount,
      transactionId: "111", // Cần kiểm tra lại nếu 111 là giá trị hợp lệ
      ChiTietGioHang: cartItems.map((item) => ({
        idBienThe: item.id,
        soLuong: item.quantity,
        donGia: item.price,
      })),
    };
  
    console.log(
      "Dữ liệu hóa đơn trước khi gửi:",
      JSON.stringify(invoiceData, null, 2)
    );
  
    try {
      const response = await axios.post(
        "/api/hoadon/createUserDiaChivaThongTinGiaoHang",
        invoiceData
      );
  
      console.log("Phản hồi từ API tạo hóa đơn:", response.data);
  
      if (response.data && response.data._id) {
        console.log("Hóa đơn đã được tạo:", response.data);
        alert("Hóa đơn đã được tạo thành công!");
  
        const hoadonId = response.data._id;
        const transactionId = response.data.transactionId || "111"; // Sử dụng 111 nếu không có trong phản hồi
  
        // Gọi API để cập nhật giao dịch COD
        const updateResponse = await axios.put(
          `/api/hoadon/updateTransactionHoaDonCOD/${hoadonId}`,
          { transactionId }
        );
  
        console.log("Giao dịch COD đã được cập nhật:", updateResponse.data);
      } else {
        alert("Không thể tạo hóa đơn. Phản hồi không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      alert("Không thể tạo hóa đơn. Vui lòng thử lại.");
    }
  };
  
  

  const handleConfirmPayment = () => {
    if (displayedAddress) {
      createInvoice();
      handleClose(); // Đóng dialog sau khi tạo hóa đơn
    } else {
      alert("Vui lòng chọn địa chỉ trước khi thanh toán.");
    }
  };

  return (
    <div>
      {/* Button to open dialog */}
      <div className="pd">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Địa Chỉ Của Tôi
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Địa Chỉ Của Tôi</DialogTitle>
        <DialogContent>
          {/* Danh sách địa chỉ hiện có */}
          {!showNewAddressForm && (
            <div>
              <RadioGroup
                value={selectedAddress}
                onChange={(e) => handleSelectAddress(e.target.value)}
              >
                {addresses.map((address) => (
                  <FormControlLabel
                    key={address.id}
                    value={address.id.toString()}
                    control={<Radio />}
                    label={
                      <div>
                        <b>{`Tên: `}</b>{" "}
                        {address.name?.toUpperCase() || "Chưa có tên"} <br />
                        <b>{`Số điện thoại:`}</b>{" "}
                        {address.phone || "Chưa có số"} <br />
                        <b>{`Địa chỉ:`}</b> {address.city || "Chưa có địa chỉ"}
                      </div>
                    }
                  />
                ))}
              </RadioGroup>

              {/* Nút để thêm địa chỉ mới */}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddNewAddress}
              >
                Thêm Địa Chỉ Mới
              </Button>
            </div>
          )}

          {/* Biểu mẫu địa chỉ mới - Chỉ hiển thị khi thêm địa chỉ mới */}
          {showNewAddressForm && (
            <div>
              <TextField
                label="Họ và tên"
                name="name"
                value={newAddress.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Số điện thoại"
                name="phone"
                value={newAddress.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Tỉnh/Thành phố"
                name="city"
                value={newAddress.city}
                onChange={handleCityChange}
                fullWidth
                margin="normal"
              >
                {cities.map((city) => (
                  <MenuItem key={city.code} value={city.code}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Quận/Huyện"
                name="district"
                value={newAddress.district}
                onChange={handleDistrictChange}
                fullWidth
                margin="normal"
                disabled={!districts.length}
              >
                {districts.map((district) => (
                  <MenuItem key={district.code} value={district.code}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Xã/Phường"
                name="ward"
                value={newAddress.ward}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!wards.length}
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.code} value={ward.code}>
                    {ward.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Địa chỉ cụ thể"
                name="specificAddress"
                value={newAddress.specificAddress}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Loại địa chỉ</FormLabel>
                <RadioGroup
                  name="type"
                  value={newAddress.type}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="Nhà Riêng"
                    control={<Radio />}
                    label="Nhà Riêng"
                  />
                  <FormControlLabel
                    value="Văn Phòng"
                    control={<Radio />}
                    label="Văn Phòng"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          {showNewAddressForm ? (
            <>
              <Button onClick={handleCancelNewAddress}>Hủy</Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={
                  !newAddress.name ||
                  !newAddress.phone ||
                  !newAddress.city ||
                  !newAddress.district ||
                  !newAddress.ward ||
                  !newAddress.specificAddress
                }
              >
                Hoàn thành
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} color="primary" variant="contained">
              Xác nhận
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Display the selected address outside the dialog after confirmation */}
      {displayedAddress && (
        <div className="displayed-address">
          <h3>Địa Chỉ:</h3>
          {/* <p>
            <b>{displayedAddress.name}</b>
            <br />
            {displayedAddress.phone}
            <br />
            {displayedAddress.city}
            <br />
            {displayedAddress.type}
          </p> */}
          <p>
            <b>
              <b>Tên: </b>
              {displayedAddress.name}
            </b>
            <br />
            <b>Số điện thoại: </b>
            {displayedAddress.phone}
            <br />
            <span>
              <b>Phường/Xã:</b> {phuongXa}
            </span>
            <br />
            <span>
              <b>Quận/Huyện:</b> {quanHuyen}
            </span>
            <br />
            <span>
              <b>Tỉnh/Thành phố:</b> {tinhThanhPho}
            </span>
            <br />
            <span>
              <b>Địa chỉ cụ thể:</b> {duongThon}
            </span>
          </p>
        </div>
      )}

      {/* Products */}
      <div className="cart-summary">
        <div className="product-list">
          <h3>Danh sách sản phẩm</h3>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cart-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-variation">
                          Phân loại: {item.variation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{item.price.toLocaleString()} VND</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="payment-content">
          <div className="payment-info">
            <h3>Tổng số tiền: {totalAmount} VNĐ</h3>

            <div className="payment-method">
              <h4>Chọn phương thức thanh toán:</h4>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                style={{ display: "flex", flexDirection: "row" }} // Ensure horizontal layout
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="Thanh toán khi nhận hàng"
                />
                <FormControlLabel
                  value="bank"
                  control={<Radio />}
                  label="Chuyển khoản"
                />
              </RadioGroup>
            </div>

            <Button
              onClick={handleConfirmPayment}
              color="primary"
              variant="contained"
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
