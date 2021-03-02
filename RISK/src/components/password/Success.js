import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import "../../css/Password.scss";

class Success extends React.Component {
  render() {
    return (
      <div className="success">
        <div className="title-success">
          <FormattedMessage
            id="password.titleSuccess"
            values={{ br: <br /> }}
          />
        </div>
        <div className="logo-success"></div>
        <Link to={buildUrl("LOGIN")} className="back-home">
          <FormattedMessage id="password.returnHome.Success" />
        </Link>
      </div>
    );
  }
}

export default Success;
