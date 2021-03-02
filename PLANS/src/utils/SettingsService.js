import { endpoint } from "./UrlService";
import ApiService from "./ApiService";
const Api = new ApiService();

/*
see components/_docs/SettingsDocs
and render this component somewhere e.g. components/Home.js
// import SettingsDocs from "./_docs/SettingsDocs";
// render <SettingsDocs />

*/

export default class Settings {
  // there are different contexts per projects (plans, logbook, v2, ...), within this

  static formatSettingsObj(oldSettingObj) {
    let newSettingObj = {
      id: null,
      url: null,
    };

    if (oldSettingObj !== undefined) {
      newSettingObj.id = oldSettingObj.id;
      newSettingObj.url = oldSettingObj.permalink;

      if (oldSettingObj.customTitle !== undefined) {
        newSettingObj.customTitle = oldSettingObj.customTitle;
      }

      return newSettingObj;
    }
    return;
  }

  // API: GET /setting/id object
  static get(history, key) {
    const ctxt = "pl";

    return new Promise((resolve, reject) => {
      Api.initAuth(history);
      Api.get(endpoint("settingsId", [key, ctxt])).then((data) => {
        if (typeof data === "object") {
          if (Object.keys(data).length === 0) {
            resolve(undefined);
          }

          resolve(data);
        } else {
          reject(false);
        }
      });
    });
  }

  // API: GET /setting full object
  static getAll(history) {
    const ctxt = "pl";

    return new Promise((resolve, reject) => {
      Api.initAuth(history);
      Api.get(endpoint("settings", ctxt)).then((data) => {
        if (typeof data === "object") {
          if (Object.keys(data).length === 0) {
            resolve(undefined);
          }

          resolve(data);
        } else {
          reject(false);
        }
      });
    });
  }

  // API: PUT /setting object
  // note we append new key to the existing structure
  // for security reasons we don't allow to POST full object now
  static set(history, key, value) {
    return this._put(history, key, value);
  }

  // API: POST /setting object = []
  // Note: remove all might be danger
  static setAll(history, values) {
    return this._post(history, values);
  }

  // API: POST /setting full object
  // note we remove key from existing structure
  static remove(history, key) {
    return new Promise((resolve, reject) => {
      this.getAll(history).then((data) => {
        if (data !== null) {
          delete data[key];

          this._post(history, data)
            .then(function (result) {
              // return full object within the callback
              resolve(data);
            })
            .catch(function () {
              reject(false);
            });
        }
        resolve(data);
      });
    });
  }

  // API: POST /setting object = []
  // Note: remove all might be danger
  static removeAll(history) {
    return this._post(history, []); // empty array is the empty state based on API
  }

  // private function, use set instead
  // API: POST /settings object
  // replaces whole object (all keys within same context)
  static _post(history, values) {
    const ctxt = "pl";

    return new Promise((resolve, reject) => {
      let json = { data: JSON.stringify(values), ctxt: ctxt };

      Api.initAuth(history);
      Api.post(endpoint("settingsPost"), json).then((res) => {
        if (res.status === "success") {
          resolve(true);
        }
        reject(false);
      });
    });
  }

  // API: PUT /settings object
  // can be used to add/update existing & new keys
  static _put(history, key, value) {
    const ctxt = "pl";

    return new Promise((resolve, reject) => {
      let json = { data: JSON.stringify(value), ctxt: ctxt };

      Api.initAuth(history);
      Api.put(endpoint("settingsIdPut", key), json).then((res) => {
        if (res.status === "success") {
          resolve(true);
        }
        reject(false);
      });
    });
  }
}
