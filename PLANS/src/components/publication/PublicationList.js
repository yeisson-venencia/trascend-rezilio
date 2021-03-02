import React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { buildUrl, endpoint } from "../../utils/UrlService";
import Loader from "../Loader";
import { Publication as PublicationModel } from "../../models/Publication";
import ApiService from "../../utils/ApiService";
import PublicationRowPending from "./PublicationRowPending";
import PublicationRowJournal from "./PublicationRowJournal";
import PublicationNoData from "./PublicationNoData";
import PublicationDetail from "./PublicationDetail";
import "./PublicationList.scss";
import "../../css/Grid.scss";

const Api = new ApiService();

//main app
class PublicationList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      section: this.props.section,
      loading: false,
      collection: [],
      model: undefined,
      showDetails: false,
    };
  }

  componentDidMount = () => {
    this.fetchData(this.state.section);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.section !== this.props.section) {
      this.fetchData(this.props.section);

      this.setState({
        section: this.props.section,
        loading: true,
      });
    }

    // notification from child to re-render
    if (prevState.refresh !== this.state.refresh) {
      this.fetchData(this.state.section);
    }
  };

  showDetails = (val, model) => {
    if (val === true) {
      this.setState({
        model: { ...model },
        showDetails: true,
      });
    } else {
      this.setState({
        showDetails: false,
      });
    }
  };

  refresh = () => {
    this.setState({
      showDetails: false,
    });
    this.fetchData(this.state.section);
  };

  fetchData = (section) => {
    let data = {};

    this.setState({
      loading: true,
    });

    switch (section) {
      case "pending":
        data = {
          mode: 2,
        };
        break;
      case "journal":
        data = {
          log: 1,
        };
        break;
      default:
    }

    Api.initAuth(this.props.history);
    Api.post(endpoint("planActivity"), data).then((res) => {
      if (res !== undefined) {
        let coll = PublicationModel(res);

        this.setState({
          loading: false,
        });

        // sort when pending
        if (section === "pending") {
          coll = this.sortCollection(coll, "update", "asc");
        }

        // filtering when journal
        if (section === "journal") {
          // need to keep only accepted and rejected
          coll = this.filterCollection(coll);
          coll = this.sortCollection(coll, "update", "desc");
        }

        // prevent rendering section which has changed already
        if (section === this.state.section) {
          this.setState({
            collection: coll,
            loading: false,
          });
        }
      } else {
        this.props.history.replace(buildUrl("ERROR") + "#api");
      }
    });
  };

  filterCollection = (coll) => {
    coll = coll.filter(function (e) {
      return e.status === "MODE_ACCEPTED" || e.status === "MODE_REJECTED";
    });

    return coll;
  };

  sortCollection = (coll, sort, sort_type) => {
    // sort collection based the sort param

    coll = coll.sort(function (a, b) {
      if (sort_type === "desc") {
        [a, b] = [b, a];
      }

      switch (sort) {
        case "update":
          return a.update - b.update;

        default:
          return a.id - b.id;
      }
    });

    return coll;
  };

  render = () => {
    const { intl } = this.props;

    let coll = this.state.collection.map((item, i) => {
      let obj;

      if (this.state.section === "pending") {
        obj = (
          <PublicationRowPending
            key={"pending-" + item.uid + "-" + i}
            model={item}
            section={this.state.section}
            showDetails={(val, model) => this.showDetails(val, model)}
          />
        );
      }

      // filtering when journal
      if (this.state.section === "journal") {
        obj = (
          <PublicationRowJournal
            key={"log-" + item.uid + "-" + i}
            model={item}
            section={this.state.section}
            showDetails={(val, model) => this.showDetails(val, model)}
          />
        );
      }

      return obj;
    });

    if (this.state.loading === false && this.state.collection.length === 0) {
      // show no data view
      return <PublicationNoData />;
    } else {
      return (
        <React.Fragment>
          <div className="grid-responsive">
            <table
              className="table"
              id="publication-table"
              ref={(el) => (this.el = el)}
            >
              {this.state.section === "pending" ? (
                <thead>
                  <tr className="header">
                    <th className="p60">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.section",
                        })}
                      </div>
                    </th>
                    <th className="w200 md-hide">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.plan.name",
                        })}
                      </div>
                    </th>
                    <th className="w150 md-hide">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.plan.site",
                        })}
                      </div>
                    </th>
                    <th className="w90 md-p20">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.plan.type",
                        })}
                      </div>
                    </th>
                    <th className="w50 md-p20"></th>
                  </tr>
                </thead>
              ) : null}
              {this.state.section === "journal" ? (
                <thead>
                  <tr className="header">
                    <th className="p60">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.section",
                        })}
                      </div>
                    </th>
                    <th className="w100 md-p20">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.plan.type",
                        })}
                      </div>
                    </th>
                    <th className="w150 md-p20">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.status",
                        })}
                      </div>
                    </th>
                    <th className="w200 md-hide">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.user",
                        })}
                      </div>
                    </th>
                    <th className="w150 md-hide">
                      <div className="name no-sort">
                        {intl.formatMessage({
                          id: "publication.list.header.date",
                        })}
                      </div>
                    </th>
                  </tr>
                </thead>
              ) : null}

              <tbody>
                {this.state.loading === false &&
                this.state.collection.length > 0
                  ? coll
                  : null}

                {this.state.loading === true ? (
                  <tr>
                    <td colSpan="5" className="text-center noitems">
                      <Loader />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {this.state.showDetails && (
            <PublicationDetail
              show={this.showDetails}
              model={this.state.model}
              refresh={this.refresh}
            />
          )}
        </React.Fragment>
      );
    }
  };
}

export default withRouter(injectIntl(PublicationList));
