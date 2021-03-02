import React, { useState, useEffect } from "react";
import "../../css/Login.outdated.scss";
import { FormattedMessage } from "react-intl";
import Bowser from "bowser";

function Outdated() {
  const [show, setShow] = useState(true);
  const [browser, setBrowser] = useState(null);

  useEffect(() => {
    setBrowser(Bowser.getParser(window.navigator.userAgent).getBrowserName());
  }, []);

  const hideWarning = () => {
    setShow(false);
  };

  return (
    <React.Fragment>
      {show === true ? (
        <div className="outdated">
          <div className="close" onClick={hideWarning}>
            X
          </div>
          <p>
            <span className="orange">
              <FormattedMessage
                id="login.outdated.line1"
                values={{ browser: browser }}
              />
            </span>
            <div className="br"></div>
            <FormattedMessage id="login.outdated.line2" />
          </p>
          <p>
            <FormattedMessage id="login.outdated.line3" />
            <strong>
              <FormattedMessage id="login.outdated.browsers" />
            </strong>
          </p>

          <div className="button" onClick={hideWarning}>
            <FormattedMessage id="login.outdated.button" />
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default Outdated;
