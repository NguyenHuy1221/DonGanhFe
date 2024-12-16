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


  return (
    <div className="products__container">
    
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
