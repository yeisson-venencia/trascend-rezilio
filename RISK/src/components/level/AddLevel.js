import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class AddLevel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      matrix: [],
      project: "",
    };
  }

  async loadMatrix(id) {
    console.log("loadMatrix");
    console.log(id);
    this.setState({ isLoading: true });
    await fetch(`https://risk-module-api.herokuapp.com/api/v1/matrices/${id}`, {
      headers: new Headers({
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("loadMatrix2");
        this.setState({
          project: data["project"],
        });
      });
  }
  //willMount
  async componentWillMount() {
    await this.loadMatrix(this.props.match.params.id);
  }

  //FORM VALIDATION
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["levelName"]) {
      formIsValid = false;
      errors["levelRiskName"] = "Level name cannot be empty";
    }

    if (!fields["levelBetween"]) {
      formIsValid = false;
      errors["levelBetween"] = "Level between cannot be empty";
    }

    if (!fields["levelAnd"]) {
      formIsValid = false;
      errors["levelAnd"] = "Level and cannot be empty";
    }

    if (!fields["levelColor"]) {
      formIsValid = false;
      errors["levelColor"] = "Level Color cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitgroup");
    if (this.handleValidation()) {
      this.addNewLevel();
      this.props.history.push(`/matrix/edit/${this.props.match.params.id}`);
    } else {
      e.preventDefault();
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  //LEVL POST
  addNewLevel() {
    console.log("addNewLevel");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.fields["levelName"],
        lower: parseInt(this.state.fields["levelBetween"]),
        upper: parseInt(this.state.fields["levelAnd"]),
        matrix: "/api/v1/matrices/" + this.props.match.params.id,
        color: this.state.fields["levelColor"],
      }),
    };

    console.log(requestOptions);

    fetch("https://risk-module-api.herokuapp.com/api/v1/levels", requestOptions)
      .then((response) => {
        const data = response.json();
      })
      .catch((error) => {
        console.error("Error!");
      });
  }

  render() {
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
              />
              <div className={styles.fixMenu}>
                <div className={styles.createproject}>
                  <div class="container-lg pt-4">
                    <form onSubmit={this.submitForm.bind(this)}>
                      <div class="d-flex justify-content-between">
                        <h4 class="mb-4" className={styles.titleheader}>
                          Level test #1 - Level Creation
                        </h4>
                        <Link
                          to={buildUrl("EDIT_RISK", this.props.match.params.id)}
                        >
                          <button class="btn btn-light ml-4 px-4" type="submit">
                            Cancel
                          </button>
                        </Link>
                      </div>
                      {/* LEVEL NAME */}
                      <div class="my-3">
                        <label for="levelName" class="form-label">
                          Name
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="levelName"
                            onChange={this.handleChange.bind(this, "levelName")}
                            value={this.state.fields["levelName"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["levelName"]}
                          </span>
                        </div>
                      </div>

                      {/* BETWEEN */}
                      <div class="my-3">
                        <label for="levelBetween" class="form-label">
                          Between
                        </label>
                        <div class="">
                          <input
                            type="number"
                            class="col-6"
                            id="levelBetween"
                            onChange={this.handleChange.bind(
                              this,
                              "levelBetween"
                            )}
                            value={this.state.fields["levelBetween"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["levelBetween"]}
                          </span>
                        </div>
                      </div>
                      {/* AND */}
                      <div class="my-3">
                        <label for="levelAnd" class="form-label">
                          and
                        </label>
                        <div class="">
                          <input
                            type="number"
                            class="col-6"
                            id="levelAnd"
                            onChange={this.handleChange.bind(this, "levelAnd")}
                            value={this.state.fields["levelAnd"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["levelAnd"]}
                          </span>
                        </div>
                      </div>
                      {/* LEVEL COLOR */}
                      <div class="my-3">
                        <label for="levelColor" class="form-label"></label>
                        <div class="">
                          <input
                            type="color"
                            class="col-1"
                            id="levelColor"
                            onChange={this.handleChange.bind(
                              this,
                              "levelColor"
                            )}
                            value={this.state.fields["levelColor"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["levelColor"]}
                          </span>
                        </div>
                      </div>

                      <br />
                      <br />
                      <button
                        class="btn btn-primary ml-4 px-4"
                        type="submit"
                        className={styles.submitbutton}
                      >
                        Save
                      </button>
                      <br />
                      <br />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterPrivate />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(AddLevel));
