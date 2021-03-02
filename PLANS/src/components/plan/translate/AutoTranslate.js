import React from "react";
import { injectIntl } from "react-intl";
import store from "../../../utils/store";

const setLocale = () => {
  if (store.get("locale") !== null) {
    let localObj;

    const locale = store.get("locale").replace("-", " ");
    const localeLang = store.get("locale").substring(0, 2);
    const localeId = window.appConfig.localeId[localeLang];

    localObj = { locale, localeLang, localeId };

    return localObj;
  }
};

export function withAutoTranslate(WrappedComponent) {
  class AutoTranslate extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        multiLanguageEnabled: false,
        interfaceLocale: undefined,
        interfaceLanguage: undefined,
        contentLanguageFull: undefined,
        contentLanguage: undefined,
        allowTranslation: false,
      };

      if (setLocale() !== undefined) {
        this.localeLangFull = props.intl.formatMessage({
          id: `locale.${setLocale().localeId}.full`,
        });
      }
    }

    componentDidMount = () => {
      if (setLocale() !== undefined) {
        this.setState({
          interfaceLocale: setLocale().locale,
          interfaceLocaleFull: this.localeLangFull,
          interfaceLanguage: setLocale().localeLang,
        });
      }
    };

    componentDidUpdate = (prevProps, prevState) => {
      if (this.state.multiLanguageEnabled !== prevState.multiLanguageEnabled) {
        // if multi-language enabled for that plan, toggle translation if applicable
        if (this.state.multiLanguageEnabled) {
          if (setLocale() !== undefined) {
            this.setState(
              {
                interfaceLocale: setLocale().locale,
                interfaceLocaleFull: this.localeLangFull,
                interfaceLanguage: setLocale().localeLang,
              },
              () => {
                this.allowTranslation();
              }
            );
          }
        }
      }
    };

    allowTranslation = () => {
      if (this.state.interfaceLanguage !== this.state.contentLanguage) {
        this.setState({
          allowTranslation: true,
        });
      }
    };

    setContentLanguage = (multiLanguageEnabled, contentLanguage) => {
      this.setState({
        multiLanguageEnabled: multiLanguageEnabled,
        contentLanguage: contentLanguage.substring(0, 2),
        contentLanguageFull: contentLanguage,
      });
    };

    render = () => {
      return (
        <WrappedComponent
          {...this.state}
          {...this.props}
          setContentLanguage={this.setContentLanguage}
        />
      );
    };
  }

  return injectIntl(AutoTranslate);
}
