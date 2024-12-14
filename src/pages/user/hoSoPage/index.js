import React, { useState, memo, useEffect } from "react";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUserById, uploadProfileImage, updateUserProfile } from "api/userService";

const HoSoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("ng************@gmail.com");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("1");
  const [birthMonth, setBirthMonth] = useState("11");
  const [birthYear, setBirthYear] = useState("2024");
  const [profileImage, setProfileImage] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const userIdFromUrl = queryParams.get("user");
  const storedUserId = localStorage.getItem("userId");

  const userId = userIdFromUrl || storedUserId;
  useEffect(() => {
    

    if (userId) {
      localStorage.setItem("userId", userId);
      fetchUserData(userId);
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  const fetchUserData = async (userId) => {
    try {
      const userData = await fetchUserById(userId);
      if (userData) {
        setName(userData.tenNguoiDung || "");
        setEmail(userData.gmail || "");
        setPhone(userData.soDienThoai || "");
        setGender(userData.GioiTinh || "");

        if (userData.ngaySinh) {
          const [day, month, year] = userData.ngaySinh.split("/");
          setBirthDay(day || "");
          setBirthMonth(month || "");
          setBirthYear(year || "");
        } else {
          setBirthDay("");
          setBirthMonth("");
          setBirthYear("");
        }

        setProfileImage(userData.anhDaiDien || null);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      navigate("/login");
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isValidFormat =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isValidFormat) {
        alert("Vui lòng chọn tệp hình ảnh có định dạng .JPEG hoặc .PNG");
        return;
      }
  
      setProfileImage(URL.createObjectURL(file)); // Hiển thị xem trước ảnh
  
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await uploadProfileImage(localStorage.getItem("userId"), formData);
        
        if (response) {
          alert("Đổi ảnh đại diện thành công");
          // setProfileImage(response.newProfileImageUrl); // Cập nhật ảnh từ API
          fetchUserData(userId);
        }
      } catch (error) {
        console.error("Lỗi khi tải lên ảnh:", error);
        alert("Tải lên ảnh thất bại.");
      }
    }
  };

  const handleSave = async () => {
    const profileData = {
      tenNguoiDung: name,
      soDienThoai: phone,
      GioiTinh: gender,
      ngaySinh: `${birthDay}/${birthMonth}/${birthYear}`
    };
    console.log("Dữ liệu hồ sơ trước khi lưu:", profileData);

    try {
      await updateUserProfile(localStorage.getItem("userId"), profileData);
      alert("Thông tin hồ sơ đã được lưu!");
    } catch (error) {
      console.error("Lỗi khi lưu thông tin hồ sơ:", error);
      alert("Không thể lưu thông tin hồ sơ.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Hồ Sơ Của Tôi</h2>
      <p className="description">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>

      <div className="profile-content">
        <div className="form-section">
          
          <div className="form-group">
            <label>Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <p className="email-display">
              {email} 
            </p>
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* <div className="form-group">
            <label>Giới tính</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Nam"
                  checked={gender === "Nam"}
                  onChange={() => setGender("Nam")}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  value="Nữ"
                  checked={gender === "Nữ"}
                  onChange={() => setGender("Nữ")}
                />
                Nữ
              </label>
              <label>
                <input
                  type="radio"
                  value="Khác"
                  checked={gender === "Khác"}
                  onChange={() => setGender("Khác")}
                />
                Khác
              </label>
            </div>
          </div> */}

          <div className="form-group">
            <label>Ngày sinh</label>
            <div className="date-select-group">
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
              >
                {[...Array(100)].map((_, i) => (
                  <option key={2024 - i} value={2024 - i}>
                    {2024 - i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleSave} className="save-button">
            Lưu
          </button>
        </div>

        <div className="profile-image-section">
          <div className="profile-image">
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <div className="profile-image-placeholder">N</div>
            )}
          </div>
          <div className="ipH">
            <input
              type="file"
              accept=".jpeg,.png"
              onChange={handleImageChange}
            />
          </div>
          <p className="file-info">
            Dung lượng file tối đa không giới hạn Định dạng: .JPEG, .PNG
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(HoSoPage);
