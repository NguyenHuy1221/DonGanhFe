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
import { navigate } from "react-router-dom";
import { createDiaChi } from "api/diaChiService";
import { createInvoiceAPI,updateTransactionAPI } from 'api/hoaDonService';

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
  const { selectedStores } = location.state;

  console.log("Danh sách cửa hàng:", selectedStores);

  const [addresses, setAddresses] = useState([]);
  const [displayedAddress, setDisplayedAddress] = useState(null);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [discountCodes, setDiscountCodes] = useState({});
  const [messages, setMessages] = useState({});
  const [selectedVouchers, setSelectedVouchers] = useState({});

  const handleDiscountChange = (storeName, discountCode) => {
    // Lưu trữ mã giảm giá của cửa hàng
    setDiscountCodes({
      ...discountCodes,
      [storeName]: discountCode,
    });
  };

  const handleMessageChange = (storeName, message) => {
    // Lưu trữ lời nhắn của cửa hàng
    setMessages({
      ...messages,
      [storeName]: message,
    });
  };

  const handleVoucherChange = (storeName, voucherCode) => {
    setSelectedVouchers({
      ...selectedVouchers,
      [storeName]: voucherCode,
    });
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
      // const response = await axios.post(
      //   `/api/diachi/createDiaChi/${userId}`,
      //   addressData
      // );
      await createDiaChi(userId, addressData);
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

    // Kiểm tra giỏ hàng
    if (!selectedStores || selectedStores.length === 0) {
      alert("Giỏ hàng trống hoặc dữ liệu không hợp lệ.");
      return;
    }

    // Gộp tất cả sản phẩm của các cửa hàng vào một mảng chung
    const mergedCart = selectedStores.map((store) => ({
      user: {
        _id: store.storeOwnerId, // ID chủ cửa hàng
      },
      transactionId: "111", // Bạn có thể thay bằng một ID giao dịch thực tế nếu có
      sanPhamList: store.storeProducts.map((product) => ({
        chiTietGioHangs: [
          {
            idBienThe: {
              _id: product.idBt, // ID biến thể
            },
            soLuong: product.quantity, // Số lượng sản phẩm
            donGia: product.price, // Đơn giá
          },
        ],
      })),
    }));

    // Tạo đối tượng hóa đơn
    const invoiceData = {
      userId,
      diaChiMoi: {
        tinhThanhPho: tinhThanhPho || "", // Nếu không có giá trị sẽ dùng mặc định
        quanHuyen: quanHuyen || "",
        phuongXa: phuongXa || "",
        duongThon: duongThon || "",
        Name: displayedAddress.name || "",
        SoDienThoai: displayedAddress.phone || "",
      },
      ghiChu: "Giao hàng vào sáng mai",
      TongTien: totalAmount, // Tổng tiền hóa đơn
      mergedCart: {
        mergedCart: mergedCart, // Chứa danh sách tất cả cửa hàng và sản phẩm
      },
    };

    console.log(
      "Dữ liệu hóa đơn trước khi gửi:",
      JSON.stringify(invoiceData, null, 2)
    );

    // Gửi dữ liệu đến API tạo hóa đơn
    try {
      // const response = await axios.post(
      //   "/api/hoadon/createUserDiaChivaThongTinGiaoHang",
      //   invoiceData
      // );

      // console.log("Phản hồi từ API tạo hóa đơn:", response.data);
      const createInvoiceResponse = await createInvoiceAPI(invoiceData);

      console.log("Phản hồi từ API tạo hóa đơn:", createInvoiceResponse);
      if (
        createInvoiceResponse &&
        createInvoiceResponse.message === "Tạo hóa đơn thành công" &&
        createInvoiceResponse.hoadon &&
        createInvoiceResponse.hoadon.length > 0
      ) {
        alert("Hóa đơn đã được tạo thành công!");

        // Gọi API updateTransactionListHoaDonCOD sau khi tạo hóa đơn thành công
        const hoadonIds = createInvoiceResponse.hoadon.map((hd) => hd._id); // Lấy tất cả các _id của hóa đơn
        const transactionId = "111"; // ID giao dịch, thay bằng ID thực tế nếu có 

        // const updateResponse = await axios.post(
        //   "/api/hoadon/updateTransactionListHoaDonCOD",
        //   {
        //     transactionId,
        //     hoadon: hoadonIds,
        //   }
        // );
        const updateResponse = await updateTransactionAPI(transactionId, hoadonIds);

        console.log("Phản hồi từ API cập nhật giao dịch:", updateResponse.data);

        // Hiển thị hộp thoại để người dùng chọn hành động tiếp theo
        const nextAction = window.confirm(
          "Đơn hàng đã được tạo thành công! Bạn muốn quay lại trang chủ hay đi đến trang hồ sơ?"
        );
  
        // Sử dụng các tên khác cho nút "OK" và "Cancel"
        if (nextAction) {
          // Người dùng chọn "Quay lại trang chủ"
          window.location.href = "/"; // Chuyển hướng về trang chủ
        } else {
          // Người dùng chọn "Đi đến hồ sơ"
          window.location.href = "/profile"; // Chuyển hướng về trang hồ sơ
        }

        // if (updateResponse.data && updateResponse.data.message === "Cập nhật thành công") {
        //   alert("Cập nhật giao dịch thành công!");
        // } else {
        //   alert("Không thể cập nhật giao dịch. Phản hồi không hợp lệ.");
        // }
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
      <div className="container">
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
                          <b>{`Địa chỉ:`}</b>{" "}
                          {address.city || "Chưa có địa chỉ"}
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

        {displayedAddress && (
          <div className="displayed-address">
            <h3>Địa Chỉ:</h3>
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
      </div>

      <div className="container my-4 cart-summary">
        <div className="row">
          <div className="col-lg-8">
            {selectedStores.map((store) => (
              <div key={store.storeName} className="store-section mb-4">
                <h4 className="mb-3">{store.storeName}</h4>
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center align-middle">Sản phẩm</th>
                      <th className="text-center align-middle">Đơn giá</th>
                      <th className="text-center align-middle">Số lượng</th>
                      <th className="text-center align-middle">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.storeProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="text-center align-middle">
                          <div className="d-flex align-items-center">
                            <img
                              src={product.image || "placeholder.png"}
                              alt={product.name}
                              className="img-thumbnail me-3"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <p className="mb-0">{product.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center align-middle">
                          {product.price.toLocaleString()} VND
                        </td>
                        <td className="text-center align-middle">
                          {product.quantity}
                        </td>
                        <td className="text-center align-middle">
                          {(product.price * product.quantity).toLocaleString()}{" "}
                          VND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Thêm mã giảm giá cho cửa hàng */}
                <div className="mb-3">
                  <label
                    htmlFor={`discount-code-${store.storeName}`}
                    className="form-label"
                  >
                    Mã giảm giá
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`discount-code-${store.storeName}`}
                    placeholder="Nhập mã giảm giá"
                    onChange={(e) =>
                      handleDiscountChange(store.storeName, e.target.value)
                    }
                  />
                </div>

                {/* Chọn voucher cho cửa hàng */}
                <div className="mb-3">
                  <label
                    htmlFor={`voucher-${store.storeName}`}
                    className="form-label"
                  >
                    Chọn voucher
                  </label>
                  <select
                    className="form-select"
                    id={`voucher-${store.storeName}`}
                    onChange={(e) =>
                      handleVoucherChange(store.storeName, e.target.value)
                    }
                  >
                    <option value="">Chọn voucher</option>
                    <option value="voucher-10-off">
                      Giảm 10% cho đơn hàng
                    </option>
                    <option value="voucher-20-off">
                      Giảm 20% cho đơn hàng
                    </option>
                    <option value="voucher-50-off">
                      Giảm 50% cho đơn hàng
                    </option>
                  </select>
                </div>

                {/* Thêm lời nhắn cho cửa hàng */}
                <div className="mb-3">
                  <label
                    htmlFor={`message-${store.storeName}`}
                    className="form-label"
                  >
                    Lời nhắn cho cửa hàng
                  </label>
                  <textarea
                    className="form-control"
                    id={`message-${store.storeName}`}
                    rows="3"
                    placeholder="Nhập lời nhắn"
                    onChange={(e) =>
                      handleMessageChange(store.storeName, e.target.value)
                    }
                  ></textarea>
                </div>

                {/* Tổng số tiền cửa hàng */}
                <tr className="table-light">
                  <td colSpan="4" className="text-end align-middle fw-bold">
                    Tổng số tiền:{" "}
                    <span className="text-danger">
                      {store.storeProducts
                        .reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        )
                        .toLocaleString()}{" "}
                      VND
                    </span>
                  </td>
                </tr>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">
                  Tổng số tiền: {totalAmount.toLocaleString()} VNĐ
                </h3>
                <hr />
                <h5>Chọn phương thức thanh toán:</h5>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="payment-cash"
                    value="cash"
                    name="payment-method"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="payment-cash">
                    Thanh toán khi nhận hàng
                  </label>
                </div>
                <div className="form-check mt-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="payment-bank"
                    value="bank"
                    name="payment-method"
                    checked={paymentMethod === "bank"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="payment-bank">
                    Chuyển khoản
                  </label>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleConfirmPayment}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
