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
import { fetchCategories } from "api/categoriesService";
import "./style.scss";
import Bredcrumb from "../bredcrumb";

const CategoryProductsPage = () => {
  const { _id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Giá thấp đến cao");

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

    fetchData();
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
    <div className="background">
      <Bredcrumb name="Danh sách sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
            <div className="sidebar">
              <div className="sidebar__item">
                <h2>Tìm kiếm</h2>
                <input type="text" />
              </div>
              <div className="sidebar__item">
                <h2>Mức giá </h2>
                <div className="price__ranger__wrap">
                  <div>
                    <p>Từ :</p>
                    <input type="number" min={0} />
                  </div>
                  <div>
                    <p>Đến :</p>
                    <input type="number" min={0} />
                  </div>
                </div>
              </div>
              <div className="sidebar__item">
                <h2>Sắp xếp</h2>
                <div className="tags">
                  {sorts.map((item, key) => (
                    <div
                      className={`tag ${selectedSort === item ? "active" : ""}`}
                      key={key}
                      onClick={() => handleSortChange(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sidebar__item">
                <h2>Thể loại khác</h2>
                <ul>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <Link to={`/category/${category._id}`}>
                        {category.TenDanhMuc}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
            <h2>Danh Sách</h2>
            <div className="products-page">
              <div className="products__list">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div className="products__card" key={product._id}>
                      <div className="products__img">
                        <img
                          src={product.HinhSanPham}
                          alt={product.TenSanPham}
                        />
                        <div className="products__badge">
                          -{product.PhanTramGiamGia}%
                        </div>
                      </div>

                      <div className="products__name">{product.TenSanPham}</div>
                      <div className="products__pricing">
                        <span className="products__price__sale">
                          {product.DonGiaBan} VND
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Hiện tại chưa có sản phẩm nào trong danh mục này!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryProductsPage);
