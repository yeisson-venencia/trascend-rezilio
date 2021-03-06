import React from "react";
import { Link, withRouter } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import PropTypes from "prop-types";
import store from "../../utils/store";
import classnames from "classnames";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import DTS from "../../utils/DateTimeService";
import Languages from "../language/Languages";
import "./HeaderPrivate.scss";

class HeaderPrivate extends React.Component {
  constructor(props) {
    super(props);

    this.toggleUserMenu = this.toggleUserMenu.bind(this);
    this.toggleProductMenu = this.toggleProductMenu.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);

    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.modules = [
      {
        id: 1,
        name: "products.logbook",
        classname: "logbook",
        hasLogo: true,
        url: buildUrl("LOGBOOK_SSO", store.get("id_token")),
      },
      {
        id: 2,
        name: "products.plansv2",
        classname: "plansv2",
        hasLogo: false,
        url: this.props.profile.homeUrl + "&s=h",
      },
    ];

    this.state = {
      showUserMenu: false,
      showProductMenu: false,
      showMobileMenu: false,
      datetime: DTS.now(),
    };
  }

  componentDidMount = () => {
    const { intl } = this.props;

    // change window title
    document.title = intl.formatMessage({ id: "page.title.app" });

    this.intervalID = setInterval(() => this.tick(), 1000);

    // listen to local storage change
    window.addEventListener("storage", function (e) {
      if (e.key === "profile") {
        // refresh
        window.location.reload();
      }
    });
  };

  componentWillUnmount = () => {};

  tick() {
    this.setState({
      datetime: DTS.now(),
    });
  }

  handleOutsideClick(e) {
    const that = this;

    if (that.nodeRef && !that.nodeRef.contains(e.target)) {
      that.setState({
        showUserMenu: false,
        showProductMenu: false,
        showMobileMenu: false,
      });
      document.removeEventListener("click", that.handleOutsideClick, false);
    }
  }

  toggleUserMenu() {
    const that = this;

    if (that.state.showUserMenu === true) {
      that.setState({
        showUserMenu: false,
        showProductMenu: false,
        showMobileMenu: false,
      });
    } else {
      that.setState({
        showUserMenu: true,
        showProductMenu: false,
        showMobileMenu: false,
      });
      document.addEventListener("click", that.handleOutsideClick, false);
    }
  }

  toggleProductMenu() {
    const that = this;

    if (that.state.showProductMenu === true) {
      that.setState({
        showUserMenu: false,
        showProductMenu: false,
        showMobileMenu: false,
      });
    } else {
      that.setState({
        showUserMenu: false,
        showProductMenu: true,
        showMobileMenu: false,
      });
      document.addEventListener("click", that.handleOutsideClick, false);
    }
  }

  toggleMobileMenu() {
    const that = this;

    if (that.state.showMobileMenu === true) {
      that.setState({
        showUserMenu: false,
        showProductMenu: false,
        showMobileMenu: false,
      });
    } else {
      that.setState({
        showUserMenu: false,
        showProductMenu: false,
        showMobileMenu: true,
      });
      document.addEventListener("click", that.handleOutsideClick, false);
    }
  }

  changeLang(locale) {
    store.set("locale", locale);
    window.location.reload();
  }

  render() {
    const that = this;
    const { intl } = this.props;

    let organizationModule = (
      <React.Fragment>
        <div className="icon"></div>
        <div className="name">{that.props.profile.user.organizationName}</div>
      </React.Fragment>
    );

    let userModule = (
      <React.Fragment>
        <div className="icon"></div>
        <div className="text">
          <div className="name">{that.props.profile.user.name}</div>
          <div className="mission">{that.props.profile.user.missionName}</div>
        </div>
      </React.Fragment>
    );

    let menuModule = (
      <React.Fragment>
        <a
          className="item profile"
          target="_blank"
          rel="noopener noreferrer"
          href={this.props.profile.homeUrl + "&s=u"}
        >
          <FormattedMessage id="header.menu.profile" />
        </a>
        <Link
          className="item settings"
          to={{
            pathname: buildUrl("PUBLICATIONS"),
            state: { linkBack: this.props.location.pathname },
          }}
        >
          <FormattedMessage id="header.menu.publications" />
        </Link>
        {/*
        <div className="item settings">Account settings</div>
        <div className="item docs">Documentation</div>
        <div className="item admin">Administration</div>
        */}
        <div
          className="item logout"
          onClick={() => {
            that.props.auth.logout();
          }}
        >
          <FormattedMessage id="header.menu.logout" />
        </div>
      </React.Fragment>
    );

    let productModule = (
      <React.Fragment>
        {that.modules.map(function (module) {
          return (
            <div className={module.classname + " item"} key={module.id}>
              <a target="_blank" rel="noopener noreferrer" href={module.url}>
                <FormattedMessage id={module.name} />
                <div className="module-logo">
                  {module.hasLogo === false &&
                    intl
                      .formatMessage({ id: module.name })
                      .substr(0, 1)
                      .toUpperCase()}
                </div>
              </a>
            </div>
          );
        })}
      </React.Fragment>
    );

    return (
      <div className="header-private">
        <h1 className="logo">
          <Link to={buildUrl("HOME")}>
            <FormattedMessage id="page.title" />
          </Link>
          {that.props.profile.image && (
            <img className="px" alt="s" src={that.props.profile.image} />
          )}
        </h1>

        <div className="datetime">
          {this.state.datetime.format(
            intl.formatMessage({ id: "format.date.Y" })
          )}
          <span>/</span>
          {this.state.datetime.format(
            intl.formatMessage({ id: "format.date.M" })
          )}
          <span>/</span>
          {this.state.datetime.format(
            intl.formatMessage({ id: "format.date.D" })
          )}
          <div className="space"></div>
          {this.state.datetime.format(
            intl.formatMessage({ id: "format.time.12.h" })
          )}
          <span>:</span>
          {this.state.datetime.format(
            intl.formatMessage({ id: "format.time.12.m" })
          )}
          <span>:</span>
          {this.state.datetime.format(
            intl.formatMessage({ id: "format.time.12.s" })
          )}
          <span>
            {this.state.datetime.format(
              intl.formatMessage({ id: "format.time.12.A" })
            )}
          </span>
        </div>
        <div className="line"></div>

        <div className="org">{organizationModule}</div>
        <div className="spacer"></div>

        <div
          ref={(node) => {
            this.nodeRef = node;
          }}
          onClick={() => that.toggleUserMenu()}
          className={classnames("user", { active: that.state.showUserMenu })}
        >
          {userModule}

          <div
            className={classnames("menu", { active: that.state.showUserMenu })}
          >
            {menuModule}
          </div>
        </div>
        <div className="line"></div>

        <div className="lang-wrapper">
          <Languages auth={true} />
        </div>

        <div className="products" onClick={() => that.toggleProductMenu()}>
          <div
            className={classnames("products-toggler", {
              active: that.state.showProductMenu,
            })}
          ></div>
          <div
            className={classnames("menu", {
              active: that.state.showProductMenu,
            })}
          >
            {productModule}
          </div>
        </div>

        <div className="mobile-top" onClick={() => that.toggleMobileMenu()}>
          <div
            className={classnames("menu", {
              active: that.state.showMobileMenu,
            })}
          >
            <div
              className="close"
              onClick={() => that.toggleMobileMenu()}
            ></div>
            <div className="content">
              <div className="items">{menuModule}</div>
            </div>
          </div>
        </div>

        <div className="mobile-bottom">
          <div className="mobile-user">{userModule}</div>
          <div
            className="mobile-products"
            onClick={() => that.toggleProductMenu()}
          >
            <div
              className={classnames("products-toggler", {
                active: that.state.showProductMenu,
              })}
            ></div>
            <div
              className={classnames("menu", {
                active: that.state.showProductMenu,
              })}
            >
              {productModule}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HeaderPrivate.propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(injectIntl(HeaderPrivate)));
