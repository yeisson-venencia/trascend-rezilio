import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class EditThreat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      threat: {},
      frequency: ["daily", "weekly", "monthly", "yearly"],
      intensity: ["low", "medium", "high"],
      indexProject: 0,
      exposeds: [],
    };
  }

  async componentWillMount() {
    await this.loadThreat(this.props.match.params.id);
    await this.loadExposeds(this.props.match.params.id);
    let idxProject = this.state.threat.project.substring(
      this.state.threat.project.lastIndexOf("/") + 1,
      this.state.threat.project.length
    );
    this.setState({ indexProject: idxProject });
    this.loadFields();
  }

  loadFields() {
    let fields = this.state.fields;
    fields["name"] = this.state.threat.name;
    fields["description"] = this.state.threat.description;
    fields["last1"] = this.state.threat.last1;
    fields["last2"] = this.state.threat.last2;
    fields["last3"] = this.state.threat.last3;
    fields["last4"] = this.state.threat.last4;
    fields["last5"] = this.state.threat.last5;
    fields["frequency"] = this.state.threat.frequency;
    fields["intensity"] = this.state.threat.intensity;
    this.setState({ fields });
    // fields["name"] = this.state.project.name;
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    console.log("f1");
    if (!fields["name"]) {
      console.log("f1");
      formIsValid = false;
      errors["name"] = "Threat name cannot be empty";
    }

    if (!fields["description"]) {
      console.log("f2");
      formIsValid = false;
      errors["description"] = "Description cannot be empty";
    }

    if (!fields["frequency"]) {
      console.log("f3");

      formIsValid = false;
      errors["frequency"] = "Select one option";
    }

    if (!fields["last1"]) {
      console.log("f4");
      formIsValid = false;
      errors["last1"] = "Date 1 cannot be empty";
    }
    if (!fields["last2"]) {
      formIsValid = false;
      errors["last2"] = "Date 2 cannot be empty";
    }
    if (!fields["last3"]) {
      formIsValid = false;
      errors["last3"] = "Date 3 cannot be empty";
    }
    if (!fields["last4"]) {
      formIsValid = false;
      errors["last4"] = "Date 4 cannot be empty";
    }
    if (!fields["last5"]) {
      formIsValid = false;
      errors["last5"] = "Date 5 cannot be empty";
    }

    if (!fields["intensity"]) {
      console.log("f5");

      formIsValid = false;
      errors["intensity"] = "Select one option";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitgroup");
    if (this.handleValidation()) {
      this.editThreat(this.props.match.params.id);
      let idxProject = this.state.threat.project.substring(
        this.state.threat.project.lastIndexOf("/") + 1,
        this.state.threat.project.length
      );
      this.props.history.push(`/projects/${idxProject}/threats`);
    } else {
      e.preventDefault();
    }
  }

  handleChange(field, e) {
    let threat = this.state.threat;
    threat[field] = e.target.value;
    this.setState({ fields: threat });
  }

  //Load Threat
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

  //EditThreat
  editThreat(id) {
    console.log("editThreat");
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        Accept: "application/ld+json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      },
      body: JSON.stringify({
        name: this.state.fields["name"],
        description: this.state.fields["description"],
        project: "/api/v1/projects/" + this.state.idxProject,
        last1: this.state.fields["last1"],
        last2: this.state.fields["last2"],
        last3: this.state.fields["last3"],
        last4: this.state.fields["last3"],
        last5: this.state.fields["last4"],
        frequency: this.state.fields["frequency"],
        intensity: this.state.fields["intensity"],
      }),
    };

    console.log(requestOptions);

    fetch(
      `https://risk-module-api.herokuapp.com/api/v1/threats/${id}`,
      requestOptions
    )
      .then((response) => {
        const data = response.json();
      })
      .catch((error) => {
        console.error("Error!");
      });
  }

  async loadExposeds(id) {
    console.log("loadExposed");
    console.log(id);
    this.setState({ isLoading: true });
    await fetch(
      `https://risk-module-api.herokuapp.com/api/v1/threats/${id}/exposed_elements`,
      {
        headers: new Headers({
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          exposeds: data["hydra:member"],
        });
      });
    console.log(this.state.exposeds);
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

  formatDate(date) {
    console.log(date);
    // console.log(new Date().toISOString().split('T')[0]);
    return date !== undefined ? date.split("T")[0] : "";

    //return new Date().toISOString().split('T')[0]
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
                idPage={this.state.indexProject}
              />
              <div className={styles.fixMenu}>
                <div className={styles.createproject}>
                  <div class="container-lg pt-4">
                    <form onSubmit={this.submitForm.bind(this)}>
                      <div class="d-flex justify-content-between">
                        <h4 class="mb-4" className={styles.titleheader}>
                          Threat Edit #1 - Threat Settings
                        </h4>
                        <Link
                          to={buildUrl("LIST_THREATS", this.state.indexProject)}
                        >
                          <button class="btn btn-light ml-4 px-4" type="submit">
                            Cancel
                          </button>
                        </Link>
                      </div>
                      <div class="mb-4 mt-3">
                        <label for="name" class="form-label">
                          Threat Name +{this.state.threat["last3"]}
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="name"
                            onChange={this.handleChange.bind(this, "name")}
                            value={this.state.fields["name"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["name"]}
                          </span>
                        </div>
                      </div>
                      {/* RANGETIME */}
                      <div class="mb-3">
                        <label class="form-label">
                          How often does it happen?
                        </label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="frequency"
                            onChange={this.handleChange.bind(this, "frequency")}
                            value={this.state.fields["frequency"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            {this.state.frequency.map((item, index) => {
                              if (
                                this.state.fields["frequency"] ===
                                item.toUpperCase()
                              )
                                return (
                                  <option value={item.toUpperCase()} selected>
                                    {item[0].toUpperCase() + item.slice(1)}
                                  </option>
                                );
                              else
                                return (
                                  <option value={item}>
                                    {item[0].toUpperCase() + item.slice(1)}
                                  </option>
                                );
                            })}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["frequency"]}
                          </span>
                        </div>
                        {/* ARRAY DATES  */}
                        <div class="mb-4 mt-3">
                          <label for="threatDates" class="form-label">
                            When were the last 5 times it happened?
                          </label>
                          {/* <input
                    type="text"
                    class="col-6"
                    id="name"
                    onChange={this.handleChange.bind(this, "name")}
                    value={this.state.fields["name"]}
                  /> */}
                          <div>
                            <input
                              id="threatDates"
                              type="date"
                              onChange={this.handleChange.bind(this, "last1")}
                              value={this.formatDate(
                                this.state.fields["last1"]
                              )}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(this, "last2")}
                              value={this.formatDate(
                                this.state.fields["last2"]
                              )}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(this, "last3")}
                              value={this.formatDate(
                                this.state.fields["last3"]
                              )}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(this, "last4")}
                              value={this.formatDate(
                                this.state.fields["last4"]
                              )}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(this, "last5")}
                              defaultValue={this.formatDate(
                                this.state.fields["last5"]
                              )}
                            ></input>
                          </div>
                          <div>
                            <span style={{ color: "red" }}>
                              {this.state.errors["last1"]}
                              {this.state.errors["last2"]}
                              {this.state.errors["last3"]}
                              {this.state.errors["last4"]}
                              {this.state.errors["last5"]}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* DESCRIPTION */}
                      <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">
                          Threat description
                        </label>

                        <div class="">
                          <textarea
                            class="col-12"
                            placeholder="Leave a comment here"
                            id="description"
                            onChange={this.handleChange.bind(
                              this,
                              "description"
                            )}
                            defaultValue={this.state.fields["description"]}
                          ></textarea>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["description"]}
                          </span>
                        </div>
                      </div>
                      {/* FREQUENCY */}
                      <div class="mb-3">
                        <label class="form-label">Thread intensity</label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="intensity"
                            onChange={this.handleChange.bind(this, "intensity")}
                            value={this.state.fields["intensity"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            {this.state.intensity.map((item, index) => {
                              if (
                                this.state.fields["intensity"] ===
                                item.toUpperCase()
                              )
                                return (
                                  <option value={item.toUpperCase()} selected>
                                    {item[0].toUpperCase() + item.slice(1)}
                                  </option>
                                );
                              else
                                return (
                                  <option value={item}>
                                    {item[0].toUpperCase() + item.slice(1)}
                                  </option>
                                );
                            })}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["intensity"]}
                          </span>
                        </div>
                      </div>
                      {/* EXPOSED SECTION */}
                      <div>
                        <div class=" mt-3">
                          <div class="d-flex justify-content-md-between">
                            <label class="form-label">EXPOSED ELEMENTS</label>
                            <Link
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
                          </div>
                          {this.state.exposeds.length > 0
                            ? this.state.exposeds.map((exposed) => {
                                return (
                                  <table class="table table-hover">
                                    <thead>
                                      <tr>
                                        <th class="col border">Name</th>
                                        <th class="col border">Description</th>
                                        <th class="col border">Type</th>
                                        <th class="col border">Importance</th>
                                        <th class="col border">Location</th>
                                        <th class="col border">RecoveryTime</th>
                                        <th class="col border">DownTime</th>
                                        <th class="col border">Delete</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td scope="row">{exposed.name}</td>
                                        <td>{exposed.description}</td>
                                        <td>{exposed.type}</td>
                                        <td>{exposed.importance}</td>
                                        <td>{exposed.location}</td>
                                        <td>{exposed.recoveryTime}</td>
                                        <td>{exposed.downTime}</td>
                                        <td>
                                          <button
                                            class="btn btn-danger px-4 "
                                            onClick={() =>
                                              this.deleteExposed(exposed.id)
                                            }
                                          >
                                            DELETE
                                          </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                );
                              })
                            : "No hay Exposed"}
                        </div>
                      </div>

                      {/* END EXPOSED SECTION */}
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

export default connect(mapStateToProps)(withRouter(EditThreat));
