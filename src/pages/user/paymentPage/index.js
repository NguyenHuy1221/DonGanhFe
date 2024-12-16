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
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { fetchUserById, showDiaChiByIdUser } from "api/userService";
import { navigate } from "react-router-dom";
import { createDiaChi } from "api/diaChiService";
import {
  createInvoiceAPI,
  updateTransactionAPI,
  updateTransactionAPICOD,
} from "api/hoaDonService";
import icon1_1 from "../../../image/icon_1.png";
import icon1_2 from "../../../image/icon_2.png";
import baokim from "../../../image/baokim.jpg";

const PaymentPage = () => {
  const [open, setOpen] = useState(false);
  const [openMGG, setOpenMGG] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [user, setUser] = useState(null);
  // API-related states
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

  // CART-ITEM
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  // const totalAmount = location.state?.totalAmount || 0;
  const [totalAmount, setTotalAmount] = useState(
    location.state?.totalAmount || 0
  );
  const { selectedStores } = location.state;

  console.log("Danh sách cửa hàng:", selectedStores);

  const [addresses, setAddresses] = useState([]);
  const [displayedAddress, setDisplayedAddress] = useState(null);

  const [messages, setMessages] = useState({});

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opeenMGG, setOpeenMGG] = useState(false);
  const [appliedDiscountNames, setAppliedDiscountNames] = useState({});
  const [appliedDiscounts, setAppliedDiscounts] = useState({});
  const [selectedStore, setSelectedStore] = useState(null);

  const handleApplyDiscount = (discount, storeName) => {
    console.log("Áp dụng mã giảm giá:", discount);
    console.log("Cửa hàng áp dụng:", storeName);

    // Lưu tên mã giảm giá vào state cho cửa hàng cụ thể
    setAppliedDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [storeName]: discount, // Lưu thông tin giảm giá cho cửa hàng
    }));

    setAppliedDiscountNames((prevNames) => ({
      ...prevNames,
      [storeName]: discount.TenKhuyenMai, // Lưu tên mã giảm giá vào appliedDiscountNames
    }));
    console.log("Discount khi áp dụng:", discount);
    handleCloseMGG(); // Đóng modal sau khi áp dụng
  };

  const calculateTotalAmountForAllStores = (stores) => {
    let totalAllStores = 0;

    stores.forEach((store) => {
      const { finalAmount } = calculateTotalAmount(store); // Tính tổng tiền cho từng shop
      totalAllStores += finalAmount; // Cộng dồn tổng tiền
    });

    console.log("Tổng tiền của tất cả các cửa hàng:", totalAllStores);
    setTotalAmount(totalAllStores); // Cập nhật state
    return totalAllStores;
  };

  useEffect(() => {
    if (selectedStores && selectedStores.length > 0) {
      calculateTotalAmountForAllStores(selectedStores);
    }
  }, [selectedStores, appliedDiscounts]);

  const calculateTotalAmount = (store) => {
    let total = store.storeProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    console.log("Tổng tiền trước khi giảm giá:", total);

    const discount = appliedDiscounts[store.storeName]; // Lấy mã giảm giá của cửa hàng hiện tại
    let discountAmount = 0;

    if (discount) {
      // Kiểm tra nếu mã giảm giá đủ điều kiện áp dụng
      if (total >= discount.GioiHanGiaTriDuocApDung) {
        discountAmount = discount.giaTriGiam; // Số tiền giảm

        // Kiểm tra giới hạn giảm tối đa
        if (discount.GioiHanGiaTriGiamToiDa) {
          discountAmount = Math.min(
            discountAmount,
            discount.GioiHanGiaTriGiamToiDa
          );
          console.log(
            "Giảm giá sau khi áp dụng giới hạn tối đa:",
            discountAmount
          );
        }

        total -= discountAmount; // Trừ số tiền giảm vào tổng
        console.log("Tổng tiền sau khi áp dụng giảm giá:", total);
      } else {
        console.log("Tổng tiền không đủ điều kiện áp dụng mã giảm giá.");
      }
    }

    const finalAmount = total < 0 ? 0 : total; // Đảm bảo tổng tiền không âm
    console.log("Tổng tiền sau khi áp dụng mã giảm giá:", finalAmount);
    // calculateTotalAmountForAllStores();
    return { finalAmount, discountAmount }; // Trả về cả tổng tiền và số tiền giảm
  };

  const calculateTotalDiscount = (stores) => {
    return stores.reduce((totalDiscount, store) => {
      const { discountAmount } = calculateTotalAmount(store); // Tính số tiền giảm của từng cửa hàng
      return totalDiscount + discountAmount;
    }, 0);
  };

  // Hàm để mở modal
  const handleOpenMGG = () => {
    setOpeenMGG(true);
    fetchDiscounts(); // Tải mã giảm giá khi mở modal
  };

  // Hàm để đóng modal
  const handleCloseMGG = () => {
    setOpeenMGG(false);
  };

  const handleMessageChange = (storeName, message) => {
    // Lưu trữ lời nhắn của cửa hàng
    setMessages({
      ...messages,
      [storeName]: message,
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

  useEffect(() => {
    if (open) {
      fetchDiscounts();
    }
  }, [open]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      // const totalAmount = store.storeProducts
      // .reduce((total, product) => total + product.price * product.quantity, 0);

      const response = await axios.get(
        `/api/khuyenmai/getlistKhuyenMai/${totalAmount}`
      );
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

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
      console.log("tổng tiền ", totalAmount);
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

    let transactionId;
    switch (paymentMethod) {
      case "cash":
        transactionId = "111"; // Thanh toán khi nhận hàng
        break;
      case "vietqr":
        transactionId = "295"; // VietQR
        break;
      case "vnpay":
        transactionId = "297"; // VNPay QR
        break;
      case "atm":
        transactionId = "151"; // ATM Card
        break;
      default:
        alert("Vui lòng chọn phương thức thanh toán.");
        return;
    }

    // Gộp tất cả sản phẩm của các cửa hàng vào một mảng chung
    const mergedCart = selectedStores.map((store) => ({
      user: {
        _id: store.storeOwnerId, // ID chủ cửa hàng
      },
      transactionId, // Bạn có thể thay bằng một ID giao dịch thực tế nếu có
    
      sanPhamList: store.storeProducts.map((product) => ({
        chiTietGioHangs: [
          {
            _id: product.id,

            idBienThe: {
              _id: product.idBt,
            },
            soLuong: product.quantity,
            donGia: product.price,
            // TongTien: totalAmount, 
          },
        ],
        khuyenMaiId: appliedDiscounts[store.storeName]?._id || null,
        giaTriKhuyenMai: calculateTotalDiscount(selectedStores),
  
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
      const createInvoiceResponse = await createInvoiceAPI(invoiceData);

      console.log("Phản hồi từ API tạo hóa đơn:", createInvoiceResponse);
      if (
        createInvoiceResponse &&
        createInvoiceResponse.message === "Tạo hóa đơn thành công" &&
        createInvoiceResponse.hoadon &&
        createInvoiceResponse.hoadon.length > 0
      ) {
        // alert("Hóa đơn đã được tạo thành công!");

        const hoadonIds = createInvoiceResponse.hoadon.map((hd) => hd._id);

        let updateResponse;

        if (transactionId === "111") {
          // Gọi API updateTransactionAPICOD nếu thanh toán bằng tiền mặt
          updateResponse = await updateTransactionAPICOD(
            transactionId,
            hoadonIds
          );
        } else {
          // Gọi API updateTransactionAPI cho các phương thức khác
          updateResponse = await updateTransactionAPI(transactionId, hoadonIds);
        }
        console.log("Phản hồi từ API cập nhật giao dịch:", updateResponse);
        // const userChoice = window.confirm(
        //   "Hóa đơn đã được tạo thành công! Bạn có muốn xem đơn hàng của mình không?"
        // );
        // if (userChoice) {
        //   navigate("/profile"); // Điều hướng đến trang hồ sơ
        // } else {
        //   navigate("/"); // Điều hướng đến trang chính
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
      handleClose();
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
            {/* {selectedStores.map((store) => (
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
                    value={appliedDiscountNames[store.storeName] || ""} // Hiển thị tên mã giảm giá
                    // onClick={handleOpenMGG}
                    onClick={() => {
                      setSelectedStore(store); // Lưu cửa hàng khi người dùng chọn
                      console.log("Cửa hàng đã chọn:", store.storeName);

                      handleOpenMGG(); // Mở modal
                    }}
                    // Mở modal để chọn mã giảm giá
                    readOnly
                  />
                </div>

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

                <tr className="table-light">
                  <td colSpan="4" className="text-end align-middle fw-bold">
                    Tổng số tiền:{" "}
                    <span className="text-danger">
                      {calculateTotalAmount(store).toLocaleString()} VND
                    </span>
                  </td>
                </tr>
              </div>
            ))} */}
            {selectedStores.map((store) => {
              const { finalAmount, discountAmount } =
                calculateTotalAmount(store); // Lấy thông tin tổng tiền và số tiền giảm

              return (
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
                            {(
                              product.price * product.quantity
                            ).toLocaleString()}{" "}
                            VND
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mã giảm giá */}
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
                      value={appliedDiscountNames[store.storeName] || ""} // Hiển thị tên mã giảm giá
                      onClick={() => {
                        setSelectedStore(store); // Lưu cửa hàng khi người dùng chọn
                        console.log("Cửa hàng đã chọn:", store.storeName);
                        handleOpenMGG(); // Mở modal
                      }}
                      readOnly
                    />
                  </div>

                  {/* Lời nhắn cho cửa hàng */}
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

                  <table className="table table-light">
                    <tbody>
                      <tr>
                        <td colSpan="4" className="fw-bold">
                          Tổng số tiền:
                          {discountAmount > 0 && (
                            <>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "#6f4f28", // Màu nâu
                                  marginRight: 5,
                                }}
                              >
                                - {discountAmount.toLocaleString()}
                              </span>
                            </>
                          )}
                          <span
                            className={
                              discountAmount > 0
                                ? "text-danger line-through mglhd"
                                : "text-danger mglhd"
                            }
                          >
                            {finalAmount.toLocaleString()} VND
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">
                  Tổng số tiền: {totalAmount.toLocaleString()} VNĐ
                </h3>
                <hr />
                <h5>Chọn phương thức thanh toán:</h5>

                {/* Thanh toán khi nhận hàng */}
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

                {/* VietQR */}
                <div className="form-check mt-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="payment-vietqr"
                    value="vietqr"
                    name="payment-method"
                    checked={paymentMethod === "vietqr"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="payment-vietqr">
                    <img src={icon1_2} alt="VietQR" className="me-2" />
                    VietQR
                  </label>
                </div>

                {/* ATM Card */}
                <div className="form-check mt-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="payment-atm"
                    value="atm"
                    name="payment-method"
                    checked={paymentMethod === "atm"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="payment-atm">
                    <img
                      style={{ height: 40 }}
                      src={baokim}
                      alt="ATM Card"
                      className="me-2"
                    />
                    ATM Card
                  </label>
                </div>

                {/* VNPay QR */}
                <div className="form-check mt-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="payment-vnpay"
                    value="vnpay"
                    name="payment-method"
                    checked={paymentMethod === "vnpay"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="payment-vnpay">
                    <img src={icon1_1} alt="VNPay QR" className="me-2" />
                    VNPay QR
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
      <Dialog open={opeenMGG} onClose={handleCloseMGG} maxWidth="sm" fullWidth>
        <DialogTitle>Áp dụng mã giảm giá</DialogTitle>
        <div className="discount-list">
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <CircularProgress />
            </div>
          ) : discounts.length > 0 ? (
            // discounts.map((discount) => (
            //   <div key={discount._id} className="discount-card">
            //     <div className="discount-left">
            //       <span className="discount-percent">
            //         {discount.giaTriGiam / 1000}k
            //       </span>
            //       <span className="discount-off">OFF</span>
            //       <span className="discount-usage">
            //         {discount.TongSoLuongDuocTao} LƯỢT
            //       </span>
            //     </div>
            //     <div className="discount-right">
            //       <div className="discount-code">{discount.TenKhuyenMai}</div>
            //       <div className="discount-dates">
            //         Áp dụng từ{" "}
            //         {new Date(discount.NgayBatDau).toLocaleDateString()} -{" "}
            //         {new Date(discount.NgayKetThuc).toLocaleDateString()}
            //       </div>
            //       <div style={{ display: "flex", gap: "10px" }}>
            //         <button
            //           className="copy-button"
            //           onClick={() =>
            //             navigator.clipboard.writeText(discount.TenKhuyenMai)
            //           }
            //         >
            //           <i className="fa fa-clone"></i>
            //         </button>
            //         <button
            //           className="apply-button"
            //           onClick={() => {
            //             if (selectedStore) {
            //               console.log(
            //                 "Áp dụng mã giảm giá cho cửa hàng:",
            //                 selectedStore.storeName
            //               );
            //               handleApplyDiscount(
            //                 discount,
            //                 selectedStore.storeName
            //               ); // Áp dụng mã giảm giá cho cửa hàng đã chọn
            //             } else {
            //               console.log("Chưa chọn cửa hàng.");
            //             }
            //           }}
            //           // onClick={() => {
            //           //   // Log cửa hàng đang áp dụng mã giảm giá
            //           //   const storeName = selectedStores[0].storeName; // Lấy tên cửa hàng đầu tiên, bạn có thể thay đổi logic này để chọn đúng cửa hàng
            //           //   console.log("Store name đang chọn:", storeName);
            //           //   handleApplyDiscount(discount, storeName); // Áp dụng mã giảm giá cho cửa hàng tương ứng
            //           // }}
            //           // onClick={() => handleApplyDiscount(discount)} // Áp dụng mã giảm giá
            //         >
            //           Áp dụng
            //         </button>
            //       </div>
            //     </div>
            //   </div>
            // ))
            discounts.map((discount) => {
              const now = new Date(); // Ngày hiện tại
              const startDate = new Date(discount.NgayBatDau);
              const endDate = new Date(discount.NgayKetThuc);
            
              const isExpired = now > endDate; // Đã hết hạn
              const isNotStarted = now < startDate; // Chưa bắt đầu
            
              return (
                <div key={discount._id} className="discount-card">
                  <div className="discount-left">
                    <span className="discount-percent">{discount.giaTriGiam / 1000}k</span>
                    <span className="discount-off">OFF</span>
                    <span className="discount-usage">
                      {discount.TongSoLuongDuocTao} LƯỢT
                    </span>
                  </div>
                  <div className="discount-right">
                    <div className="discount-code">{discount.TenKhuyenMai}</div>
                    <div className="discount-dates">
                      Áp dụng từ{" "}
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="copy-button"
                        onClick={() =>
                          navigator.clipboard.writeText(discount.TenKhuyenMai)
                        }
                      >
                        <i className="fa fa-clone"></i>
                      </button>
                      <button
                        className="apply-button"
                        onClick={() => {
                          if (selectedStore) {
                            console.log(
                              "Áp dụng mã giảm giá cho cửa hàng:",
                              selectedStore.storeName
                            );
                            handleApplyDiscount(discount, selectedStore.storeName);
                          } else {
                            console.log("Chưa chọn cửa hàng.");
                          }
                        }}
                        disabled={isExpired || isNotStarted} // Vô hiệu hóa nếu hết hạn hoặc chưa bắt đầu
                        style={{
                          backgroundColor: isExpired || isNotStarted ? "#ccc" : "#007bff",
                          cursor: isExpired || isNotStarted ? "not-allowed" : "pointer",
                        }}
                      >
                        {isExpired
                          ? "Hết hạn"
                          : isNotStarted
                          ? "Chưa bắt đầu"
                          : "Áp dụng"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              Không có mã giảm giá nào.
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default PaymentPage;
