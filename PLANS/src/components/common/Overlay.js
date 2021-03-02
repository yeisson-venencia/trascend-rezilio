import React from "react";
import cs from "classnames";
import "./Overlay.scss";

const Overlay = ({ overlayClass }) => {
  return <div className={cs("overlay", overlayClass)}></div>;
};

export default Overlay;
