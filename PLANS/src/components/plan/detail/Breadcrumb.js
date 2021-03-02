import React from "react";
import _ from "lodash";
import "./Breadcrumb.scss";
//import { FormattedMessage } from "react-intl";

const Breadcrumb = (props) => {
  if (props.sections.length > 0) {
    // remove duplicate titles (keep last = most detailed)
    let nav = [...props.sections].reverse();

    nav = _.reverse(_.uniqBy(nav, "title"));

    nav = nav
      .map((item, i, arr) => {
        // don't show onClick when last item (current one)
        if (i === arr.length - 1) {
          return (
            <div className="item last" key={item.uuid}>
              {item.title}
            </div>
          );
        }
        return (
          <div
            className="item"
            key={item.uuid}
            onClick={(e) => props.callback(item)}
          >
            {item.title}
          </div>
        );
      })
      .reduce((prev, curr, i) => [
        prev,
        <div key={i} className="separator">
          /
        </div>,
        curr,
      ]);

    // add gap when we don't have full breadcrumb
    // TODO needs to change upon the API
    /*
    if (props.sections[0].isRootSection === true) {
      return <div className="plan-breadcrumb">{nav}</div>;
    } else {
      return (
        <div className="plan-breadcrumb">
          <div className="item-empty">
            <FormattedMessage id="plan.section.main" />
          </div>
          <div className="separator">/</div>
          <div className="item-empty">
            <FormattedMessage id="plan.section.dots" />
          </div>
          <div className="separator">/</div>
          {nav}
        </div>
      );
    }
    */
    return <div className="plan-breadcrumb">{nav}</div>;
  }
  return null;
};

export default Breadcrumb;
