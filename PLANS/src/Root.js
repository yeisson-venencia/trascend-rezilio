import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import App from "./App"; // private app
import PublicApp from "./components/public/PublicApp"; // public app
import ErrorMessage from "./components/error/ErrorMessage"; // public app
import Login from "./components/login/Login"; // public app
import SupportCollection from "./components/support/SupportCollection"; // public app
import Password from "./components/password/Password"; // public app
import store from "./utils/store";
import Auth from "./utils/auth";
import { buildUrl, getUrl } from "./utils/UrlService";
import AuthCheck from "./utils/authcheck";
import history from "./utils/history";
import { injectIntl } from "react-intl";

export const auth = new Auth();

const PrivateRoute = ({ component: Component, auth }) => (
  <Route
    render={(props) =>
      auth.isFullAuthenticated() === true ? (
        <Component auth={auth} {...props} />
      ) : (
        <Redirect
          to={{
            pathname: buildUrl("LOGIN"),
          }}
        />
      )
    }
  />
);

class Root extends React.Component {
  componentWillMount() {
    const { intl } = this.props;

    // change page title coming via translation file
    document.title = intl.formatMessage({ id: "page.title" });
  }

  componentDidMount() {
    // detect online status, show homepage
    window.addEventListener("online", function () {
      //window.location.replace('/')
      history.push(buildUrl("HOME"));
    });

    // detect offline status, show error
    window.addEventListener("offline", function () {
      history.push(buildUrl("ERROR"));
    });

    // enable error handling
    window.onerror = function (message, source, lineno, colno, error) {
      if (window.appConfig.trackErrors === true) {
        // send info to an endpoint
        let debug = {
          short_message: message,
          full_message: window.location.pathname + " " + JSON.stringify(error),
          _component: "index.onError",
        };

        store.set("info", JSON.stringify(debug));
      }

      // if we see a white page redirect to an error page
      if (
        document.getElementById("root").innerHTML.length === 0 &&
        window.appConfig.trackErrors === true
      ) {
        history.push(buildUrl("ERROR"));
        //window.location.replace('/error')
      }
    };
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <PrivateRoute path={getUrl("HOME")} auth={auth} component={App} />
          <Route path={getUrl("LOGIN")} render={() => <Login auth={auth} />} />
          <Route
            path={getUrl("RESET_PASSWORD")}
            render={() => <Password auth={auth} />}
          />
          <Route
            path={getUrl("AUTHCHECK")}
            render={() => <AuthCheck auth={auth} />}
          />
          <Route path={getUrl("ERROR")} render={() => <ErrorMessage />} />
          <Route path={getUrl("PUBLIC")} render={() => <PublicApp />} />
          <Route
            path={getUrl("SUPPORT")}
            render={() => <SupportCollection />}
          />
          {
            // language routes
            window.appConfig.lang.map(function (lang) {
              return (
                <Route
                  exact
                  key={lang}
                  path={getUrl("/") + lang}
                  render={() => <Login auth={auth} />}
                />
              );
            })
          }
          <Route render={() => <AuthCheck auth={auth} />} />
        </Switch>
      </Router>
    );
  }
}

export default injectIntl(Root);
