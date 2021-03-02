import React, { useState } from "react";
import { Link } from "react-router-dom";
import { endpoint, buildUrl } from "../../utils/UrlService";
import ApiService from "../../utils/ApiService";
const Api = new ApiService();

export default class ProjectListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isPublished: this.props.project.isPublished
    };
    this.handleHover = this.handleHover.bind(this);
  }

  handleHover() {
    this.setState((prevState) => ({
      isHovered: !prevState.isHovered,
    }));
  }

  handlePublish(id) {
    this.setState({
      isPublished: !this.state.isPublished
    })
    let project = {
      isPublished: !this.props.project.isPublished
    };

    let headers = {
      "Content-Type": "application/merge-patch+json",
      Accept: "application/ld+json",
    };

    Api.patch(endpoint("editProject", [id]), project, headers).then((res) => {
      if (res) {
        this.props.updateProject(res);
      }
    });
  }

  render() {
    const {name,createdAt,author,id} = this.props.project;
    return (
      <tr>
        <td scope="row">{name}</td>
        <td>{new Date(createdAt).toLocaleString()}</td>
        <td>
          
          <button
            type="button"
            onClick={()=>this.handlePublish(id)}
            className={`${
              this.state.isPublished ? "btn btn-secondary" : "btn btn-primary"
            }`}
          >
            {this.state.isPublished ? "Unpublish" : "Publish"}
          </button>
        </td>
        <td>{author}</td>
        <td>
          <Link to={{ pathname: buildUrl("SHOW_PROJECT", id) }}>
            <button type="button" class="btn btn-primary">
              Go
            </button>
          </Link>
        </td>
        <td>
          <div class="dropdown">
            <button
              type="button"
              class="btn"
              id="dropdownMenu2"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
              {/* <Link to={{ pathname: buildUrl("EDIT_PROJECT", id) }}> */}
                <button class="dropdown-item" type="button" onClick={() => this.props.handleClick("edit_project", this.props.project)}>
                  Edit Project
                </button>
              {/* </Link> */}
              <button
                class="dropdown-item"
                type="button"
                onClick={() => this.props.onDelete(id)}
              >
                Delete Project
              </button>
              <button
                class="dropdown-item"
                type="button"
                onClick={this.handlePublish.bind(this, id)}
              >
                {this.state.isPublished ? "Unpublish" : "Publish"} Project
              </button>
              <button class="dropdown-item" type="button">
                Duplicate Project
              </button>
            </div>
          </div>
        </td>
      </tr>
    );

    /*
    <li className={`d-flex justify-content-between align-items-center list-group-item
      ${isActive}`} onMouseEnter={this.handleHover}
              onMouseLeave={this.handleHover}>
              {this.props.name} <br/>
              <small>{this.props.description}</small> <br/>
              <small>{this.props.createdAt} </small> <br/>
              <small>{this.props.isPublished} </small>      
          </li>
      */
  }
}
