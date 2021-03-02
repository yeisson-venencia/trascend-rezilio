import React from "react";
import { withRouter } from "react-router-dom";
import ApiService from "../../utils/ApiService";
import { endpoint, buildUrl } from "../../utils/UrlService";
import TwoPanels from "../wrappers/TwoPanels";
import Email from "./Email";
import Code from "./Code";
import NewPassword from "./NewPassword";
import Success from "./Success";

const Api = new ApiService();

class Password extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      secret: "",
      password: "",
      showEmail: true,
      showCode: false,
      showPassword: false,
      showSuccess: false,
    };
  }

  emailStepSuccess = (email) => {
    this.setState({
      email: email,
      showEmail: false,
      showCode: true,
      showPassword: false,
      showSuccess: false,
    });
  };

  codeStepSuccess = (secret) => {
    this.setState({
      showEmail: false,
      showCode: false,
      showPassword: true,
      showSuccess: false,
      secret: secret,
    });
  };

  passwordStepSuccess = (password) => {
    this.setState(
      {
        showEmail: false,
        showCode: false,
        showPassword: false,
        showSuccess: true,
        password: password,
      },
      this.resetPasswordComplete
    );
  };

  resetPasswordComplete = () => {
    // POST API new password
    let persist = {
      email: this.state.email,
      secret: this.state.secret,
      password: this.state.password,
    };

    Api.init(this.props.history);
    Api.post(endpoint("resetPassword"), persist)
      .then((res) => {
        if (res.status !== "success") {
          this.props.history.replace(buildUrl("ERROR") + "#api");
        }
      })
      .catch(function (err) {
        this.props.history.replace(buildUrl("ERROR") + "#api");
      });
  };

  render() {
    return (
      <TwoPanels auth={this.props.auth}>
        <div className="password">
          <div className="mobile logo"></div>

          {this.state.showEmail === true ? (
            <Email onSuccess={this.emailStepSuccess} />
          ) : null}

          {this.state.showCode === true ? (
            <Code onSuccess={this.codeStepSuccess} email={this.state.email} />
          ) : null}

          {this.state.showPassword === true ? (
            <NewPassword
              onSuccess={this.passwordStepSuccess}
              email={this.state.email}
            />
          ) : null}

          {this.state.showSuccess === true ? <Success /> : null}
        </div>
      </TwoPanels>
    );
  }
}

export default withRouter(Password);
