import React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Map } from "@esri/react-arcgis";
import MapPoint from "../map/MapPoint";

import { endpoint } from "../../utils/UrlService";
import ApiService from "../../utils/ApiService";
const Api = new ApiService();

class AddSite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      showMap: false,
      map: null,
      view: null,
      point: [],
      groups: [],
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  componentDidMount() {
    this.loadGroups(this.props.id);
  }

  //Add new site
  addNewSite() {
    let site = {
      name: this.state.fields["siteName"],
      responsible: this.state.fields["siteResponsible"],
      location: this.state.fields["siteLocation"],
      project: "/api/v1/projects/" + this.props.id,
      grp: "/api/v1/groups/" + this.state.fields["group"],
    };

    Api.post(endpoint("sites"), site).then((res) => {
      if (res) {
        console.log(res);
        this.props.updateSites(res);
        console.log("site added");
      }
    });
  }

  //Loading groups
  loadGroups(id) {
    Api.initAuth(this.props.history);
    Api.get(endpoint("projects", [id])).then((res) => {
      if (res) {
        let groups = res["groups"];
        this.setState({
          groups: groups,
        });
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

  //Show Map (TODO: Refactor)
  buttonShow() {
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
    fields["siteLocation"] = coords.toString();
    this.setState({ fields });
  }

  //Validation Form
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["siteName"]) {
      formIsValid = false;
      errors["siteName"] = "Site name cannot be empty";
    }

    if (!fields["siteResponsible"]) {
      formIsValid = false;
      errors["siteResponsible"] = "Responsible cannot be empty";
    }

    if (!fields["siteLocation"]) {
      formIsValid = false;
      errors["siteLocation"] = "Location cannot be empty";
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
      this.addNewSite();
      this.props.handleClick("list");
    } else {
      e.preventDefault();
    }
  }

  render() {
    return (
      <>
        <div class="h-screen">
          <div className={styles.menuRezilio}>
            <div class="d-flex flex-col justify-center items-center mx-4 mt-3 ">
              {this.state.showMap && (
                <div className={styles.fixMenu}>
                  <div class="container-lg pt-4">
                    <form>
                      <div class="d-flex justify-content-between">
                        <h4 class="mb-4" className={styles.titleheader}>
                          Site test #1 - Site Settings
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
              {this.state.showMap === false && (
                <div className={styles.fixMenu}>
                  <div class="container-lg pt-4">
                    <div class="d-flex justify-content-between">
                      <h4 class="mb-4" className={styles.titleheader}>
                        Site test #1 - Site Settings
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
                        <label for="siteName" class="form-label">
                          Site Name
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="siteName"
                            onChange={this.handleChange.bind(this, "siteName")}
                            value={this.state.fields["siteName"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["siteName"]}
                          </span>
                        </div>
                      </div>
                      <div class="mb-4 mt-3">
                        <label for="siteResponsible" class="form-label">
                          Site Responsible
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="siteResponsible"
                            onChange={this.handleChange.bind(
                              this,
                              "siteResponsible"
                            )}
                            value={this.state.fields["siteResponsible"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["siteName"]}
                          </span>
                        </div>
                      </div>
                      {/* SITE LOCATION */}
                      <div class="mb-4 mt-3">
                        <label for="siteLocation" class="form-label">
                          Site Location
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="siteLocation"
                            onChange={this.handleChange.bind(
                              this,
                              "siteLocation"
                            )}
                            value={this.state.fields["siteLocation"]}
                          />
                          <button onClick={() => this.buttonShow()}>
                            openMap
                          </button>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["siteLocation"]}
                          </span>
                        </div>
                      </div>
                      {/* GROUPS */}
                      <div class="mb-3">
                        <label class="form-label">Groups</label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="group"
                            onChange={this.handleChange.bind(this, "group")}
                            value={this.state.fields["group"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
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
                  </div>
                </div>
              )}
            </div>
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

export default connect(mapStateToProps)(withRouter(AddSite));
