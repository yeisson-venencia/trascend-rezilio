import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import SearchBar from "../../../../common/SearchBar";
import Icon from "../../../detail/Icon";
import { icons } from "../../../../Icons";
import "./IconEditMenu.scss";

const colors = window.appConfig.iconColors;

const iconList = icons.slice(0, 77);

const IconEditMenu = ({ show, hide, intl }) => {
  return (
    show && (
      <div className="icon-edit-menu">
        <div className="icon-edit-header">
          <div className="icon-edit-color-title">
            <FormattedMessage id="plan.edit.icon.modal.title.color" />
          </div>
          <div className="icon-edit-close" onClick={hide}></div>
        </div>
        <ColorCircles />
        <div className="hr"></div>
        <div className="icon-edit-header">
          <div className="icon-edit-icon-title">
            <FormattedMessage id="plan.edit.icon.modal.title.icon" />
          </div>
          <button className="icon-delete-btn">
            <FormattedMessage id="plan.edit.icon.action.delete" />
            <div className="icon-delete-btn-icon"></div>
          </button>
        </div>
        <div className="select-icon">
          <SearchBar
            placeholder={intl.formatMessage({
              id: "plans.text.search.placeholder",
            })}
          />
          <button className="icon-download-btn">
            <FormattedMessage id="plan.edit.icon.action.download" />
          </button>
        </div>
        <Icons icons={iconList} />
      </div>
    )
  );
};

const ColorCircles = ({ color }) => {
  return (
    <div className="color-circles">
      {colors.map((color) => (
        <div className="color-circle" style={{ background: `${color}` }}></div>
      ))}
    </div>
  );
};

const Icons = ({ icons }) => {
  return (
    <div className="icon-list">
      {icons.map(({ id, prefix, alias5, ...rest }) => (
        <Icon key={id} icon={prefix + "-" + alias5} color={"grey"} />
      ))}
    </div>
  );
};

export default injectIntl(IconEditMenu);
