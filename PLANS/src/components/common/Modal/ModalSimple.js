import React, { Component } from "react";
import Overlay from "../Overlay";
import withModal from "./withModal";
import "./Modal.scss";
import cs from "classnames";

class ModalSimple extends Component {
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

  render() {
    const { show } = this.state;

    if (show) {
      return (
        <div className={this.props.class}>
          <Overlay overlayClass={this.props.overlayClass} />
          <div className={cs("modal simple show")} role="dialog">
            <div className="modal-body">{this.props.children}</div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default withModal(ModalSimple);
