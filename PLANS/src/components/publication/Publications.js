import React from "react";
import { buildUrl } from "../../utils/UrlService";
import { Link, withRouter } from "react-router-dom";
import { injectIntl, FormattedMessage } from "react-intl";
import cs from "classnames";
import ReactTooltip from "react-tooltip";
import withPageLayout from "../common/PageLayout/withPageLayout";
import PublicationList from "./PublicationList";
import store from "../../utils/store";
import "./Publications.scss";

//main app
class Publications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      linkBack: buildUrl("HOME"),
      tab: "pending",
      localeId: undefined,
    };
  }

  componentDidMount() {
    // set link back if available
    if (store.get("locale") !== null) {
      const locale = store.get("locale").substring(0, 2);
      const localeId = window.appConfig.localeId[locale];

      this.setState({ localeId: localeId });
    }

    if (
      this.props.history &&
      this.props.history.location &&
      this.props.history.location.state &&
      this.props.history.location.state.linkBack
    ) {
      this.setState({
        linkBack: this.props.history.location.state.linkBack,
      });
    }
  }

  changeTab = (tab) => {
    this.setState({
      tab: tab,
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="publications">
          <div className="publications-header">
            <Link className="button" to={this.state.linkBack}>
              <FormattedMessage id="publication.back" />
            </Link>
            <h1>
              <FormattedMessage id="publication.title" />
            </h1>
            <span
              className="lang"
              data-tip={this.props.intl.formatMessage({
                id: "publication.lang.tooltip",
              })}
              data-for="publication-lang-tooltip"
            >
              {this.state.localeId !== undefined && (
                <FormattedMessage
                  id={`locale.${this.state.localeId}.full.translated`}
                />
              )}
            </span>
            <ReactTooltip
              id="publication-lang-tooltip"
              effect="solid"
              place="bottom"
            />
          </div>
          <div className="publications-tabs">
            <div
              className={cs("item", { active: this.state.tab === "pending" })}
              onClick={() => {
                this.changeTab("pending");
              }}
            >
              <FormattedMessage id="publication.tab.pending" />
            </div>
            <div
              className={cs("item", { active: this.state.tab === "journal" })}
              onClick={() => {
                this.changeTab("journal");
              }}
            >
              <FormattedMessage id="publication.tab.journal" />
            </div>
          </div>
          <div className="publications-main">
            <PublicationList section={this.state.tab} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withPageLayout(withRouter(injectIntl(Publications)));
