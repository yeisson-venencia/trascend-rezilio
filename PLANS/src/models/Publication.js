import store from "../utils/store";

export function Publication(jsonData) {
  let array = [];

  const setLocale = () => {
    if (store.get("locale") !== null) {
      let locale;
      locale = store.get("locale").substring(0, 2);
      return locale;
    }
  };

  const localeKey = setLocale();

  if (Array.isArray(jsonData) === false) {
    jsonData = [jsonData];
  }

  jsonData.forEach((item, i) => {
    let data = {
      id: item.sectionId,
      uid: Math.round(Math.random() * 99999),
      title: item.title,
      breadcrumb: item.breadcrumb,
      icon: item.icon,
      color: item.colorV3,
      modeId: item.modeId,
      status: undefined,
      user: item.userName,
      userId: item.userId,
      update: item.timeStamp,
      localeId: undefined,

      plan: {
        id: item.planId,
        site: item.siteName,
        name: item.planName,
        type: item.planTypeName,
        tag: item.acronym,
        color: item.acronymColor,
        language: undefined,
      },
      payload: {
        planId: item.planId,
        section: item.section,
        sectionId: item.sectionId,
      },
    };

    // stagus logic
    switch (data.modeId) {
      /*
      case 1:
        data.status = "MODE_DRAFT";
        break;
      */
      case 2:
        data.status = "MODE_PENDING";
        break;
      case 3:
        data.status = "MODE_REJECTED";
        break;
      /*
      case 4:
        data.status = "MODE_DELETED";
        break;
      case 5:
        data.status = "MODE_RELEASED";
        break;
      */
      case 6:
        data.status = "MODE_ACCEPTED";
        break;
      default:
        data.status = undefined;
    }

    // plan tag
    if (
      item.acronym === null ||
      item.acronym === undefined ||
      item.acronym.length === 0
    ) {
      data.plan.tag = "";
      data.plan.color = "";
    }

    if (data.status !== undefined) {
      array.push(data);
    }

    if (item.language !== undefined) {
      data.plan.language = item.language.replace("_", " ");
    }

    if (localeKey !== undefined) {
      data.localeId = window.appConfig.localeId[localeKey];
    }
  });

  return array;
}
