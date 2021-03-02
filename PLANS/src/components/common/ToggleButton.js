import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import cs from "classnames";
import "./ToggleButton.scss";

const ToggleButton = (props) => {
  return (
    <div className="toggle" data-tip={props.dataTip} data-for="toggle-tooltip">
      <div
        className={cs({ "toggle-btn": true, on: props.isToggled })}
        onClick={props.onToggle}
      ></div>
      {props.label && <div className="toggle-label">{props.label}</div>}
      {props.tooltip && (
        <ReactTooltip
          className="toggle-tooltip"
          id="toggle-tooltip"
          effect="solid"
          place="bottom"
        />
      )}
    </div>
  );
};

ToggleButton.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isToggled: PropTypes.bool.isRequired,
  label: PropTypes.string,
};

export default ToggleButton;
