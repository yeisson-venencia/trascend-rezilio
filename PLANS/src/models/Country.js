// API => model transormation

export function Country(jsonData, asArray = true) {
  let arr = [];

  if (Array.isArray(jsonData) === false) {
    jsonData = [jsonData];
  }

  jsonData.forEach(function (item) {
    let data = {
      _modelName: "Country",
      name: item.name,
      iso: item.iso,
      total: item.total,
      default: false,
    };

    if (item.isDefault === 1) {
      data.default = true;
    }

    arr.push(data);
  });

  if (arr.length === 1 && asArray === false) {
    return arr[0];
  }
  return arr;
}
