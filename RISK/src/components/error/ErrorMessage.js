import React from "react";
import { Link, withRouter } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import Loader from "../Loader";
import "../../css/ErrorMessage.scss";
import { injectIntl, FormattedMessage } from "react-intl";
import store from "../../utils/store";
import moment from "moment";
import request from "superagent";

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      error: "default", // goes to render switch default case
    };
  }

  componentDidMount() {
    const that = this;

    let hash = "";

    // decide what error page to show (based on hash in the url)
    if (that.props.location.hash && that.props.location.hash.length > 0) {
      hash = that.props.location.hash.replace("#", "");
    }

    if (window.appConfig.trackErrors === true) {
      // three main objects to get all info about the error

      let stateObj, storeObj, debugObj;

      if (that.props.location.state !== undefined) {
        // if an object as message is passed
        // message is passed when using try-catch somewhere in the app
        stateObj = that.props.location.state;
      }

      if (store.get("info") !== undefined) {
        storeObj = JSON.parse(store.get("info"));
      }

      debugObj = {
        version: window.appConfig.ver,
        host: window.location.host,
        ip: store.get("ip"),
        short_message:
          window.location.pathname + "#" + hash + " error page displayed",
        full_message: "",
        timestamp: moment().unix(),
        level: 1,
        _component: "ErrorGeneral",
      };

      if (store.get("profile") !== null) {
        let user = JSON.parse(store.get("profile"));

        debugObj = {
          ...debugObj,
          _user: user.user.email,
          _user_id: user.user.id,
          _org_id: user.user.organisationId,
          _bearer: store.get("id_token"),
        };
      }

      debugObj = {
        ...debugObj,
        ...stateObj,
        ...storeObj,
      };

      request
        .post(window.appConfig.endpoints.greylog)
        .send(debugObj)
        .then(function (res) {
          store.remove("info");
        })
        .catch(function (e) {
          console.log("error", e);
        });
    }

    that.setState({
      isLoaded: true,
      error: hash,
    });
  }

  render() {
    const that = this;
    const { isLoaded } = that.state;

    if (!isLoaded) {
      return <Loader />;
    } else {
      let content;

      switch (that.state.error) {
        case "login":
          store.remove("id_token");
          store.remove("profile");
          store.remove("url");

          content = (
            <div className="content">
              <h1 className="message">
                <FormattedMessage id="error.login.message" />
              </h1>
              <p className="reason">
                <FormattedMessage id="error.login.reason" />
              </p>
              <p className="resolution">
                <FormattedMessage
                  id="error.login.resolution"
                  values={{
                    link: (chunks) => (
                      <a href={<FormattedMessage id="error.email.link" />}>
                        {chunks}
                      </a>
                    ),
                  }}
                />
              </p>

              <Link className="button" to={buildUrl("LOGIN")}>
                <FormattedMessage id="error.login.button" />
              </Link>
            </div>
          );
          break;
        case "expire":
          store.remove("id_token");
          store.remove("profile");
          store.remove("url");

          content = (
            <div className="content">
              <h1 className="message">
                <FormattedMessage id="error.expire.message" />
              </h1>
              <p className="reason">
                <FormattedMessage id="error.expire.reason" />
              </p>
              <p className="resolution">
                <FormattedMessage
                  id="error.expire.resolution"
                  values={{
                    link: (chunks) => (
                      <a href={<FormattedMessage id="error.email.link" />}>
                        {chunks}
                      </a>
                    ),
                  }}
                />
              </p>

              <Link className="button" to={buildUrl("LOGIN")}>
                <FormattedMessage id="error.expire.button" />
              </Link>
            </div>
          );
          break;
        case "noaccess":
          store.remove("url");

          content = (
            <div className="content">
              <h1 className="message">
                <FormattedMessage id="error.noaccess.message" />
              </h1>
              <p className="reason">
                <FormattedMessage id="error.noaccess.reason" />
              </p>
              <p className="resolution">
                <FormattedMessage
                  id="error.noaccess.resolution"
                  values={{
                    link: (chunks) => (
                      <a href={<FormattedMessage id="error.email.link" />}>
                        {chunks}
                      </a>
                    ),
                  }}
                />
              </p>

              <Link className="button" to={buildUrl("HOME")}>
                <FormattedMessage id="error.noaccess.button" />
              </Link>
            </div>
          );
          break;
        case "api":
          store.remove("url");

          content = (
            <div className="content">
              <h1 className="message">
                <FormattedMessage id="error.default.message" />
              </h1>
              <p className="reason">
                <FormattedMessage id="error.default.reason" />
              </p>
              <p className="resolution">
                <FormattedMessage
                  id="error.default.resolution"
                  values={{
                    link: (chunks) => (
                      <a href={<FormattedMessage id="error.email.link" />}>
                        {chunks}
                      </a>
                    ),
                  }}
                />
              </p>

              <Link className="button" to={buildUrl("HOME")}>
                <FormattedMessage id="error.default.button" />
              </Link>
              <Link className="button" to={buildUrl("LOGIN")}>
                <FormattedMessage id="error.default.button2" />
              </Link>
            </div>
          );
          /*
          content = (
            <div>
              <h1 className="message"><FormattedMessage id="error.api.message" /></h1>
              <p className="reason"><FormattedMessage id="error.api.reason" /></p>
              <p className="resolution"><FormattedHTMLMessage id="error.api.resolution" /></p>
              
              <Link className="button" to={ buildUrl('LOGIN') }>
                <FormattedMessage id="error.api.button" />
              </Link>
            </div>
          )
          */
          break;
        case "404":
          store.remove("url");

          content = (
            <div className="content">
              <h1 className="message">
                <FormattedMessage id="error.404.message" />
              </h1>
              <p className="reason">
                <FormattedMessage id="error.404.reason" />
              </p>
              <p className="resolution">
                <FormattedMessage
                  id="error.404.resolution"
                  values={{
                    link: (chunks) => (
                      <a href={<FormattedMessage id="error.email.link" />}>
                        {chunks}
                      </a>
                    ),
                  }}
                />
              </p>

              <Link className="button" to={buildUrl("HOME")}>
                <FormattedMessage id="error.404.button" />
              </Link>
            </div>
          );
          break;
        default:
          //store.remove('profile')

          content = (
            <div className="content">
              <h1 className="message">
                <FormattedMessage id="error.default.message" />
              </h1>
              <p className="reason">
                <FormattedMessage id="error.default.reason" />
              </p>
              <p className="resolution">
                <FormattedMessage id="error.default.resolution" />
              </p>

              <Link className="button" to={buildUrl("HOME")}>
                <FormattedMessage id="error.default.button" />
              </Link>
              <Link className="button" to={buildUrl("LOGIN")}>
                <FormattedMessage id="error.default.button2" />
              </Link>
            </div>
          );
      } // switch

      return (
        <div className="container-fluid full">
          <div className="error-message">
            <div className="row no-gutters bar">
              <div className="col-3">
                <a href={buildUrl("/")} className="logo">
                  <FormattedMessage id="page.title" />
                </a>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-12 col-md-6">{content}</div>
              <div className="col-12 col-md-6">
                <div className="graphic"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(injectIntl(ErrorMessage));
