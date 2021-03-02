import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import SearchBar from "../../common/SearchBar";
import Select from "../../common/Select";
import Loader from "../../Loader";
import classnames from "classnames";

class PlanViewFull extends React.Component {
  constructor(props) {
    super(props);

    // show/hide countries
    let showCountries = false;
    if (props.countries.length > 1) {
      showCountries = true;
    }

    this.state = {
      showRecent: true,
      showCountries: showCountries,
    };
  }

  showHide = () => {
    this.setState({
      showRecent: !this.state.showRecent,
    });
  };

  render() {
    const { intl } = this.props;

    // prepare countries
    let countries = this.props.countries.map((item) => {
      return {
        value: item.iso,
        label: item.name + " (" + item.total + ")",
      };
    });

    return (
      <React.Fragment>
        {this.props.recent.length > 0 ? (
          <div className="collection-wrapper white">
            <div className="container max">
              <div className="coll-recent">
                <div
                  className={classnames("toggle-title", {
                    show: this.state.showRecent,
                  })}
                  onClick={() => this.showHide()}
                >
                  <FormattedMessage id="plans.recent" />
                </div>
                {this.state.showRecent === true ? (
                  <div className="listing">{this.props.recent}</div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        <div className="container max">
          <div className="collection-wrapper grey">
            <div className="tools">
              {this.state.showCountries === true ? (
                <Select
                  onChange={(value) => this.props.changeCountry(value)}
                  options={countries}
                />
              ) : null}
              <SearchBar
                search={this.props.search}
                reset={this.props.reset}
                placeholder={intl.formatMessage({
                  id: "plans.search.placeholder",
                })}
              />
            </div>

            <div className="coll-listing">
              <div className="grid-responsive">
                <table
                  className="table"
                  id="plans-table"
                  ref={(el) => (this.el = el)}
                >
                  <thead>
                    <tr className="header">
                      <th className="p40 md-p80">
                        <div
                          className={classnames(
                            "name",
                            {
                              [`${this.props.sort.type}`]:
                                this.props.sort.column === "title",
                            },
                            { active: this.props.sort.column === "title" }
                          )}
                          onClick={() => {
                            this.props.sort.fn(0);
                          }}
                        >
                          {intl.formatMessage({
                            id: "plans.list.header.title",
                          })}
                        </div>
                      </th>

                      <th className="auto md-hide">
                        <div
                          className={classnames(
                            "name",
                            {
                              [`${this.props.sort.type}`]:
                                this.props.sort.column === "address",
                            },
                            { active: this.props.sort.column === "address" }
                          )}
                          onClick={() => {
                            this.props.sort.fn(1);
                          }}
                        >
                          {intl.formatMessage({
                            id: "plans.list.header.address",
                          })}
                        </div>
                      </th>

                      <th className="p10 md-p20">
                        <div
                          className={classnames(
                            "name",
                            {
                              [`${this.props.sort.type}`]:
                                this.props.sort.column === "tag",
                            },
                            { active: this.props.sort.column === "tag" }
                          )}
                          onClick={() => {
                            this.props.sort.fn(2);
                          }}
                        >
                          {intl.formatMessage({ id: "plans.list.header.tag" })}
                        </div>
                      </th>

                      <th className="w150 md-hide">
                        <div
                          className={classnames(
                            "name",
                            {
                              [`${this.props.sort.type}`]:
                                this.props.sort.column === "update",
                            },
                            { active: this.props.sort.column === "update" }
                          )}
                          onClick={() => {
                            this.props.sort.fn(3);
                          }}
                        >
                          {intl.formatMessage({
                            id: "plans.list.header.update",
                          })}
                        </div>
                      </th>
                    </tr>
                    <tr>
                      <td colSpan="4">
                        {this.props.sort.column !== "group" ? (
                          <div
                            className={classnames("reset")}
                            onClick={() => {
                              this.props.sort.default();
                            }}
                          >
                            {intl.formatMessage({
                              id: "plans.list.filter.reset",
                            })}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.loading === false &&
                    this.props.collection.length > 0
                      ? this.props.collection
                      : null}

                    {this.props.loading === false &&
                    this.props.collection.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center noitems">
                          <FormattedMessage id="plans.list.nosearch" />
                        </td>
                      </tr>
                    ) : null}

                    {this.props.loading === true ? (
                      <tr>
                        <td colSpan="4" className="text-center noitems">
                          <Loader />
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default injectIntl(PlanViewFull);
