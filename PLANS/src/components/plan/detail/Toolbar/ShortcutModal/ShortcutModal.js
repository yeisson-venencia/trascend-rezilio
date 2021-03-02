import React, { Component } from "react";
import cs from "classnames";
import { FormattedMessage, injectIntl } from "react-intl";
import ModalClose from "../../../../common/Modal/ModalClose";
import "./ShortcutModal.scss";

class ShortcutModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  handleChange = (e) => {
    e.preventDefault();

    this.setState({ value: e.target.value });
  };

  handleSubmit = () => {
    if (this.state.value === "") {
      this.props.onSubmit(this.props.action, this.props.defaultValue);
    } else {
      this.props.onSubmit(this.props.action, this.state.value);
    }
  };

  render() {
    const { intl } = this.props;

    return (
      <ModalClose
        hide={this.props.hide}
        header={intl.formatMessage({
          id: "plan.toolbar.shortcut." + this.props.action + ".title",
        })}
      >
        <div className="shortcut-modal-body">
          {this.props.action === "delete" ? (
            <div className="shortcut-modal-message">
              <FormattedMessage id={`plan.toolbar.shortcut.delete.message`} />
            </div>
          ) : (
            <input
              value={this.props.value}
              onChange={this.handleChange}
              defaultValue={this.props.defaultValue}
            ></input>
          )}

          <button
            className={cs("action", this.props.action)}
            onClick={this.handleSubmit}
          >
            {
              <FormattedMessage
                id={
                  "plan.toolbar.shortcut." +
                  this.props.action +
                  ".action.button"
                }
              />
            }
          </button>
        </div>
      </ModalClose>
    );
  }
}

export default injectIntl(ShortcutModal);
