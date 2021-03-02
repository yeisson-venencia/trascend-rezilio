import React from "react";
import "./MFA.scss";

class CopyFR extends React.Component {
  render() {
    const { mfa } = this.props;

    return (
      <div className="mfa-copy">
        <div className="row border-bottom">
          <div className="col-12 col-lg-8 section-title order-2 order-lg-1">
            <h1>
              Avis d'activation de l'authentification sécuritaire à deux
              facteurs
            </h1>
            <p className="highlight">
              Qu'est-ce que l'authentification sécuritaire à deux facteurs ou
              multi facteur ?
            </p>
            <p>
              L'identification multi facteur est une mesure sécuritaire qui
              combine deux composantes différentes et indépendantes et sert à
              authentifier un utilisateur dans le but de lui accorder une
              autorisation d'accès.
            </p>
            <p>
              Cette méthode sécuritaire, est de plus en plus courante au sein
              des institutions financières, Google, Microsoft et bien d'autres.
            </p>
          </div>

          <div className="col-12 col-lg-4 section-info order-1 order-lg-2">
            <h1>
              Avis d'activation de l'authentification sécuritaire à deux
              facteurs
            </h1>
            <div className="box">
              <h2 className="title">Important</h2>
              <div className="text">
                <p>
                  Assurez-vous de bien comprendre les éléments de cette page
                  avant de la quitter.
                </p>
                <p>
                  Lors de votre prochaine tentative de connexion, il est
                  possible que vous ne soyez pas en mesure de vous connecter au
                  portail Rezilio.
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
                  Si l'une des 3 options, telles que décrite ci-dessous, est en
                  place, vous serez en mesure de vous connecter.
                </h2>
              </div>
              <div className="row">
                <div className="col-12 col-lg-4 box">
                  <h3 className="o1">Option 1</h3>
                  <p>
                    L'adresse email associée à votre profil est valide et est
                    fonctionnelle.
                  </p>
                </div>
                <div className="col-12 col-lg-4 box">
                  <h3 className="o2">Option 2</h3>
                  <p>
                    Dans la page profile vous avez inscrit un téléphone de type
                    mobile qui est valide et vous ayez cochez l'option
                    <span className="nobr"> « Oui</span>, je souhaite recevoir
                    mon code de la double authentification par{" "}
                    <span className="nobr">SMS »</span>.
                  </p>
                </div>
                <div className="col-12 col-lg-4 box">
                  <h3 className="o3">Option 3</h3>
                  <p>
                    Vous avez scanné le code QR présent dans cette page avec une
                    application de double authentification OTP (voir les
                    indications ci-dessous).
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="row section-app">
          <div className="col-12">
            <h2>Authentification par Application OTP :</h2>
          </div>
          <div className="col-12 col-lg-8 left">
            <h3>Étape 1</h3>
            <p>
              Télécharger une de ces applications selon le type de votre
              téléphone cellulaire.
            </p>

            <div className="highlight">Liste des Applications Gratuites :</div>

            <div className="text">
              Android :
              <ul>
                <li>Microsoft Authenticator</li>
                <li>Google Authenticator</li>
                <li>FreeOTP</li>
              </ul>
              Apple (MacOs, iOS) :
              <ul>
                <li>Microsoft Authenticator</li>
                <li>Google Authenticator</li>
                <li>OTP Auth</li>
                <li>HDE OTP Generator</li>
                <li>FreeOTP (iOS)</li>
              </ul>
              Black Berry :
              <ul>
                <li>Authomator</li>
              </ul>
              Windows Phone :
              <ul>
                <li>Microsoft Authenticator</li>
              </ul>
            </div>
            <button
              className="confirm desktop"
              onClick={() => this.props.agree()}
            >
              J'ai bien compris
            </button>
          </div>
          <div className="col-12 col-lg-4 right">
            <h2>Étape 2 </h2>
            <p>
              <img src={"data:image/png;base64," + mfa.qr} alt="QR" />
              Après l’installation de l’application{" "}
              <span className="nobr">« Authenticator »</span> vous pouvez
              scanner le code QR.
            </p>

            <button
              className="confirm mobile"
              onClick={() => this.props.agree()}
            >
              J'ai bien compris
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CopyFR;
