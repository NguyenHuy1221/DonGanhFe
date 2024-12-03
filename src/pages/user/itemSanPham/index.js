import { useState, useEffect, memo } from "react";
import "./style.scss";
import {
  FaStar,
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

import { fetchProducts } from "api/productService";
import { Link } from "react-router-dom";

const ItemSanPham = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState("new"); // Quản lý tab hiện tại
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const productsData = await fetchProducts(); // Gọi API để lấy dữ liệu

      // Lọc sản phẩm mới
      const sortedNewProducts = [...productsData]
        .sort((a, b) => new Date(b.NgayTao) - new Date(a.NgayTao))
        .slice(0, 10);
      setNewProducts(sortedNewProducts);

      // Lọc sản phẩm bán chạy
      const sortedBestSellingProducts = [...productsData]
        .sort(
          (a, b) =>
            a.SoLuongNhap -
            a.SoLuongHienTai -
            (b.SoLuongNhap - b.SoLuongHienTai)
        )
        .slice(0, 10);
      setBestSellingProducts(sortedBestSellingProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const moveLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  const moveRight = () => {
    const products = currentTab === "new" ? newProducts : bestSellingProducts;
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= products.length - 5) return prevIndex; // Giới hạn khi đạt cuối
      return prevIndex + 1;
    });
  };

  const productsToDisplay =
    currentTab === "new" ? newProducts : bestSellingProducts;

  return (
    <div className="container">
      <section className="flash_sale sec-box-white">
        <div className="entry-head">
          <div className="menuajax">
            <a
              className={`hot ${currentTab === "new" ? "active" : ""}`}
              style={{ paddingLeft: "25px" }}
              onClick={() => setCurrentTab("new")}
            >
              Sản phẩm mới
            </a>
            <a
              className={`${currentTab === "best" ? "active" : ""}`}
              onClick={() => setCurrentTab("best")}
            >
              Bán chạy nhất
            </a>
          </div>
          <div
            className="owl-scroll-mb owl-carousel owl-flex s-nav list-p-1 first owl-loaded owl-drag"
            data-res="5,4,4,3"
            paramowl="margin=10"
          >
            <div className="owl-stage-outer">
              <div
                className="owl-stage"
                style={{
                  transform: `translate3d(-${currentIndex * 230}px, 0px, 0px)`,
                  transition: "all 0.3s ease",
                }}
              >
                {/* Render các sản phẩm */}
                {productsToDisplay.map((product) => (
                  <div
                    key={product._id}
                    className="owl-item active"
                    style={{ width: "230px" }}
                  >
                    <div className="item">
                      <Link
                        to={`/detail/${product._id}`}
                        className="img-full tRes_100"
                      >
                        <img
                          className="loaded lazy-loaded"
                          src={product.HinhSanPham}
                          alt={product.TenSanPham}
                        />
                      </Link>
                      <div className="divtext">
                        <h3 className="line-2">
                          <Link to={`/detail/${product._id}`}>
                            <a>{product.TenSanPham}</a>
                          </Link>
                        </h3>
                        <div className="ratingresult">
                          <span className="stars">
                            {/* Hiển thị số sao đánh giá */}
                            {[...Array(product.rating || 0)].map((_, index) => (
                              <FaStar
                                key={index}
                                className="rated"
                                color="gold"
                              />
                            ))}
                          </span>
                          <li className="total-reviews">
                            <a href="#">({product.reviewsCount || 0})</a>
                          </li>
                        </div>
                        <ul className="ulmeta inline bd">
                          <li>
                            <span>{product.SoLuongHienTai} Còn lại</span>
                          </li>
                        </ul>
                        <div
                          className="price"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <strong>
                              {product.DonGiaBan.toLocaleString()} ₫
                            </strong>
                            <p
                              style={{
                                margin: 0,
                                padding: 0,
                                textAlign: "left",
                                height: "22px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#9e9e9e",
                                  textDecoration: "line-through",
                                  fontSize: "12px",
                                  margin: 0,
                                }}
                              >
                                {(
                                  product.DonGiaBan *
                                  (1 + product.PhanTramGiamGia / 100)
                                ).toLocaleString()}{" "}
                                ₫
                              </span>
                              <span
                                style={{
                                  textDecoration: "unset",
                                  fontSize: "12px",
                                }}
                              >
                                -{product.PhanTramGiamGia}%
                              </span>
                            </p>
                          </div>
                          <div className="add-to-cart">
                            <a
                              className="btn detail_add_to_cart_3"
                              data-id={product._id}
                              style={{ padding: "0 6px", margin: 0 }}
                            >
                              <span
                                style={{
                                  margin: 0,
                                  fontSize: "24px",
                                }}
                              >
                                <FaShoppingCart />
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="owl-nav">
              <div className="owl-prev" onClick={moveLeft}>
                <FaArrowLeft />
              </div>
              <div className="owl-next" onClick={moveRight}>
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(ItemSanPham);
