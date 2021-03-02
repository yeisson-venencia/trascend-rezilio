import React, { Profiler } from "react";
import ProjectListItem from "./ProjectListItem";
import { Link } from "react-router-dom";
import { endpoint, buildUrl } from "../../utils/UrlService";
import CreateProject from "./CreateProject";
import ApiService from "../../utils/ApiService";
import EditProject from "./EditProject";
const Api = new ApiService();

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      display: "project_list",
      project: {},
    };
  }

  componentDidMount() {
    this.loadProjects(1);
  }

  //Delete Project
  handleDelete = (itemId) => {
    Api.del(endpoint("delProject", [itemId])).then((res) => {
      if (res) {
        const data = this.state.projects.filter(
          (project) => project.id !== itemId
        );
        this.setState({ projects: data });
      }
    });
  };

  //GetProjects
  loadProjects(page) {
    Api.initAuth(this.props.history);
    Api.get(endpoint("getProjects", [page])).then((res) => {
      if (res) {
        let projects = res["hydra:member"];
        let totalProjects = projects.length;
        this.setState({
          isLoading: false,
          projects: projects,
          totalProjects: totalProjects,
        });
      }
    });
  }

  //show add,edit or list component
  handleClick = (showComponent, project) => {
    console.log(showComponent);
    this.setState({
      display: showComponent,
      project: project,
    });
  };

  updateProject = (project) => {
    console.log(project);
    let projects;
    projects = [...this.state.projects];
    let index = this.state.projects.findIndex((el) => el.id === project.id);
    if (index !== -1) {
      let projectEdited = Object.assign(projects[index], {
        name: project.name,
        description: project.description,
        sector: project.sector,
      });
      projects[index] = projectEdited;
    } else {
      projects = [...this.state.projects, project];
    }
    this.setState({
      projects: projects,
    });
  };

  render() {
    const projectItems = this.state.projects.map((project) => (
      <ProjectListItem
        project={project}
        onDelete={this.handleDelete}
        updateProject={this.updateProject}
                  handleClick={this.handleClick}
        author={this.props.profile.user.name}
      />
    ));

    return (
      <>
        {this.state.display === "project_list" ? (
          <div>
            <div class="mx-4 mt-3">
              <div class="d-flex justify-content-md-end">
                {/* <Link to={buildUrl("CREATE_PROJECT")}> */}
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={() => this.handleClick("add_project")}
                  >
                    Add new
                  </button>
                {/* </Link> */}
              </div>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Project name</th>
                  <th scope="col">Last updated</th>
                  <th scope="col">Status</th>
                  <th scope="col">Author</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>{projectItems}</tbody>
            </table>
          </div>
        ) : null}
        {this.state.display === "add_project" ? (
          <div>
            <div class="mx-4 mt-3">
              <div>
                <CreateProject
                  // id={this.props.match.params.id}
                  updateProject={this.updateProject}
                  handleClick={this.handleClick}
                />
              </div>
            </div>
          </div>
        ) : null}
        {this.state.display === "edit_project" ? (
          <div>
            <div class="mx-4 mt-3">
              <div>
                <EditProject
                  project={this.state.project}
                  updateProject={this.updateProject}
                  handleClick={this.handleClick}
                />
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
