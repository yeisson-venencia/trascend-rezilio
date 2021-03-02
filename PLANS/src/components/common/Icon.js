import React from "react";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

config.mutateApproach = "sync";
library.add(far, fas, fab);

const isUrl = (string) => {
  try {
    return Boolean(new URL(string));
  } catch (e) {
    return false;
  }
};

const Icon = (props) => {
  //props.icon could be font awesome icon or url to the custom image
  if (isUrl(props.icon) === true) {
    return <img src={props.icon} alt="fa" />;
  }

  if (props.icon !== undefined && props.color !== undefined) {
    let dash = props.icon.indexOf("-"),
      prefix = props.icon.substring(0, dash),
      icon = props.icon.substring(dash + 1);

    return (
      // unique key props is used to help re-rendering the FA icon based on a unique identifier
      <span
        key={Math.random()}
        className={props.className}
        onClick={props.onClick}
      >
        <i
          className={prefix + " fa-" + icon}
          color={props.color}
          data-fa-transform={props.transform}
        />
      </span>
    );
  }
  return null;
};

export default Icon;
