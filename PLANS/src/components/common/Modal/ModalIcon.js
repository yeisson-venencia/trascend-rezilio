import React, { Component } from "react";
import cs from "classnames";
import Overlay from "../Overlay";
import withModal from "./withModal";
import "./Modal.scss";

class ModalIcon extends Component {
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
          <div className="modal icon show" role="dialog">
            <div className="modal-header">
              {this.props.header && (
                <>
                  <div
                    className={cs("modal-header-icon", this.props.icon)}
                  ></div>
                  <h1 className="modal-header-text">{this.props.header}</h1>
                </>
              )}
              <div className="close" onClick={this.hideModal}>
                X
              </div>
            </div>
            <div className="modal-body">{this.props.children}</div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default withModal(ModalIcon);
