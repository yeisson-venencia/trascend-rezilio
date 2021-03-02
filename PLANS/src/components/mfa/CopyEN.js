import React from "react";
import "./MFA.scss";

class CopyEN extends React.Component {
  render() {
    const { mfa } = this.props;

    return (
      <div className="mfa-copy">
        <div className="row border-bottom">
          <div className="col-12 col-lg-8 section-title">
            <h1>You must enable two-factor authentication</h1>
            <p className="highlight">
              First, what is two-factor or multi-factor authentication (2FA or
              MFA)?
            </p>
            <p>
              A multi-factor identification combines two different and
              independent components and is used to authenticate a user so that
              he or she is granted access.This method is becoming more and more
              common among financial institutions, Google, Microsoft, and many
              others.
            </p>
          </div>

          <div className="col-12 col-lg-4 section-info">
            <h1>You must enable two-factor authentication</h1>
            <div className="box">
              <h2 className="title">IMPORTANT</h2>
              <div className="text">
                <p>
                  Please note that you must make sure that you understand the
                  elements of this page before leaving it.
                </p>
                <p>
                  Otherwise, on your next login attempt, you may not be able to
                  log in to the Rezilio portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {mfa.organizationMfa === 1 &&
        mfa.emailNotification === 1 &&
        mfa.smsNotification === 1 ? (
          <div className="row border-bottom">
            <div className="section-options">
              <div className="col-12 col-lg-6">
                <h2>
                  If one of the 3 options, as described below, is in place, you
                  will be able to connect.
                </h2>
              </div>
              <div className="row">
                <div className="col-12 col-lg-4 box">
                  <h3 className="o1">Option 1</h3>
                  <p>
                    The email address associated with your profile is valid and
                    is functional
                  </p>
                </div>
                <div className="col-12 col-lg-4 box">
                  <h3 className="o2">Option 2</h3>
                  <p>
                    On the profile page, you have registered a valid mobile
                    phone and you have checked the option "Yes, I would like to
                    receive my double authentication code by SMS"
                  </p>
                </div>
                <div className="col-12 col-lg-4 box">
                  <h3 className="o3">Option 3</h3>
                  <p>
                    You have scanned the QR code on this page with an OTP double
                    authentication application (see the indications below)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="row section-app">
          <div className="col-12">
            <h2>Authentication by OTP Application</h2>
          </div>
          <div className="col-12 col-lg-8 left">
            <h3>Phase 1</h3>
            <p>
              To enable the Rezilio double authentication using the
              “Authenticator” application linked to your Rezilio account,
              depending on your cellphone type, you can download one of the
              following applications.
            </p>

            <div className="highlight">List of Free Applications:</div>

            <div className="text">
              Android:
              <ul>
                <li>Microsoft Authenticator</li>
                <li>Google Authenticator</li>
                <li>FreeOTP</li>
              </ul>
              Apple (MacOs, iOS):
              <ul>
                <li>Microsoft Authenticator</li>
                <li>Google Authenticator</li>
                <li>OTP Auth</li>
                <li>HDE OTP Generator</li>
                <li>FreeOTP (iOS)</li>
              </ul>
              Black Berry:
              <ul>
                <li>Authomator</li>
              </ul>
              Windows Phone:
              <ul>
                <li>Microsoft Authenticator</li>
              </ul>
            </div>
            <button
              className="confirm desktop"
              onClick={() => this.props.agree()}
            >
              I understand
            </button>
          </div>
          <div className="col-12 col-lg-4 right">
            <h2>Phase 2 </h2>
            <p>
              <img src={"data:image/png;base64," + mfa.qr} alt="QR" />
            </p>

            <button
              className="confirm mobile"
              onClick={() => this.props.agree()}
            >
              I understand
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CopyEN;
