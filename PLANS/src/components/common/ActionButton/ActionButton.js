import React from "react";
import classnames from "classnames";
import "./ActionButton.scss";

const ActionButton = ({ action, text, onClick, showProgress, disabled }) => {
  return (
    <button
      className={classnames({
        "action-button": true,
        [`${action}`]: true,
        "save-progress": showProgress,
      })}
      onClick={(e) => onClick(e, action)}
      disabled={disabled}
    >
      <span
        className={classnames({
          "action-button-icon": true,
          [`${action}`]: true,
        })}
      ></span>
      <span className="action-button-text">{text}</span>
      {showProgress && (
        <div className="action-button-progress">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </button>
  );
};

export default ActionButton;
