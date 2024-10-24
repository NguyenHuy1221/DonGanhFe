import React from "react";
import ReactDOM from "react-dom/client";
import RouterCustom from "./router";
import "./style/style.scss";
// import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterCustom />
  </React.StrictMode>
);
