import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as ACTIONS from "../../store/actions/actions";
import store from "../../utils/store";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import "./TwoPanels.scss";
import { getUrl } from "../../utils/UrlService";
import FooterPublic from "../footer/FooterPublic";
import FooterMobile from "../footer/FooterMobile";
import Languages from "../language/Languages";

class TwoPanels extends React.Component {
  constructor(props) {
    super(props);

    this.toggleLang = this.toggleLang.bind(this);

    this.state = {
      showLang: false,
    };
  }

  componentDidMount() {
    const that = this;
    const { intl } = that.props;

    // if you are already logged in redirect to homepage
    if (that.props.auth.isFullAuthenticated() === true) {
      that.props.login_success();
      that.props.add_profile(that.props.auth.profile);
      that.props.history.replace(getUrl("HOME"));
    }

    // detect if a locale is passed
    let url = that.props.location.pathname
      .replace(getUrl("LOGIN"), "")
      .replace("/", "");

    if (url && url.length > 0) {
      const lang = window.appConfig.lang.find(function (item) {
        if (item.includes(url)) {
          return true;
        }
        return false;
      });

      if (lang !== undefined && lang !== intl.formatMessage({ id: "lang" })) {
        that.changeLang(lang);
      }
    }
  }

  toggleLang(val) {
    this.setState({
      showLang: val,
    });
  }

  changeLang(locale) {
    const that = this;

    store.set("locale", locale);
    that.props.history.push(getUrl("LOGIN"));
    that.props.history.go();
  }

  render() {
    const that = this;

    return (
      <div className="container-fluid full">
        <div className={classnames("row", "no-gutters", "two_panels")}>
          <div className={classnames("d-lg-none", "col-12", "lang_mobile")}>
            <Languages callback={that.toggleLang} auth={false} />
          </div>

          <div className={classnames("col-xs-12", "col-lg-5", "side_wrapper")}>
            {/* renders whats inside the component calling TwoPanels */}
            {that.props.children}
          </div>

          <div
            className={classnames(
              "d-none",
              "d-lg-inline-flex",
              "col-lg-7",
              "main_wrapper"
            )}
          >
            {that.state.showLang === true ? <div className="bcg"></div> : null}

            <div className="top">
              <Languages callback={that.toggleLang} auth={false} />
            </div>

            <div className="center"></div>

            <div className="bottom">
              <FooterPublic />
            </div>
          </div>

          <div className={classnames("d-lg-none", "col-12")}>
            <FooterMobile />
          </div>
        </div>
      </div>
    );
  }
}

TwoPanels.propTypes = {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(withRouter(TwoPanels)));
