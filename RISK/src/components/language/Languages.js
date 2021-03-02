import React from "react";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import store from "../../utils/store";
import { FormattedMessage, injectIntl } from "react-intl";
import "../../css/Languages.scss";

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
    let languages = window.appConfig.lang.map(function (locale) {
      let current = false;

      if (locale === intl.formatMessage({ id: "lang" })) {
        current = true;
      }
      return {
        current: current,
        locale: locale,
        name: intl.formatMessage({ id: "lang." + locale + ".full" }),
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
      store.set("locale", lang.locale);
      this.props.history.go();
    }
  };

  render() {
    const that = this;

    return (
      <React.Fragment>
        {that.state.showLang === false ? (
          <div className="lang" onClick={() => that.toggleLang()}>
            <FormattedMessage id="lang.full" />
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
