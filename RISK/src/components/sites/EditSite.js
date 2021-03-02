import React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl, endpoint } from "../../utils/UrlService";
import { Map } from "@esri/react-arcgis";
import MapPoint from "../map/MapPoint";

import ApiService from "../../utils/ApiService";
import AddPlayer from "../players/AddPlayer";
import EditPlayer from "../players/EditPlayer";

const Api = new ApiService();

class editSite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      site: {},
      players: [],
      player: {},
      indexProject: 0,
      showMap: false,
      map: null,
      view: null,
      point: [],
      groups: [],
      display: "editSite",
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  componentDidMount() {
    let idxProject = this.props.idProject;
    this.setState({ indexProject: idxProject });
    this.loadGroups(idxProject);
    this.loadPlayers(this.props.site.id);
    this.loadFields();
  }

  // Loading groups
  loadGroups(idProject) {
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

  //editSite
  editSite(id) {

    let site = {
      name: this.state.fields["name"],
      responsible: this.state.fields["responsible"],
      location: this.state.fields["location"],
      project: "/api/v1/projects/" + this.state.indexProject,
      grp: "/api/v1/groups/" + this.state.fields["group"],
    };

    let headers = {
      "Content-Type": "application/merge-patch+json",
      Accept: "application/ld+json",
    };

    Api.patch(endpoint("editSites", [id]), site, headers).then((res) => {
      if (res) {
        console.log(res);
        this.props.updateSites(res);
      }
    });
  }

  //MAP
  handleMapLoad(map, view) {
    this.setState({ map, view });
  }

  info(e) {
    let latLong = [e.mapPoint.latitude, e.mapPoint.longitude];
    this.setState({
      point: [...this.state.point, latLong],
    });
  }

  buttonShow() {
    console.log(this.props.site["location"]);
    let savedPoints = this.props.site["location"].split(",");
    const p = savedPoints.reduce(function (result, value, index, array) {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);
    console.log(p);

    this.setState({
      point: [...this.state.point, ...p],
    });
    let show = !this.state.showMap;
    this.setState({
      showMap: show,
    });
  }

  buttonClose(coords) {
    let show = !this.state.showMap;
    this.setState({
      showMap: show,
    });
    let fields = this.state.fields;
    fields["location"] = coords.toString();
    this.setState({ fields });
    //actualizamos el location antes de editarlo.
    let site = this.state.site;
    site["location"] = this.state.site["location"];
    this.setState({
      site: this.state.site,
    });
  }

  //Form
  loadFields() {
    const { name, responsible, location } = this.props.site;
    let fields = this.state.fields;
    fields["name"] = name;
    fields["responsible"] = responsible;
    fields["location"] = location;
    // fields["group"] = this.state.groups[].location; TODO:falta getGroup del back
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

    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Site name cannot be empty";
    }

    if (!fields["responsible"]) {
      formIsValid = false;
      errors["responsible"] = "Responsible cannot be empty";
    }

    if (!fields["location"]) {
      formIsValid = false;
      errors["location"] = "Location cannot be empty";
    }

    if (!fields["group"]) {
      formIsValid = false;
      errors["group"] = "Select one option";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    if (this.handleValidation()) {
      this.editSite(this.props.site.id);
      this.props.handleClick("list");
    } else {
      e.preventDefault();
    }
  }

  //Players
  handleClickPlayer = (showComponent, player) => {
    this.setState({
      display: showComponent,
      player: player,
    });
  };

  //update component list after add,delete or edit, NO se usa aún
  updatePlayers = (player) => {
    let players;
    players = [...this.state.players];
    let index = this.state.players.findIndex((el) => el.id === player.id);
    if (index !== -1) {
      let playerEdited = Object.assign(players[index], {
        name: player.name,
        position: player.position,
        company: player.company,
        email: player.email,
        phone: player.phone,
      });
      players[index] = playerEdited;
    } else {
      players = [...this.state.players, player];
    }
    this.setState({
      players: players,
    });
  };

  //loadPlayers
  loadPlayers(id) {
    Api.get(endpoint("getPlayers", [id])).then((res) => {
      if (res) {
        let players = res["hydra:member"];
        console.log(players);
        this.setState({
          players: players,
        });
      }
    });
  }

  //deletePlayers
  deletePLayer(id) {
    Api.del(endpoint("delPlayer", [id])).then((res) => {
      if (res) {
        const data = this.state.players.filter((player) => player.id !== id);
        this.setState({ players: data });
      }
    });
  }

  render() {
    const that = this;
    const { indexProject } = that.state;
    const listPlayers = this.state.players.map((player) => {
      return (
        <tr>
          <td scope="row">{player.name}</td>
          <td>{player.position}</td>
          <td>{player.company}</td>
          <td>{player.email}</td>
          <td>{player.phone}</td>
          <td>
            <button
              class="btn btn-warning px-4"
              onClick={() => this.handleClickPlayer("editPlayer", player)}
            >
              EDIT
            </button>
          </td>
          <td>
            <button
              class="btn btn-danger px-4 "
              onClick={() => this.deletePLayer(player.id)}
            >
              DELETE
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div class="h-screen">
        <div className={styles.menuRezilio}>
          {/* {this.state.display === "editSite" ? ( */}
          {this.state.display === "editSite" && this.state.showMap && (
            <div className={styles.fixMenu}>
              <div class="container-lg pt-4">
                <form>
                  <div class="d-flex justify-content-between">
                    <h4 class="mb-4" className={styles.titleheader}>
                      Site test #1 - Site Edit
                    </h4>
                    <button
                      class="btn btn-light ml-4 px-4"
                      onClick={() => this.buttonClose(this.state.point)}
                    >
                      Close
                    </button>
                  </div>
                </form>
                <div className={styles.mapRoot}>
                  <Map
                    onClick={(e) => this.info(e)}
                    mapProperties={{ basemap: "streets" }}
                  >
                    <MapPoint pointClick={this.state.point} />
                  </Map>
                </div>
              </div>
            </div>
          )}
          {this.state.display === "editSite" && this.state.showMap === false && (
            <div className={styles.fixMenu}>
              <div className={styles.createproject}>
                <div class="container-lg pt-4">
                  <div class="d-flex justify-content-between">
                    <h4 class="mb-4" className={styles.titleheader}>
                      Site test #1 - Site Edit
                    </h4>
                    <button
                      class="btn btn-light ml-4 px-4"
                      onClick={() => this.props.handleClick("list")}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={this.submitForm.bind(this)}>
                    <div class="mb-4 mt-3">
                      <label for="name" class="form-label">
                        Site Name
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
                    {/* SITE RESPONSIBLE */}
                    <div class="mb-4 mt-3">
                      <label for="responsible" class="form-label">
                        Site Responsible
                      </label>
                      <div class="">
                        <input
                          type="text"
                          class="col-6"
                          id="responsible"
                          onChange={this.handleChange.bind(this, "responsible")}
                          value={this.state.fields["responsible"]}
                        />
                      </div>
                      <div>
                        <span style={{ color: "red" }}>
                          {this.state.errors["name"]}
                        </span>
                      </div>
                    </div>
                    {/* SITE LOCATION */}
                    <div class="mb-4 mt-3">
                      <label for="location" class="form-label">
                        Site Location
                      </label>
                      <div class="">
                        <input
                          type="text"
                          class="col-6"
                          id="location"
                          onChange={this.handleChange.bind(this, "location")}
                          value={this.state.fields["location"]}
                        />
                        <button onClick={() => this.buttonShow()}>
                          openMap
                        </button>
                      </div>
                      <div>
                        <span style={{ color: "red" }}>
                          {this.state.errors["location"]}
                        </span>
                      </div>
                    </div>
                    {/* GROUP SECTION */}
                    <div class="mb-3">
                      <label class="form-label">Group</label>
                      <div>
                        <select
                          className={styles.selectform}
                          id="group"
                          onChange={this.handleChange.bind(this, "group")}
                          value={this.state.fields["group"]}
                        >
                          {this.state.groups.map((item, index) => {
                            if (this.state.fields["group"] === item.name)
                              return (
                                <option value={item.id} selected>
                                  {item.name}
                                </option>
                              );
                            else
                              return (
                                <option value={item.id}>{item.name}</option>
                              );
                          })}
                        </select>
                      </div>
                      <div>
                        <span style={{ color: "red" }}>
                          {this.state.errors["group"]}
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

                  {/* PLAYER SECTION */}
                  <div>
                    <div class=" mt-3">
                      <div class="d-flex justify-content-md-between">
                        <label class="form-label">Players</label>

                        <button
                          type="button"
                          class="btn btn-primary"
                          onClick={() => this.handleClickPlayer("addPlayer")}
                        >
                          Add new player
                        </button>
                      </div>
                      {this.state.players.length > 0 ? (
                        <table class="table table-hover">
                          <thead>
                            <tr>
                              <th class="col ">Name</th>
                              <th class="col ">Position</th>
                              <th class="col ">Company</th>
                              <th class="col ">Email</th>
                              <th class="col ">Phone</th>
                              <th class="col ">Edit</th>
                              <th class="col ">Delete</th>
                            </tr>
                          </thead>
                          <tbody>{listPlayers}</tbody>
                        </table>
                      ) : (
                        "No hay Players"
                      )}
                    </div>
                  </div>

                  {/* END PLAYER SECTION */}
                </div>
              </div>
            </div>
          )}

          {this.state.display === "addPlayer" ? (
            <AddPlayer
              idSite={this.props.site.id}
              updatePlayers={this.updatePlayers}
              handleClickPlayer={this.handleClickPlayer}
            />
          ) : null}
          {this.state.display === "editPlayer" ? (
            <EditPlayer
              player={this.state.player}
              idSite={this.props.site.id}
              updatePlayers={this.updatePlayers}
              handleClickPlayer={this.handleClickPlayer}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(editSite));
