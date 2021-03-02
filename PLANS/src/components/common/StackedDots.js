import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "./StackedDots.scss";

class StackedDots extends React.Component {
  render() {
    return (
      <div
        className={classnames("three-dot", this.props.mode, {
          double: this.props.double,
          disabled: this.props.disabled,
        })}
        onClick={this.props.onClick}
        onMouseDown={this.props.onDotsMouseDown}
        onMouseUp={this.props.onDotsMouseUp}
        data-tip={this.props.dataTip}
        data-for={this.props.dataFor}
      ></div>
    );
  }
}

StackedDots.propTypes = {
  onClick: PropTypes.func,
};

export default StackedDots;
