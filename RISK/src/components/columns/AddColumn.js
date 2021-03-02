import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class AddColumn extends React.Component {
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
  async componentWillMount() {}

  //FORM VALIDATION
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["columnName"]) {
      formIsValid = false;
      errors["columnName"] = "Column name cannot be empty";
    }

    if (!fields["columnRV"]) {
      formIsValid = false;
      errors["columnRV"] = "Select one option";
    }

    if (!fields["columnEval"]) {
      formIsValid = false;
      errors["columnEval"] = "Select one option";
    }

    if (!fields["columnWeight"]) {
      formIsValid = false;
      errors["columnWeight"] = "Column Weight cannot be empty";
    }

    if (!fields["columnIndexRank"]) {
      formIsValid = false;
      errors["columnIndexRank"] = "Column Index Rank cannot be empty";
    }

    if (!fields["columnRankUnits"]) {
      formIsValid = false;
      errors["columnRankUnits"] = "Column Ran Units cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitgroup");
    if (this.handleValidation()) {
      this.addNewColumn();
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

  //MATRIX POST
  addNewColumn() {
    console.log("addNewColumn");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.fields["columnName"],
        type: this.state.fields["columnRV"],
        weight: parseInt(this.state.fields["columnWeight"]),
        step: 0, //no tiene campo
        min: parseInt(this.state.fields["columnIndexRank"]),
        max: parseInt(this.state.fields["columnRankUnits"]),
        matrix: "/api/v1/matrices/" + this.props.match.params.id,
      }),
    };

    console.log(requestOptions);

    fetch(
      "https://risk-module-api.herokuapp.com/api/v1/columns",
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
                          Column test #1 - Column Creation
                        </h4>
                        <Link
                          to={buildUrl("EDIT_RISK", this.props.match.params.id)}
                        >
                          <button class="btn btn-light ml-4 px-4" type="submit">
                            Cancel
                          </button>
                        </Link>
                      </div>
                      {/* MATRIX NAME */}
                      <div class="my-3">
                        <label for="columnName" class="form-label">
                          Name
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="columnName"
                            onChange={this.handleChange.bind(
                              this,
                              "columnName"
                            )}
                            value={this.state.fields["columnName"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["columnName"]}
                          </span>
                        </div>
                      </div>
                      {/* SECTOR */}
                      <div class="mb-3">
                        <label class="form-label">Risk or Vulnerability</label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="columnRV"
                            onChange={this.handleChange.bind(this, "columnRV")}
                            value={this.state.fields["columnRV"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            <option value="TYPE_RISK">Risk</option>
                            <option value="TYPE_VULNERABILITY">
                              Vulnerability
                            </option>
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["columnRV"]}
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
                            id="columnEval"
                            onChange={this.handleChange.bind(
                              this,
                              "columnEval"
                            )}
                            value={this.state.fields["columnEval"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            <option value="Probability">
                              Probability of ocurrence
                            </option>
                            <option value="Recurrence">Recurrence</option>
                            <option value="Consecuences">Consecuences</option>
                            <option value="Intensity">Intensity</option>
                            <option value="Prevention">
                              Prevention mesures
                            </option>
                            <option value="Reaction">
                              Reaction capability
                            </option>
                            {/* {this.state.rangeTimes.map((item, index)=>{
                            return <option value={item.id}>{item.name}</option>
                        })}                         */}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["columnEval"]}
                          </span>
                        </div>
                      </div>
                      {/* MATRIX NAME */}
                      <div class="my-3">
                        <label for="columnWeight" class="form-label">
                          Variable weight
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="columnWeight"
                            onChange={this.handleChange.bind(
                              this,
                              "columnWeight"
                            )}
                            value={this.state.fields["columnWeight"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["columnWeight"]}
                          </span>
                        </div>
                      </div>
                      {/* MATRIX NAME */}
                      <div class="my-3">
                        <label for="columnIndexRank" class="form-label">
                          IndexRank
                        </label>
                        <div class="">
                          <input
                            type="number"
                            class="col-6"
                            id="columnIndexRank"
                            onChange={this.handleChange.bind(
                              this,
                              "columnIndexRank"
                            )}
                            value={this.state.fields["columnIndexRank"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["columnIndexRank"]}
                          </span>
                        </div>
                      </div>
                      {/* MATRIX NAME */}
                      <div class="my-3">
                        <label for="columnRankUnits" class="form-label">
                          Rank units
                        </label>
                        <div class="">
                          <input
                            type="number"
                            class="col-6"
                            id="columnRankUnits"
                            onChange={this.handleChange.bind(
                              this,
                              "columnRankUnits"
                            )}
                            value={this.state.fields["columnRankUnits"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["columnRankUnits"]}
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

export default connect(mapStateToProps)(withRouter(AddColumn));
