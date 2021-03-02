import React from "react";
import "./PlanBox.scss";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import ReactTooltip from "react-tooltip";
import { buildUrl } from "../../../utils/UrlService";
import { FormattedMessage, injectIntl } from "react-intl";
import DTS from "../../../utils/DateTimeService";

class PlanBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      id: props.data.id,
      title: props.data.title,
      address: props.data.address,
      city: props.data.city,
      tag: props.data.tag,
      color: props.data.color,
      sections: props.data.sections,
      update: props.data.update,
      multiLanguageEnabled: props.data.multiLanguageEnabled,
      url: props.data.url,
    };
  }

  addMouseHover = () => {
    this.setState({
      active: true,
    });
  };

  removeMouseHover = () => {
    this.setState({
      active: false,
    });
  };

  goToPlan = () => {
    this.props.history.push(buildUrl("PLAN", this.state.id));
    window.scrollTo(0, 0);
  };

  render() {
    const { intl } = this.props;

    return (
      <div
        className={classnames("plan-box", { active: this.state.active })}
        onMouseEnter={this.addMouseHover}
        onMouseLeave={this.removeMouseHover}
        onClick={() => this.goToPlan()}
      >
        <div className="title">{this.state.title}</div>

        <div className="address">
          {this.state.address} {this.state.city}
        </div>

        <div className="hr" />

        <div className="translation">
          {this.state.multiLanguageEnabled === true ? (
            <React.Fragment>
              <div
                className="icon"
                data-tip={intl.formatMessage({
                  id: "plans.multiLanguageEnabled",
                })}
              ></div>
              <ReactTooltip effect="solid" />
            </React.Fragment>
          ) : null}
        </div>

        <div className="info">
          {this.state.tag !== "" ? (
            <div className="left">
              <div
                className="tag"
                style={{
                  color: this.state.color,
                  borderColor: this.state.color,
                }}
              >
                {this.state.tag}
              </div>
            </div>
          ) : null}

          <div className="right">
            <div className="sections">
              {this.state.sections}

              {this.state.sections === 1 ? (
                <FormattedMessage id="plans.box.section" />
              ) : (
                <FormattedMessage id="plans.box.sections" />
              )}
            </div>
            {this.state.update !== 0 ? (
              <div className="update">
                <FormattedMessage id="plans.box.update" />
                <strong>
                  {DTS.moment(this.state.update).format(
                    intl.formatMessage({
                      id: DTS.format("plans.box.update.format"),
                    })
                  )}
                </strong>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(injectIntl(PlanBox));
