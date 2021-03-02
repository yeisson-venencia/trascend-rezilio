import React from "react";
import "../../css/Login.scss";
import { FormattedMessage } from "react-intl";
import { buildUrl } from "../../utils/UrlService";
import classnames from "classnames";
import Loader from "../Loader";

class Code extends React.Component {
  constructor(props) {
    super(props);

    this.changeInput = this.changeInput.bind(this);
    this.resetInput = this.resetInput.bind(this);
    this.resendCode = this.resendCode.bind(this);
    this.onSubmitCode = this.onSubmitCode.bind(this);

    this.state = {
      username: this.props.username,
      password: this.props.password,
      code: ["", "", "", "", "", ""],
      showError: false,
      showLoading: false,
      showSending: false,
    };

    this.number0 = React.createRef();
    this.number1 = React.createRef();
    this.number2 = React.createRef();
    this.number3 = React.createRef();
    this.number4 = React.createRef();
    this.number5 = React.createRef();
  }

  changeInput(e, pos) {
    const that = this;

    let code = that.state.code,
      value = e.target.value;

    code[pos] = value;

    if (!code.includes("")) {
      that.onSubmitCode();
    }

    if (pos < 5 && value !== "") {
      let ref = pos + 1;

      that[`number${ref}`].focus();
    }

    that.setState({
      code: code,
    });
  }

  resetInput(pos) {
    const that = this;

    let code = that.state.code;

    if (!that.state.code.includes("")) {
      code = ["", "", "", "", "", ""];

      that.number0.focus();
    } else {
      code[pos] = "";
    }

    that.setState({
      code: code,
      showError: false,
    });
  }

  resendCode() {
    const that = this;
    const { intl } = that.props;

    let locale = intl.formatMessage({
      id: "locale_full",
    });

    that.setState({
      showSending: true,
    });

    that.props.auth
      .login(that.state.username, that.state.password, locale)
      .then(function (result) {
        setTimeout(function () {
          that.setState({
            showSending: false,
          });
        }, 5 * 1000);
      })
      .catch(function () {
        this.props.history.replace(buildUrl("ERROR") + "#api");
      });
  }

  onSubmitCode() {
    const that = this;
    const { intl } = that.props;

    let locale = intl.formatMessage({
      id: "locale_full",
    });

    that.setState({
      showLoading: true,
    });

    that.props.auth
      .mfa(
        that.state.username,
        that.state.password,
        locale,
        that.state.code.join("")
      )
      .then(function (result) {
        that.props.onSuccess();
      })
      .catch(function () {
        // throw error message
        that.setState({
          showLoading: false,
          showError: true,
        });
      });
  }

  render() {
    const that = this;

    return (
      <div className="code">
        <h1>
          <FormattedMessage id="login.code.title" values={{ br: <br /> }} />
        </h1>
        <p>
          <FormattedMessage id="login.code.text" values={{ br: <br /> }} />
        </p>
        <div className="inputs">
          {that.state.showLoading === true ? (
            <Loader />
          ) : (
            that.state.code.map((value, index) => {
              return (
                <input
                  key={index}
                  ref={(input) => (this[`number${index}`] = input)}
                  onChange={(e) => that.changeInput(e, index)}
                  onClick={() => that.resetInput(index)}
                  className={classnames(
                    "number",
                    { valid: that.state.code[index] !== "" ? true : false },
                    { invalid: that.state.showError }
                  )}
                  value={that.state.code[index]}
                  autoFocus={index === 0 ? true : false}
                  maxLength="1"
                />
              );
            })
          )}
        </div>
        {that.state.showError === true ? (
          <div className="error">
            <FormattedMessage id="login.code.error" values={{ br: <br /> }} />
          </div>
        ) : null}

        <div>
          {that.state.showSending === false ? (
            <div className="resend" onClick={() => that.resendCode()}>
              <FormattedMessage id="login.code.resend" />
            </div>
          ) : null}
          {that.state.showSending === true ? (
            <div className="sending">
              <FormattedMessage id="login.code.sent" />
            </div>
          ) : null}
        </div>

        <div>
          <div className="back" onClick={() => that.props.goBack()}>
            <FormattedMessage id="login.code.back" />
          </div>
        </div>
      </div>
    );
  }
}

export default Code;
