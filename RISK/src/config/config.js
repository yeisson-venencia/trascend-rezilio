window.appConfig = {
  env: "local",
  api: {
    url: "https://api-testing.rezilio.net",
    v1: "https://api-testing.rezilio.net/api/v1",
    v2: "https://api-testing.rezilio.net/api/v2",
    v3: "https://risk-module-api.herokuapp.com/api/v1",
  },
  trackErrors: true,
  responseErrors: 30 * 1000,
  deadlineErrors: 120 * 1000,
  inactivityTimeout: 30 * 60 * 1000,
  logoutTimeout: 60 * 1000,
};

// specify all endpoints
window.appConfig.setEndpoints = function () {
  window.appConfig.endpoints = {
    token: window.appConfig.api.v1 + "/login-check",
    forgotPassword: window.appConfig.api.v1 + "/no-pass-check",
    resetPassword: window.appConfig.api.v1 + "/profile/reset-password",
    userInfo: window.appConfig.api.v1 + "/profile/me.jsonld?trxId={trxId}",
    logout: window.appConfig.api.v1 + "/logout",
    greylog: "https://logsys.rezilio.net:12202/gelf",
    sites: window.appConfig.api.v3 + "/sites",
    getSites: window.appConfig.api.v3 + "/projects/{id1}/sites?page={id2}",
    editSites: window.appConfig.api.v3 + "/sites/{id1}",
    delSites: window.appConfig.api.v3 + "/sites/{id1}",
    players: window.appConfig.api.v3 + "/players",
    editPlayer: window.appConfig.api.v3 + "/players/{id1}",
    getPlayers: window.appConfig.api.v3 + "/sites/{id1}/players",
    delPlayer: window.appConfig.api.v3 + "/players/{id1}",
    addProject: window.appConfig.api.v3 + "/projects",
    projects: window.appConfig.api.v3 + "/projects/{id1}",
    getProjects: window.appConfig.api.v3 + "/projects?page={id1}",
    delProject: window.appConfig.api.v3 + "/projects/{id1}",
    editProject: window.appConfig.api.v3 + "/projects/{id1}",
    getSectors: window.appConfig.api.v3 + "/sectors?page={id1}",
    groups: window.appConfig.api.v3 + "/groups",
    delGroup: window.appConfig.api.v3 + "/groups/{id1}"
  };
};

window.appConfig.setEndpoints();

window.appConfig.URL = {
  "/": "/",
  PUBLIC: "/public",
  LOGIN: "/login",
  SUPPORT: "/support",
  404: "/404",
  AUTHCHECK: "/authcheck",
  ERROR: "/error",
  HOME: "/app",
  CREATE_PROJECT: "/projects/new",
  CREATE_GROUP: "/projects/:id/groups/new",
  EDIT_GROUP: "/groups/edit/:id",
  EDIT_PROJECT: "/projects/edit/:id",
  SHOW_PROJECT: "/projects/:id",
  LIST_THREATS: "/projects/:id/threats",
  CREATE_THREAT: "/projects/:id/threats/new",
  EDIT_THREAT: "/threats/edit/:id",
  LIST_SITES: "/projects/:id/sites",
  CREATE_SITE: "/projects/:id/sites/new",
  EDIT_SITE: "/sites/edit/:id",
  LIST_EXPOSED: "/projects/:id/exposed",
  CREATE_EXPOSED: "/threats/:id/exposed/new",
  EDIT_EXPOSED: "/exposed/edit/:id",
  CREATE_PLAYER: "/sites/:id/players/new", //mirarlo
  EDIT_PLAYER: "/players/edit/:id",
  LIST_RISK: "/projects/:id/matrix",
  CREATE_RISK: "/projects/:id/matrix/new",
  EDIT_RISK: "/matrix/edit/:id",
  CREATE_COLUMN: "/matrix/:id/columns/new",
  CREATE_LEVEL: "/matrix/:id/levels/new",
  LOGBOOK_SSO: "https://lb-staging.rezilio.com/external/token/:id",
  RESET_PASSWORD: "/reset-password",
  DIRECT_IMPACTS: "/projects/:id/direct-impacts",
  INTERDEPENDENCES: "/projects/:id/interdependences",
  SIMULATOR: "/projects/:id/simulator",
  CASCADE: "/projects/:id/cascade-effects",
};

window.appConfig.lang = ["en", "fr"];

// dynamically set when user logged in
window.appConfig.core = {};
