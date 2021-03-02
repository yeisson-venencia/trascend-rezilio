import React from "react";
import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log(this.props.match.params.id);
  }

  async componentWillMount() {}

  //show add,edit or list component
  handleClick = (showComponent, site) => {
    console.log(showComponent);
    this.setState({
      display: showComponent,
      site: site,
    });
  };

  render() {
    const that = this;

    return (
      <>
        <HeaderPrivate auth={that.props.auth} />
        <div class="d-flex flex-col h-screen">
          <div class="mx-4 mt-3 col-2">
            <div className={styles.menuRezilio}>
              <SideBar
                auth={that.props.auth}
                idPage={this.props.match.params.id}
                handleClick={this.handleClick}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(ProjectDetail));
