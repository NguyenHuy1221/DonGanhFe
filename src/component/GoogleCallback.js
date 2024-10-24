import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL hoặc backend sau khi chuyển hướng
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Giải mã token để lấy thông tin người dùng
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.data;
      localStorage.setItem("userId", userId);

      // Chuyển hướng đến trang chính
      navigate("/");
    } else {
      // Xử lý lỗi hoặc chuyển hướng đến đăng nhập nếu thất bại
      navigate("/login");
    }
  }, [navigate]);

  return null; // Không cần UI, chỉ để xử lý chuyển hướng
};

export default GoogleCallback;
