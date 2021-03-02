export function Version(jsonData) {
  let array = [];

  if (Array.isArray(jsonData) === false) {
    jsonData = [jsonData];
  }

  jsonData.forEach((item, i) => {
    let data = {
      icon: "fas-history",
      type: "history",
      class: "highlight",
      user: undefined,
      update: undefined,
      _revisionId: item.revision,
    };

    if (
      item.firstName !== undefined &&
      item.firstName !== "-" &&
      item.lastName !== undefined &&
      item.lastName !== "-"
    ) {
      data.user = item.firstName + " " + item.lastName;
    }

    if (
      item.microtime !== undefined &&
      item.microtime !== 0 &&
      item.microtime !== 1
    ) {
      data.update = Math.round(item.microtime);
    }

    // overide icon for current version
    if (i === 0) {
      data.icon = "far-check-circle";
      data.class = "";
      data.type = "current";
    }

    if (data.user !== undefined && data.update !== undefined) {
      array.push(data);
    }
  });

  return array;
}
