import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import Icon from "../Icon";

import "./ContextMenuExtended.scss";

class ContextMenuExtended extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  handleOutsideClick = (e) => {
    if (this.nodeRef && !this.nodeRef.contains(e.target)) {
      this.setState({
        show: false,
      });
      // notify the parent
      this.props.onClickOutside();

      document.removeEventListener("click", this.handleOutsideClick, false);
    }
  };

  componentDidMount = () => {
    this.setState({
      show: true,
    });
    document.addEventListener("click", this.handleOutsideClick, false);
  };

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      this.setState({
        show: true,
      });
      document.addEventListener("click", this.handleOutsideClick, false);
    }
  };

  clickAction = (e, action) => {
    this.props.onClick(e, action);

    document.removeEventListener("click", this.handleOutsideClick, false);

    this.setState({
      show: false,
    });
  };

  formatVersion = (item) => {
    return (
      <React.Fragment>
        <Icon icon={item.icon} color="" />
        <span>{item.user}</span>
        <span>{item.update}</span>
      </React.Fragment>
    );
  };

  render() {
    const { items } = this.props;

    if (this.state.show === true) {
      let versions = items.map((item) => {
        return (
          <li key={item._revisionId} onClick={(e) => this.clickAction(e, item)}>
            {this.formatVersion(item)}
          </li>
        );
      });

      if (versions.length > 1) {
        // add separator in between actual and historical versions
        versions.splice(
          1,
          0,
          <li key="0" className="context-menu-header">
            <FormattedMessage id="plan.context.menu.version.header" />
          </li>
        );
      }

      return (
        <div
          className="context-menu ex"
          ref={(node) => {
            this.nodeRef = node;
          }}
        >
          <ul>{versions}</ul>
        </div>
      );
    }
    return null;
  }
}

ContextMenuExtended.propTypes = {
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  onClickOutside: PropTypes.func,
};

export default injectIntl(ContextMenuExtended);
