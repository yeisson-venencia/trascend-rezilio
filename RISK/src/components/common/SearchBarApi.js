import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Tooltip from "./Tooltip";
import "./SearchBarApi.scss";

const regexp = window.appConfig.regexp.patternPlanSearch;

class SearchBarApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      search: "",
      isFocused: false,
      placeholder: props.placeholder,
      validity: false,
      tooltipActive: false,
    };
  }

  componentDidMount() {
    this.setState({
      search: this.props.defaultValue === null ? "" : this.props.defaultValue,
      isLoaded: true,
    });
  }

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };
  handleChange = (event) => {
    this.setState({
      search: event.target.value,
      validity: event.target.checkValidity(),
    });
  };
  handleSearch = () => {
    const regex = RegExp(regexp);

    if (this.state.search !== "") {
      if (regex.test(this.state.search)) {
        this.setState({ tooltipActive: false });
        this.props.searchAction(this.state.search);
      } else if (!this.state.validity) {
        this.setState(
          {
            tooltipActive: true,
          },
          () => {
            setTimeout(() => this.setState({ tooltipActive: false }), 3000);
          }
        );
      } else {
        this.setState({ tooltipActive: false });
        this.props.searchAction(this.state.search);
      }
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      return this.handleSearch();
    }
  };

  resetSearch = () => {
    this.setState({
      search: "",
      validity: false,
    });
    this.props.resetAction();
  };

  render() {
    const that = this;
    const {
      search,
      placeholder,
      isLoaded,
      isFocused,
      tooltipActive,
    } = that.state;

    const { intl } = this.props;

    return (
      isLoaded && (
        <div className="search-bar-api">
          <Tooltip
            active={tooltipActive}
            content={intl.formatMessage({
              id: "plans.text.search.input.tooltip",
            })}
          >
            <input
              value={search}
              placeholder={placeholder}
              pattern={regexp}
              title=""
              onChange={that.handleChange}
              onFocus={that.handleFocus}
              onBlur={that.handleBlur}
              onKeyDown={that.handleKeyDown}
            />
          </Tooltip>
          <button
            className={isFocused ? "search active" : "search"}
            onClick={that.handleSearch}
          />
          {search !== "" ? (
            <button className="close" onClick={that.resetSearch} />
          ) : null}
        </div>
      )
    );
  }
}

export default injectIntl(SearchBarApi);
