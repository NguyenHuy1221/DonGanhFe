import { memo, useEffect, useState } from "react";
import "./style.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import { fetchProducts, fetchProductsByDanhMuc } from "api/productService";

import { fetchCategories } from "api/categoriesService";

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

  const renderFeaturedProducts = () => {
    return (
      <Tabs
        selectedIndex={categories.findIndex(
          (category) => category._id === activeTab
        )}
        onSelect={handleTabSelect}
      >
        <TabList>
          {categories.map((category) => (
            <Tab key={category._id}>{category.TenDanhMuc}</Tab>
          ))}
        </TabList>

        {categories.map((category) => (
          <TabPanel key={category._id}>
            {activeTab === category._id ? (
              selectedProducts.length > 0 ? (
                <div className="products__list">
                  {selectedProducts.map((product) => (
                    <div className="products__card" key={product._id}>
                      <Link
                        to={`/detail/${product._id}`}
                        className="detaiProducts"
                      >
                        <div className="products__img">
                          <img
                            src={product.HinhSanPham}
                            alt={product.TenSanPham}
                          />
                          <div className="products__badge">
                            -{product.PhanTramGiamGia}%
                          </div>
                        </div>
                        <div className="products__category">
                          {product.category}
                        </div>
                        <div className="products__name">
                          {product.TenSanPham}
                        </div>

                        <div className="products__pricing">
                          <span className="products__price__sale">
                            {product.DonGiaBan} VND
                          </span>
                          <span className="products__price__normal">
                            {product.DonGiaBan} VND
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Hiện tại chưa có sản phẩm nào trong danh mục này!</p>
              )
            ) : (
              <p>Không có dữ liệu để hiển thị.</p>
            )}
          </TabPanel>
        ))}
      </Tabs>
    );
  };

  return (
    <div className="products__container">
      <div className="collection">
        <h2>Nông Sản Cao Cấp</h2>
        <p>
          Bộ sưu tập quà tặng nông sản là lựa chọn tuyệt vời cho quà Tết, quà
          Trung Thu, quà tặng doanh nghiệp, giúp kết nối tình thân, vun đắp các
          mối quan hệ thêm bền chặt.
        </p>
      </div>

      {/* Categories Start */}
      <div className="categories__list">
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
      </div>
      {/* Categories End */}

      {/* Feature Start  */}
      <div className="container">
        <div className="featured">
          <div className="section__title">
            <h2>Sản phẩm nổi bật</h2>
          </div>
          {renderFeaturedProducts()}
        </div>
      </div>
      {/* Feature End */}


        


    </div>
  );
};

export default memo(HomePage);
