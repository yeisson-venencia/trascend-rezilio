function buildUrl(key, keys = [], extra = "") {
  // replace keys within the url string with keys
  let url = window.appConfig.URL[key];

  if (Array.isArray(keys)) {
    // replace all given ids
    let replaces = [":id", ":id2", ":id3", ":id4", ":id5"];
    for (let i = 0; i < keys.length; i++) {
      url = url.replace(replaces[i], keys[i]);
    }
  } else if (keys !== "") {
    // replace :id
    url = url.replace(":id", keys);
  }

  if (extra !== "" && extra.charAt(0) !== "/") {
    extra = "/" + extra;
  }

  return url + extra;
}

function getUrl(key) {
  // return "pure" url string
  return window.appConfig.URL[key];
}

function endpoint(key, keys = []) {
  // return endpoint url string
  let url = window.appConfig.endpoints[key];

  if (Array.isArray(keys)) {
    // replace all given ids
    let replaces = ["{id1}", "{id2}", "{id3}", "{id4}", "{id5}"];
    for (let i = 0; i < keys.length; i++) {
      url = url.replace(replaces[i], keys[i]);
    }
  } else if (keys !== "") {
    // replace :id
    url = url.replace("{id}", keys);
  }

  return url;
}

export { buildUrl, getUrl, endpoint };
