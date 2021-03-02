import React from "react";
import { FormattedMessage } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import "../../css/Header.bar.scss";
import Languages from "../language/Languages";

class HeaderBar extends React.Component {
  render() {
    return (
      <div className="header-bar">
        <div className="logo">
          <Link to={buildUrl("LOGIN")}>
            <FormattedMessage id="page.title" />
          </Link>
        </div>
        <div className="right">
          <Languages />
        </div>
      </div>
    );
  }
}
export default withRouter(HeaderBar);
