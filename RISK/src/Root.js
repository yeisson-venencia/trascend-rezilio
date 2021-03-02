import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import App from "./App"; // private app
import PublicApp from "./components/public/PublicApp"; // public app
import ErrorMessage from "./components/error/ErrorMessage"; // public app
import Login from "./components/login/Login"; // public app
import Password from "./components/password/Password"; // public app
import store from "./utils/store";
import Auth from "./utils/auth";
import { buildUrl, getUrl } from "./utils/UrlService";
import AuthCheck from "./utils/authcheck";
import history from "./utils/history";
import { injectIntl } from "react-intl";
import CreateProject from "./components/project/CreateProject";
import CreateGroup from "./components/groups/CreateGroup";
import EditProject from "./components/project/EditProject";
import ProjectDetail from "./components/project/ProjectDetail";
import EditGroup from "./components/groups/EditGroup";
import ListThreat from "./components/threat/ListThreat";
import AddThreat from "./components/threat/AddThreat";
import EditThreat from "./components/threat/EditThreat";
import ListSite from "./components/sites/ListSite";
import AddSite from "./components/sites/AddSite";
import EditSite from "./components/sites/EditSite";
import AddPlayer from "./components/players/AddPlayer";
import EditPlayer from "./components/players/EditPlayer";
import ListExposed from "./components/exposed/ListExposed";
import AddExposed from "./components/exposed/AddExposed";
import ListRisk from "./components/risk/ListRisk";
import AddRisk from "./components/risk/AddRisk";
import EditRisk from "./components/risk/EditRisk";
import AddColumn from "./components/columns/AddColumn";
import AddLevel from "./components/level/AddLevel";
import DirectImpacts from "./components/iframes/DirectImpacts";
import Interdependences from "./components/iframes/Interdependences";
import Simulator from "./components/iframes/Simulator";
import CascadeEffects from "./components/iframes/CascadeEffects";

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

          <PrivateRoute
            path={getUrl("CREATE_PROJECT")}
            auth={auth}
            component={CreateProject}
          />
          <Route
            path={getUrl("EDIT_PROJECT")}
            auth={auth}
            component={EditProject}
          />

          <Route
            path={getUrl("CREATE_GROUP")}
            auth={auth}
            component={CreateGroup}
          />
          <Route
            path={getUrl("EDIT_GROUP")}
            auth={auth}
            component={EditGroup}
          />

          <Route
            path={getUrl("CREATE_THREAT")}
            auth={auth}
            component={AddThreat}
          />

          <Route
            path={getUrl("EDIT_THREAT")}
            auth={auth}
            component={EditThreat}
          />
          <Route path={getUrl("CREATE_SITE")} auth={auth} component={AddSite} />

          <Route path={getUrl("EDIT_SITE")} auth={auth} component={EditSite} />
          <Route
            path={getUrl("CREATE_EXPOSED")}
            auth={auth}
            component={AddExposed}
          />

          <Route
            path={getUrl("EDIT_EXPOSED")}
            auth={auth}
            component={EditSite}
          />
          <Route
            path={getUrl("CREATE_PLAYER")}
            auth={auth}
            component={AddPlayer}
          />
          <Route
            path={getUrl("EDIT_PLAYER")}
            auth={auth}
            component={EditPlayer}
          />
          <Route path={getUrl("CREATE_RISK")} auth={auth} component={AddRisk} />
          <Route path={getUrl("EDIT_RISK")} auth={auth} component={EditRisk} />
          <Route
            path={getUrl("CREATE_COLUMN")}
            auth={auth}
            component={AddColumn}
          />
          <Route
            path={getUrl("CREATE_LEVEL")}
            auth={auth}
            component={AddLevel}
          />
          <Route path={getUrl("LIST_SITES")} auth={auth} component={ListSite} />
          <Route
            path={getUrl("DIRECT_IMPACTS")}
            auth={auth}
            component={DirectImpacts}
          />
          <Route
            path={getUrl("INTERDEPENDENCES")}
            auth={auth}
            component={Interdependences}
          />
          <Route path={getUrl("SIMULATOR")} auth={auth} component={Simulator} />
          <Route
            path={getUrl("CASCADE")}
            auth={auth}
            component={CascadeEffects}
          />
          <Route
            path={getUrl("LIST_THREATS")}
            auth={auth}
            component={ListThreat}
          />
          <Route path={getUrl("LIST_RISK")} auth={auth} component={ListRisk} />
          <Route path={getUrl("LIST_SITES")} auth={auth} component={ListSite} />
          <Route
            path={getUrl("LIST_EXPOSED")}
            auth={auth}
            component={ListExposed}
          />

          <Route
            path={getUrl("SHOW_PROJECT")}
            auth={auth}
            component={ProjectDetail}
          />
          {/* <Route path={getUrl("EDIT_THREAT")} auth={auth} component={ProjectDetail} /> */}

          {/* <PrivateRoute path={getUrl("EDIT_PROJECT")} auth={auth} component={EditProject} /> */}
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
