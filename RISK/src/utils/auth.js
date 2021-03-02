import history from "./history";
import request from "superagent";
import store from "./store";
import { endpoint, buildUrl } from "./UrlService";
import { Profile as ProfileModel } from "../models/Profile";
import ApiService from "./ApiService";
const Api = new ApiService();

export default class Auth {
  constructor() {
    const that = this;

    that.profile = {};
    that.id_token = null;

    if (that.isAuthenticated() === true) {
      // load from localstorage
      that.id_token = store.get("id_token");
      that.profile = JSON.parse(store.get("profile"));
    }
  }

  login = (username, password, locale) => {
    // Get a token from api server using the fetch api
    // mfa "-" is temporary solution, later backend will provide better way / another endpoint
    return new Promise((resolve, reject) => {
      request
        .post(endpoint("token"))
        .accept("application/json")
        .field("username", username)
        .field("password", password)
        .field("locale", locale)
        .field("trxId", Api.getTransactionId())
        .then(function (res) {
          let data = res.body;

          // check if we get token or not
          if (data.token) {
            store.set("id_token", data.token);
            store.set("refresh_token", data.refresh_token);
            resolve(true);
          } else if (data.code === 204) {
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch(function (err) {
          reject(false);
        });
    });
  };

  mfa = (username, password, locale, mfa) => {
    // Get a token from api server using the fetch api
    // mfa "-" is temporary solution, later backend will provide better way / another endpoint
    return new Promise((resolve, reject) => {
      request
        .post(endpoint("token"))
        .accept("application/json")
        .field("username", username)
        .field("password", password)
        .field("locale", locale)
        .field("mfa", mfa)
        .field("trxId", Api.getTransactionId())
        .then(function (res) {
          let data = res.body;

          // check if we get token or not
          if (data.token) {
            store.set("id_token", data.token);
            store.set("refresh_token", data.refresh_token);
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch(function (err) {
          reject(false);
        });
    });
  };

  setProfile = () => {
    const that = this;

    // Get a token from api server using the fetch api
    return new Promise((resolve, reject) => {
      if (that.isAuthenticated() === true) {
        // fetch from API
        Api.initAuth(history);
        Api.get(endpoint("userInfo"))
          .then((res) => {
            let data = res;
            if (data.status === "success") {
              // set model and save to store
              let model = ProfileModel(data);

              if (model.homeUrl !== undefined && model.homeUrl !== null) {
                // redirection outside of plans
                window.location.replace(
                  model.homeUrl + "&t=" + store.get("refresh_token")
                );
              } else {
                store.set("profile", JSON.stringify(model));

                // set profile in plans
                that.profile = model;

                // change endpoint urls
                window.appConfig.api.url = model.zoneUrl;
                window.appConfig.api.v1 = model.zoneUrlV1;
                window.appConfig.api.v2 = model.zoneUrlV2;
                window.appConfig.setEndpoints();

                resolve(true);
              }
            } else {
              history.replace(buildUrl("ERROR") + "#api");
              reject(false);
            }
          })
          .catch(function (err) {
            history.replace(buildUrl("ERROR") + "#api");
            reject(false);
          });
      } else {
        history.replace(buildUrl("ERROR") + "#api");
        reject(false);
      }
    });
  };

  logout = () => {
    let persist = {
      logout: true,
    };

    Api.initAuth(history);
    Api.post(endpoint("logout"), persist)
      .then((res) => {
        if (res.status === "success") {
          // Delete token ad profile from LocalStorage
          store.remove("id_token");
          store.remove("profile");
          setTimeout(() => {
            history.replace(window.appConfig.URL.AUTHCHECK);
          }, 100);
        } else {
          history.replace(buildUrl("LOGIN"));
        }
      })
      .catch(function (err) {
        history.replace(buildUrl("LOGIN"));
      });
  };

  isAuthenticated = () => {
    if (store.get("id_token") !== null) {
      return true;
    }

    // get relative url (without origin) including params
    let fullUrl = window.location.href.substring(window.location.origin.length);

    // save the url for future landing
    store.set("url", fullUrl);

    return false;
  };

  isFullAuthenticated = () => {
    if (store.get("id_token") !== null && store.get("profile") !== null) {
      return true;
    }
    store.remove("id_token");
    store.remove("profile");

    return false;
  };
}
