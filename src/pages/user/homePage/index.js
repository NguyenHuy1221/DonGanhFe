import { memo, useEffect, useState } from "react";
import "./style.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import { fetchProducts, fetchProductsByDanhMuc } from "api/productService";
import gg from "../../../image/gg.png";
import { fetchCategories } from "api/categoriesService";
import ItemSanPham from "../itemSanPham";
import ItemSanPhamByCategoriPage from "../itemSanPhamByCategori";
const HomePage = () => {
  const [setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(
    categories.length > 0 ? categories[0]._id : null
  );

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setActiveTab(categoriesData[0]._id);
          fetchProductsByDanhMuc(categoriesData[0]._id).then((productsData) => {
            setSelectedProducts(productsData);
          });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getCategories();
    getProducts();
  }, []);

  const handleTabSelect = (index) => {
    const selectedCategoryId = categories[index]._id;
    fetchProductsByDanhMuc(selectedCategoryId)
      .then((productsData) => {
        if (productsData === "Hết hàng" || productsData.length === 0) {
          setSelectedProducts([]);
        } else {
          setSelectedProducts(productsData);
        }
        setActiveTab(selectedCategoryId);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setSelectedProducts([]);
      });
  };

  // const renderFeaturedProducts = () => {
  //   return (
  //     <Tabs
  //       selectedIndex={categories.findIndex(
  //         (category) => category._id === activeTab
  //       )}
  //       onSelect={handleTabSelect}
  //     >
  //       <TabList>
  //         {categories.map((category) => (
  //           <Tab key={category._id}>{category.TenDanhMuc}</Tab>
  //         ))}
  //       </TabList>

  //       {categories.map((category) => (
  //         <TabPanel key={category._id}>
  //           {activeTab === category._id ? (
  //             selectedProducts.length > 0 ? (
  //               <div className="products__list">
  //                 {selectedProducts.map((product) => (
  //                   <div className="products__card" key={product._id}>
  //                     <Link
  //                       to={`/detail/${product._id}`}
  //                       className="detaiProducts"
  //                     >
  //                       <div className="products__img">
  //                         <img
  //                           src={product.HinhSanPham}
  //                           alt={product.TenSanPham}
  //                         />
  //                         <div className="products__badge">
  //                           -{product.PhanTramGiamGia}%
  //                         </div>
  //                       </div>
  //                       <div className="products__category">
  //                         {product.category}
  //                       </div>
  //                       <div className="products__name">
  //                         {product.TenSanPham}
  //                       </div>

  //                       <div className="products__pricing">
  //                         <span className="products__price__sale">
  //                           {product.DonGiaBan} VND
  //                         </span>
  //                         <span className="products__price__normal">
  //                           {product.DonGiaBan} VND
  //                         </span>
  //                       </div>
  //                     </Link>
  //                   </div>
  //                 ))}
  //               </div>
  //             ) : (
  //               <p>Hiện tại chưa có sản phẩm nào trong danh mục này!</p>
  //             )
  //           ) : (
  //             <p>Không có dữ liệu để hiển thị.</p>
  //           )}
  //         </TabPanel>
  //       ))}
  //     </Tabs>
  //   );
  // };

  return (
    <div className="products__container">
      {/* <div className="collection">
        <h2>Nông Sản Cao Cấp</h2>
        <p>
          Bộ sưu tập quà tặng nông sản là lựa chọn tuyệt vời cho quà Tết, quà
          Trung Thu, quà tặng doanh nghiệp, giúp kết nối tình thân, vun đắp các
          mối quan hệ thêm bền chặt.
        </p>
      </div> */}

      {/* Categories Start */}
      {/* <div className="categories__list">
        {categories.map((category) => (
          <div className="categoties" key={category._id}>
            <img src={category.AnhDanhMuc} alt={category.TenDanhMuc} />
            <Link to={`/category/${category._id}`} className="categoties__info">
              <h4>{category.TenDanhMuc}</h4>
              <p>{category.IDDanhMuc}</p>
              <a href="#">Xem ngay »</a>
            </Link>
          </div>
        ))}
      </div> */}
      {/* Categories End */}

      {/* Feature Start  */}
      {/* <div className="container">
        <div className="featured">
          <div className="section__title">
            <h2>Sản phẩm nổi bật</h2>
          </div>
          {renderFeaturedProducts()}
        </div>
      </div> */}
      {/* Feature End */}

      {/* <div className="container">
        <section className="flash_sale sec-box-white">
          <div className="entry-head">
            <div className="menuajax">
              <a
                className="hot active"
                style={{ paddingLeft: "25px" }}
                href="#"
                data-tab="first"
              >
                Sản phẩm mới
              </a>

              <a href="#" data-tab="best" className="">
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
                    transform: "translate3d(0px, 0px, 0px)",
                    transition: "all",
                    width: "7200px",
                  }}
                >
                  <div
                    className="owl-item active"
                    style={{ width: "230px", marginRight: "10px" }}
                  >
                    <div className="item">
                      <a href="/" className="img-full tRes_100">
                        <img
                          className="loaded lazy-loaded"
                          data-lazy-type="image"
                          data-lazy-src="https://storage.googleapis.com/fm-insight-production-v2/uploads/cua_gach_ca_mau_tuoi_ngon_0_1724738977857_1729134022191.png"
                          src="https://storage.googleapis.com/fm-insight-production-v2/uploads/cua_gach_ca_mau_tuoi_ngon_0_1724738977857_1729134022191.png"
                        />
                      </a>
                      <div className="divtext">
                        <h3 className="line-2">
                          <a href="/">Combo 2 Cua Thịt L + 2 Cua Gạch L</a>
                        </h3>
                        <div className="ratingresult">
                          <span className="stars">
                            <FaStar className="rated" color="gold" />
                            <FaStar className="rated" color="gold" />
                            <FaStar className="rated" color="gold" />
                            <FaStar className="rated" color="gold" />
                            <FaStar className="rated" color="gold" />
                          </span>
                          <li className="total-reviews">
                            <a href="#">(0)</a>
                          </li>
                        </div>
                        <ul className="ulmeta inline bd">
                          <li>
                            <span>82 Đã bán</span>
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
                            <strong>1,559,000 ₫</strong>
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
                                2,000,000 ₫
                              </span>
                              <span
                                style={{
                                  textDecoration: "unset",
                                  fontSize: "12px",
                                }}
                              >
                                -22%
                              </span>
                            </p>
                          </div>
                          <div className="add-to-cart">
                            <a
                              className="btn detail_add_to_cart_3"
                              data-id="8398"
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
                </div>
              </div>

              <div className="owl-nav">
                <div className="owl-prev">
                  <FaArrowLeft />
                </div>
                <div className="owl-next">
                  <FaArrowRight />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div> */}
      <ItemSanPham />
      <ItemSanPhamByCategoriPage />
      <div class="quote-section">
        <div class="overlay">
          <div className="dl_text">
            <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
            <h1>Nhận Bảng Giá</h1>
            <p>
              Bằng cách đăng ký vào danh sách gửi nhận thông tin hoạt động của
              chúng tôi, bảng giá và thông tin tư vấn trực tiếp sẽ gửi đến hộp
              thư đến của BẠN.
            </p>
            <form class="email-form">
              <input type="email" placeholder="Email" required />
              <button type="submit">Nhận ngay</button>
            </form>
          </div>
        </div>
      </div>

      <div class="about-section">
        <div class="overlay">
          <h3>VỀ ĐÒN GÁNH SHOP & STORE</h3>
          <h1>Sẻ chia cùng nhà Nông</h1>
          <p>
            Chúng tôi, những người trẻ, nhiệt huyết và tận tâm trong ngành Nông
            nghiệp Việt Nam. Với tinh thần nỗ lực không ngừng phát triển, đa
            dạng hóa sản phẩm giúp sẻ chia cùng người nông dân và phục vụ nhu
            cầu hàng ngày của mọi người.
          </p>
          <button class="about-button">Xem Thêm</button>
        </div>
      </div>

      <div class="info-section">
        <h2>ĐÒN GÁNH SHOP & STORE NEWS</h2>
        <h1>Thông Tin</h1>

        <div class="info-grid">
          {/* <!-- Card 1 --> */}
          <div class="info-card">
            <img src="https://shop.donganh.vn/wp-content/uploads/2024/07/cai-don-ganh.jpg" alt="google" />

            <h3>Câu chuyện Đòn Gánh</h3>
            <p>
              Từ thuở xưa, cái đòn gánh luôn gắn liền với hình ảnh những bà cả,
              bà già quang gánh cần lao. Hình ảnh đó đã đi vào văn thơ và nhạc
              họa...
            </p>
          </div>

          {/* <!-- Card 2 --> */}
          <div class="info-card">
            <img src="https://shop.donganh.vn/wp-content/uploads/2024/07/chinh-sach-thanh-toan-the-gioi-thep-group.jpg" alt="google" />

            <h3>Chính sách thanh toán</h3>
            <p>
              Thanh toán bằng tiền mặt: Số 152/48 Hoàng Hoa Thám, TP. Buôn Ma
              Thuột, Đắk Lắk...
            </p>
          </div>

          {/* <!-- Card 3 --> */}
          <div class="info-card">
            <img src="https://shop.donganh.vn/wp-content/uploads/2024/07/chinh-sach-doi-tra-thumbnail.png" alt="google" />

            <h3>Chính sách đổi trả</h3>
            <p>
              Điều kiện đổi trả – Thời gian đổi trả: trong vòng 7 ngày kể từ
              ngày yêu cầu đổi trả hàng...
            </p>
          </div>

          {/* <!-- Card 4 --> */}
          <div class="info-card">
            <img src="https://shop.donganh.vn/wp-content/uploads/2024/07/Chinh-sach-van-chuyen-giao-nhan-hang-hoa.jpg" alt="google" />
            <h3>Chính sách vận chuyển & giao nhận hàng hóa</h3>
            <p>
              Thời gian giao – nhận hàng sau khi được tiếp nhận xử lý xong sẽ
              được giao ngay trong vòng 24h...
            </p>
          </div>

          {/* Card 5  */}
          <div class="info-card">
            <img src="https://shop.donganh.vn/wp-content/uploads/2024/07/news_1645000389.jpg" alt="google" />

            <h3>Chính sách bảo mật</h3>
            <p>
              Mục đích thu thập thông tin cá nhân của khách hàng nhằm liên quan
              đến các hoạt động hỗ trợ...
            </p>
          </div>
        </div>

        <button class="info-button">Xem Thêm</button>
      </div>
    </div>
  );
};

export default memo(HomePage);
