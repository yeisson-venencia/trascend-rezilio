import React from "react";
import cs from "classnames";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import ReactTooltip from "react-tooltip";
import DTS from "../../../../utils/DateTimeService";
import "./ModeBar.scss";

class ModeBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: props.mode,
      action: props.action,
      toggle: false,
    };
  }

  toggleVersion = () => {
    this.setState({ toggle: !this.state.toggle });

    this.state.action(!this.state.toggle);
  };

  render = () => {
    const { mode, toggle, action } = this.state;

    const copy = "plan.edit.mode.bar." + mode.type;
    const toggleText =
      "plan.edit.mode.bar.toggle.text." + (toggle ? "on" : "off");

    const tooltipMessageObj = defineMessages({
      tooltip: {
        id: "plan.edit.mode.bar.tooltip",
      },
    });

    const tooltipText = this.props.intl.formatMessage(
      tooltipMessageObj.tooltip,
      {
        user: mode.user,
        timestamp: DTS.moment(mode.unix).format(
          this.props.intl.formatMessage({
            id: DTS.format("plan.description.update.format.date"),
          })
        ),
      }
    );

    return (
      <div
        className={cs("mode-bar", mode.type)}
        data-tip={tooltipText}
        data-for="mode-tooltip"
      >
        <div className="icon"></div>
        <div className="text">
          <FormattedMessage id={copy} />
        </div>

        {mode.type === "MODE_DRAFT" && (
          <div className="button" onClick={action}>
            <FormattedMessage id="plan.edit.mode.bar.draft.button" />
          </div>
        )}

        {mode.type === "MODE_REJECTED" && (
          <>
            <ReactTooltip id="mode-tooltip" effect="solid" place="bottom" />
            <div className="button" onClick={action}>
              <FormattedMessage id="plan.edit.mode.bar.draft.button" />
            </div>
          </>
        )}

        {mode.type === "MODE_LOCKED" && <div className="text">{mode.user}</div>}

        {mode.type === "MODE_PENDING" && (
          <>
            <div
              className={cs({ "version-toggle": true, on: this.state.toggle })}
              onClick={this.toggleVersion}
            ></div>
            <div className="version-toggle-text">
              <FormattedMessage id={toggleText} />
            </div>
          </>
        )}
      </div>
    );
  };
}

export default injectIntl(ModeBar);
