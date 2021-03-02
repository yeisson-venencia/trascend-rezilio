import React from "react";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import Loader from "../Loader";

class Welcome extends React.Component {
  render() {
    return (
      <div className="welcome">
        <h1>
          <FormattedMessage id="login.welcome.title" />
        </h1>
        <p>
          <FormattedMessage id="login.welcome.text" />
        </p>
        <Loader wrapper={true} />
      </div>
    );
  }
}

export default Welcome;
