import React from "react";
import { connect } from "react-redux";
import FooterPrivate from "../footer/FooterPrivate";
import styles from "../../css/App.module.scss";

//main app
class PublicApp extends React.Component {
  componentDidMount() {
    //const that = this
  }

  render() {
    return (
      <div className={styles.app}>
        <div className="public">Public App</div>
        <FooterPrivate />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(PublicApp);
export const PublicAppTest = PublicApp;
