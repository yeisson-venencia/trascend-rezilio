import React from "react";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import { buildUrl } from "../../utils/UrlService";
import { FormattedMessage, injectIntl } from "react-intl";
import "../../css/Login.scss";
import Loader from "../Loader";
import store from "../../utils/store";

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.togglePassword = this.togglePassword.bind(this);

    this.state = {
      showWelcome: true,
      showInactivity: false,
      username: "",
      password: "",
      showPassword: false,
      formSent: false,
      showError: false,
      usernameError: false,
      passwordError: false,
    };
  }

  componentDidMount() {
    const that = this;

    if (store.get("username") !== null) {
      that.setState({
        username: store.decrypt("username"),
      });
    }

    if (that.props.location.hash === "#inactivity") {
      that.setState({
        showWelcome: false,
        showInactivity: true,
      });
    }
  }

  onFormSubmit(e) {
    const that = this;
    const { intl } = that.props;

    let locale = intl.formatMessage({
      id: "locale_full",
    });

    e.preventDefault();

    if (that.validateForm() === true) {
      that.setState({
        formSent: true,
      });

      that.props.auth
        .login(
          that.usernameRef.current.value,
          that.passwordRef.current.value,
          locale
        )
        .then(function (result) {
          that.setState({
            formSent: false,
          });

          // save username for next time
          store.encrypt("username", that.state.username);

          that.props.onSuccess(that.state.username, that.state.password);
        })
        .catch(function () {
          // throw error message
          that.setState({
            formSent: false,
            showError: true, // backend error
            usernameError: true,
            passwordError: true,
          });
        });
    } else {
      that.setState({
        showError: true, // front-end validation
      });
    }
  }

  validateForm() {
    const that = this;

    let regUsername = /^[@\.\-\_a-zA-Z0-9]{3,99}$/,
      regPassword = /^[\s\S]{8,64}$/;

    let error_fields_username = false,
      error_fields_password = false;

    // validate fields
    if (that.state.username === "") {
      error_fields_username = true;
    }

    if (regUsername.test(that.state.username) === false) {
      error_fields_username = true;
    }

    if (that.state.password === "") {
      error_fields_password = true;
    }

    if (regPassword.test(that.state.password) === false) {
      error_fields_password = true;
    }

    that.setState({
      usernameError: error_fields_username,
      passwordError: error_fields_password,
    });

    // global true ? false
    if (error_fields_username === true || error_fields_password === true) {
      return false;
    }
    return true;
  }

  changeInput() {
    const that = this;

    that.setState({
      username: that.usernameRef.current.value,
      password: that.passwordRef.current.value,
      showError: false,
      usernameError: false,
      passwordError: false,
    });
  }

  togglePassword() {
    const that = this;

    if (that.state.showPassword === true) {
      that.setState({
        showPassword: false,
      });
    } else {
      that.setState({
        showPassword: true,
      });
    }
  }

  render() {
    const that = this;
    const { intl } = that.props;

    // focus & filled classes
    let usernameClass = "",
      passwordClass = "";

    if (that.state.username.length > 0) {
      usernameClass = "filled";
    }
    if (that.state.password.length > 0) {
      passwordClass = "filled";
    }

    return (
      <div className="form">
        {that.state.showWelcome === true ? (
          <h1>
            <FormattedMessage id="login.welcome" />
          </h1>
        ) : null}

        {that.state.showInactivity === true ? (
          <React.Fragment>
            <h1 className="inactivity">
              <FormattedMessage id="login.inactivity" />
            </h1>
            <p className="inactivity-text">
              <FormattedMessage id="login.inactivity.text" />
            </p>
          </React.Fragment>
        ) : null}

        <form onSubmit={that.onFormSubmit}>
          <div className="offset">
            <div className="form-label">
              <FormattedMessage id="login.placeholder.username" />
            </div>
            <input
              onChange={() => that.changeInput()}
              type="text"
              ref={that.usernameRef}
              className={classnames("form-input", "username", usernameClass, {
                invalid: that.state.usernameError,
              })}
              placeholder={intl.formatMessage({
                id: "login.placeholder.username",
              })}
              value={that.state.username}
              autoComplete="new-password"
            />

            <div className="form-label">
              <FormattedMessage id="login.placeholder.password" />
            </div>
            <input
              onChange={() => that.changeInput()}
              type={that.state.showPassword === true ? "text" : "password"}
              ref={that.passwordRef}
              className={classnames("form-input", "password", passwordClass, {
                invalid: that.state.passwordError,
              })}
              placeholder={intl.formatMessage({
                id: "login.placeholder.password",
              })}
              autoComplete="new-password"
            />

            <div
              className={classnames("toggle-password", passwordClass, {
                open: that.state.showPassword,
              })}
              onClick={() => that.togglePassword()}
            ></div>

            <div className="forgot-password">
              <Link to={buildUrl("RESET_PASSWORD")}>
                <FormattedMessage id="login.forgot_password" />
              </Link>
            </div>
          </div>

          {that.state.showError === true ? (
            <div className="error">
              <FormattedMessage id="login.error" values={{ br: <br /> }} />
            </div>
          ) : (
            <div className="error-space"></div>
          )}

          {that.state.formSent === false ? (
            <button type="submit" className="submit">
              <FormattedMessage id="login.button.submit" />
            </button>
          ) : (
            <Loader wrapper={true} />
          )}
        </form>
      </div>
    );
  }
}

export default injectIntl(withRouter(Form));
