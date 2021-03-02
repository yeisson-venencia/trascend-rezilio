import React, { Component } from "react";
import Icon from "../../common/Icon";

import "./PlanTextSearchResult.scss";

class PlanTextSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  componentDidMount() {
    this.setState({ loading: true });
  }
  render() {
    let { loading } = this.state;
    let { search, outputMessage, results, link } = this.props;
    return (
      <>
        {loading && (
          <>
            <div className="search-result-output-message">
              {outputMessage}
              <span className="search-result-term-wrapper">
                “<span className="search-result-term">{search}</span>”
              </span>
            </div>
            <div className="search-result-list-wrapper">
              {results.map((result, key) => {
                return (
                  <TextResult
                    key={result.id}
                    breadcrumb={result.breadcrumb}
                    title={result.title}
                    description={result.description}
                    icon={result.icon}
                    color={result.color}
                    link={link(result.permalink)}
                  />
                );
              })}
            </div>
          </>
        )}
      </>
    );
  }
}

const TextResult = ({ breadcrumb, title, description, icon, color, link }) => {
  return (
    <div className="search-result-item">
      <div className="search-result-item-breadcrumb">{breadcrumb}</div>
      <div className="search-result-item-title-wrapper">
        {icon !== "" && (
          <div className="icon">
            <Icon icon={icon} color={color} />
          </div>
        )}
        <a className="search-result-item-title" href={link}>
          {title}
        </a>
      </div>
      <div className="search-result-item-description">{description}</div>
    </div>
  );
};

export default PlanTextSearchResult;
