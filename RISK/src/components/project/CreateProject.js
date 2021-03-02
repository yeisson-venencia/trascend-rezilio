import React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { endpoint } from "../../utils/UrlService";
import ApiService from "../../utils/ApiService";
const Api = new ApiService();

class CreateProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      sectors: [],
    };
  }

  componentDidMount() {
    this.fetchSectors(1);
  }

  //Load Sectors
  fetchSectors(page) {
    Api.initAuth(this.props.history);
    Api.get(endpoint("getSectors", [page])).then((res) => {
      if (res) {
        let sectors = res["hydra:member"];
        this.setState({
          sectors: sectors,
        });
      }
    });
  }

  addNewProject() {
    let project = {
      name: this.state.fields["projectName"],
      description: this.state.fields["projectDescription"],
      sector: "/api/v1/sectors/" + this.state.fields["sector"],
      isPublished: false,
    };

    Api.post(endpoint("addProject"), project).then((res) => {
      if (res) {
        console.log(res);
        this.props.updateProject(res);
        console.log("project added");
      }
    });
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["projectName"]) {
      formIsValid = false;
      errors["projectName"] = "Project name cannot be empty";
    }

    if (!fields["projectDescription"]) {
      formIsValid = false;
      errors["projectDescription"] = "Description cannot be empty";
    }

    if (!fields["sector"]) {
      formIsValid = false;
      errors["sector"] = "Select one option";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    if (this.handleValidation()) {
      this.addNewProject();
      this.props.handleClick("project_list");
    } else {
      e.preventDefault();
    }
  }

  render() {
    const that = this;
    return (
      <>
        <div class="container-lg pt-4 text-start">
          <div class="d-flex justify-content-between">
            <h4 class="mb-4" className={styles.titleheader}>
              Project test #1 - Project Settings
            </h4>
            <button
              class="btn btn-light ml-4 px-4"
              onClick={() => this.props.handleClick("project_list")}
            >
              Cancel
            </button>
          </div>
          <form onSubmit={this.submitForm.bind(this)}>
            <div class="mb-4 mt-3">
              <label for="projectName" class="form-label">
                Project Name
              </label>
              <div class="">
                <input
                  type="text"
                  class="col-6"
                  id="projectName"
                  onChange={this.handleChange.bind(this, "projectName")}
                  value={this.state.fields["projectName"]}
                />
              </div>
              <div>
                <span style={{ color: "red" }}>
                  {this.state.errors["projectName"]}
                </span>
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Company context description and its risk management
              </label>

              <div class="">
                <textarea
                  class="col-12"
                  placeholder="Leave a comment here"
                  id="projectDescription"
                  onChange={this.handleChange.bind(this, "projectDescription")}
                  value={this.state.fields["projectDescription"]}
                ></textarea>
              </div>
              <div>
                <span style={{ color: "red" }}>
                  {this.state.errors["projectDescription"]}
                </span>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Sector</label>
              <div>
                <select
                  className={styles.selectform}
                  id="sector"
                  onChange={this.handleChange.bind(this, "sector")}
                  value={this.state.fields["sector"]}
                >
                  <option value="" hidden>
                    Select one
                  </option>
                  {this.state.sectors.map((item, index) => {
                    return <option value={item.id}>{item.name}</option>;
                  })}
                </select>
              </div>
              <div>
                <span style={{ color: "red" }}>
                  {this.state.errors["sector"]}
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
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(CreateProject));
