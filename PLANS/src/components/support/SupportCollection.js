import React from "react";
import { Link, withRouter } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SupportItem from "./SupportItem";
import HeaderBar from "../header/HeaderBar";
import FooterPrivate from "../footer/FooterPrivate";
import "../../App.scss";
import "./Support.scss";
import { FormattedMessage } from "react-intl";

class SupportCollection extends React.Component {
  render() {
    return (
      <div className="app">
        <HeaderBar />
        <div className="support">
          <div className="top-wrapper">
            <h1>
              <FormattedMessage id="support.title" />
            </h1>
          </div>
          <div className="collection">
            <SupportItem type="email" />
            <SupportItem type="chatbox" />
          </div>

          <div className="back-home">
            <Link to={buildUrl("HOME")} className="link-back-home">
              <FormattedMessage id="support.homePage" />
            </Link>
          </div>
        </div>
        <FooterPrivate />
      </div>
    );
  }
}

export default withRouter(SupportCollection);
