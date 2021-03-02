import request from "superagent";
import { buildUrl } from "./UrlService";
import store from "./store";

export default class Api {
  constructor() {
    this.historyObj = undefined; // used to navigate within the app

    this.defaultHeaders = {
      //Accept: 'application/json',
    };
  }

  setHeaders(headers) {
    return {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  endCallback(
    endpoint: string,
    resolve: Function,
    reject: Function,
    error: {},
    response: {}
  ) {
    const that = this;

    try {
      const resObj = response.text ? JSON.parse(response.text) : {};
      let hash = "",
        message = "";

      if (resObj !== undefined && resObj.message !== undefined) {
        // custom response message for "login" endpoints
        switch (resObj.message) {
          case "Invalid JWT Token":
          case "JWT Token not found":
            hash = "login";
            message = resObj.message;
            break;
          case "Expired JWT Token":
            hash = "expire";
            message = resObj.message;
            break;
          default:
            hash = "api";
            message = "Unknown API error";
        }
      } else if (response.status !== undefined) {
        // general logic for all "data" endpoints
        switch (response.status) {
          case 401:
          case 403:
            hash = "404";
            message = resObj.message;
            break;
          case 423:
            //do nothing
            break;
          case 500:
            hash = "api";
            message = "500 Internal Error";
            break;
          default:
            hash = "api";
            message = "Unknown API error";
        }
      }

      if (error) {
        let errObj = {
          short_message: message,
          _data: resObj,
          _endpoint: endpoint,
          _status: response.status,
          _component: "Api",
        };

        if (response.status === 423) {
          reject(response);
        } else {
          that.historyObj.push(buildUrl("ERROR") + "#" + hash, errObj);
        }

        reject(errObj);
        return;
      }

      resolve(resObj);
    } catch (unknownError) {
      let errObj = {
        short_message: "Unknown error",
        _data: { message: "Unknown error" },
        _endpoint: endpoint,
        _status: response ? response.status : "unknown",
        _component: "Api",
      };

      that.historyObj.push(buildUrl("ERROR") + "#api", errObj);

      reject(errObj);
    }
  }

  init(history, headers) {
    const that = this;

    that.historyObj = history;
    that.defaultHeaders = {
      ...headers,
      ...that.defaultHeaders,
    };
  }

  initAuth(history, headers) {
    const that = this;

    that.historyObj = history;
    that.defaultHeaders = {
      ...headers,
      ...that.defaultHeaders,
      Authorization: "Bearer " + store.get("id_token"),
    };
  }

  send(method: Function, endpoint: string, values: {}, headers: {}) {
    const that = this;

    return new Promise((resolve, reject) => {
      // add trxId to values
      values.trxId = that.getTransactionId();

      method(`${endpoint}`)
        .set(that.setHeaders(headers))
        //.send(JSON.stringify(values))
        .send(values)
        .timeout({
          response: window.appConfig.responseErrors,
          deadline: window.appConfig.deadlineErrors,
        })
        .end((error, response) => {
          that.endCallback(endpoint, resolve, reject, error, response);
        });
    });
  }

  get(endpoint: string, headers: {}) {
    const that = this;

    return new Promise((resolve, reject) => {
      request
        .get(`${endpoint}`.replace("{trxId}", that.getTransactionId()))
        .set(that.setHeaders(headers))
        .timeout({
          response: window.appConfig.responseErrors,
          deadline: window.appConfig.deadlineErrors,
        })
        .end((error, response) => {
          that.endCallback(endpoint, resolve, reject, error, response);
        });
    });
  }

  del(endpoint: string, headers: {}) {
    const that = this;

    return new Promise((resolve, reject) => {
      request
        .del(`${endpoint}`)
        .set(that.setHeaders(headers))
        .timeout({
          response: window.appConfig.responseErrors,
          deadline: window.appConfig.deadlineErrors,
        })
        .end((error, response) => {
          that.endCallback(endpoint, resolve, reject, error, response);
        });
    });
  }

  post(endpoint: string, values: {}, headers: {}) {
    const that = this;

    return that.send(request.post, endpoint, values, headers);
  }

  put(endpoint: string, values: {}, headers: {}) {
    const that = this;

    return that.send(request.put, endpoint, values, headers);
  }

  getTransactionId() {
    let ip = "0.0.0.1",
      seed = 1234567890;

    if (store.get("ip") !== null) {
      ip = store.get("ip");
    }

    seed = ip.split(".").reduce(function (ip, octet, i) {
      return Number(ip) + Number(octet) * 255 * (i + 1);
    });

    let random = Math.sin(seed++) * 10000 - Math.floor(seed);
    random = Math.abs(random).toString().replace(".", "-");

    let milisec = new Date().getTime();

    return "trid-" + milisec + "-" + random;
  }
}
