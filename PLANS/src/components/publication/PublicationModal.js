import React, { Component } from "react";
import cs from "classnames";
import ModalClose from "../common/Modal/ModalClose";
import ModalSimple from "../common/Modal/ModalSimple";
import Loader from "../Loader";

class PublicationModal extends Component {
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
    const { value } = this.state;
    const { action, defaultValue } = this.props;
    if (this.props.input) {
      if (this.state.value === "") {
        this.props.onSubmit(action, defaultValue);
      } else {
        this.props.onSubmit(action, value);
      }
    } else {
      this.props.onSubmit(action);
    }
  };

  render() {
    const {
      title,
      input,
      value,
      defaultValue,
      info,
      emphasis,
      action,
      buttonText,
      confirmation,
      inProgress,
    } = this.props;

    // three different popups shown

    // 1. info popup (requires a confirmation to perform action)
    // 2. progress popup (loader animation)
    if (confirmation === false || confirmation === undefined) {
      return (
        <ModalClose overlayClass="none" hide={this.props.hide}>
          <div className={cs("edit-modal-title", action)}>{title}</div>
          <div className="edit-modal-body">
            {input && (
              <input
                value={value}
                onChange={this.handleChange}
                defaultValue={defaultValue}
              ></input>
            )}
            {info && (
              <div className={cs("edit-modal-info", action)}>
                {info}
                <span>{emphasis}</span>
              </div>
            )}

            {inProgress === true ? (
              <Loader wrapper={true} />
            ) : (
              <button
                className={cs("btn-confirmation", action)}
                onClick={this.handleSubmit}
              >
                {buttonText}
              </button>
            )}
          </div>
        </ModalClose>
      );
    }

    // 3. confirmation popup (autoclose after while)
    if (confirmation === true) {
      return (
        <ModalSimple overlayClass="none">
          <div className="edit-modal-body confirmation">
            {input && (
              <input
                value={value}
                onChange={this.handleChange}
                defaultValue={defaultValue}
              ></input>
            )}
            {info && (
              <div className={cs("edit-modal-info", action)}>
                {info}
                <span>{emphasis}</span>
              </div>
            )}
            {confirmation && (
              <div className={cs("confirmation-image", action)}></div>
            )}
          </div>
        </ModalSimple>
      );
    }

    return null;
  }
}

export default PublicationModal;
