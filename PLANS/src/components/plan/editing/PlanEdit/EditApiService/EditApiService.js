import ApiService from "../../../../../utils/ApiService";
import { endpoint as _endpoint } from "../../../../../utils/UrlService";

const Api = new ApiService();

export default class EditApiService {
  constructor(payload) {
    this.historyObj = undefined;

    this.planId = payload.planId;
    this.section = payload.section;
    this.sectionId = payload.sectionId;
  }

  setPayload(contentObj) {
    let payload = {
      planId: this.planId,
      section: this.section,
      sectionId: this.sectionId,
      ...contentObj,
    };

    return payload;
  }

  callApi(
    historyObj,
    method,
    endpoint,
    contentObj /*{ content, revisionId }*/
  ) {
    this.historyObj = historyObj;
    const payload = contentObj
      ? this.setPayload(contentObj)
      : this.setPayload();

    switch (method) {
      case "get":
        Api.initAuth(this.historyObj);
        Api.init(this.historyObj);
        return new Promise((resolve, reject) => {
          Api.get(_endpoint(endpoint), payload)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              if (error.status === 423) {
                reject(error);
              }
            });
        });
      case "post":
        Api.initAuth(this.historyObj);
        Api.init(this.historyObj);
        return new Promise((resolve, reject) => {
          Api.post(_endpoint(endpoint), payload)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              if (error.status === 423) {
                reject(error);
              }
            });
        });
      default:
        break;
    }
  }
}
