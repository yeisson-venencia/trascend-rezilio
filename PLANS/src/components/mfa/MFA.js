import React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUrl } from "../../utils/UrlService";
import store from "../../utils/store";
import CopyFR from "./CopyFR";
import CopyEN from "./CopyEN";

import "./MFA.scss";

class MFA extends React.Component {
  clickAgree = () => {
    // update first load
    this.props.profile.mfa.firstLoad = 0;
    store.set("profile", JSON.stringify(this.props.profile));

    this.props.history.push(getUrl("HOME"));
  };

  render = () => {
    let lang = this.props.intl.formatMessage({
      id: "lang",
    });

    return (
      <div className="container max mfa-layout">
        {lang === "fr" && (
          <CopyFR mfa={this.props.profile.mfa} agree={this.clickAgree} />
        )}
        {lang === "en" && (
          <CopyEN mfa={this.props.profile.mfa} agree={this.clickAgree} />
        )}
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(injectIntl(MFA)));
