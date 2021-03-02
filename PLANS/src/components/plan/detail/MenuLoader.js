import React from "react";
import "./MenuLoader.scss";

const MenuLoader = (props) => {
  if (props.type.includes("menu")) {
    return (
      <div className="plan-loader-menu">
        <div className="title" />
      </div>
    );
  }
  if (props.type.includes("text")) {
    return <div className="plan-loader-text"></div>;
  }
};

export default MenuLoader;
