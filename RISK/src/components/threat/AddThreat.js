import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class AddThreat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      projects: [],
    };
    console.log(this.props.match.params.id);
    //this.fetchProjects = this.fetchProjects.bind(this);
  }

  //Load Projects

  //   async componentDidMount() {
  //     this.fetchProjects(1);
  //   }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["threatName"]) {
      formIsValid = false;
      errors["threatName"] = "Threat name cannot be empty";
    }

    if (!fields["threatDescription"]) {
      formIsValid = false;
      errors["threatDescription"] = "Description cannot be empty";
    }

    if (!fields["threatFrequency"]) {
      formIsValid = false;
      errors["threatFrequency"] = "Select one option";
    }

    if (!fields["threatDate1"]) {
      formIsValid = false;
      errors["threatDate1"] = "Date 1 cannot be empty";
    }
    if (!fields["threatDate2"]) {
      formIsValid = false;
      errors["threatDate2"] = "Date 2 cannot be empty";
    }
    if (!fields["threatDate3"]) {
      formIsValid = false;
      errors["threatDate3"] = "Date 3 cannot be empty";
    }
    if (!fields["threatDate4"]) {
      formIsValid = false;
      errors["threatDate4"] = "Date 4 cannot be empty";
    }
    if (!fields["threatDate5"]) {
      formIsValid = false;
      errors["threatDate5"] = "Date 5 cannot be empty";
    }

    if (!fields["threatIntensity"]) {
      formIsValid = false;
      errors["threatIntensity"] = "Select one option";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitgroup");
    if (this.handleValidation()) {
      this.addNewThreat();
      this.props.history.push(
        `/projects/${this.props.match.params.id}/threats`
      );
    } else {
      e.preventDefault();
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  addNewThreat() {
    console.log("addNewThreat");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.fields["threatName"],
        description: this.state.fields["threatDescription"],
        project: "/api/v1/projects/" + this.props.match.params.id,
        last1: this.state.fields["threatDate1"],
        last2: this.state.fields["threatDate2"],
        last3: this.state.fields["threatDate3"],
        last4: this.state.fields["threatDate4"],
        last5: this.state.fields["threatDate5"],
        frequency: this.state.fields["threatFrequency"],
        intensity: this.state.fields["threatIntensity"],
      }),
    };

    console.log(requestOptions);

    fetch(
      "https://risk-module-api.herokuapp.com/api/v1/threats",
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
                          Threat test #1 - Threat Settings
                        </h4>
                        <Link
                          to={buildUrl(
                            "LIST_THREATS",
                            this.props.match.params.id
                          )}
                        >
                          <button class="btn btn-light ml-4 px-4" type="submit">
                            Cancel
                          </button>
                        </Link>
                      </div>
                      <div class="mb-4 mt-3">
                        <label for="threatName" class="form-label">
                          Threat Name
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="threatName"
                            onChange={this.handleChange.bind(
                              this,
                              "threatName"
                            )}
                            value={this.state.fields["threatName"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["threatName"]}
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
                            id="threatFrequency"
                            onChange={this.handleChange.bind(
                              this,
                              "threatFrequency"
                            )}
                            value={this.state.fields["threatFrequency"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="YEARLY">Yearly</option>
                            {/* {this.state.rangeTimes.map((item, index)=>{
                            return <option value={item.id}>{item.name}</option>
                        })}                         */}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["threatFrequency"]}
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
                    id="threatName"
                    onChange={this.handleChange.bind(this, "threatName")}
                    value={this.state.fields["threatName"]}
                  /> */}
                          <div>
                            <input
                              id="threatDates"
                              type="date"
                              onChange={this.handleChange.bind(
                                this,
                                "threatDate1"
                              )}
                              value={this.state.fields["threatDate1"]}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(
                                this,
                                "threatDate2"
                              )}
                              value={this.state.fields["threatDate2"]}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(
                                this,
                                "threatDate3"
                              )}
                              value={this.state.fields["threatDate3"]}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(
                                this,
                                "threatDate4"
                              )}
                              value={this.state.fields["threatDate4"]}
                            ></input>
                            <input
                              type="date"
                              onChange={this.handleChange.bind(
                                this,
                                "threatDate5"
                              )}
                              value={this.state.fields["threatDate5"]}
                            ></input>
                          </div>
                          <div>
                            <span style={{ color: "red" }}>
                              {this.state.errors["threatDate1"]}
                              {this.state.errors["threatDate2"]}
                              {this.state.errors["threatDate3"]}
                              {this.state.errors["threatDate4"]}
                              {this.state.errors["threatDate4"]}
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
                            id="threatDescription"
                            onChange={this.handleChange.bind(
                              this,
                              "threatDescription"
                            )}
                            value={this.state.fields["threatDescription"]}
                          ></textarea>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["threatDescription"]}
                          </span>
                        </div>
                      </div>
                      {/* FREQUENCY */}
                      <div class="mb-3">
                        <label class="form-label">Thread intensity</label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="threatIntensity"
                            onChange={this.handleChange.bind(
                              this,
                              "threatIntensity"
                            )}
                            value={this.state.fields["threatIntensity"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            {/* {this.state.rangeTimes.map((item, index)=>{
                            return <option value={item.id}>{item.name}</option>
                        })}                         */}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["threatIntensity"]}
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

export default connect(mapStateToProps)(withRouter(AddThreat));
