import React from "react";
import { withRouter } from "react-router-dom";
import "./PlanRow.scss";
import classnames from "classnames";
import ReactTooltip from "react-tooltip";
import { buildUrl } from "../../../utils/UrlService";
import { FormattedMessage, injectIntl } from "react-intl";
import DTS from "../../../utils/DateTimeService";

class PlanRow extends React.Component {
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
      <tr
        className={classnames("plan-row", { active: this.state.active })}
        onMouseEnter={this.addMouseHover}
        onMouseLeave={this.removeMouseHover}
        onClick={() => this.goToPlan()}
      >
        <td>
          <div className="title">
            {this.state.title}
            <div className="address">{this.state.address}</div>
          </div>
        </td>

        <td>
          <div className="city responsive">{this.state.city}</div>
        </td>

        <td>
          <div className="tag">
            {this.state.tag !== "" ? (
              <div
                className="icon"
                style={{
                  color: this.state.color,
                  borderColor: this.state.color,
                }}
              >
                {this.state.tag}
              </div>
            ) : (
              <div className="no-icon">-</div>
            )}
          </div>
        </td>

        <td>
          <div className="info responsive">
            <div>
              <div className="sections">
                {this.state.sections}

                {this.state.sections === 1 ? (
                  <FormattedMessage id="plans.box.section" />
                ) : (
                  <FormattedMessage id="plans.box.sections" />
                )}
              </div>
              <div className="update">
                <FormattedMessage id="plans.box.update" />
                {this.state.update !== 0 ? (
                  <strong>
                    {DTS.moment(this.state.update).format(
                      intl.formatMessage({
                        id: DTS.format("plans.box.update.format"),
                      })
                    )}
                  </strong>
                ) : (
                  "-"
                )}
              </div>
            </div>

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
          </div>
        </td>
      </tr>
    );
  }
}

export default withRouter(injectIntl(PlanRow));
