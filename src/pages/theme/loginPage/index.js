// LoginPage.jsx
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import gg from "../../../image/gg.png";
import { jwtDecode } from "jwt-decode"; // Sửa lại import
import "./style.scss";
import { login, fetchUserById } from "api/userService"; // Thêm getUserById
import { ROUTER } from "./../../../utils/router";
import axios from "axios";

const LoginPage = () => {
  const [gmail, setGmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const handleGoogleLogin = () => {
    const googleAuthURL = "http://localhost:5000/auth/google"; // API mở Google OAuth
    //  const googleAuthURL = "http://apps.donganh.vn/auth/google";
    const popup = window.open(
      googleAuthURL,
      "Google Login",
      "width=500,height=600"
    );

    // Lắng nghe message từ popup (trả về từ server)
    window.addEventListener("message", async (event) => {
      if (event.origin !== "http://localhost:5000") return;
      // if (event.origin !== "http://apps.donganh.vn/auth/google") return;
      const { token, userId } = event.data; // Nhận token và userId từ server
      if (token && userId) {
        // Lưu vào localStorage
        localStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        const userIdFromToken = decodedToken.data;
        localStorage.setItem("userId", userIdFromToken);

        // Chuyển hướng đến Dashboard
        navigate("/");
      }
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đăng nhập và lấy token
      const userData = await login(gmail, matKhau);
      console.log("Đăng nhập thành công", userData);
      localStorage.setItem("token", userData.token);

      // Giải mã token để lấy userId
      const decodedToken = jwtDecode(userData.token);
      console.log(decodedToken);
      const userIdFromToken = decodedToken.data;
      localStorage.setItem("userId", userIdFromToken);

      // Lấy thông tin người dùng
      const user = await fetchUserById(userIdFromToken); // Thay đổi theo cách bạn lấy thông tin người dùng

      if (user.hoKinhDoanh) {
        // Nếu là người kinh doanh, điều hướng đến trang admin
        navigate(ROUTER.ADMIN.DASHBOARD);
      } else {
        // Nếu không phải người kinh doanh, điều hướng đến trang chính
        navigate(ROUTER.USER.HOME);
      }
    } catch (error) {
      setErrorMessage("Sai thông tin tài khoản hoặc mật khẩu");
    }
  };



  return (
    <div className="body-login">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Đăng nhập</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
            />
            <MdEmail className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Mật khẩu"
              required
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label className="remember-flex">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#">Quên mật khẩu</a>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">Đăng nhập</button>

          <div className="register-link">
            <p>
              Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>{" "}
            </p>
          </div>

          <div className="login-with">
            <p>hoặc đăng nhập với</p>

            {/* <a href="https://imp-model-widely.ngrok-free.app/auth/google"> */}
            <a>
              <img onClick={handleGoogleLogin} src={gg} alt="google" width={40} height={40} />
            </a>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(LoginPage);
