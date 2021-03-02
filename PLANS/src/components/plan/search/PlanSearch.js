import React from "react";
import { injectIntl } from "react-intl";
import Bowser from "bowser";
import { isInteger } from "lodash";
import { buildUrl, endpoint } from "../../../utils/UrlService";
import { withPlanLayout } from "../PlanLayout";
import { PlanTextSearch as PlanTextSearchModel } from "../../../models/PlanTextSearch";
import PageNavigation from "../../common/PageNavigation";
import PlanTextSearchResult from "./PlanTextSearchResult";
import Loader from "../../Loader";

import ApiService from "../../../utils/ApiService";

const Api = new ApiService();

const url = (query, planId, page) => {
  return `${buildUrl("PLAN_SEARCH", planId)}?query=${query}&page=${page}`;
};
const itemsPerPage = window.appConfig.itemsPerPage;

// set regex pattern per browser agent
const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.parsedResult.browser.name;
const regexp =
  browserName === "Safari"
    ? window.appConfig.regexp.patternPlanSearch.safari
    : window.appConfig.regexp.patternPlanSearch.default;

const getParams = (params) => {
  return new URLSearchParams(params);
};

const getParam = (params, param) => {
  return getParams(params).get(param);
};

class PlanSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.model, // plan model from PlanLayout HOC,
      planId: props.model.id, // plan id from plan model,
      loading: false, // triggers the loading component rendering
      search: "", // text being searched,
      searchUrl: "", // URL string to redirect to search result page,
      results: [], // text search results,
      isEmptySearch: false, // used for empty result rendering,
      nbPages: 0, // total result pages,
      currentPage: 1, // current active page,
    };
  }

  componentDidMount() {
    const that = this;
    const search = that.props.history.location.search;
    const searchParams = getParams(search);
    const queryParam = getParam(search, "query");
    const pageParam = getParam(search, "page");
    const page = parseInt(pageParam);
    const regex = RegExp(regexp);

    if (!regex.test(queryParam)) {
      that.props.history.replace(buildUrl("ERROR") + "#api");
    } else {
      // check if search is in the url on mount
      if (queryParam && queryParam !== "") {
        // if first page search (no page param)
        if (pageParam === null) {
          that.fetchSearchResults(
            that.state.model.id,
            queryParam,
            itemsPerPage,
            1
          );
        } else if (isInteger(page)) {
          // if page has changed, check what page we show
          that.fetchSearchResults(
            that.state.model.id,
            queryParam,
            itemsPerPage,
            page
          );
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const that = this;
    const search = that.props.history.location.search;
    const queryParam = getParam(search, "query");
    const pageParam = getParam(search, "page");
    const page = parseInt(pageParam);
    const regex = RegExp(regexp);

    // url query has changed
    // page number has changed in the url
    if (prevProps !== this.props) {
      if (!regex.test(queryParam)) {
        that.props.history.replace(buildUrl("ERROR") + "#api");
      } else {
        if (queryParam && queryParam !== "") {
          // if first page search (no page param)
          if (pageParam === null) {
            // if very first search (no page param)
            that.fetchSearchResults(
              that.state.model.id,
              queryParam,
              itemsPerPage,
              1
            );
          } else if (isInteger(page)) {
            // if page has changed, check what page we show and fetch API
            that.fetchSearchResults(
              that.state.model.id,
              queryParam,
              itemsPerPage,
              page
            );
          }
        }
      }
    }
  }

  handlePageClick = (page) => {
    const { search, model } = this.state;

    this.props.history.push(url(search, model.id, page));

    this.setState({ currentPage: page });
  };

  handlePreviousClick = () => {
    const { search, model } = this.state;

    this.setState({
      currentPage: this.state.currentPage - 1,
    });
    this.props.history.push(url(search, model.id, this.state.currentPage - 1));
  };

  handleNextClick = () => {
    const { model, search, currentPage } = this.state;

    if (currentPage > 0) {
      this.setState({ currentPage: currentPage + 1 });
      this.props.history.push(
        url(search, model.id, this.state.currentPage + 1)
      );
    }
  };

  handleFastRewindClick = () => {
    const { model, search } = this.state;
    this.setState({ currentPage: 1 });
    this.props.history.push(url(search, model.id, 1));
  };

  handleFastForwardClick = () => {
    const { model, search, nbPages } = this.state;
    this.setState({ currentPage: nbPages });
    this.props.history.push(url(search, model.id, nbPages));
  };

  fetchSearchResults = (planId, value, perPage = itemsPerPage, page) => {
    this.setState({
      loading: true,
      search: value,
      currentPage: page,
    });

    return new Promise((resolve, reject) => {
      Api.initAuth(this.props.history);

      const fetchResults = () => {
        return Api.get(
          endpoint("planTextSearch", [
            planId,
            encodeURIComponent(value),
            perPage,
            page,
          ])
        );
      };

      fetchResults()
        .then((response) => {
          if (response) {
            this.setState({
              loading: false,
            });
            // first check if empty response from API
            if (response.length === 0) {
              this.setState({
                isEmptySearch: true,
                results: [],
                nbPages: 0,
              });
            } else {
              let results = PlanTextSearchModel(
                response["hydra:member"],
                false
              );

              this.setState({
                isEmptySearch: false,
                results,
                nbPages: response["hydra:result"]["nbPages"],
              });

              resolve(true);
            }
          }
          // else {
          //   this.props.history.replace(buildUrl("ERROR") + "#api");
          //   reject(false);
          // }
        })
        .catch((err) => {
          this.props.history.replace(buildUrl("ERROR") + "#api");
          reject(false);
        });
    });
  };

  handleResultClick = (planId, sectionId, permalink) => {
    return buildUrl("PLAN_LINK", [planId, encodeURIComponent(permalink)]);
  };

  render = () => {
    const that = this;
    const {
      model,
      loading,
      nbPages,
      currentPage,
      search,
      results,
      isEmptySearch,
      planId,
    } = that.state;

    const { intl } = that.props;

    return (
      <>
        {model !== null && (
          <>
            {search !== "" && (
              <div className="plan-text-search">
                {loading && (
                  <>
                    <SearchLoader
                      text={intl.formatMessage({
                        id: "plans.text.search.loading.message",
                      })}
                    />
                  </>
                )}
                {!loading && (
                  <>
                    <div className="search-result">
                      <PlanTextSearchResult
                        search={search}
                        outputMessage={intl.formatMessage({
                          id: isEmptySearch
                            ? "plans.text.search.empty.message"
                            : "plans.text.search.output.message",
                        })}
                        results={results}
                        planId={planId}
                        link={(permalink) => {
                          return buildUrl("PLAN_LINK", [
                            planId,
                            encodeURIComponent(permalink),
                          ]);
                        }}
                      />

                      {nbPages !== 0 && (
                        <PageNavigation
                          pages={[...Array(nbPages + 1).keys()].slice(1)}
                          onClick={that.handlePageClick}
                          currentPage={currentPage}
                          navPrevious={
                            currentPage === 1
                              ? null
                              : intl.formatMessage({
                                  id: "page.navigation.button.previous",
                                })
                          }
                          navNext={
                            currentPage === nbPages
                              ? null
                              : intl.formatMessage({
                                  id: "page.navigation.button.next",
                                })
                          }
                          onPreviousClick={that.handlePreviousClick}
                          onNextClick={that.handleNextClick}
                          onFastRewindClick={that.handleFastRewindClick}
                          onFastForwardClick={that.handleFastForwardClick}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  };
}

const SearchLoader = ({ text }) => {
  return (
    <div className="search-loader-wrapper">
      <div className="search-loader-message">{text}</div>
      <Loader wrapper={false} />
    </div>
  );
};

export default withPlanLayout(injectIntl(PlanSearch));
