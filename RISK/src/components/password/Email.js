import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { buildUrl, endpoint } from "../../utils/UrlService";
import classnames from "classnames";
import ApiService from "../../utils/ApiService";
import "../../css/Password.scss";

const Api = new ApiService();

class Email extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      errorEmail: false,
      showLoading: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      email: e.target.value,
      errorEmail: false,
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();

    if (this.state.email === "") {
      this.setState({
        errorEmail: true,
      });
    } else {
      if (this.validateForm() === true) {
        this.setState({
          showLoading: true,
        });

        // api to triger MFA code
        let persist = {
          email: this.state.email,
        };
        Api.init(this.props.history);
        Api.post(endpoint("forgotPassword"), persist)
          .then((res) => {
            if (res.status === "Success") {
              this.props.onSuccess(this.state.email);
            } else {
              // no email found
              this.props.history.replace(buildUrl("ERROR") + "#api");
            }
          })
          .catch(function (err) {
            this.props.history.replace(buildUrl("ERROR") + "#api");
          });
      } else {
        this.setState({
          errorEmail: true,
        });
      }
    }
  };

  validateForm = () => {
    let regEmail = /^[-a-z0-9!#$%&\'*+\/=?^_`{|}~]+(\.[-a-z0-9!#$%&\'*+\/=?^_`{|}~]+)*@(([a-z0-9]([-a-z0-9]*[a-z0-9]+)?){1,63}\.)+([a-z0-9]([-a-z0-9]*[a-z0-9]+)?){2,63}$/i;
    let isValid = false;
    if (regEmail.test(this.state.email) === true) {
      this.setState({
        errorEmail: false,
      });
      isValid = true;
    } else {
      this.setState({
        errorEmail: true,
      });
      isValid = false;
    }

    return isValid;
  };

  render() {
    const { intl } = this.props;

    let emailClass = "";
    if (this.state.email.length > 0) {
      emailClass = "filled";
    }

    return (
      <div className="email">
        <h1>
          <FormattedMessage id="password.title" />
        </h1>
        <form onSubmit={this.onFormSubmit}>
          <div className="form-label">
            <FormattedMessage id="password.enterEmail" />
          </div>

          <input
            onChange={this.handleChange}
            type="text"
            className={classnames(
              "form-input-email",
              classnames("email-icon"),
              emailClass,
              { invalid: this.state.errorEmail }
            )}
            value={this.state.email}
            placeholder={intl.formatMessage({
              id: "password.placeholder.email",
            })}
          />

          {this.state.errorEmail === true ? (
            <div className="error-email">
              <FormattedMessage id="password.errorEmail" />
            </div>
          ) : (
            <div className="error-space"></div>
          )}

          <button type="submit" className="button-submit">
            <FormattedMessage id="password.button.submit" />
          </button>

          <div className="back-home">
            <Link to={buildUrl("LOGIN")} className="link-back-home">
              <FormattedMessage id="password.returnHome.Success" />
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(withRouter(Email));
