import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import store from "./utils/store";
import HeaderPrivate from "./components/header/HeaderPrivate";
import Home from "./components/Home";
import MFA from "./components/mfa/MFA";
import PlanCollection from "./components/plan/listing/PlanCollection";
import PlanSections from "./components/plan/detail/PlanSections";
import PlanSearch from "./components/plan/search/PlanSearch";
import Publications from "./components/publication/Publications";
import Timeout from "./components/login/Timeout";
import FooterPrivate from "./components/footer/FooterPrivate";
import { connect } from "react-redux";
import { getUrl } from "./utils/UrlService";
import ModalWarning from "./components/common/Modal/ModalWarning";
import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    this.showWarning = this.showWarning.bind(this);
    this.hideWarning = this.hideWarning.bind(this);
    this.logout = this.logout.bind(this);
    this.resetTimeout = this.resetTimeout.bind(this);

    this.state = {
      showWarning: false,
    };
  }

  componentDidMount() {
    const that = this;

    that.setListeners();
  }

  componentWillUnmount() {
    // Cleanup
    this.cleanup();
  }

  setListeners() {
    const that = this;

    for (var i in that.events) {
      window.addEventListener(that.events[i], that.resetTimeout);
    }

    that.setTimeout();
  }

  clearTimeout() {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);
  }

  setTimeout() {
    const that = this;

    that.warnTimeout = setTimeout(
      that.showWarning,
      that.props.profile.inactivityTimeout
    );
  }

  resetTimeout() {
    this.clearTimeout();
    this.setListeners();
  }

  showWarning() {
    this.setState({
      showWarning: true,
    });

    this.cleanup();
  }

  hideWarning() {
    this.setState({
      showWarning: false,
    });

    this.resetTimeout();
  }

  cleanup() {
    clearTimeout();

    for (var i in this.events) {
      window.removeEventListener(this.events[i], this.resetTimeout);
    }
  }

  logout() {
    const that = this;

    // save the url for future landing
    store.set("url", window.location.pathname + window.location.hash);
    that.props.auth.logout("inactivity");

    // Cleanup
    that.cleanup();
  }

  render() {
    const that = this;

    return (
      <div>
        <HeaderPrivate auth={that.props.auth} />

        <ModalWarning />

        <div className="app">
          <Switch>
            <Route
              exact
              path={getUrl("HOME")}
              auth={that.props.auth}
              component={Home}
            />

            <Route
              exact
              path={getUrl("MFA")}
              auth={that.props.auth}
              component={MFA}
            />

            <Route
              exact
              path={getUrl("PLANS")}
              auth={that.props.auth}
              component={PlanCollection}
            />

            <Route
              exact
              path={getUrl("PLAN")}
              auth={that.props.auth}
              component={PlanSections}
            />

            <Route
              exact
              path={getUrl("PLAN_SEARCH")}
              auth={that.props.auth}
              component={PlanSearch}
            />

            <Route
              exact
              path={getUrl("PUBLICATIONS")}
              auth={that.props.auth}
              component={Publications}
            />

            <Route>
              <Redirect to={getUrl("ERROR") + "#404"} />
            </Route>
          </Switch>
        </div>

        <div id="modal"></div>

        <FooterPrivate />

        {that.state.showWarning === true ? (
          <Timeout hideWarning={that.hideWarning} logout={that.logout} />
        ) : null}
      </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(App);
