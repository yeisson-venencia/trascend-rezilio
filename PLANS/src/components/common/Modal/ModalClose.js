import React, { Component } from "react";
import cs from "classnames";
import Overlay from "../Overlay";
import withModal from "./withModal";
import "./Modal.scss";

class ModalClose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    this.setState({
      show: true,
    });
  }

  hideModal = () => {
    this.setState({
      show: false,
    });

    // call the parent if props passed
    if (this.props.hide !== undefined) {
      this.props.hide();
    }
  };

  render() {
    const { show } = this.state;

    if (show) {
      return (
        <div className={this.props.class}>
          <Overlay overlayClass={this.props.overlayClass} />
          <div className={cs("modal", "close", "show")} role="dialog">
            <div className="modal-header">
              {this.props.header && (
                <h1 className="modal-header-text">{this.props.header}</h1>
              )}
              <div className="close" onClick={this.hideModal}>
                X
              </div>
            </div>
            <div className="modal-body">
              {this.props.children}
              {this.props.actionButton ? (
                <button className="button" onClick={this.hideModal}>
                  {this.props.actionButtonText}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default withModal(ModalClose);
