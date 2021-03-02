window.appConfig = {
  env: "production",
  ver: "ZZverplaceholderZZZ", //replaced during deployment
  api: {
    /*
    'url': 'https://api-testing.rezilio.net',
    'v1': 'https://api-testing.rezilio.net/api/v1',
    'v2': 'https://api-testing.rezilio.net/api/v2',
    */
    /*
    'url': 'https://api-staging.rezilio.net',
    'v1': 'https://api-staging.rezilio.net/api/v1',
    'v2': 'https://api-staging.rezilio.net/api/v2',
    */
    url: "https://api.rezilio.net",
    v1: "https://api.rezilio.net/api/v1",
    v2: "https://api.rezilio.net/api/v2",
  },
  redirect: false,
  trackErrors: true,
  responseErrors: 30 * 1000,
  deadlineErrors: 120 * 1000,
  inactivityTimeout: 30 * 60 * 1000,
  logoutTimeout: 60 * 1000,
  editorAutosave: 15 * 1000,
  editorDelay: 3 * 1000,
  modalAutoclose: 5 * 1000,
  regexp: {
    patternPlanSearch: {
      default:
        "(?<![<>A-Za-zÀ-ÖØ-öø-ÿ0-9-_/ \\\\',“”‘’'?%@!#&$&*.°()\\]\\[\\{\\}\\|=+~:;±«»\"])[A-Za-zÀ-ÖØ-öø-ÿ0-9-_/ \\\\',“”‘’'?%@!#&$&*.°()\\]\\[\\{\\}\\|=+~:;±«»\"]{3,}(?![A-Za-zÀ-ÖØ-öø-ÿ0-9-_/ \\\\',“”‘’'?%@!#&$&*.°()\\]\\[\\{\\}\\|=+~:;±«»\"<>])",
      safari:
        "^[^<>][A-Za-zÀ-ÖØ-öø-ÿ0-9-_/ \\\\',“”‘’'?%@!#&$&*.°()\\]\\[\\{\\}\\|=+~:;±«»\"][^<>]{1,}$",
    },
  },
  itemsPerPage: 10,
  nbShortcuts: 5,
  paginationMaxPages: 7, // has to be an odd number
  iconColors: [
    "#ffffff",
    "#1a1a1a",
    "#7f1818",
    "#ef2629",
    "#ff6634",
    "#fc9100",
    "#f7d74f",
    "#aa7830",
    "#960087",
    "#a600c8",
    "#e95ded",
    "#e184f4",
    "#ed7caa",
    "#7951f4",
    "#11498a",
    "#154be5",
    "#3989c9",
    "#4f7ef7",
    "#69b3e3",
    "#40b2f2",
    "#006e79",
    "#197b30",
    "#5fc96b",
    "#63717c",
    "#b1b6ba",
    "#ed4087",
  ],
  FROALA_KEY:
    "fIE3A-9B1D1G2C5D5B1td1CGHNOa1TNSPH1e1J1VLPUUCVd1FC-22C4A3C3E2D4G2G2C3B3C2==",
};

