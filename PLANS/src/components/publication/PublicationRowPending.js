import React from "react";
import { withRouter } from "react-router-dom";
import cs from "classnames";
import { injectIntl } from "react-intl";
import ReactTooltip from "react-tooltip";
import Icon from "../common/Icon";
import "./PublicationRow.scss";

class PublicationRowPending extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      section: props.section,
      active: false,
      model: props.model,
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

  clickDetails = () => {
    this.props.showDetails(true, this.state.model);
  };

  render() {
    const { active, section, model } = this.state;

    return (
      <tr
        className={cs("publication-row", section, { active: active })}
        onMouseEnter={this.addMouseHover}
        onMouseLeave={this.removeMouseHover}
        onClick={this.clickDetails}
      >
        <td>
          <div className="title">
            <div className="ico">
              <Icon icon={model.icon} color={model.color} />
            </div>
            {model.title}
            <div className="breadcrumb">{model.breadcrumb}</div>
          </div>
        </td>

        <td className="hide">
          <div className="info">{model.plan.name}</div>
        </td>

        <td className="hide">
          <div className="info">{model.plan.site}</div>
        </td>

        <td>
          <div className="tag">
            {model.plan.tag !== "" ? (
              <React.Fragment>
                <div
                  className="icon"
                  style={{
                    color: model.plan.color,
                    borderColor: model.plan.color,
                  }}
                  data-tip={model.plan.type}
                  data-for="publication-tooltip"
                >
                  {model.plan.tag}
                </div>
                <ReactTooltip
                  className="dark"
                  id="publication-tooltip"
                  effect="solid"
                  place="top"
                />
              </React.Fragment>
            ) : (
              <div className="no-icon">-</div>
            )}
          </div>
        </td>
        <td>
          <div className="lang">{model.plan.language}</div>
        </td>
      </tr>
    );
  }
}

export default withRouter(injectIntl(PublicationRowPending));
