import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import { endpoint, buildUrl } from "../../../utils/UrlService";
import { FormattedMessage } from "react-intl";
import { Plan as PlanModel } from "../../../models/Plan";
import { Country as CountryModel } from "../../../models/Country";
import Loader from "../../Loader";
import PlanViewCompact from "./PlanViewCompact";
import PlanViewFull from "./PlanViewFull";
import PlanBox from "./PlanBox";
import PlanRow from "./PlanRow";
import PlanGroup from "./PlanGroup";
import NoPlan from "./NoPlan";
import "./PlanCollection.scss";
import "../../../css/Grid.scss";

import ApiService from "../../../utils/ApiService";
const Api = new ApiService();

let provinceArray = [];

const normalize = (val) => {
  return val.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

class PlanCollection extends React.Component {
  state = {
    countries: [],
    collection: [],
    collection_recent: [],
    sort: "group", // default sort by group
    sort_type: "asc",
    isLoaded: false,
    loading: false,
    display: "compact",
    search: "",
    count: 0,
  };

  componentDidMount = () => {
    this.fetchCountries();
  };

  fetchCountries = () => {
    const that = this;

    Api.initAuth(that.props.history);
    Api.get(endpoint("plansCountries"))
      .then((res) => {
        if (res) {
          let coll = CountryModel(res["hydra:member"]);

          // get number of plans (for all countries)
          let total = 0;

          if (coll.length > 0) {
            total = coll
              .map((item) => item.total)
              .reduce((acc, val) => {
                return acc + val;
              });
          }

          let display = "compact",
            isLoaded = false;

          if (total === 0) {
            display = "empty";
            isLoaded = true;
          }

          if (total >= 1 && total <= 10) {
            display = "compact";
            that.fetchData();
          }

          if (total > 10) {
            display = "full";
            that.fetchRecentCollection();
            // fetch data for my own country
            that.fetchData(that.props.profile.address.iso);
          }

          that.setState({
            display: display,
            countries: coll,
            isLoaded: isLoaded,
          });
        } else {
          that.props.history.replace(buildUrl("ERROR") + "#api");
        }
      })
      .catch(function (err) {
        that.props.history.replace(buildUrl("ERROR") + "#api");
      });
  };

  fetchData = (country) => {
    const that = this;

    that.setState({
      loading: true,
    });

    let url = endpoint("plans", [500, 1]);

    if (country !== undefined) {
      url = endpoint("plansCountry", [country, 500, 1]);
    }

    Api.initAuth(that.props.history);
    Api.get(url)
      .then((res) => {
        if (res) {
          let coll = PlanModel(res["hydra:member"]);

          // redirection if user has one plan available only
          if (coll.length === 1) {
            that.props.history.push(buildUrl("PLAN", coll[0].id));
          }

          that.setState({
            collection: coll,
            isLoaded: true,
            loading: false,
            count: res["hydra:totalItems"],
          });
        } else {
          that.props.history.replace(buildUrl("ERROR") + "#api");
        }
      })
      .catch(function (err) {
        that.props.history.replace(buildUrl("ERROR") + "#api");
      });
  };

  fetchRecentCollection = () => {
    const that = this;

    Api.initAuth(that.props.history);
    Api.get(endpoint("plansRecent"))
      .then((res) => {
        if (res) {
          let coll = PlanModel(res["hydra:member"]);

          that.setState({
            collection_recent: coll,
          });
        } else {
          that.props.history.replace(buildUrl("ERROR") + "#api");
        }
      })
      .catch(function (err) {
        that.props.history.replace(buildUrl("ERROR") + "#api");
      });
  };

  prepareData(value) {
    provinceArray.push(value.organization.province);

    const province = _.find(provinceArray, (province) => {
      return normalize(province) === normalize(value.organization.province);
    });

    let obj = {
      id: value.id,
      title: value.name,
      address: value.organization.street + ", " + value.organization.zip,
      city:
        value.organization.city +
        ", " +
        province +
        ", " +
        value.organization.country,
      group: province,
      tag: value.type,
      color: value.color,
      sections: value.sections,
      update: value.update,
      url: value.url,
    };

    obj.multiLanguageEnabled = value.multiLanguageEnabled;

    return obj;
  }

  filterCollection = (coll) => {
    let search = this.state.search;

    if (search && search.length > 0) {
      coll = coll.filter(function (e) {
        // uses model object
        let stringObj = [e.name, e.address, e.city, e.type]
          .join(" ")
          .toLowerCase();

        if (stringObj.includes(search.toLowerCase())) {
          return true;
        }
        return false;
      });
    }

    return coll;
  };

  sortCollection = (coll) => {
    const that = this;

    // sort collection based on this.state.sort and this.state.sort_type
    coll = coll.sort(function (a, b) {
      if (that.state.sort_type === "desc") {
        [a, b] = [b, a];
      }

      switch (that.state.sort) {
        case "group":
          if (a.organization.province === b.organization.province) {
            if (a.organization.city === b.organization.city) {
              // sort by name
              a.name.localeCompare(b.name);
            }
            // sort by city
            return a.organization.city.localeCompare(b.organization.city);
          }
          // sort by group
          return a.organization.province.localeCompare(b.organization.province);

        case "title":
          return a.name.localeCompare(b.name);

        case "address":
          if (a.organization.city === b.organization.city) {
            a.name.localeCompare(b.name);
          }
          return a.organization.city.localeCompare(b.organization.city);

        case "tag":
          if (a.type === b.type) {
            a.name.localeCompare(b.name);
          }
          return a.type.localeCompare(b.type);

        case "update":
          return a.update - b.update;

        default:
          return a.id - b.id;
      }
    });

    return coll;
  };

  handleSearch = (val) => {
    this.setState({
      search: val,
    });
  };

  resetSearch = () => {
    this.setState({
      search: "",
    });
  };

  changeCountry = (iso) => {
    this.fetchData(iso);
  };

  sortByColumn = (column) => {
    let sort = "",
      type = "asc";

    switch (column) {
      case 0:
        sort = "title";
        break;
      case 1:
        sort = "address";
        break;
      case 2:
        sort = "tag";
        break;
      case 3:
        sort = "update";
        break;
      default:
        sort = "update";
    }

    if (this.state.sort === sort) {
      if (this.state.sort_type === "asc") {
        type = "desc";
      }
    }

    this.setState({
      sort: sort,
      sort_type: type,
    });
  };

  sortByDefault = () => {
    this.setState({
      sort: "group",
      sort_type: "asc",
    });
  };

  render = () => {
    if (this.state.isLoaded !== true) {
      // show loader
      return (
        <div className="plans">
          <div className="container max">
            <div className="centered">
              <Loader />
            </div>
          </div>
        </div>
      );
    } else {
      // show boxes (compact view)
      let coll = this.state.collection.map((value) => {
        return <PlanBox key={value.id} data={this.prepareData(value)} />;
      });

      // show boxes (full view if any recent)
      let coll_recent = this.state.collection_recent
        .slice(0, 5)
        .map((value) => {
          return <PlanBox key={value.id} data={this.prepareData(value)} />;
        });

      // show all plans (full view + search)
      let coll_full = this.filterCollection(this.state.collection);
      // apply sort
      coll_full = this.sortCollection(coll_full);

      let group = "";

      coll_full = coll_full.map((value) => {
        let data = this.prepareData(value),
          el;

        if (this.state.sort === "group" && group !== data.group) {
          el = (
            <React.Fragment key={value.id}>
              <PlanGroup value={data.group} />
              <PlanRow key={value.id} data={data} />
            </React.Fragment>
          );
        } else {
          el = <PlanRow key={value.id} data={data} />;
        }

        group = data.group;

        return el;
      });

      return (
        <div className="plans">
          {this.state.display === "empty" ? (
            <div className="container max">
              <NoPlan />
            </div>
          ) : (
            <div className="container max">
              <div className="top">
                <div className="title">
                  <FormattedMessage id="plans.access" />
                </div>
                {/*
                <div className="button list active">
                  <FormattedMessage id="plans.list" />
                </div>
                <div className="button geo">
                  <FormattedMessage id="plans.geomap" />
                </div>
                */}
              </div>
            </div>
          )}

          {this.state.display === "compact" ? (
            <PlanViewCompact collection={coll} />
          ) : null}

          {this.state.display === "full" ? (
            <PlanViewFull
              recent={coll_recent}
              collection={coll_full}
              countries={this.state.countries}
              changeCountry={this.changeCountry}
              search={this.handleSearch}
              sort={{
                column: this.state.sort,
                type: this.state.sort_type,
                fn: this.sortByColumn,
                default: this.sortByDefault,
              }}
              loading={this.state.loading}
              reset={this.resetSearch}
            />
          ) : null}
        </div>
      );
    } //isLoaded
  }; //render
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(PlanCollection));
