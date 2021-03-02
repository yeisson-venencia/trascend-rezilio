import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import {buildUrl, endpoint } from "../../utils/UrlService";
import ApiService from "../../utils/ApiService";
import CreateGroup from "../groups/CreateGroup";
import EditGroup from "../groups/EditGroup";
const Api = new ApiService();

class EditProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "edit_project",
      fields: {},
      errors: {},
      sectors: [],
      project: {},
      sector: {},
      groups: [],
      group:{}
    };
  }

  componentDidMount() {
    this.fetchSectors(1);
    this.loadFields();
    this.loadGroups(this.props.project.id);
  }

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

  editProject(idProject) {
    let project = {
      name: this.state.fields["name"],
      description: this.state.fields["description"],
      sector: "/api/v1/sectors/" + this.state.fields["sector"],
      isPublished: false,
    };

    Api.put(endpoint("editProject", [idProject]), project).then((res) => {
      if (res) {
        console.log(res);
        this.props.updateProject(res);
      }
    });


  }

  loadFields() {
    const {name,description,sector} = this.props.project;
    let fields = this.state.fields;
    fields["name"] = name;
    fields["description"] = description;
    this.setState({ fields });
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
    console.log(fields["name"]);
    if (!fields["name"]) {
      console.log("falla name");
      formIsValid = false;
      errors["name"] = "Project name cannot be empty";
    }

    if (!fields["description"]) {
      formIsValid = false;
      errors["description"] = "Description cannot be empty";
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
      this.editProject(this.props.project.id);
      // e.preventDefault();
      this.props.handleClick("project_list");
    } else {
      e.preventDefault();
    }
  }

  handleClickGroup = (showComponent, group) => {
    this.setState({
      display: showComponent,
      group: group,
    });
  };

  loadGroups(idProject){
    Api.initAuth(this.props.history);
    Api.get(endpoint("projects", [idProject])).then((res) => {
      if (res) {
        let groups = res["groups"];
        this.setState({
          groups: groups,
        });
      }
    });
  }

   //update component list after add,delete or edit, NO se usa aún
  updateGroups = (group) => {
    let groups;
    groups = [...this.state.groups];
    let index = this.state.groups.findIndex((el) => el.id === group.id);
    if (index !== -1) {
      let groupEdited = Object.assign(groups[index], {
        name: group.name,
        position: group.position,
        company: group.company,
        email: group.email,
        phone: group.phone,
      });
      groups[index] = groupEdited;
    } else {
      groups = [...this.state.groups, group];
    }
    this.setState({
      groups: groups,
    });
  };

  deleteGroup(id) {
    Api.del(endpoint("delGroup", [id])).then((res) => {
      if (res) {
        const data = this.state.groups.filter((group) => group.id !== id);
        this.setState({ groups: data });
      }
    });
  }

  render() {
    const that = this;
    return (
      <>
      
      {this.state.display === "edit_project" ? (
      <div class="container-lg pt-4 text-start">
            <div class="d-flex justify-content-between">
                <h4 class="mb-4" className={styles.titleheader}>
                  Project test #1 - Project Edit
                </h4>
                  <button class="btn btn-light ml-4 px-4" onClick={() => this.props.handleClick("project_list")}>
                    Cancel
                  </button>
            </div>
            <form onSubmit={this.submitForm.bind(this)}>

              <div class="mb-4 mt-3">
                <label for="name" class="form-label">
                  Project Name
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
              <div class="mb-3">
                <label for="description" class="form-label">
                  Description
                </label>

                <div class="">
                  <textarea
                    class="col-12"
                    placeholder="Leave a comment here"
                    id="description"
                    onChange={this.handleChange.bind(this, "description")}
                    value={this.state.fields["description"]}
                  ></textarea>
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["description"]}
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
                    {this.state.sectors.map((item, index) => {
                      if (this.props.project.sector.name === item.name)
                        return (
                          <option value={item.id} selected>
                            {item.name}
                          </option>
                        );
                      else return <option value={item.id}>{item.name}</option>;
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
            {/* GROUP SECTION */}
            <div class="mb-3 col-6 d-flex justify-content-between">
                <label class="form-label">Groups</label>
              
                  <button type="button" class="btn btn-primary" onClick={() => this.handleClickGroup("add_group")}>
                    Add new
                  </button>
              </div>
              <div class="col-6">
                {this.state.groups.length > 0
                  ? this.state.groups.map((group) => {
                      return (
                        <div class="d-flex justify-content-between mb-4">
                          <div>{group.name}</div>
                          <div class=" ">
                            <Link
                              to={{
                                pathname: buildUrl("EDIT_GROUP", group.id),
                              }}
                            >
                              <button class="btn btn-warning px-4">EDIT</button>
                            </Link>
                            <button
                              class="btn btn-danger px-4"
                              onClick={() => this.deleteGroup(group.id)}
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                      );
                    })
                  : "No hay grupos"}
              </div>

              {/* END GROUP SECTION */}
          </div>
        
        ):null}

          {this.state.display === "add_group" ? (
            <CreateGroup
              idProject={this.props.project.id}
              updateGroups={this.updateGroups}
              handleClickGroup={this.handleClickGroup}
            />
          ) : null}
          {this.state.display === "edit_group" ? (
            <EditGroup
              // player={this.state.player}
              // idSite={this.props.site.id}
              // updatePlayers={this.updatePlayers}
              // handleClickPlayer={this.handleClickPlayer}
            />
          ) : null}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(EditProject));
