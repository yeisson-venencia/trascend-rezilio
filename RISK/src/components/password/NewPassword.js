import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import classnames from "classnames";
import { withRouter, Link } from "react-router-dom";
import Loader from "../Loader";
import { buildUrl } from "../../utils/UrlService";
import "../../css/Password.scss";

class newPassword extends Component {
  state = {
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    errorPassword: false,
    errorConfirmPassword: false,
    formSent: false,
    errorForm: false,
    rules: ["letters", "numbers", "special", "length"],
    valid: [false, false, false, false],
  };

  onFormSubmit = (e) => {
    e.preventDefault();

    if (this.state.password === "") {
      this.setState({
        errorPassword: true,
        errorForm: true,
      });

      if (this.state.confirmPassword === "") {
        this.setState({
          errorConfirmPassword: true,
        });
      }
    } else {
      if (this.validateForm(this.state.password) === true) {
        if (this.state.confirmPassword === "") {
          this.setState({
            errorPassword: false,
            errorConfirmPassword: true,
            errorForm: true,
          });
        } else {
          if (this.state.password !== this.state.confirmPassword) {
            // passwords not match
            this.setState({
              errorConfirmPassword: true,
              errorForm: true,
            });
          } else {
            this.setState({
              errorPassword: false,
              errorConfirmPassword: false,
              formSent: true,
              errorForm: false,
            });

            // send data to parent component
            this.props.onSuccess(this.state.password);
          }
        }
      } else {
        // password not valid
        this.setState({
          errorPassword: true,
          errorForm: true,
        });
      }
    }
  };

