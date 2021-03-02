// API => model transormation
import store from "../utils/store";
import { getUrlParamEntries } from "../utils/UrlService";

export function PlanSection(jsonData, asArray = true) {
  let arr = [];

  if (Array.isArray(jsonData) === false) {
    jsonData = [jsonData];
  }

  jsonData.forEach(function (item) {
    let data = {
      _modelName: "PlanSection",
      id: item.id,
      title: item.title,
      icon: "fas-list-ul",
      color: item.colorV3,
      description: undefined,
      parentUrl: item.parentUrl,
      permalink: item.permalink,
      sectionUrl: undefined, // set when section has sub-sections, always array from API
      sectionType: undefined,
      textUrl: undefined, // set when section has text, always string from API,
      printUrl: undefined,
      mode: undefined,
      update: undefined,
      user: undefined,
      language: undefined,
    };

    // an icon via API?
    if (
      item.iconCustom !== "" &&
      item.iconCustom !== undefined &&
      item.iconCustom !== null
    ) {
      data.icon = item.iconCustom;
    } else if (
      item.icon !== "" &&
      item.icon !== undefined &&
      item.icon !== null
    ) {
      data.icon = item.icon;
    }

    if (typeof item.sectionUrl !== "undefined" && item.sectionUrl.length > 0) {
      if (Array.isArray(item.sectionUrl) === false) {
        item.sectionUrl = [item.sectionUrl];
      }

      data.permalink = item.sectionUrl[0]; //TODO just first item if multiple

      // array of urls
      data.sectionUrl = item.sectionUrl.map(
        (url) => window.appConfig.api.url + url + "&trxId={trxId}"
      );
    }

    if (item.textUrl !== "") {
      data.permalink = item.textUrl;
      data.textUrl = window.appConfig.api.url + item.textUrl + "&trxId={trxId}";
    }

    // mode
    if (item.currentMode !== null && item.currentMode !== undefined) {
      let user = JSON.parse(store.get("profile"));

      switch (item.currentMode.modeId) {
        case 1:
          if (item.currentMode.userId === user.user.id) {
            // has existing draft, show button to continue with editing the draft
            data.mode = {
              type: "MODE_DRAFT",
              userId: item.currentMode.userId,
              user: item.currentMode.userName,
              unix: item.currentMode.timeStamp,
            };
          } else {
            data.mode = {
              // the section is locked (edited by someone else)
              type: "MODE_LOCKED",
              userId: item.currentMode.userId,
              user: item.currentMode.userName,
              unix: item.currentMode.timeStamp,
            };
          }
          break;
        case 3:
          if (item.currentMode.userId === user.user.id) {
            // has existing rejected draft, show button to continue with editing the draft
            data.mode = {
              type: "MODE_REJECTED",
              userId: item.currentMode.userId,
              user: item.currentMode.userName,
              unix: item.currentMode.timeStamp,
            };
          }
          break;
        case 2:
          // page was submitted, show current and new version toggle
          if (item.currentMode.userId === user.user.id) {
            // show pending only for current user
            data.mode = {
              type: "MODE_PENDING",
              userId: item.currentMode.userId,
              user: item.currentMode.userName,
              unix: item.currentMode.timeStamp,
            };
          } else {
            // show locked for other users
            data.mode = {
              // the section is locked (edited by someone else)
              type: "MODE_LOCKED",
              userId: item.currentMode.userId,
              user: item.currentMode.userName,
              unix: item.currentMode.timeStamp,
            };
          }
          break;
        /*
        case 4:
          // not used for now
          data.mode = "MODE_DELETED";
          break;
        */
        default:
          data.mode = {
            type: "MODE_EDIT",
          };
      }
    } else {
      // Note this is now applied to sections (menus) as well
      data.mode = {
        type: "MODE_EDIT",
      };
    }

    if (item.description !== "") {
      data.description = item.description;
    }

    if (item.lastUpdated > 0) {
      data.update = item.lastUpdated;
    }

    if (item.user !== "") {
      data.user = item.user;
    }

    if (item.language !== "") {
      data.language = item.language;
    }

    // set sectionType
    const searchParams = decodeURIComponent(data.permalink);
    const entries = getUrlParamEntries(searchParams);

    for (let pair of entries) {
      if (pair[0] === "section") {
        data.sectionType = pair[1];
      }
    }

    // print url
    if (item.printParameters !== undefined && item.printParameters !== "") {
      data.printUrl = item.printParameters;
    }

    arr.push(data);
  });

  if (arr.length === 1 && asArray === false) {
    return arr[0];
  }
  return arr;
}
