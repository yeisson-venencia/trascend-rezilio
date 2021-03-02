import React, { Component } from "react";
import { injectIntl } from "react-intl";
import "./PageNavigation.scss";

class PageNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    const that = this;
    that.setState({ isLoaded: true });
  }

  render() {
    const that = this;
    const { isLoaded } = that.state;
    const {
      pages,
      currentPage,
      onClick,
      navPrevious,
      navNext,
      onPreviousClick,
      onNextClick,
      onFastRewindClick,
      onFastForwardClick,
      intl,
    } = that.props;

    let maxItems = window.appConfig.paginationMaxPages;

    let arr = [];

    if (pages.length <= maxItems) {
      // ALL
      arr = pages;
    } else if (currentPage <= maxItems - 1 && currentPage <= maxItems / 2 + 1) {
      // START
      arr.push(
        ...pages.slice(0, maxItems),
        intl.formatMessage({ id: "page.navigation.continued" })
      );
    } else if (pages.length < currentPage + maxItems / 2) {
      // LAST RANGE OF PAGES
      let index = pages.length - maxItems;
      arr.push(
        intl.formatMessage({ id: "page.navigation.continued" }),
        ...pages.slice(index, index + maxItems)
      );
    } else if (currentPage > pages.length - 1) {
      // END
      let index = pages.length - maxItems;
      arr.push(
        intl.formatMessage({ id: "page.navigation.continued" }),
        ...pages.slice(index, index + maxItems)
      );
    } else {
      // BETWEEN
      let index = currentPage;
      arr.push(
        intl.formatMessage({ id: "page.navigation.continued" }),
        ...pages.slice(index - maxItems / 2, index + maxItems / 2),
        intl.formatMessage({ id: "page.navigation.continued" })
      );
    }

    return (
      <div className="page-navigation">
        {isLoaded && (
          <>
            <NavButton
              onClick={onPreviousClick}
              onFastClick={onFastRewindClick}
              fastRewind={true}
            >
              {navPrevious}
            </NavButton>
            <div
              className={`page-numbers-wrapper ${
                currentPage === pages.length
                  ? "previous-only"
                  : currentPage === 1
                  ? "next-only"
                  : null
              }`}
            >
              {arr.map((page, key) => {
                if (
                  page ===
                  intl.formatMessage({ id: "page.navigation.continued" })
                ) {
                  return (
                    <div className="next-pages" key={key}>
                      {intl.formatMessage({ id: "page.navigation.continued" })}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={key}
                      className={
                        currentPage !== page
                          ? "page-number"
                          : "page-number active"
                      }
                      onClick={() => onClick(page)}
                    >
                      {page}
                    </div>
                  );
                }
              })}
            </div>
            <NavButton
              onClick={onNextClick}
              onFastClick={onFastForwardClick}
              previous={false}
              fastForward={true}
            >
              {navNext}
            </NavButton>
          </>
        )}
      </div>
    );
  }
}

const NavButton = ({
  children,
  previous = true,
  fastRewind,
  fastForward,
  onClick,
  onFastClick,
}) => {
  return (
    <>
      {children ? (
        <div
          className={`page-numbers-nav-btn-wrapper ${
            previous ? "previous" : "next"
          }`}
        >
          {fastRewind && (
            <div
              className="page-numbers-fast-rewind"
              onClick={onFastClick}
            ></div>
          )}

          {previous && (
            <div className="page-numbers-rewind" onClick={onClick}>
              <div className="triangle-rewind" />
              <span>{children}</span>
            </div>
          )}
          {!previous && (
            <div className="page-numbers-forward" onClick={onClick}>
              <span>{children}</span>
              <div className="triangle-forward" />
            </div>
          )}

          {fastForward && (
            <div
              className="page-numbers-fast-forward"
              onClick={onFastClick}
            ></div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default injectIntl(PageNavigation);