// specify all endpoints
window.appConfig.setEndpoints = function () {
  window.appConfig.endpoints = {
    token: window.appConfig.api.v1 + "/login-check",
    forgotPassword: window.appConfig.api.v1 + "/no-pass-check",
    resetPassword: window.appConfig.api.v1 + "/profile/reset-password",
    settings:
      window.appConfig.api.v1 + "/settings.jsonld?ctxt={id}&trxId={trxId}",
    settingsPost: window.appConfig.api.v1 + "/settings.jsonld",
    settingsId:
      window.appConfig.api.v1 +
      "/settings/{id1}.jsonld?ctxt={id2}&trxId={trxId}",
    settingsIdPut: window.appConfig.api.v1 + "/settings/{id}.jsonld",
    userInfo:
      window.appConfig.api.v1 + "/profile/me.jsonld?auto=true&trxId={trxId}",
    plans:
      window.appConfig.api.v2 +
      "/profile/plans.jsonld?itemsPerPage={id1}&_page={id2}&trxId={trxId}",
    plansCountry:
      window.appConfig.api.v2 +
      "/profile/plans.jsonld?country={id1}&itemsPerPage={id2}&_page={id3}&trxId={trxId}",
    plansRecent:
      window.appConfig.api.v2 +
      "/profile/plans.json?lastSelected=true&trxId={trxId}",
    plansCountries:
      window.appConfig.api.v2 + "/organisation/countrylist.json?trxId={trxId}",
    planDetail:
      window.appConfig.api.v2 + "/profile/plans/{id}.jsonld?trxId={trxId}",
    planTextSearch:
      window.appConfig.api.v2 +
      "/plan/search.json?planId={id1}&search={id2}&itemsPerPage={id3}&_page={id4}&trxId={trxId}",
    planActivity: window.appConfig.api.v1 + "/content/activity.json",
    planObjectInfo: window.appConfig.api.v2 + "/menu/info.jsonld",
    planContentDelete: window.appConfig.api.v1 + "/content/delete.json",
    planContentDiff: window.appConfig.api.v1 + "/content/diff.json",
    planContentEdit: window.appConfig.api.v1 + "/content/edit.json",
    planContentHistory: window.appConfig.api.v1 + "/content/history.json",
    planContentPublish: window.appConfig.api.v1 + "/content/publish.json",
    planContentReject: window.appConfig.api.v1 + "/content/reject.json",
    planContentRead: window.appConfig.api.v1 + "/content/read.json",
    planContentLook: window.appConfig.api.v1 + "/content/look.json",
    planContentUnlook: window.appConfig.api.v1 + "/content/unlook.json",
    planContentRelease: window.appConfig.api.v1 + "/content/release.json",
    planContentSubmit: window.appConfig.api.v1 + "/content/submit.json",
    planContentText: window.appConfig.api.v1 + "/content/text.json",
    planContentUpdate: window.appConfig.api.v1 + "/content/update.json",
    planContentTranslate: window.appConfig.api.v1 + "/content/translate.json",
    uploadConfig:
      window.appConfig.api.v1 +
      "/content/getUploadProperties.json?planId={id1}&delay={id2}&trxId={trxId}",
    logout: window.appConfig.api.v1 + "/logout",
    locale: window.appConfig.api.v1 + "/locales?trxId={trxId}",
    localeUpdate: window.appConfig.api.v1 + "/locales.jsonld",
    greylog: "https://logsys.rezilio.net:12202/gelf",
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
  MFA: "/app/mfa",
  PLANS: "/app/plan",
  PLAN: "/app/plan/:id",
  PLAN_SEARCH: "/app/plan/:id/search",
  PLAN_LINK: "/app/plan/:id?link=:id2",
  PUBLICATIONS: "/app/publications",
  LOGBOOK_SSO: "https://lb.rezilio.com/external/token/:id",
  RESET_PASSWORD: "/reset-password",
};

window.appConfig.lang = ["en", "fr"];
window.appConfig.locale = { en: "en-CA", fr: "fr-CA" };
window.appConfig.localeId = { en: "en.ca", fr: "fr.ca" };

window.const = {
  ROLE_ADMIN: "ROLE_ADMIN",
  ROLE_USER: "ROLE_USER",

  PLAN_READ: "PLAN_READ",
  PLAN_UPDATE: "PLAN_UPDATE",
  PLAN_UPDATE_WITH_APPROVAL: "PLAN_UPDATE_WITH_APPROVAL",
  PLAN_DELETE: "PLAN_DELETE",
  PLAN_DELETE_WITH_APPROVAL: "PLAN_DELETE_WITH_APPROVAL",

  DRAFT_READ: "DRAFT_READ",
  DRAFT_UPDATE: "DRAFT_UPDATE",
  DRAFT_DELETE: "DRAFT_DELETE",

  CONTENT_SUBMIT: "CONTENT_SUBMIT",
  CONTENT_PUBLISH: "CONTENT_PUBLISH",

  MENU_CREATE: "MENU_CREATE",
  MENU_READ: "MENU_READ",
  MENU_UPDATE: "MENU_UPDATE",
  MENU_DELETE: "MENU_DELETE",
  MENU_MOVE: "MENU_MOVE",
};

// dynamically set when user logged in
window.appConfig.core = {};
