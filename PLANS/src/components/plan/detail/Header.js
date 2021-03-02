import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { buildUrl } from "../../../utils/UrlService";
import DTS from "../../../utils/DateTimeService";
import SearchBarApi from "../../common/SearchBarApi";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: {
        id: props.plan.id,
        title: props.plan.name,
        type: props.plan.type,
        color: props.plan.color,
        update: props.plan.update,
      },
    };
  }

  search = (text) => {
    const encodedText = encodeURIComponent(text);
    // navigate to plan search page
    this.props.history.push(
      buildUrl("PLAN_SEARCH", this.state.model.id) + "?query=" + encodedText
    );
  };

  reset = () => {
    // navigate to plan page
    this.props.history.push(buildUrl("PLAN", this.state.model.id));
  };

  searchDefaultValue = () => {
    const search = this.props.history.location.search;
    const params = new URLSearchParams(search);
    const query = params.get("query");

    let returnValue = "";

    if (query !== "") {
      returnValue = query;
    }

    return returnValue;
  };

  render = () => {
    return (
      <div className="container-fluid full plan-header">
        <div className="col-8 col-lg-8 title-wrapper text-left">
          <Link to={buildUrl("PLANS")} className="back">
            -
          </Link>
          <div className="title">{this.state.model.title}</div>

          <div className="info">
            {this.state.model.type !== "" ? (
              <div
                className="tag"
                style={{
                  color: this.state.model.color,
                  borderColor: this.state.model.color,
                }}
              >
                {this.state.model.type}
              </div>
            ) : null}
            {this.state.model.update !== 0 ? (
              <div className="update">
                <FormattedMessage id="plan.header.update" />
                <strong>
                  {DTS.moment(this.state.model.update).format(
                    this.props.intl.formatMessage({
                      id: DTS.format("plan.header.update.format"),
                    })
                  )}
                </strong>
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-4 col-lg-4 search-wrapper">
          <SearchBarApi
            searchAction={this.search}
            resetAction={this.reset}
            defaultValue={this.searchDefaultValue()}
            placeholder={this.props.intl.formatMessage({
              id: "plans.text.search.placeholder",
            })}
          />
        </div>
      </div>
    );
  };
}

export default withRouter(injectIntl(Header));
