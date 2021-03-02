import React from "react";
import "./Password.scss";
import { FormattedMessage } from "react-intl";
import classnames from "classnames";
import { buildUrl, endpoint } from "../../utils/UrlService";
import { Link } from "react-router-dom";
import ApiService from "../../utils/ApiService";

const Api = new ApiService();

class Code extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  changeInput = (e, pos) => {
    let code = this.state.code,
      value = e.target.value;

    code[pos] = value;

    if (!code.includes("")) {
      this.onSubmitCode();
    }

    if (pos < 5 && value !== "") {
      let ref = pos + 1;
      this[`number${ref}`].focus();
    }
    this.setState({
      code: code,
    });
  };

  resetInput = (pos) => {
    let code = this.state.code;
    if (!this.state.code.includes("")) {
      code = ["", "", "", "", "", ""];
      this.number0.focus();
    } else {
      code[pos] = "";
    }
    this.setState({
      code: code,
      showError: false,
    });
  };

  onSubmitCode = () => {
    // api to match code & get secret
    let persist = {
      email: this.props.email,
      mfa: this.state.code.join(""),
    };

    Api.init(this.props.history);
    Api.post(endpoint("forgotPassword"), persist)
      .then((res) => {
        // pass secret to parent component
        if (res && res.secret && res.secret.length > 0) {
          this.props.onSuccess(res.secret);
        } else {
          // secret is not generated (email doesn't exist or MFA code is not valid)
          this.setState({
            showError: true,
            showLoading: false,
          });
        }
      })
      .catch(function (err) {
        this.props.history.replace(buildUrl("ERROR") + "#api");
      });
  };

  resendCode = () => {
    const that = this;

    this.setState({
      showSending: true,
    });

    let persist = {
      email: this.props.email,
    };

    Api.init(this.props.history);
    Api.post(endpoint("forgotPassword"), persist)
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
  };

  render() {
    return (
      <div className="code">
        <h1 className="title">
          <FormattedMessage id="password.code.title" values={{ br: <br /> }} />
        </h1>
        <h1 className="digit-code">
          <FormattedMessage id="password.code.text" values={{ br: <br /> }} />
        </h1>
        <p>
          <FormattedMessage
            id="password.code.enterCode"
            values={{ br: <br /> }}
          />
        </p>
        <div className="inputs">
          {this.state.code.map((value, index) => {
            return (
              <input
                key={index}
                ref={(input) => (this[`number${index}`] = input)}
                onChange={(e) => this.changeInput(e, index)}
                onClick={() => this.resetInput(index)}
                className={classnames(
                  "number",
                  { valid: this.state.code[index] !== "" ? true : false },
                  { invalid: this.state.showError }
                )}
                value={this.state.code[index]}
                autoFocus={index === 0 ? true : false}
                maxLength="1"
              />
            );
          })}
        </div>

        <div>
          {this.state.showSending === false ? (
            <div className="resend" onClick={() => this.resendCode()}>
              <FormattedMessage id="password.code.resend" />
            </div>
          ) : null}
          {this.state.showSending === true ? (
            <div className="sending">
              <FormattedMessage id="password.code.sent" />
            </div>
          ) : null}
        </div>

        {this.state.showError === true ? (
          <div className="error">
            <FormattedMessage
              id="password.code.error"
              values={{ br: <br /> }}
            />
          </div>
        ) : (
          <div className="error-space"></div>
        )}

        <div className="back-home">
          <Link to={buildUrl("LOGIN")} className="link-back-home">
            <FormattedMessage id="password.returnHome.Success" />
          </Link>
        </div>
      </div>
    );
  }
}

export default Code;
