import React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { endpoint } from "../../utils/UrlService";

import ApiService from "../../utils/ApiService";
const Api = new ApiService();

class AddPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
    };
  }

  addNewPlayer() {
    let player = {
      name: this.state.fields["playerName"],
      position: this.state.fields["playerPosition"],
      company: this.state.fields["playerCompany"],
      email: this.state.fields["playerEmail"],
      phone: this.state.fields["playerPhone"],
      site: "/api/v1/sites/" + this.props.idSite,
    };

    Api.initAuth(this.props.history);
    Api.post(endpoint("players"), player).then((res) => {
      if (res) {
        console.log(res);
        this.props.updatePlayers(res);
        console.log("player added");
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

    if (!fields["playerName"]) {
      formIsValid = false;
      errors["playerName"] = "Player name cannot be empty";
    }

    if (!fields["playerPosition"]) {
      formIsValid = false;
      errors["playerPosition"] = "Position cannot be empty";
    }

    if (!fields["playerCompany"]) {
      formIsValid = false;
      errors["playerCompany"] = "Company cannot be empty";
    }

    if (!fields["playerEmail"]) {
      formIsValid = false;
      errors["playerEmail"] = "Email cannot be empty";
    }

    if (!fields["playerPhone"]) {
      formIsValid = false;
      errors["playerPhone"] = "Phone cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitSite");
    if (this.handleValidation()) {
      this.addNewPlayer();
      this.props.handleClick("editSite");
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
                Player test #1 - Player Settings
              </h4>
              <button
                class="btn btn-light ml-4 px-4"
                onClick={() => this.props.handleClickPlayer("editSite")}
              >
                Cancel
              </button>
            </div>
            <form onSubmit={this.submitForm.bind(this)}>
              <div class="mb-4 mt-3">
                <label for="playerName" class="form-label">
                  Player Name
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="playerName"
                    onChange={this.handleChange.bind(this, "playerName")}
                    value={this.state.fields["playerName"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["playerName"]}
                  </span>
                </div>
              </div>
              {/* PLAYER POSITION */}
              <div class="mb-4 mt-3">
                <label for="playerPosition" class="form-label">
                  Player Position
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="playerPosition"
                    onChange={this.handleChange.bind(this, "playerPosition")}
                    value={this.state.fields["playerPosition"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["playerName"]}
                  </span>
                </div>
              </div>
              {/* PLAYER COMPANY */}
              <div class="mb-4 mt-3">
                <label for="playerCompany" class="form-label">
                  Player Company
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="playerCompany"
                    onChange={this.handleChange.bind(this, "playerCompany")}
                    value={this.state.fields["playerCompany"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["playerCompany"]}
                  </span>
                </div>
              </div>
              {/* PLAYER EMAIL */}
              <div class="mb-4 mt-3">
                <label for="playerEmail" class="form-label">
                  Player Email
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="playerEmail"
                    onChange={this.handleChange.bind(this, "playerEmail")}
                    value={this.state.fields["playerEmail"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["playerEmail"]}
                  </span>
                </div>
              </div>
              {/* PLAYER PHONE */}
              <div class="mb-4 mt-3">
                <label for="playerPhone" class="form-label">
                  Player Phone
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="playerPhone"
                    onChange={this.handleChange.bind(this, "playerPhone")}
                    value={this.state.fields["playerPhone"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["playerPhone"]}
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

export default connect(mapStateToProps)(withRouter(AddPlayer));
