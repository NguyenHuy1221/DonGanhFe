import { memo, useEffect, useState } from "react";
import "./style.scss";
import {
  AiOutlineBell,
  AiOutlineLogin,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import logomain from "../../../image/logomain.png";
import nha from "../../../image/nha.png";
import girl1 from "../../../image/girl1.jpg";
import girl2 from "../../../image/girl2.jpg";
import { fetchUserById } from "api/userService";
import { getDanhMucList } from "../../../api/danhMucService";
import { getBanners } from "../../../api/bannerService";

import { IoCartOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchCartById } from "api/cartService";
import { message } from "antd";

const HeaderNew = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const navigate = useNavigate();

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
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // const fetchCartData = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     if (!userId) {
  //       console.log("User chưa đăng nhập.");
  //       setTotalItemCount(0);
  //       return;
  //     }

  //     const cartData = await fetchCartById(userId);

  //     if (
  //       !cartData.mergedCart ||
  //       !Array.isArray(cartData.mergedCart) ||
  //       cartData.mergedCart.length === 0
  //     ) {
  //       console.log("Giỏ hàng rỗng hoặc không hợp lệ.");
  //       setTotalItemCount(0);
  //       return;
  //     }

  //     // Tính tổng số lượng sản phẩm
  //     const totalCount = cartData.mergedCart.reduce(
  //       (total, store) =>
  //         total +
  //         store.sanPhamList.reduce(
  //           (subTotal, product) =>
  //             subTotal +
  //             product.chiTietGioHang.reduce((sum, item) => sum + item.soLuong, 0),
  //           0
  //         ),
  //       0
  //     );

  //     setTotalItemCount(totalCount);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy giỏ hàng:", error);
  //     setTotalItemCount(0);
  //   }
  // };

  // useEffect(() => {
  //   fetchCartData();
  // }, []); // Chỉ chạy một lần khi header được render

  // const fetchCategories = () => {
  //   axios
  //     .get("/api/danhmuc/getlistDanhMuc")
  //     .then((response) => {
  //       setCategories(response.data);
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  // };

  const fetchCategories = async () => {
    try {
      const categories = await getDanhMucList(); // Gọi hàm API
      setCategories(categories); // Cập nhật state với dữ liệu trả về
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   const fetchBanners = async () => {
  //     try {
  //       const data = await getBanners(); // Gọi hàm API
  //       setBanners(data); // Cập nhật state với dữ liệu trả về
  //     } catch (error) {
  //       console.error("Error fetching banners:", error);
  //     }
  //   };

  //   fetchBanners(); // Gọi hàm fetch banners khi component mount
  // }, []);
  useEffect(() => {
    fetchBanners(); // Gọi hàm fetch banners khi component mount
  }, []);
  const fetchBanners = async () => {
    try {
      const bannersData = await getBanners();
      setBanners(bannersData);
    } catch (error) {
      console.error("Error fetching banners:", error);
      message.error("Không thể tải danh sách banner");
      setBanners([]);
    }
  };

  const handleHoKinhDoanhClick = () => {
    if (
      user &&
      (user.role === "hokinhdoanh" ||
        user.role === "admin" ||
        user.role === "nhanvien")
    ) {
      navigate("/dashboard"); // Navigate to /dashboard
    } else {
      // Nếu người dùng không phải là hokinhdoanh hoặc admin, có thể hiển thị thông báo hoặc chuyển hướng khác
      alert("Bạn không có quyền truy cập vào trang này.");
    }
  };

  return (
    <div>
      <div id="toppanel">
        <div className="container clearfix">
          <div className="group-right">
            <div className="item hotline">
              HOTLINE
              <a href="tel:+842877702614" rel="nofollow">
                <span className="number">083 2610 204</span>
              </a>
            </div>
            <div className="item">
              <a className="promotion-header">Chỉ từ 9K</a>
            </div>
            <div className="item">
              <a>Tải ứng dụng</a>
            </div>
            <div className="item">
              <a onClick={handleHoKinhDoanhClick}>Dành cho hộ kinh doanh</a>
            </div>
          </div>
        </div>
      </div>
      <header id="header" role="banner" style={{ zIndex: 200 }}>
        <div className="container" style={{ zIndex: 40 }}>
          <a href="/" id="logo">
            <img src={logomain} alt="Logo" />
          </a>
          <div className="group-header">
            <div className="item show-768 search-container">
              <form action="" className="form-search-header">
                <input
                  type="text"
                  placeholder="Nhập nội dung tìm kiếm"
                  name="keyword_search"
                  className="search-header"
                  autoComplete="off"
                />
                <button className="btn_search">
                  <AiOutlineSearch />
                </button>
              </form>
              <div className="search-result"></div>
            </div>
            <a href="/account/notifies" className="item">
              <AiOutlineBell /> Thông báo của tôi
            </a>
            <a
              style={{ cursor: "pointer" }}
              id="modal-login-trigger"
              data-modal="myLogin"
              className="item btnModal"
            >
              {user ? (
                <Link to="/profile">
                  <AiOutlineUser /> Tài khoản
                </Link>
              ) : (
                <>
                  {/* <AiOutlineUser /> Đăng nhập */}
                  <Link to="/login">
                    <AiOutlineUser /> Đăng nhập
                  </Link>
                </>
              )}
            </a>
            <a
              className="item"
              id="btnRegisterNew"
              style={{ cursor: "pointer" }}
            >
              |&nbsp;&nbsp;&nbsp;Đăng ký
            </a>
            <div className="item widget-mini-cart">
              <span
                className="toggle chooseLocationPickup"
                style={{ padding: "4px 10px 4px 6px" }}
              >
                <img
                  src={nha}
                  alt="warehouse pickup"
                  style={{ marginRight: "5px" }}
                />
                Giao hàng từ kho: &nbsp;
                <b style={{ color: "#FFBE00" }} id="locationStockPickup">
                  BMT
                </b>
              </span>
            </div>
            <div className="item widget-mini-cart toggleClass">
              <Link to="/cart">
                <span
                  className="toggle"
                  style={{ padding: "4px 10px 4px 6px", position: "relative" }}
                >
                  <IoCartOutline />
                  <span
                    className="count"
                    style={{ top: 0, position: "absolute", right: 0 }}
                  >
                    {totalItemCount}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div id="mainmenu" className="wrap-menu-header">
        <div className="container clearfix">
          <div className="sec-menu-category">
            <div className="title">
              <AiOutlineMenuUnfold />
              Danh mục sản phẩm
            </div>
            <ul className="vertical-menu">
              {categories.map((category) => (
                <li
                  key={category._id}
                  className="children current itemmega itemmega-4 1"
                >
                  <a href="/">
                    <span>{category.TenDanhMuc}</span>
                  </a>
                  <div className="wrapul">
                    <ul>
                      {category.DanhMucCon.map((subCategory) => (
                        <li key={subCategory._id} className="children 2">
                          <a href="/">
                            <span>{subCategory.TenDanhMucCon}</span>
                          </a>
                          <div className="wrapul">
                            <ul>
                              {/* Hiển thị các mục con của danh mục con (nếu có) */}
                              <li>
                                <a href="/">
                                  <span>
                                    {/* Tách chuỗi mô tả và hiển thị mỗi phần trong một dòng */}
                                    {subCategory.MieuTa &&
                                      subCategory.MieuTa.split(",").map(
                                        (item, index) => (
                                          <span key={index}>
                                            {item.trim()} <br />
                                          </span>
                                        )
                                      )}
                                  </span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ul className="menu-top-header">
            {categories.slice(0, 5).map((category, index) => (
              <li
                key={category._id}
                className={`children ${category.TenDanhMuc.replace(
                  /\s+/g,
                  "-"
                ).toLowerCase()}`}
                id={`li-${index + 1}`} // Tạo ID tương tự format phía dưới
              >
                <Link to={`/category/${category._id}`}>
                  {" "}
                  {/* Liên kết tới trang danh mục chính */}
                  <img
                    style={{ width: 28, marginRight: 6 }}
                    src={category.AnhDanhMuc}
                  />
                  <span>{category.TenDanhMuc}</span>
                </Link>
                {category.DanhMucCon && category.DanhMucCon.length > 0 && (
                  <ul className="dropdown-menu">
                    {category.DanhMucCon.map((subCategory) => (
                      <li key={subCategory._id}>
                        <Link to={`/category/${category._id}`}>
                          {" "}
                          {/* Liên kết tới trang danh mục con */}
                          {subCategory.TenDanhMucCon}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            <li className="children fixed-item-2">
              <a>
                <img
                  style={{ width: 28, marginRight: 6 }}
                  src={
                    "https://foodmap.asia/assets/images/svg/icon-my-farm-white.svg"
                  }
                  alt=""
                />
                <span>Thông tin</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* BANNER  */}
      {location.pathname === "/" && (
        <div className="banner">
          <div className="container">
            <div className="row">
              {/* Cột 9 chứa carousel */}
              <div className="col-9 bn1">
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    {Array.isArray(banners) && banners.length > 0 ? (
                      banners.map((banner, index) => (
                        <button
                          key={index}
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to={index}
                          className={index === 0 ? "active" : ""}
                          aria-current={index === 0 ? "true" : "false"}
                          aria-label={`Slide ${index + 1}`}
                        ></button>
                      ))
                    ) : (
                      <p>No Banners Available</p> // Thêm fallback nếu `banners` rỗng
                    )}
                  </div>
                  <div className="carousel-inner">
                    {banners.length > 0 ? (
                      banners.map((banner, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          <img
                            src={banner.hinhAnh}
                            className="d-block w-100"
                            alt={`Banner ${index + 1}`}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="carousel-item active">
                        <img
                          src="https://via.placeholder.com/800x400?text=No+Banner+Available"
                          className="d-block w-100"
                          alt="No Banners"
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="carousel-control-prev"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </div>
                  <div
                    className="carousel-control-next"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </div>
                </div>
              </div>
              {/* Cột 3 bên phải */}
              <div className="col-3 bn2">
                <div className="row">
                  <div className="col-12 ctbn1">
                    <img
                      src="https://shop.donganh.vn/wp-content/uploads/2024/07/cai-don-ganh.jpg"
                      alt="Image 1"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 ctbn2">
                    <img
                      src="https://shop.donganh.vn/wp-content/uploads/2024/07/chinh-sach-thanh-toan-the-gioi-thep-group.jpg"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 ctbn3">
                    <img
                      src="https://shop.donganh.vn/wp-content/uploads/2024/07/Chinh-sach-van-chuyen-giao-nhan-hang-hoa.jpg"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>;

export default memo(HeaderNew);
