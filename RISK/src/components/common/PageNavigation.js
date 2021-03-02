import React, { Component } from "react";
import "./Page.navigation.scss";

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
    } = that.props;

    return (
      <div className="page-navigation">
        {isLoaded && (
          <>
            <NavButton onClick={onPreviousClick}>{navPrevious}</NavButton>
            <div
              className={`page-numbers-wrapper ${
                currentPage === pages.length
                  ? "previous-only"
                  : currentPage === 1
                  ? "next-only"
                  : null
              }`}
            >
              {pages.map((page, key) => (
                <div
                  key={page}
                  className={
                    currentPage !== page ? "page-number" : "page-number active"
                  }
                  onClick={() => onClick(page)}
                >
                  {page}
                </div>
              ))}
            </div>
            <NavButton onClick={onNextClick} previous={false}>
              {navNext}
            </NavButton>
          </>
        )}
      </div>
    );
  }
}

const NavButton = ({ children, previous = true, onClick }) => {
  return (
    <>
      {children ? (
        <div
          className={`page-numbers-nav-btn-wrapper ${
            previous ? "previous" : "next"
          }`}
        >
          <div className="page-numbers-nav-btn" onClick={onClick}>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PageNavigation;
