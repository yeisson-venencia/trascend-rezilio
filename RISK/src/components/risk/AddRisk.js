import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class AddRisk extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      matrix: [],
      sectors: [],
    };
  }

  //willMount
  async componentWillMount() {
    this.fetchSectors(1);
  }
  //Load Sectors
  async fetchSectors(page) {
    console.log("aaabbb");
    this.setState({ isLoading: true });
    await fetch(
      "https://risk-module-api.herokuapp.com/api/v1/sectors?page=" + page,
      {
        headers: new Headers({
          /*'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers':'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',*/
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          sectors: data["hydra:member"],
        });
      });
  }

  //FORM VALIDATION
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["matrixName"]) {
      formIsValid = false;
      errors["matrixName"] = "Matrix name cannot be empty";
    }

    if (!fields["matrixSector"]) {
      formIsValid = false;
      errors["matrixSector"] = "Select one option";
    }

    if (!fields["matrixType"]) {
      formIsValid = false;
      errors["matrixType"] = "Select one option";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitgroup");
    if (this.handleValidation()) {
      this.addNewMatrix();
      this.props.history.push(`/projects/${this.props.match.params.id}/matrix`);
    } else {
      e.preventDefault();
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  //MATRIX POST
  addNewMatrix() {
    console.log("addNewMatrix");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.fields["matrixName"],
        description: "",
        sector: "/api/v1/sectors/" + this.state.fields["matrixSector"],
        owner: "/api/v1/users/1",
        project: "/api/v1/projects/" + this.props.match.params.id,
        isPublished: true,
        type: this.state.fields["matrixType"],
        status: "false",
      }),
    };

    console.log(requestOptions);

    fetch(
      "https://risk-module-api.herokuapp.com/api/v1/matrices",
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
                          Project test #1 - Matrix Creation
                        </h4>
                        <Link
                          to={buildUrl("LIST_RISK", this.props.match.params.id)}
                        >
                          <button class="btn btn-light ml-4 px-4" type="submit">
                            Cancel
                          </button>
                        </Link>
                      </div>
                      {/* MATRIX NAME */}
                      <div class="my-3">
                        <label for="matrixName" class="form-label">
                          Matrix Name
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="matrixName"
                            onChange={this.handleChange.bind(
                              this,
                              "matrixName"
                            )}
                            value={this.state.fields["matrixName"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["matrixName"]}
                          </span>
                        </div>
                      </div>
                      {/* SECTOR */}
                      <div class="mb-3">
                        <label class="form-label">Sector</label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="matrixSector"
                            onChange={this.handleChange.bind(
                              this,
                              "matrixSector"
                            )}
                            value={this.state.fields["matrixSector"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            {this.state.sectors.map((item, index) => {
                              return (
                                <option value={item.id}>{item.name}</option>
                              );
                            })}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["matrixSector"]}
                          </span>
                        </div>
                      </div>
                      {/* TYPE */}
                      <div class="mb-3">
                        <label class="form-label">
                          Type of building / infrastructure
                        </label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="matrixType"
                            onChange={this.handleChange.bind(
                              this,
                              "matrixType"
                            )}
                            value={this.state.fields["matrixType"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            <option value="type1">Type 1</option>
                            <option value="type2">Type 2</option>
                            <option value="type3">Type 3</option>
                            {/* {this.state.rangeTimes.map((item, index)=>{
                            return <option value={item.id}>{item.name}</option>
                        })}                         */}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["matrixType"]}
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

export default connect(mapStateToProps)(withRouter(AddRisk));
