import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import HeaderPrivate from "../header/HeaderPrivate";
import styles from "../../css/CreateProject.module.scss";
import SideBar from "../sidebar/SideBar";
import AddSite from "./AddSite";
import { Site } from "../../models/Site";
import EditSite from "./EditSite";
import { endpoint } from "../../utils/UrlService";
import ApiService from "../../utils/ApiService";
const Api = new ApiService();

class ListSite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      display: "list",
      site: {},
    };
  }

  componentDidMount() {
    this.loadsites(this.props.match.params.id, 1);
    console.log("xD");
  }

  //Load Groups by project
  loadsites(id, page) {
    Api.initAuth(this.props.history);
    Api.get(endpoint("getSites", [id, page])).then((res) => {
      if (res) {
        let sites = Site(res["hydra:member"]);
        this.setState({
          sites: sites,
        });
      }
    });
  }
  //DeleteSite
  deleteSite(id) {
    Api.del(endpoint("delSites", [id])).then((res) => {
      if (res) {
        const data = this.state.sites.filter((site) => site.id !== id);
        console.log(this.state.sites);
        this.setState({ sites: data });
      }
    });
  }
  //show add,edit or list component
  handleClick = (showComponent, site) => {
    console.log(showComponent);
    this.setState({
      display: showComponent,
      site: site,
    });
  };
  //update component list after add,delete or edit, NO se usa aún
  updateSites = (site) => {
    let sites;
    sites = [...this.state.sites];
    let index = this.state.sites.findIndex((el) => el.id === site.id);
    if (index !== -1) {
      let siteEdited = Object.assign(sites[index], {
        name: site.name,
        responsible: site.responsible,
        location: site.location,
      });
      sites[index] = siteEdited;
    } else {
      sites = [...this.state.sites, site];
    }
    this.setState({
      sites: sites,
    });
  };
  //format location
  spliceLocation(sl) {
    let arrSL = sl.split(",");
    const p = arrSL.reduce(function (result, value, index, array) {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);
    let stringFormatted = JSON.stringify(p);
    stringFormatted = stringFormatted.replaceAll("[", "{");
    stringFormatted = stringFormatted.replaceAll("]", "}").slice(1, -1);
    // console.log(stringFormatted);
    return stringFormatted;
  }

  render() {
    const siteItems = this.state.sites.map((site) => {
      return (
        <tr>
          <td>{site.name}</td>
          <td>{new Date(site.createdAt).toLocaleString()}</td>
          <td>{site.responsible}</td>
          <td>{this.spliceLocation(site.location)}</td>
          <td>
            <button
              class="btn btn-warning px-4"
              onClick={() => this.handleClick("editSite", site)}
            >
              Edit
            </button>
          </td>
          <td>
            <button
              class="btn btn-danger px-4"
              onClick={() => this.deleteSite(site.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

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
                idComponent={"ListSite"}
                handleClick={this.handleClick}
              />

              <div className={styles.fixMenu}>
                {this.state.display === "list" ? (
                  <>
                    <div class="d-flex justify-content-md-end ">
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={() => this.handleClick("addSite")}
                      >
                        Add new Site
                      </button>
                    </div>

                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Date</th>
                          <th scope="col">Responsible</th>
                          <th scope="col">Location</th>
                          <th scope="col">EDIT</th>
                          <th scope="col">DELETE</th>
                        </tr>
                      </thead>
                      <tbody>{siteItems}</tbody>
                    </table>
                  </>
                ) : null}

                {this.state.display === "addSite" ? (
                  <AddSite
                    id={this.props.match.params.id}
                    updateSites={this.updateSites}
                    handleClick={this.handleClick}
                  />
                ) : null}
                {this.state.display === "editSite" ? (
                  <EditSite
                    site={this.state.site}
                    idProject={this.props.match.params.id}
                    updateSites={this.updateSites}
                    handleClick={this.handleClick}
                  />
                ) : null}
              </div>
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

export default connect(mapStateToProps)(withRouter(ListSite));
