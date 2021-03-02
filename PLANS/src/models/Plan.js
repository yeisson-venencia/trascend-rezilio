// API => model transormation

export function Plan(jsonData, asArray = true) {
  let arr = [];

  if (Array.isArray(jsonData) === false) {
    jsonData = [jsonData];
  }

  const multiLanguageEnabled = (language) => {
    const localeConfigObj = window.appConfig.locale;
    const localeLanguages = [];

    Object.keys(localeConfigObj).map((key) =>
      localeLanguages.push(localeConfigObj[key])
    );

    let planLanguages = language.map((lang) => {
      return lang.replace("_", "-");
    });

    // plan language shows at least two languages and is available as locale
    return (
      language.length > 1 &&
      planLanguages.every((lang) => localeLanguages.includes(lang))
    );
  };

  jsonData.forEach(function (item) {
    let data = {
      _modelName: "Plan",
      id: item.id,
      name: item.name,
      sections: item.sections,
      update: item.lastUpdate,
      recent: 0,
      type: "",
      color: "",
      language: [],
      shortcuts: [],
      multiLanguageEnabled: false,
      organization: {
        id: item.organisationId.id,
        street: item.organisationId.street,
        city: item.organisationId.city,
        province: item.organisationId.provinceState,
        zip: item.organisationId.zip,
        country: item.organisationId.country,
      },
      url: window.appConfig.api.url + item.url + "&trxId={trxId}",
      printUrl: undefined,
      permalink: item.url,
    };

    if (
      item.organisationId.planLanguage !== undefined &&
      item.organisationId.planLanguage !== null
    ) {
      data.language = item.organisationId.planLanguage;
      data.multiLanguageEnabled = multiLanguageEnabled(data.language);
    }

    if (item.acronym !== null) {
      data.type = item.acronym;
    }

    if (item.acronymColor !== null) {
      data.color = item.acronymColor;
    }

    if (item.defaultShortcut && item.defaultShortcut.length > 0) {
      data.shortcuts = item.defaultShortcut;
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
