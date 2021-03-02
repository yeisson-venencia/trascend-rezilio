// PlanSection extended model
// Used to keep same and organized structure to render sections
// Since following object structure is used in multiple places (components / PlanSection.js)
// I decided to set it via this common place to make changes easier later on
// Note: don't use it as API model

import _ from "lodash";
import { getUrlParamEntries } from "../utils/UrlService";

export function PlanSectionExtended(plan, type = "default", extra = {}) {
  let data = {
    _modelName: "PlanSectionExtended",
    id: plan.id,
    uuid: _.random(1, Number.MAX_SAFE_INTEGER),
    title: plan.title,
    permalink: plan.permalink,
    sectionUrl: plan.sectionUrl,
    sectionType: undefined,
    textUrl: plan.textUrl,
    printUrl: plan.printUrl,
    mode: plan.mode,
    type: plan.type,
    icon: plan.icon,
    color: plan.color,
    user: plan.user,
    update: plan.update,
    items: [], //added via components/Section.js
    description: undefined, // added via compoents/Section.js
  };

  // decide what structure we use
  switch (type) {
    case "menu":
      data.type = ["menu"];
      break;
    case "text":
      data.type = ["text"];
      break;
    default:
  }

  const searchParams = decodeURIComponent(data.permalink);
  const entries = getUrlParamEntries(searchParams);

  for (let pair of entries) {
    if (pair[0] === "section") {
      data.sectionType = pair[1];
    }
  }

  // override whats passed via extra
  Object.assign(data, extra);

  // Used when we need to load parent sections via API
  // Api is not sending sectionUrl for text objects so
  // we get it from its parent and childs
  // if parent childs contains same item id as callbackId
  // we add whole section to the menu
  if (plan.callbackId !== undefined) {
    data.callbackId = plan.callbackId;
  }

  return data;
}
