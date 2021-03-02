import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl, endpoint } from "../../utils/UrlService";
import ApiService from "../../utils/ApiService";
const Api = new ApiService();

class EditPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      player: {},
      indexSite: 0,
    };
  }

  componentDidMount() {
    // this.loadPlayer(this.props.match.params.id);
    console.log(this.props.player);
    let idxSite = this.props.idSite;
    this.setState({ indexSite: idxSite });
    this.loadFields();
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Player name cannot be empty";
    }

    if (!fields["position"]) {
      formIsValid = false;
      errors["position"] = "Position cannot be empty";
    }

    if (!fields["company"]) {
      formIsValid = false;
      errors["company"] = "Company cannot be empty";
    }

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
    }

    if (!fields["phone"]) {
      formIsValid = false;
      errors["phone"] = "Phone cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    if (this.handleValidation()) {
      this.editPlayer(this.props.player.id);
      this.props.handleClickPlayer("editSite");
    } else {
      e.preventDefault();
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  //edit player
  editPlayer(id) {
    let player = {
      name: this.state.fields["name"],
      position: this.state.fields["position"],
      company: this.state.fields["company"],
      email: this.state.fields["email"],
      phone: this.state.fields["phone"],
    };

    let headers = {
      "Content-Type": "application/merge-patch+json",
      Accept: "application/ld+json",
    };

    Api.initAuth(this.props.history);
    Api.patch(endpoint("editPlayer", [id]), player, headers).then((res) => {
      if (res) {
        console.log(res);
        this.props.updatePlayers(res);
      }
    });
  }
  //Form
  loadFields() {
    const { name, position, company, email, phone } = this.props.player;
    let fields = this.state.fields;
    fields["name"] = name;
    fields["position"] = position;
    fields["company"] = company;
    fields["email"] = email;
    fields["phone"] = phone;
    // fields["group"] = this.state.groups[].location; TODO:falta getGroup del back
    this.setState({ fields });
  }

  render() {
    const that = this;
    return (
      <>
        <HeaderPrivate auth={that.props.auth} />

        <div className={styles.createproject}>
          <div class="container-lg pt-4">
            <form onSubmit={this.submitForm.bind(this)}>
              <div class="d-flex justify-content-between">
                <h4 class="mb-4" className={styles.titleheader}>
                  Player Edit #1 - Player Settings
                </h4>
                <button
                  class="btn btn-light ml-4 px-4"
                  onClick={() => this.props.handleClickPlayer("editSite")}
                >
                  Cancel
                </button>
              </div>
              <div class="mb-4 mt-3">
                <label for="name" class="form-label">
                  Player Name
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="name"
                    onChange={this.handleChange.bind(this, "name")}
                    defaultValue={this.state.fields["name"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["name"]}
                  </span>
                </div>
              </div>
              {/* PLAYER POSITION */}
              <div class="mb-4 mt-3">
                <label for="position" class="form-label">
                  Player Position
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="position"
                    onChange={this.handleChange.bind(this, "position")}
                    defaultValue={this.state.fields["position"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["name"]}
                  </span>
                </div>
              </div>
              {/* PLAYER COMPANY */}
              <div class="mb-4 mt-3">
                <label for="company" class="form-label">
                  Player Company
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="company"
                    onChange={this.handleChange.bind(this, "company")}
                    defaultValue={this.state.fields["company"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["company"]}
                  </span>
                </div>
              </div>
              {/* PLAYER EMAIL */}
              <div class="mb-4 mt-3">
                <label for="email" class="form-label">
                  Player Email
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="email"
                    onChange={this.handleChange.bind(this, "email")}
                    defaultValue={this.state.fields["email"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["email"]}
                  </span>
                </div>
              </div>
              {/* PLAYER PHONE */}
              <div class="mb-4 mt-3">
                <label for="phone" class="form-label">
                  Player Phone
                </label>
                <div class="">
                  <input
                    type="text"
                    class="col-6"
                    id="phone"
                    onChange={this.handleChange.bind(this, "phone")}
                    defaultValue={this.state.fields["phone"]}
                  />
                </div>
                <div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["phone"]}
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

export default connect(mapStateToProps)(withRouter(EditPlayer));
