import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import HeaderPrivate from "../header/HeaderPrivate";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class ListExposed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exposeds: [],
    };
  }

  //Load Exposeds by project
  loadExposeds(id, page) {
    console.log("loadExposeds");
    this.setState({ isLoading: true });
    fetch(
      `https://risk-module-api.herokuapp.com/api/v1/projects/${id}/exposed_elements?page=${page}`,
      {
        headers: new Headers({
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("loadExposeds2");
        this.setState({
          exposeds: data["hydra:member"],
        });
      });
    console.log(this.state.exposeds);
  }

  async componentWillMount() {
    await this.loadExposeds(this.props.match.params.id, 1);
    this.setState({
      exposeds: this.state.exposeds,
    });
  }

  //deleteExposed
  deleteExposed(id) {
    fetch(
      "https://risk-module-api.herokuapp.com/api/v1/exposed_elements/" + id,
      {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        },
        method: "DELETE",
      }
    );

    // actualiza
    const data = this.state.exposeds.filter((exposed) => exposed.id !== id);
    console.log(this.state.exposeds);
    this.setState({ exposeds: data });
    console.log(data);
  }

  //show add,edit or list component
  handleClick = (showComponent, site) => {
    console.log(showComponent);
    this.setState({
      display: showComponent,
      site: site,
    });
  };

  render() {
    const exposedItems = this.state.exposeds.map((exposed) => {
      return (
        <tr>
          <td>{exposed.name}</td>
          <td>{exposed.createdAt}</td>
          <td>{exposed.responsible}</td>
          <td>{exposed.location}</td>
          <td></td>
          <td></td>
          <td>
            <Link
              to={{
                pathname: buildUrl("EDIT_EXPOSED", [exposed.id]),
              }}
            >
              <button class="btn btn-warning px-4">Edit</button>
            </Link>
          </td>
          <td>
            <button
              class="btn btn-danger px-4"
              onClick={() => this.deleteExposed(exposed.id)}
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
                idComponent={"ListExposed"}
                handleClick={this.handleClick}
              />

              <div className={styles.fixMenu}>
                <Link
                  class="d-flex justify-content-md-end "
                  to={{
                    pathname: buildUrl(
                      "CREATE_EXPOSED",
                      this.props.match.params.id
                    ),
                  }}
                >
                  <button type="button" class="btn btn-primary">
                    Add new Exposed
                  </button>
                </Link>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">EE Name</th>
                      <th scope="col">EE Type</th>
                      <th scope="col">Business Unit</th>
                      <th scope="col">Importance level</th>
                      <th scope="col">Dur. Max Perturbations</th>
                      <th scope="col">Temps Recuperation</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>{exposedItems}</tbody>
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

export default connect(mapStateToProps)(withRouter(ListExposed));
