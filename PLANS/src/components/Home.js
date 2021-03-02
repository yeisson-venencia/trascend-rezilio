import React from "react";
import { getUrl } from "../utils/UrlService";
import { withRouter } from "react-router-dom";
import "./Home.scss";
import { connect } from "react-redux";
//import SettingsDocs from "./_docs/SettingsDocs";
//import PermissionsDocs from "./_docs/PermissionsDocs";

class Home extends React.Component {
  componentDidMount() {
    if (
      this.props.profile.mfa !== undefined &&
      this.props.profile.mfa.firstLoad === 1
    ) {
      this.props.history.push(getUrl("MFA"));
    } else {
      this.props.history.push(getUrl("PLANS"));
    }
  }

  render() {
    const that = this;

    return (
      <div className="home">
        <h1>Homepage</h1>
        You are logged in as {that.props.profile.user.name}
        <br />
        {/*
        <SettingsDocs />
        <PermissionsDocs />
        */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(Home));
