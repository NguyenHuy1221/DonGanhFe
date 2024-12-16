import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { ROUTER } from "./../../../utils/router";

const RegisterPage = () => {
  const [tenNguoiDung, setTenNguoiDung] = useState("");
  const [gmail, setGmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [matKhauLai, setMatKhauLai] = useState(""); // Thêm state cho mật khẩu nhập lại
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Hook điều hướng

  // Hàm kiểm tra định dạng email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 

    // Kiểm tra điều kiện nhập liệu
    if (tenNguoiDung.length < 3 || tenNguoiDung.length > 20) {
      setError("Tên đăng nhập phải từ 3 đến 20 ký tự.");
      setSuccess("");
      return;
    }

    if (!isValidEmail(gmail)) {
      setError("Email không đúng định dạng.");
      setSuccess("");
      return;
    }

    if (matKhau.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
      setSuccess("");
      return;
    }

    if (matKhau !== matKhauLai) {
      setError("Mật khẩu và mật khẩu nhập lại không khớp.");
      setSuccess("");
      return;
    }

    // API
    const registerApiUrl = `/api/user/Register`;
    const resendOtpApiUrl = `/api/user/resendOTP`;

    try {
      const registerResponse = await fetch(registerApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenNguoiDung, gmail, matKhau }),
      });

      if (registerResponse.ok) {
        const otpResponse = await fetch(resendOtpApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gmail }),
        });

        if (otpResponse.ok) {
          setSuccess("Đăng ký thành công! OTP đã được gửi đến email của bạn.");
          setError("");
          navigate(ROUTER.USER.OTP, { state: { gmail } });
        } else {
          setError("Đăng ký thành công nhưng không thể gửi OTP. Vui lòng thử lại.");
          setSuccess("");
        }
      } else {
        const result = await registerResponse.json();
        setError(result.message || "Đăng ký thất bại, vui lòng thử lại.");
        setSuccess("");
      }
    } catch (err) {
      setError("Lỗi hệ thống, vui lòng thử lại sau.");
      setSuccess("");
    }
  };

  return (
    <div className="body-register">
      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <h1>Đăng ký</h1>

         
          <div className="input-box">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={tenNguoiDung}
              onChange={(e) => setTenNguoiDung(e.target.value)}
              required
            />
            <IoMdPerson className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
            />
            <MdEmail className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={matKhauLai}
              onChange={(e) => setMatKhauLai(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
       
          <div className="remember-forgot">
            <label>
              <input type="checkbox" required />
              Tôi đồng ý với <a href="#terms">Điều khoản</a> &{" "}
              <a href="#privacy">Chính sách bảo mật</a>
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default memo(RegisterPage);
