import { memo } from "react";
import Header from "../header";
import HeaderNew from "../headerNew";
import Footer from "../footer";

const MasterLayout = ({ children, ...props }) => {
  return (
    <div {...props}>
      {/* <Header /> */}
      <HeaderNew />
      {children}
      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
