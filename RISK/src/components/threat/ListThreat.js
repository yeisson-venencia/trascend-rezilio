import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import HeaderPrivate from "../header/HeaderPrivate";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class ListThreat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      threats: [],
    };
  }

  //show add,edit or list component
  handleClick = (showComponent, site) => {
    console.log(showComponent);
    this.setState({
      display: showComponent,
      site: site,
    });
  };

  //Load Groups by project
  loadThreats(id, page) {
    console.log("loadThreats");
    this.setState({ isLoading: true });
    fetch(
      `https://risk-module-api.herokuapp.com/api/v1/projects/${id}/threats?page=${page}`,
      {
        headers: new Headers({
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("loadThreats2");
        this.setState({
          threats: data["hydra:member"],
        });
      });
    console.log(this.state.threats);
  }

  async componentWillMount() {
    console.log("se monta");
    await this.loadThreats(this.props.match.params.id, 1);
    await this.setState({
      threats: this.state.threats,
    });
  }

  componentWillUnmount() {
    console.log("se desmonta");
  }

  //DeleteThreat
  deleteThreat(id) {
    fetch("https://risk-module-api.herokuapp.com/api/v1/threats/" + id, {
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      },
      method: "DELETE",
    });

    //actualiza
    const data = this.state.threats.filter((threat) => threat.id !== id);
    console.log(this.state.threats);
    this.setState({ threats: data });
    // console.log(data);
  }

  render() {
    const threatItems = this.state.threats.map((threat) => {
      return (
        <tr>
          <td>{threat.name}</td>
          <td>{new Date(threat.createdAt).toLocaleString()}</td>
          <td>{threat.description}</td>
          <td>
            <Link
              to={{
                pathname: buildUrl("EDIT_THREAT", [threat.id]),
              }}
            >
              <button class="btn btn-warning px-4">Edit</button>
            </Link>
          </td>
          <td>
            <button
              class="btn btn-danger px-4"
              onClick={() => this.deleteThreat(threat.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

    const that = this;
    return (
      <>
        <HeaderPrivate auth={that.props.auth} />
        <div class="h-screen">
          <div className={styles.menuRezilio}>
            <div class="d-flex flex-col justify-center items-center mx-4 mt-3 ">
              <SideBar
                auth={that.props.auth}
                idPage={this.props.match.params.id}
                idComponent={"ListThreat"}
                handleClick={this.handleClick}
              />

              <div className={styles.fixMenu}>
                <Link
                  class="d-flex justify-content-md-end "
                  to={{
                    pathname: buildUrl(
                      "CREATE_THREAT",
                      this.props.match.params.id
                    ),
                  }}
                >
                  <button type="button" class="btn btn-primary">
                    Add new threat
                  </button>
                </Link>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Date</th>
                      <th scope="col">Description</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.threats.length > 0 ? threatItems : null}
                  </tbody>
                </table>
              </div>
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

export default connect(mapStateToProps)(withRouter(ListThreat));
