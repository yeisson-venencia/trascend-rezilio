import React from "react";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import store from "../../utils/store";
import { FormattedMessage, injectIntl } from "react-intl";
import "./Languages.scss";
import ApiService from "../../utils/ApiService";
const Api = new ApiService();

const localeConfigObj = window.appConfig.locale;
const localeIdConfigObj = window.appConfig.localeId;

class Languages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLang: false,
      languages: [],
    };
  }

  componentDidMount() {
    const that = this;
    const { intl } = that.props;

    // show languages
    let languages = Object.keys(localeConfigObj).map(function (key) {
      let current = false;
      const locale = localeConfigObj[key].toLowerCase();

      if (locale.substring(0, 2) === intl.formatMessage({ id: "lang" })) {
        current = true;
      }

      const localeId =
        "locale." +
        locale.substring(0, 2) +
        "." +
        locale.substring(3, 5) +
        ".full";

      return {
        current: current,
        locale: locale,
        localeId: localeId,
        name: intl.formatMessage({
          id: localeId,
        }),
      };
    });

    // sort the actual first
    languages = languages.sort(function (a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });

    let index = languages.findIndex((lang) => lang.current === true),
      item = languages[index];

    languages = languages.filter(function (item) {
      return item.current === false;
    });

    that.setState({
      languages: [item].concat(languages),
    });
  }

  handleOutsideClick = (e) => {
    const that = this;

    if (that.nodeRef && !that.nodeRef.contains(e.target)) {
      that.setState({
        showLang: false,
      });

      if (that.props.callback) {
        that.props.callback(false);
      }

      document.removeEventListener("click", that.handleOutsideClick, false);
    }
  };

  toggleLang = () => {
    const that = this;

    if (that.state.showLang === true) {
      that.setState({
        showLang: false,
      });

      if (that.props.callback) {
        that.props.callback(false);
      }
    } else {
      that.setState({
        showLang: true,
      });

      if (that.props.callback) {
        that.props.callback(true);
      }
      document.addEventListener("click", that.handleOutsideClick, false);
    }
  };

  changeLang = (lang) => {
    if (!lang.current) {
      // map language to locale
      let locale = window.appConfig.locale[lang.locale.substr(0, 2)];
      store.set("locale", locale);

      // if user is logged in persist with api
      if (this.props.auth === true) {
        // persist locale with the api
        Api.initAuth(this.props.history);
        Api.put(window.appConfig.endpoints.localeUpdate, {
          locale: locale,
        }).then((res) => {
          this.props.history.go();
        });
      } else {
        this.props.history.go();
      }
    }
  };

  render() {
    const that = this;
    const { intl } = that.props;
    const currentLanguage = intl.formatMessage({ id: "lang" });
    const currentLocaleId = localeIdConfigObj[currentLanguage];
    const localeFull = `locale.${currentLocaleId}.full`;

    return (
      <React.Fragment>
        {that.state.showLang === false ? (
          <div className="lang" onClick={() => that.toggleLang()}>
            {this.state.languages.length > 0 && (
              <FormattedMessage id={localeFull} />
            )}
          </div>
        ) : (
          <div
            className="lang-open"
            onClick={() => that.toggleLang()}
            ref={(node) => {
              this.nodeRef = node;
            }}
          >
            {that.state.languages.map(function (lang) {
              return (
                <div
                  className={classnames("item", { current: lang.current })}
                  key={lang.locale}
                  onClick={() => that.changeLang(lang)}
                >
                  {lang.name}
                </div>
              );
            })}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default injectIntl(withRouter(Languages));
