import React from "react";
import "./Select.scss";
import classnames from "classnames";

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
      value: props.options[0],
      options: props.options,
    };
  }

  toggleSelect = () => {
    const that = this;

    if (that.state.showOptions === true) {
      that.setState({
        showOptions: false,
      });
    } else {
      that.setState({
        showOptions: true,
      });
      document.addEventListener("click", that.handleOutsideClick, false);
    }
  };

  handleOutsideClick = (e) => {
    const that = this;

    if (that.nodeRef && !that.nodeRef.contains(e.target)) {
      that.setState({
        showOptions: false,
      });
      document.removeEventListener("click", that.handleOutsideClick, false);
    }
  };

  onChange = (item) => {
    this.setState({
      value: item,
    });

    this.props.onChange(item.value);
  };

  render() {
    // options
    let options = this.state.options.map((item, id) => {
      return (
        <div
          className="item"
          key={id}
          onClick={() => {
            this.onChange(item);
          }}
        >
          {item.label}
        </div>
      );
    });

    return (
      <div
        ref={(node) => {
          this.nodeRef = node;
        }}
        onClick={() => this.toggleSelect()}
        className={classnames("select", { open: this.state.showOptions })}
      >
        <div className="current">{this.state.value.label}</div>
        <div className="items">{options}</div>
      </div>
    );
  }
}
export default Select;
