import React from "react";
import "./Tooltip.scss";

const Tooltip = (props) => {
  return (
    <div className="tooltip-wrapper">
      {props.children}
      {props.active && <div className="tooltip">{props.content}</div>}
    </div>
  );
};

export default Tooltip;
