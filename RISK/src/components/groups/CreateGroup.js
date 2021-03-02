import React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";

import {buildUrl, endpoint } from "../../utils/UrlService";
import ApiService from "../../utils/ApiService";
const Api = new ApiService();

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "add_group",
      fields: {},
      errors: {},
    };
  }

  componentDidMount() {}

  addNewGroup() {
    let group = {
        name: this.state.fields["name"],
        project: "/api/v1/projects/" + this.props.idProject,
      };
  
      Api.initAuth(this.props.history);
      Api.post(endpoint("groups"), group).then((res) => {
        if (res) {
          console.log(res);
          this.props.updateGroups(res);
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

    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Group name cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitgroup");
    if (this.handleValidation()) {
      this.addNewGroup();
      this.props.handleClickGroup("edit_project");
    } else {
      e.preventDefault();
    }
  }


  render() {
    const that = this;
    return (
      <>
        <div className={styles.createproject}>
          <div class="container-lg pt-4">
              <div class="d-flex justify-content-between">
                <h4 class="mb-4" className={styles.titleheader}>
                  Group test #1 - Group Settings
                </h4>
                  <button class="btn btn-light ml-4 px-4" onClick={() => this.props.handleClickGroup("edit_project")}>
                    Cancel
                  </button>
              </div>
            <form onSubmit={this.submitForm.bind(this)}>
              <div class="mb-4 mt-3">
                <label for="name" class="form-label">
                  Group Name
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
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(CreateGroup));
