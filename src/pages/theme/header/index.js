import { memo, useState, useEffect } from "react";
import "./style.scss";
import axios from "axios";
import car from "../../../image/car.png";
import qua from "../../../image/qua.png";
import tanhtoan from "../../../image/thanhtoan.png";
import tuvan from "../../../image/tuvan.png";
import { fetchUserById } from "api/userService";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineDown,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineMenu,
} from "react-icons/ai";
import { BsFillGeoAltFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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

  const fetchCategories = () => {
    axios
      .get("/api/danhmuc/getlistDanhMuc")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    axios
      .get("/api/banner/banners")
      .then((response) => {
        setBanners(response.data);
      })
      .catch((error) => console.error("Error fetching banners:", error));
  }, []);

  const handleMouseEnter = () => {
    setIsCategoriesVisible(true);
    if (categories.length === 0) {
      fetchCategories();
    }
  };

  const handleMouseLeave = () => {
    setIsCategoriesVisible(false);
  };

  const showPreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const showNextBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="header__color">
      <header className="header">
        <div className="header__top">
          <div className="header__top__left">
            <p>
              Ưu đãi độc quyền: Giảm 30 - 50% cho những ai có ngày sinh trùng
              với Black Friday.
            </p>
          </div>
          <div className="header__top__right">
            <p>Tư vấn mua hàng</p>
            <span>0832610204</span>
          </div>
        </div>

        <div className="container">
          <div className="row header__main">
            <div className="col-lg-3 header__logo">
              <h1>Đòn Gánh</h1>
            </div>
            <div className="col-lg-6  hero__search__container">
              <div className="hero__search">
                <div className="hero__search__from">
                  <form>
                    <input type="text" placeholder="Tìm sản phẩm ..." />
                    <button type="#">Tìm kiếm</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-3  header__icons">
              <Link to="/cua-hang">
                <BsFillGeoAltFill />
                <p>Cửa hàng</p>
              </Link>
              <Link to="/yeu-thich">
                <AiOutlineHeart />
                <p>Yêu thích </p>
              </Link>
              <div
                className="header__user-menu"
                onMouseEnter={() => setIsMenuVisible(true)}
                onMouseLeave={() => setIsMenuVisible(false)}
              >
                <Link to="/tai-khoan">
                  <AiOutlineUser />
                  <p>Tài khoản</p>
                </Link>
                {isMenuVisible && (
                  <div className="user-menu-dropdown">
                    {user ? (
                      <>
                        <Link to="#">Trang cá nhân</Link>
                        <button onClick={handleLogout}>Đăng xuất</button>
                      </>
                    ) : (
                      <Link to="/login">Đăng nhập</Link>
                    )}
                  </div>
                )}
              </div>
              <Link to="/cart">
                <AiOutlineShoppingCart />
                <p>Giỏ hàng</p>
              </Link>
              <div className="menu__open">
                <span>
                  <AiOutlineMenu />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="header__menu">
          <div className="container ">
            <div className="row">
              <div
                className="product__category col-lg-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <h4>
                  DANH MỤC SẢN PHẨM
                  <AiOutlineDown />
                </h4>
                {isCategoriesVisible && (
                  <div className="categories__dropdown">
                    <ul>
                      {categories.map((category) => (
                        <li key={category._id}>{category.TenDanhMuc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <nav className="header__nav col-lg-6">
                <ul>
                  <li>
                    <a href="/">Trang chủ</a>
                  </li>
                  <li>
                    <a href="/">Giới thiệu</a>
                  </li>
                  <li>
                    <a href="/">Sản phẩm</a>
                  </li>
                  <li>
                    <a href="/">Tin tức</a>
                  </li>
                  <li>
                    <a href="/">Chính sách</a>
                  </li>
                  <li>
                    <a href="/">Liên hệ</a>
                  </li>
                </ul>
              </nav>
              <div className="header__right col-lg-3">
                <div className="hot__deal">
                  <span className="deal__icon">%</span>
                  Hot deal
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {location.pathname === "/" && (
        <div className="hero__banner">
          {banners.length > 0 && (
            <div className="banner__carousel">
              <button onClick={showPreviousBanner}>
                <AiOutlineLeft />
              </button>
              <div className="banner__item">
                <img src={banners[currentBannerIndex].hinhAnh} alt={""} />
              </div>
              <button onClick={showNextBanner}>
                <AiOutlineRight />
              </button>
            </div>
          )}
        </div>
      )}

      {location.pathname === "/" && (
        <div className="features">
          <div className="feature-item">
            <div className="icon">
              <img src={car} alt="Giao hàng siêu tốc" />
            </div>
            <div className="text">
              <h4>Giao hàng siêu tốc</h4>
              <p>Giao hàng trong 24h</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">
              <img src={tuvan} alt="Tư vấn miễn phí" />
            </div>
            <div className="text">
              <h4>Tư vấn miễn phí</h4>
              <p>Đội ngũ tư vấn tận tình</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">
              <img src={tanhtoan} alt="Thanh toán" />
            </div>
            <div className="text">
              <h4>Thanh toán</h4>
              <p>Thanh toán an toàn</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">
              <img src={qua} alt="Giải pháp quà tặng" />
            </div>
            <div className="text">
              <h4>Giải pháp quà tặng</h4>
              <p>Dành cho doanh nghiệp</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Header);
