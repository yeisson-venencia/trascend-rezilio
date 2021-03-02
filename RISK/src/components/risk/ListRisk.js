import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import HeaderPrivate from "../header/HeaderPrivate";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class ListRisk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      matrixS: [],
    };
    // console.log(this.state.id);
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
  loadMatrix(id, page) {
    console.log("loadMatrix");
    this.setState({ isLoading: true });
    fetch(`https://risk-module-api.herokuapp.com/api/v1/matrices`, {
      headers: new Headers({
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("loadMatrix2");
        this.setState({
          matrixS: data["hydra:member"],
        });
      });
  }

  async componentWillMount() {
    await this.loadMatrix(this.props.match.params.id, 1);
    await this.setState({
      matrixS: this.state.matrixS,
    });
  }

  componentWillUnmount() {
    console.log("se desmonta");
  }

  //DELETE MATRIX
  deleteMatrix(id) {
    fetch("https://risk-module-api.herokuapp.com/api/v1/matrices/" + id, {
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      },
      method: "DELETE",
    });

    //actualiza
    const data = this.state.matrixS.filter((matrix) => matrix.id !== id);
    console.log(this.state.matrixS);
    this.setState({ matrixS: data });
    // console.log(data);
  }

  async handlePublish(id) {
    // console.log(id);
    let idxMatrix = this.state.matrixS.findIndex((m) => m.id === id);
    let matrixN = this.state.matrixS;
    matrixN[idxMatrix].isPublished = !matrixN[idxMatrix].isPublished;

    this.setState({
      matrixS: matrixN,
    });

    await fetch("https://risk-module-api.herokuapp.com/api/v1/matrices/" + id, {
      headers: {
        "Content-Type": "application/merge-patch+json",
        Accept: "application/ld+json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      },
      method: "PATCH",
      body: JSON.stringify({ isPublished: matrixN[idxMatrix].isPublished }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
    // this.setState({ isPublished: !this.state.isPublished })
  }

  render() {
    const MatrixItems = this.state.matrixS.map((matrix) => {
      return (
        <tr>
          <td>{matrix.name}</td>
          <td>{matrix.createdAt}</td>
          <td>
            <button
              type="button"
              onClick={this.handlePublish.bind(this, matrix.id)}
              className={`${
                matrix.isPublished ? "btn btn-secondary" : "btn btn-primary"
              }`}
            >
              {matrix.isPublished ? "Unpublish" : "Publish"}
            </button>
          </td>
          <td>{matrix.owner}</td>
          <td>
            <Link
              to={{
                pathname: buildUrl("EDIT_RISK", [matrix.id]),
              }}
            >
              <button type="button" class="btn btn-primary">
                Go
              </button>
            </Link>
          </td>
          <td>
            <div class="dropdown">
              <button
                type="button"
                class="btn"
                id="dropdownMenu2"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-three-dots-vertical"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <Link
                  to={{
                    pathname: buildUrl("EDIT_RISK", [matrix.id]),
                  }}
                >
                  <button class="dropdown-item" type="button">
                    Edit Matrix
                  </button>
                </Link>
                <button
                  class="dropdown-item"
                  type="button"
                  onClick={() => this.deleteMatrix(matrix.id)}
                >
                  Delete Matrix
                </button>
                <button class="dropdown-item" type="button">
                  Duplicate Matrix
                </button>
              </div>
            </div>
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
                idPage={this.state.id}
                idComponent={"ListRisk"}
                handleClick={this.handleClick}
              />

              <div className={styles.fixMenu}>
                <Link
                  class="d-flex justify-content-md-end "
                  to={{
                    pathname: buildUrl(
                      "CREATE_RISK",
                      this.props.match.params.id
                    ),
                  }}
                >
                  <button type="button" class="btn btn-primary">
                    Add new Matrix
                  </button>
                </Link>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Matrix Name</th>
                      <th scope="col">Created</th>
                      <th scope="col">Status</th>
                      <th scope="col">Author</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.matrixS.length > 0 ? MatrixItems : null}
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

export default connect(mapStateToProps)(withRouter(ListRisk));