  validateForm = (password) => {
    let regPasswordLetters = /([a-z].*[A-Z])|([A-Z].*[a-z])/;
    let regPasswordNumbers = /[0-9]/;
    let regPasswordSpecial = /[!,%,&,@,#,$,^,*,?,_,~]/;
    let regPasswordLength = /.{10,}/;
    let valid = [];
    this.state.rules.map((item, index) => {
      if (item === "letters") {
        valid.splice(index, 1, regPasswordLetters.test(password));
      }

      if (item === "numbers") {
        valid.splice(index, 1, regPasswordNumbers.test(password));
      }

      if (item === "special") {
        valid.splice(index, 1, regPasswordSpecial.test(password));
      }

      if (item === "length") {
        valid.splice(index, 1, regPasswordLength.test(password));
      }
      return valid;
    });

    this.setState({
      valid: valid,
    });

    let trueValues = this.state.valid.filter(function (item) {
      return item === true;
    }).length;

    if (trueValues === this.state.valid.length) {
      return true;
    }
    return false;
  };

  onChangePassword = (e) => {
    let password = e.target.value;

    this.setState({
      password: password,
      errorPassword: false,
      errorForm: false,
    });

    this.validateForm(password);
  };

  togglePassword = () => {
    if (this.state.showPassword === true) {
      this.setState({
        showPassword: false,
      });
    } else {
      this.setState({
        showPassword: true,
      });
    }
  };

  onChangeConfirmPassword = (e) => {
    this.setState({
      confirmPassword: e.target.value,
      errorConfirmPassword: false,
      errorForm: false,
    });
  };

  toggleConfirmPassword = () => {
    if (this.state.showConfirmPassword === true) {
      this.setState({
        showConfirmPassword: false,
      });
    } else {
      this.setState({
        showConfirmPassword: true,
      });
    }
  };

  render = () => {
    const { intl } = this.props;

    let reliabilityPassword = "",
      passwordClass = "",
      confirmPasswordClass = "",
      errorMessage = "";

    let nbrConstraintsValid = this.state.valid.filter(function (item) {
      return item === true;
    }).length;

    let lengthValid = this.state.valid.length;

    if (this.state.password.length > 0) {
      passwordClass = "filled";
    }

    if (this.state.confirmPassword.length > 0) {
      confirmPasswordClass = "filled";
    }

    if (nbrConstraintsValid === lengthValid) {
      reliabilityPassword = "strong";
    }

    if (nbrConstraintsValid === lengthValid - 1) {
      reliabilityPassword = "average";
    }

    if (this.state.errorForm === true && nbrConstraintsValid === 0) {
      reliabilityPassword = "weak";
    }

    if (
      nbrConstraintsValid < lengthValid - 1 &&
      this.state.password.length > 0
    ) {
      reliabilityPassword = "weak";
    }

    if (this.state.errorForm) {
      if (this.state.password === "") {
        errorMessage = "password.missingPassword";
      } else {
        if (nbrConstraintsValid === lengthValid) {
          if (this.state.confirmPassword === "") {
            errorMessage = "password.missingConfirmationPassword";
          } else {
            if (this.state.confirmPassword !== this.state.password) {
              errorMessage = "password.confirmPasswordInvalid";
            }
          }
        } else {
          errorMessage = "password.minCharactersConstraints";
        }
      }
    }

    return (
      <div className="new-password">
        <div className="title">
          <FormattedMessage id="password.newpassword" />
        </div>
        <form onSubmit={this.onFormSubmit}>
          <div className="offset">
            <div className="label-password">
              <FormattedMessage id="password.enterpassword" />
            </div>

            <input
              onChange={this.onChangePassword}
              type={this.state.showPassword === true ? "text" : "password"}
              className={classnames(
                "form-new-password",
                "password",
                passwordClass,
                { invalid: this.state.errorPassword }
              )}
              value={this.state.password}
              placeholder={intl.formatMessage({
                id: "password.placeholder.password",
              })}
              autoComplete="new-password"
            />

            <div
              className={classnames("toggle-password", passwordClass, {
                open: this.state.showPassword,
              })}
              onClick={() => this.togglePassword()}
            ></div>

            <div className="constraints-password">
              {this.state.rules.map((value, key) => {
                let icon = "invalid";
                if (this.state.valid[key] === true) {
                  icon = "valid";
                }
                return (
                  <div className={classnames("password-icon", icon)} key={key}>
                    <FormattedMessage id={"password.constraints." + value} />
                  </div>
                );
              })}
            </div>

            <div
              className={classnames(
                "password-reliability",
                reliabilityPassword
              )}
            >
              <FormattedMessage id="password.reliability" />
              {reliabilityPassword !== "" ? (
                <p className="p-reliability-password">
                  <FormattedMessage
                    id={"password.reliability." + reliabilityPassword}
                  />
                </p>
              ) : null}
            </div>

            <div className="label-password">
              <FormattedMessage id="password.confirm.newpassword" />
            </div>

            <input
              onChange={this.onChangeConfirmPassword}
              type={
                this.state.showConfirmPassword === true ? "text" : "password"
              }
              className={classnames(
                "form-new-password",
                "password",
                confirmPasswordClass,
                { invalid: this.state.errorConfirmPassword }
              )}
              value={this.state.confirmPassword}
              placeholder={intl.formatMessage({
                id: "password.placeholder.password",
              })}
              autoComplete="new-password"
            />

            <div
              className={classnames("toggle-password", confirmPasswordClass, {
                open: this.state.showConfirmPassword,
              })}
              onClick={() => this.toggleConfirmPassword()}
            ></div>
          </div>

          {this.state.errorForm === true ? (
            <div className="error-password">
              <FormattedMessage id={errorMessage} />
            </div>
          ) : (
            <div className="error-space"></div>
          )}

          {this.state.formSent === false ? (
            <React.Fragment>
              <button type="submit" className="button-submit">
                <FormattedMessage id="password.confirm" />
              </button>
              <div className="back-home">
                <Link to={buildUrl("LOGIN")} className="link-back-home">
                  <FormattedMessage id="password.returnHome.Success" />
                </Link>
              </div>
            </React.Fragment>
          ) : (
            <div className="processing">
              <div className="processing-loader">
                <Loader wrapper={true} />
              </div>
              <div className="processing-message">
                <FormattedMessage id="password.processing" />
              </div>
            </div>
          )}
        </form>
      </div>
    ); // return
  }; // render
} // component

export default injectIntl(withRouter(newPassword));
