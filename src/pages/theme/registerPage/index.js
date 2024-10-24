import { memo, useState } from "react";
import "./style.scss";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import gg from "../../../image/gg.png";
import { IoMdPerson } from "react-icons/io";
const RegisterPage = () => {
  return (
    <div className="body-register">
      <div className="wrapper">
        <form action="">
          <h1>Đăng ký</h1>

          <div className="input-box">
            <input type="text" placeholder="Tên đăng nhập" required />
            <IoMdPerson className="icon" />
          </div>

          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <MdEmail className="icon" />
          </div>

          <div className="input-box">
            <input type="password" placeholder="Mật khẩu" required />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              {" "}
              <input type="checkbox" />
              Tôi đồng ý với <a> Điều khoản </a> & <a>Chính sách bảo mật</a>{" "}
            </label>
          </div>
          <button type="submit">Đăng ký</button>

          <div className="login-with">
            <p>hoặc đăng nhập với </p>

            <a href="#">
              <img src={gg} alt="google" width={40} height={40} />
            </a>
          </div>

          <div className="register-link">
            <p>
              Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default memo(RegisterPage);
