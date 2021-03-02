import React from "react";
import classnames from "classnames";
import { FormattedMessage, injectIntl } from "react-intl";
import "./Support.scss";

class SupportItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type,
      hover: false,
    };
  }

  handleHoverEnter = () => {
    this.setState({
      hover: true,
    });
  };

  handleHoverLeave = () => {
    this.setState({
      hover: false,
    });
  };

  handleClick = () => {
    const { intl } = this.props;

    switch (this.state.type) {
      case "email":
        window.location.href =
          "mailto:" + intl.formatMessage({ id: "support.email.mailto" });
        break;
      case "chatbox":
        window.$zoho.salesiq.floatwindow.visible("show");
        break;
      default:
        return null;
    }
  };

  render() {
    return (
      <div
        className={classnames("box", { active: this.state.hover })}
        onMouseEnter={this.handleHoverEnter}
        onMouseLeave={this.handleHoverLeave}
        onClick={this.handleClick}
      >
        <div className={classnames("icon", this.state.type)}></div>

        <div className="text">
          <FormattedMessage id={"support." + this.state.type} />
        </div>
      </div>
    );
  }
}

export default injectIntl(SupportItem);
