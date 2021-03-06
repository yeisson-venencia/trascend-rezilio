import React from "react";
import "./FooterPublic.scss";
import { FormattedMessage, injectIntl } from "react-intl";
//import { Link } from 'react-router-dom'
//import {buildUrl} from '../../utils/UrlService'

class FooterPublic extends React.Component {
  render() {
    const { intl } = this.props;

    return (
      <footer className="footer-public">
        <div className="logo">
          <FormattedMessage id="footer.copyright" values={{currentYear: new Date().getFullYear()}} />
        </div>

        <div className="links">
          <div className="footer-item">
            <a
              target="_blank"
              href={intl.formatMessage({ id: "footer.privacypolicy.link" })}
              rel="noopener noreferrer"
            >
              <FormattedMessage id="footer.privacypolicy" />
            </a>
          </div>
          <div className="footer-item">
            <a
              target="_blank"
              href={intl.formatMessage({ id: "footer.terms.link" })}
              rel="noopener noreferrer"
            >
              <FormattedMessage id="footer.terms" />
            </a>
          </div>
          {/*
          <div className="footer-item">
            <Link to={ buildUrl('SUPPORT') }>
              <FormattedMessage id="footer.support" />
            </Link>
          </div>
          */}
        </div>
      </footer>
    );
  }
}

export default injectIntl(FooterPublic);
