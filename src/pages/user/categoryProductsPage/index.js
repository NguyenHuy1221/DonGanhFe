import { memo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchProductsByDanhMuc,
  sapXepSanPhamTheoGia,
  sapXepSanPhamTheoGiaGiamDan,
  sapXepSanPhamTheoNgayTao,
  sapXepSanPhamNgayTaoGiamDan,
  sapXepSanPhamBanChayNhat,
  sapXepSanPhamCoGiamGia,
} from "api/productService";

import { FaShoppingCart, FaStar } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { fetchCategories } from "api/categoriesService";
import "./style.scss";
import Bredcrumb from "../bredcrumb";

const CategoryProductsPage = () => {
  const { _id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Giá thấp đến cao");

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSubMenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const sorts = [
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Mới đến cũ",
    "Cũ đến mới",
    "Bán chạy nhất",
    "Đang giảm giá",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProductsByDanhMuc(_id),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchData();
  }, [_id]);

  const handleSortChange = async (sort) => {
    setLoading(true);
    setSelectedSort(sort);

    try {
      let sortedProducts;
      switch (sort) {
        case "Giá thấp đến cao":
          sortedProducts = await sapXepSanPhamTheoGia();
          break;
        case "Giá cao đến thấp":
          sortedProducts = await sapXepSanPhamTheoGiaGiamDan();
          break;
        case "Mới đến cũ":
          sortedProducts = await sapXepSanPhamTheoNgayTao();
          break;
        case "Cũ đến mới":
          sortedProducts = await sapXepSanPhamNgayTaoGiamDan();
          break;
        case "Bán chạy nhất":
          sortedProducts = await sapXepSanPhamBanChayNhat();
          break;
        case "Đang giảm giá":
          sortedProducts = await sapXepSanPhamCoGiamGia();
          break;
        default:
          sortedProducts = await fetchProductsByDanhMuc(_id);
      }

      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching sorted products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main id="main" className="sec-tb">
      <div className="container">
        <div className="row end">
          <div className="col-md-4 col-lg-3 sidebar">
            <div className="inner">
              <div className="widget">
                <div className="widget-title">Danh mục sản phẩm</div>
                <div className="widget-content">
                  <ul className="menu-category">
                    {categories.map((category, index) => (
                      <li key={category._id}>
                        <a
                          className={activeIndex === index ? "active" : ""}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log(
                              `Clicked category: ${category.TenDanhMuc}, ID: ${category._id}`
                            );
                            // fetchProductsByDanhMuc(category._id).then(
                            //   (data) => {
                            //     console.log("Fetched products:", data); // Kiểm tra dữ liệu trả về
                            //     setProducts(data); // Cập nhật state
                            //   }
                            // );
                            toggleSubMenu(index);
                          }}
                        >
                          {category.TenDanhMuc}
                        </a>
                        {/* Danh mục con */}
                        {category.DanhMucCon && (
                          <ul
                            style={{
                              display: activeIndex === index ? "block" : "none",
                            }}
                          >
                            {category.DanhMucCon.map((subCategory) => (
                              <li key={subCategory._id}>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    fetchProductsByDanhMuc(category._id).then(
                                      (data) => {
                                        console.log("Fetched products:", data); // Kiểm tra dữ liệu trả về
                                        setProducts(data); // Cập nhật state
                                      }
                                    );
                                    console.log(
                                      `Clicked category: ${category.TenDanhMuc}, ID: ${category._id}`
                                    );
                                  }}
                                >
                                  {subCategory.TenDanhMucCon}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 col-lg-9">
            <div className="sec-box-white">
              <div class="topresults clearfix">
                <form action="/" class="form-search">
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value=""
                    name="keyword"
                  />
                  <button>
                    <AiOutlineSearch />
                  </button>
                </form>
                <div class="orderby">
                  <span class="t">Bộ lọc:</span>
                  <a class="" href="#" data-sort="latest">
                    Mới nhất
                  </a>
                  <a class="" href="#" data-sort="best">
                    Bán chạy
                  </a>
                  <a class="" href="#" data-sort="lowtohigh">
                    Giá: từ thấp đến cao
                  </a>
                  <a class="" href="#" data-sort="hightolow">
                    Giá: từ cao đến thấp
                  </a>
                </div>
              </div>
              <div className="content-product-outner">
                <div className="mainproduct list-p-1" data-view="grid">
                  <div className="row list-item">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <div
                          className="col-6 col-lg-3 col-md-4 product-list-1 pd-bt"
                          key={product._id}
                        >
                          <div className="item product_box">
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
                      ))
                    ) : (
                      <p>Không có sản phẩm nào trong danh mục này.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(CategoryProductsPage);
