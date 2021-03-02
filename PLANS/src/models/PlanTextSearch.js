// API => model transformation

export function PlanTextSearch(jsonData, asArray = true) {
  let arr = [];

  if (Array.isArray(jsonData) === false) {
    jsonData = [jsonData];
  }

  jsonData.forEach(function (item) {
    let data = {
      _modelName: "PlanTextSearch",
      id: item["@id"],
      sectionId: item.id,
      type: item["@type"],
      breadcrumb: item.breadcrumb,
      title: item.title,
      color: item.color,
      icon: item.icon,
      description: item.sampleDescription,
      permalink: undefined,
    };

    if (item.textUrl !== "") {
      data.permalink = item.textUrl;
      data.textUrl = window.appConfig.api.url + item.textUrl + "&trxId={trxId}";
    }

    arr.push(data);
  });

  // if (arr.length === 1 && asArray === false) {
  //   return arr[0];
  // }
  return arr;
}
