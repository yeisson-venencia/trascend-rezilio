import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import appConfig from "./config/config.js";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as serviceWorker from "./serviceWorker";
import rootReducer from "./store/reducers";
import store from "./utils/store";
import request from "superagent";
import Bowser from "bowser";
import classnames from "classnames";
import "./css/styles.scss";
import { IntlProvider } from "react-intl";
import messages_en from "./translations/en.json";
import messages_fr from "./translations/fr.json";
import messages_es from "./translations/es.json";

const reduxStore = createStore(rootReducer, applyMiddleware());

// get user ip
request
  .get("https://api.ipify.org/")
  .timeout({
    response: 3000,
    deadline: 3000,
  })
  .then(function (res) {
    store.set("ip", res.text);
  });

const messages = {
  en: messages_en,
  fr: messages_fr,
  es: messages_es,
};

window.startApp = function () {
  let language = "fr"; // default one

  if (store.get("locale") !== null) {
    language = store.get("locale");
  } else {
    if (navigator.languages !== undefined) {
      let languages = navigator.languages
        .map(function (it) {
          let lang = it.substr(0, 2);

          if (Object.keys(messages).includes(lang)) {
            return lang;
          }
          return null;
        })
        .filter(function (el) {
          // filter out not supported langauges
          if (el !== null) {
            return el;
          }
          return false;
        });

      if (languages.length > 0) {
        language = languages[0];
      }
    }
  }

  // map language to locale
  // Note for the future would need mapping based on same language with different locales
  language = language.substr(0, 2);
  store.set("locale", window.appConfig.locale[language]);

  // Change language of chatbot according to website language
  /*
  window.$zoho.salesiq.ready = function () {
    window.$zoho.salesiq.language(language)
  }
  */

  // add classes per platform, browser, ...
  const browser = Bowser.getParser(window.navigator.userAgent);

  let alias = browser.getBrowserName().toLowerCase().replace(/\s+/g, ""),
    platform = browser.getOSName().toLowerCase().replace(/\s+/g, "");

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={reduxStore}>
        <IntlProvider locale={language} messages={messages[language]}>
          <div className={classnames(alias, platform)}>
            <Root />
          </div>
        </IntlProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

window.startApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
