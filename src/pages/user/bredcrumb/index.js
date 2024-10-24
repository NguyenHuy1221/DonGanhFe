import { ROUTER } from "utils/router";
import { memo } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const Bredcrumb = (props) => {
  return (
    <>
      <div className="container">
        <div className="breadcrumb">
          <div className="breadcrumb__text">
            <ul>
              <li className="link">
                <Link to={ROUTER.USER.HOME}>Trang Chủ </Link>
              </li>
              <li>{props.name}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Bredcrumb);
