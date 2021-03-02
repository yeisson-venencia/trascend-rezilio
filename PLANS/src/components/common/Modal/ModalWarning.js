import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import store from "../../../utils/store";
import "./ModalWarning.scss";
import ModalClose from "./ModalClose";

class ModalWarning extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
    };
  }

  componentWillMount() {
    if (store.get("warning") === null) {
      store.set("warning", true);
    }
    this.setState({
      show: store.get("warning") === "true",
    });
  }

  hideModal = () => {
    this.setState({
      show: false,
    });

    store.set("warning", false);
  };

  render() {
    const { show } = this.state;
    const { intl } = this.props;

    if (show) {
      return (
        <ModalClose
          hide={this.hideModal}
          class="modal-warning"
          header={intl.formatMessage({
            id: "modal.warning.title",
          })}
        >
          <div className="image"></div>

          <div className="modal-text">
            <FormattedMessage
              id={`modal.warning.message`}
              values={{
                br: <br />,
              }}
            />
          </div>

          <button className="modal-button" onClick={this.hideModal}>
            <FormattedMessage id={`modal.warning.button`} />
          </button>
        </ModalClose>
      );
    }
    return null;
  }
}

export default injectIntl(ModalWarning);
