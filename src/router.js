import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTER } from "./utils/router";
import HomePage from "./pages/user/homePage";
import MasterLayout from "./pages/theme/masterLayout";
import ProfilePage from "./pages/user/profilePage";
import ProductsPage from "./pages/user/productDetailPage";
import CategoryProductsPage from "pages/user/categoryProductsPage";
import ProductDetailPage from "./pages/user/productDetailPage";
import LoginPage from "./pages/theme/loginPage";
import CartPage from "./pages/user/cartPage";
import RegisterPage from "./pages/theme/registerPage";
import GoogleCallback from "./component/GoogleCallback";
import PaymentPage from "./pages/user/paymentPage";
import DashboardPage from "./pages/admin/dashboardPage";
import AdminLayout from "./pages/theme/adminLayout";
import TableList from "./pages/admin/TableList";
import ProductFormPage from "./pages/admin/productFormPage";

const RenderUserRouter = () => {
  const userRouter = [
    {
      path: ROUTER.USER.HOME,
      component: <HomePage />,
    },
    {
      path: ROUTER.USER.PROFILE,
      component: <ProfilePage />,
    },
    {
      path: ROUTER.USER.PRODUCTS,
      component: <ProductsPage />,
    },
    {
      path: ROUTER.USER.CATEGORIES,
      component: <CategoryProductsPage />,
    },
    {
      path: ROUTER.USER.PRODUCTDETAIL,
      component: <ProductDetailPage />,
    },
    {
      path: ROUTER.USER.CART,
      component: <CartPage />,
    },
    {
      path: ROUTER.USER.PAYMENT,
      component: <PaymentPage />,
    },
  ];

  const adminRouter = [
    {
      path: ROUTER.ADMIN.DASHBOARD,
      component: <DashboardPage />,
    },
    {
      path: ROUTER.ADMIN.ADDPRODUCTS,
      component: <ProductFormPage />,
    },
  ];

  return (
    <>
      <Routes>
        {userRouter.map((item, key) => (
          <Route
            key={key}
            path={item.path}
            element={<MasterLayout>{item.component}</MasterLayout>}
          />
        ))}
        {adminRouter.map((item, key) => (
          <Route
            key={key}
            path={item.path}
            element={<AdminLayout>{item.component}</AdminLayout>}
          />
        ))}
        <Route path={ROUTER.USER.LOGIN} element={<LoginPage />} />
        <Route path={ROUTER.USER.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTER.USER.GOOGLE} element={<GoogleCallback />} />
      </Routes>
    </>
  );
};

const RouterCustom = () => {
  return (
    <Router>
      <RenderUserRouter />
    </Router>
  );
};

export default RouterCustom;
