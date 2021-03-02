import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import "./ContextMenu.scss";

class ContextMenu extends Component {
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

  render = () => {
    const { actions, tags } = this.props;

    if (this.state.show === true) {
      return (
        <div
          className="context-menu"
          ref={(node) => {
            this.nodeRef = node;
          }}
        >
          <ul>
            {actions.map((action) => (
              <li key={action} onClick={(e) => this.clickAction(e, action)}>
                <div className={`context-menu-icon ${action}`}></div>
                <span key={1}>
                  <FormattedMessage id={`plan.context.menu.action.${action}`} />
                </span>
                {tags
                  ? tags.map((tag) => <span key={2}>&nbsp;({tag})</span>)
                  : null}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };
}

ContextMenu.propTypes = {
  actions: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  onClickOutside: PropTypes.func,
};

export default injectIntl(ContextMenu);
