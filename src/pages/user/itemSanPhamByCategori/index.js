import { useState, useEffect, memo } from "react";
import "./style.scss";
import {
  FaStar,
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { fetchCategories } from "api/categoriesService";
import { fetchProductsByDanhMuc } from "api/productService";
import { Link } from "react-router-dom";

const ItemSanPhamByCategoriPage = () => {
  const [categories, setCategories] = useState([]); // Lưu danh sách danh mục
  const [currentCategory, setCurrentCategory] = useState(""); // Danh mục hiện tại
  const [products, setProducts] = useState([]); // Sản phẩm theo danh mục
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý vị trí hiển thị

  // useEffect(() => {
  //   const getCategories = async () => {
  //     try {
  //       const categoriesData = await fetchCategories();
  //       setCategories(categoriesData);

  //       // Chọn danh mục đầu tiên nếu có danh mục
  //       if (categoriesData.length > 0) {
  //         setCurrentCategory(categoriesData[0]._id);
  //         fetchProductsByDanhMuc(categoriesData[0]._id).then((productsData) => {
  //           setProducts(productsData);
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   getCategories();
  // }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
  
        // Lọc danh mục không có TinhTrang là "Đã xóa"
        const filteredCategories = categoriesData.filter(
          (category) => category.TinhTrang !== "Đã xóa"
        );
  
        setCategories(filteredCategories);
  
        // Chọn danh mục đầu tiên nếu có danh mục
        if (filteredCategories.length > 0) {
          setCurrentCategory(filteredCategories[0]._id);
          fetchProductsByDanhMuc(filteredCategories[0]._id).then(
            (productsData) => {
              setProducts(productsData);
            }
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    getCategories();
  }, []);
  
  // Hàm chuyển đổi danh mục
  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentIndex(0); // Reset vị trí hiển thị
    fetchProductsByDanhMuc(categoryId).then((productsData) => {
      setProducts(productsData);
    });
  };

  const moveLeft = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 10, 0)); // Không để index nhỏ hơn 0
  };

  const moveRight = () => {
    setCurrentIndex(
      (prevIndex) =>
        Math.min(prevIndex + 10, Math.floor(products.length / 10) * 10) // Không vượt quá giới hạn danh sách
    );
  };

  return (
    <div className="container">
      <section className="flash_sale sec-box-white">
        <div className="entry-head">
          {/* Tabs hiển thị danh mục */}
          <div className="menuajax1">
            <h2 class="ht">Sản phẩm nổi bật</h2>
            <div className="pdl"></div>
            {categories.map((category) => (
              <a
                key={category._id}
                className={`hot ${
                  currentCategory === category._id ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.TenDanhMuc}
              </a>
            ))}
            <a href="/all-products" className="xem-tat-ca">
              Xem tất cả
            </a>
          </div>

          {/* Khu vực hiển thị sản phẩm */}
          {/* <div className="owl-scroll-mb owl-carousel owl-flex s-nav list-p-1 first owl-loaded owl-drag">
            <div className="owl-stage-outer">
              <div
                className="owl-stage1"
                style={{
                  transform: `translate3d(0px, 0px, 0px)`,
                  transition: "all 0.3s ease",
                }}
              >
                {products
                  .slice(currentIndex, currentIndex + 10)
                  .map((product) => (
                    <div
                      key={product._id}
                      className="owl-item1 active"
                      style={{ width: "215px" }}
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
                            <a href="/">{product.TenSanPham}</a>
                          </h3>
                          <div className="ratingresult">
                            <span className="stars">
                              {[...Array(product.rating || 0)].map(
                                (_, index) => (
                                  <FaStar
                                    key={index}
                                    className="rated"
                                    color="gold"
                                  />
                                )
                              )}
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
          </div> */}

          {/* Khu vực hiển thị sản phẩm */}
          <div className="owl-scroll-mb owl-carousel owl-flex s-nav list-p-1 first owl-loaded owl-drag">
            <div className="owl-stage-outer">
              {products.length > 0 ? (
                <div
                  className="owl-stage1"
                  style={{
                    transform: `translate3d(0px, 0px, 0px)`,
                    transition: "all 0.3s ease",
                  }}
                >
                  {products
                    .slice(currentIndex, currentIndex + 10)
                    .map((product) => (
                      <div
                        key={product._id}
                        className="owl-item1 active"
                        style={{ width: "215px" }}
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
                                {[...Array(product.rating || 0)].map(
                                  (_, index) => (
                                    <FaStar
                                      key={index}
                                      className="rated"
                                      color="gold"
                                    />
                                  )
                                )}
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
              ) : (
                <div className="no-products">
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      fontSize: "18px",
                    }}
                  >
                    Không tìm thấy sản phẩm nào cho danh mục này.
                  </p>
                </div>
              )}
            </div>

            {/* Điều hướng */}
            {products.length > 0 && (
              <div className="owl-nav">
                <div className="owl-prev" onClick={moveLeft}>
                  <FaArrowLeft />
                </div>
                <div className="owl-next" onClick={moveRight}>
                  <FaArrowRight />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(ItemSanPhamByCategoriPage);
