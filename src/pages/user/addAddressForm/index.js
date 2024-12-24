import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import axios from "axios";

const AddAddressForm = ({ onAddressAdded, onEditCompleted, editingAddress }) => {
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

  // Tải danh sách tỉnh/thành phố khi component được mount
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error)
      );
  }, []);

  useEffect(() => {
    if (editingAddress) {
      console.log("Editing address:", editingAddress);
  
      // Tách dữ liệu
      const parts = editingAddress.city.split(",").map((s) => s.trim());
      const [cityName, districtName, wardName, specificAddress] = parts;
  
      setNewAddress((prevState) => ({
        ...prevState,
        name: editingAddress.name,
        phone: editingAddress.phone,
        specificAddress: specificAddress || editingAddress.specificAddress || "",
        type: editingAddress.type || "Nhà Riêng",
      }));
  
      const selectedCity = cities.find((city) => city.name === cityName);
      if (selectedCity) {
        setNewAddress((prevState) => ({
          ...prevState,
          city: selectedCity.code,
        }));
  
        // Tải danh sách quận/huyện
        axios
          .get(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`)
          .then((response) => {
            setDistricts(response.data.districts);
  
            const selectedDistrict = response.data.districts.find(
              (district) => district.name === districtName
            );
  
            if (selectedDistrict) {
              setNewAddress((prevState) => ({
                ...prevState,
                district: selectedDistrict.code,
              }));
  
              // Tải danh sách xã/phường
              axios
                .get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
                .then((response) => {
                  setWards(response.data.wards);
  
                  const selectedWard = response.data.wards.find(
                    (ward) => ward.name === wardName
                  );
  
                  if (selectedWard) {
                    setNewAddress((prevState) => ({
                      ...prevState,
                      ward: selectedWard.code,
                    }));
                  }
                })
                .catch((error) => console.error("Lỗi khi tải xã/phường:", error));
            }
          })
          .catch((error) => console.error("Lỗi khi tải quận/huyện:", error));
      }
    }
  }, [editingAddress, cities]);

  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setNewAddress((prevState) => ({
      ...prevState,
      city: cityCode,
      district: "", // Reset district và ward
      ward: "",
    }));

    // Tải danh sách quận/huyện khi chọn thành phố mới
    axios
      .get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`)
      .then((response) => {
        setDistricts(response.data.districts);
        setWards([]); // Reset xã/phường khi chọn thành phố mới
      })
      .catch((error) =>
        console.error("Lỗi khi tải danh sách quận/huyện:", error)
      );
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setNewAddress((prevState) => ({
      ...prevState,
      district: districtCode,
      ward: "", // Reset ward khi chọn quận/huyện mới
    }));

    // Tải danh sách xã/phường khi chọn quận/huyện mới
    axios
      .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((response) => {
        setWards(response.data.wards);
      })
      .catch((error) =>
        console.error("Lỗi khi tải danh sách xã/phường:", error)
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
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (editingAddress) {
        // Cập nhật địa chỉ
        await axios.post(
          `/api/diachi/updateDiaChi/${userId}/${editingAddress.id}`,
          addressData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Cập nhật địa chỉ thành công!");
        onEditCompleted();
      } else {
        // Thêm địa chỉ mới
        await axios.post(`/api/diachi/createDiaChi/${userId}`, addressData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Thêm địa chỉ thành công!");
        onAddressAdded();
      }
    } catch (error) {
      console.error("Lỗi khi xử lý địa chỉ:", error);
      alert("Không thể xử lý địa chỉ. Vui lòng thử lại.");
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
        {editingAddress ? "Cập Nhật Địa Chỉ" : "Thêm Địa Chỉ"}
      </Button>
    </div>
  );
};

export default AddAddressForm;
