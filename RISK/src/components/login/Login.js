import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Bowser from "bowser";
import * as ACTIONS from "../../store/actions/actions";
import store from "../../utils/store";
import "../../css/Login.scss";
import TwoPanels from "../wrappers/TwoPanels";
import Form from "./Form";
import Welcome from "./Welcome";
import Code from "./Code";
import Outdated from "./Outdated";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.formStepSuccess = this.formStepSuccess.bind(this);
    this.codeStepSuccess = this.codeStepSuccess.bind(this);
    this.goBack = this.goBack.bind(this);

    this.state = {
      showForm: true,
      showCode: false,
      showWelcome: false,
      showOutdated: false,
    };
  }

  componentDidMount = () => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const isInvalidBrowser = browser.satisfies({
      "internet explorer": "<=11",
    });

    if (isInvalidBrowser === true) {
      this.setState({
        showOutdated: true,
      });
    }
  };

  formStepSuccess(username, password, type = "code") {
    const that = this;

    if (store.get("id_token") !== null) {
      // login without MFA
      that.setState({
        username: username,
        password: password,
        showForm: false,
        showCode: false,
        showWelcome: true,
      });

      that.loginComplete();
    } else {
      // login using MFA
      that.setState({
        username: username,
        password: password,
        showForm: false,
        showCode: true,
        showWelcome: false,
      });
    }
  }

  codeStepSuccess() {
    const that = this;

    that.setState({
      showForm: false,
      showCode: false,
      showWelcome: true,
    });

    that.loginComplete();
  }

  goBack() {
    const that = this;

    that.setState({
      showForm: true,
      showCode: false,
      showWelcome: false,
    });
  }

  loginComplete() {
    const that = this;

    that.props.auth.setProfile().then(function (result) {
      // redirect to home page
      that.props.login_success();
      that.props.add_profile(that.props.auth.profile);

      // decide where to redirect
      // uses landing page based on API response
      // for logbook or any other project redirect using window.replace...
      setTimeout(() => {
        that.props.history.replace(window.appConfig.URL.AUTHCHECK);
      }, 100);
    });
    /*
      .catch(function() {
        setTimeout(() => { that.props.history.replace(window.appConfig.URL.AUTHCHECK) }, 100)
      })
      */
  }

  render() {
    const that = this;

    return (
      <TwoPanels auth={that.props.auth}>
        <div className="login_e3b">
          {that.state.showOutdated === true ? <Outdated /> : null}

          <div className="mobile logo"></div>

          {that.state.showForm === true ? (
            <Form onSuccess={that.formStepSuccess} auth={that.props.auth} />
          ) : null}

          {that.state.showCode === true ? (
            <Code
              onSuccess={that.codeStepSuccess}
              goBack={that.goBack}
              auth={that.props.auth}
              username={that.state.username}
              password={that.state.password}
            />
          ) : null}

          {that.state.showWelcome === true ? <Welcome /> : null}
        </div>
      </TwoPanels>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    is_authenticated: state.auth.is_authenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login_success: () => dispatch(ACTIONS.login_success()),
    add_profile: (profile) => dispatch(ACTIONS.add_profile(profile)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
