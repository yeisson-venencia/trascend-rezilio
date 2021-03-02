import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class AddExposed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      threat: {},
      indexProject: 0,
    };
    console.log(this.props.match.params.id);
  }

  //willMount
  async componentWillMount() {
    await this.loadThreat(this.props.match.params.id);
    let idxProject = this.state.threat.project.substring(
      this.state.threat.project.lastIndexOf("/") + 1,
      this.state.threat.project.length
    );
    this.setState({ indexProject: idxProject });
  }

  async loadThreat(id) {
    console.log("loadThreat");
    this.setState({ isLoading: true });
    await fetch(`https://risk-module-api.herokuapp.com/api/v1/threats/${id}`, {
      headers: new Headers({
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          threat: data,
        });
      });
    console.log(this.state.threat);
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["exposedName"]) {
      formIsValid = false;
      errors["exposedName"] = "Exposed name cannot be empty";
    }

    if (!fields["exposedDescription"]) {
      formIsValid = false;
      errors["exposedDescription"] = "Exposed Description cannot be empty";
    }

    if (!fields["exposedType"]) {
      formIsValid = false;
      errors["exposedType"] = "Exposed type cannot be empty";
    }

    if (!fields["exposedImportance"]) {
      formIsValid = false;
      errors["exposedImportance"] = "Exposed importance cannot be empty";
    }

    if (!fields["exposedLocation"]) {
      formIsValid = false;
      errors["exposedLocation"] = "Exposed location cannot be empty";
    }

    if (!fields["exposedRecovery"]) {
      formIsValid = false;
      errors["exposedRecovery"] = "Exposed recovery time cannot be empty";
    }

    if (!fields["exposedDown"]) {
      formIsValid = false;
      errors["exposedDown"] = "Exposed down time cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitSite");
    if (this.handleValidation()) {
      this.addNewExposed();
      this.props.history.push(`/threats/edit/${this.props.match.params.id}`);
    } else {
      console.log("novalido");
      e.preventDefault();
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  addNewExposed() {
    console.log("addNewExposed");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.fields["exposedName"],
        description: this.state.fields["exposedDescription"],
        type: this.state.fields["exposedType"],
        importance: this.state.fields["exposedImportance"],
        location: this.state.fields["exposedLocation"],
        recoveryTime: parseInt(this.state.fields["exposedRecovery"]),
        downTime: parseInt(this.state.fields["exposedDown"]),
        threat: "/api/v1/threats/" + this.props.match.params.id,
        project: "/api/v1/projects/" + this.state.indexProject,
      }),
    };

    console.log(requestOptions);

    fetch(
      "https://risk-module-api.herokuapp.com/api/v1/exposed_elements",
      requestOptions
    )
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
                          Exposed test #1 - Exposed Settings
                        </h4>
                        <Link
                          to={buildUrl(
                            "LIST_EXPOSED",
                            this.props.match.params.id
                          )}
                        >
                          <button class="btn btn-light ml-4 px-4" type="submit">
                            Cancel
                          </button>
                        </Link>
                      </div>

                      {/* EXPOSED NAME */}
                      <div class="mb-4 mt-3">
                        <label for="exposedName" class="form-label">
                          Exposed Name
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="exposedName"
                            onChange={this.handleChange.bind(
                              this,
                              "exposedName"
                            )}
                            value={this.state.fields["exposedName"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["exposedName"]}
                          </span>
                        </div>
                      </div>
                      {/* EXPOSED DESCRIPTION */}
                      <div class="mb-4 mt-3">
                        <label for="exposedDescription" class="form-label">
                          Exposed Description
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="exposedDescription"
                            onChange={this.handleChange.bind(
                              this,
                              "exposedDescription"
                            )}
                            value={this.state.fields["exposedDescription"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["exposedDescription"]}
                          </span>
                        </div>
                      </div>
                      {/* EXPOSED TYPE */}
                      <div class="mb-4 mt-3">
                        <label for="exposedType" class="form-label">
                          Exposed Type
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="exposedType"
                            onChange={this.handleChange.bind(
                              this,
                              "exposedType"
                            )}
                            value={this.state.fields["exposedType"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["exposedType"]}
                          </span>
                        </div>
                      </div>
                      {/* EXPOSED IMPORTANCE */}
                      <div class="mb-4 mt-3">
                        <label for="exposedImportance" class="form-label">
                          Exposed Importance
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="exposedImportance"
                            onChange={this.handleChange.bind(
                              this,
                              "exposedImportance"
                            )}
                            value={this.state.fields["exposedImportance"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["exposedImportance"]}
                          </span>
                        </div>
                      </div>
                      {/* EXPOSED LOCATION */}
                      <div class="mb-4 mt-3">
                        <label for="exposedLocation" class="form-label">
                          Exposed Location
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="exposedLocation"
                            onChange={this.handleChange.bind(
                              this,
                              "exposedLocation"
                            )}
                            value={this.state.fields["exposedLocation"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["exposedLocation"]}
                          </span>
                        </div>
                      </div>
                      {/* EXPOSED RECOVERY */}
                      <div class="mb-4 mt-3">
                        <label for="exposedRecovery" class="form-label">
                          Exposed Recovery Time
                        </label>
                        <div class="">
                          <input
                            type="number"
                            class="col-6"
                            id="exposedRecovery"
                            onChange={this.handleChange.bind(
                              this,
                              "exposedRecovery"
                            )}
                            value={this.state.fields["exposedRecovery"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["exposedRecovery"]}
                          </span>
                        </div>
                      </div>
                      {/* EXPOSED DOWN */}
                      <div class="mb-4 mt-3">
                        <label for="exposedDown" class="form-label">
                          Exposed Down Time
                        </label>
                        <div class="">
                          <input
                            type="number"
                            class="col-6"
                            id="exposedDown"
                            onChange={this.handleChange.bind(
                              this,
                              "exposedDown"
                            )}
                            value={this.state.fields["exposedDown"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["exposedDown"]}
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

export default connect(mapStateToProps)(withRouter(AddExposed));
