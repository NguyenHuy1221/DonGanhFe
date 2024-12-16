import { memo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.scss";
import { MdEmail } from "react-icons/md";
import { ROUTER } from "./../../../utils/router";

const OtpPage = () => {
  const [maOtp, setMaOtp] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook điều hướng
  const location = useLocation(); // Lấy state từ trang đăng ký, chứa email

  useEffect(() => {
    // Kiểm tra nếu không có email từ trang đăng ký, điều hướng về trang đăng ký
    if (!location.state?.gmail) {
      navigate(ROUTER.USER.REGISTER);
    }
  }, [location.state, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const verifyOtpApiUrl = "/api/user/verifyOtp";

    try {
      const response = await fetch(verifyOtpApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gmail: location.state.gmail, // Lấy email từ state
          otp: maOtp, // Mã OTP người dùng nhập
        }),
      });

      if (response.ok) {
        setSuccess("Xác minh OTP thành công!");
        setError("");
        // Điều hướng tới trang đăng nhập hoặc trang chính
        navigate(ROUTER.USER.LOGIN);
      } else {
        const result = await response.json();
        setError(result.message || "Xác minh OTP thất bại, vui lòng thử lại.");
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
        <form onSubmit={handleVerifyOtp}>
          <h1>Xác minh OTP</h1>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="input-box">
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={maOtp}
              onChange={(e) => setMaOtp(e.target.value)}
              required
            />
            <MdEmail className="icon" />
          </div>

          <button type="submit">Xác minh</button>
        </form>
      </div>
    </div>
  );
};

export default memo(OtpPage);
