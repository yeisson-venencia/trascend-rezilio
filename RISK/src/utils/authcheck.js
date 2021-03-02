import React from "react";
import { withRouter } from "react-router-dom";
import history from "./history";
import { buildUrl } from "./UrlService";
import * as ACTIONS from "../store/actions/actions";
import { connect } from "react-redux";
import store from "./store";

class AuthCheck extends React.Component {
  componentDidMount = () => {
    const that = this;

    that.redirect();
  };

  redirect = () => {
    const that = this;

    if (that.props.auth.isFullAuthenticated()) {
      // login, redirect to homepage after
      that.props.login_success();
      that.props.add_profile(that.props.auth.profile);

      if (store.get("url") !== null && store.get("url") !== "/") {
        // if there is saved url navigate there right away
        history.replace(store.get("url"));
        store.remove("url");
      } else {
        // fallback homepage redirection]
        history.replace(buildUrl("HOME"));
      }
    } else {
      // logout, redirect to login page after
      that.props.login_failure();
      that.props.remove_profile();

      history.replace(buildUrl("LOGIN"));
    }
  };

  render = () => {
    return (
      <React.Fragment>
        <button onClick={this.redirect}>Redirect</button>
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    login_success: () => dispatch(ACTIONS.login_success()),
    login_failure: () => dispatch(ACTIONS.login_failure()),
    add_profile: (profile) => dispatch(ACTIONS.add_profile(profile)),
    remove_profile: () => dispatch(ACTIONS.remove_profile()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AuthCheck));
