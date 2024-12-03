import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const AddAddressForm = ({ onAddressAdded }) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    specificAddress: "",
    type: "Nhà Riêng",
  });

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

    try {
      // Gọi API để thêm địa chỉ
      const userId = localStorage.getItem("userId");
      await axios.post(`/api/diachi/createDiaChi/${userId}`, addressData);
      alert("Thêm địa chỉ thành công!");
      // Reset form
      setNewAddress({
        name: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        specificAddress: "",
        type: "Nhà Riêng",
      });
      // Call the onAddressAdded callback to notify the parent component
      onAddressAdded();
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      alert("Không thể thêm địa chỉ. Vui lòng thử lại.");
    }
  };

  return (
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
      
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Thêm Địa Chỉ
      </Button>
    </div>
  );
};

export default AddAddressForm;
