export function Site(jsonData, asArray = true) {
  let arr = [];

  if (Array.isArray(jsonData) === false) {
    jsonData = [jsonData];
  }

  jsonData.forEach(function (item) {
    console.log(item);
    let data = {
      _modelName: "Site",
      createdAt: item.createdAt,
      id: item.id,
      location: item.location,
      name: item.name,
      project: item.project,
      responsible: item.responsible,
      updateAt: item.updatedAt,
    };
    arr.push(data);
  });

  if (arr.length === 1 && asArray === false) {
    return arr[0];
  }
  return arr;
}
