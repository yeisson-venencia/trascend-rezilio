import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import SideBar from "../sidebar/SideBar";

class EditRisk extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      matrix: {},
      frequency: ["daily", "weekly", "monthly", "yearly"],
      intensity: ["low", "medium", "high"],
      indexProject: 0,
      sectors: [],
      sector: {},
      columns: [],
      levelR: [],
      levelV: [
        {
          id: 1,
          name: "Weak",
          lower: 0,
          upper: 10,
          color: "red",
        },
        {
          id: 2,
          name: "Moderate",
          lower: 60,
          upper: 80,
          color: "orange",
        },
      ],
    };
  }

  async componentWillMount() {
    await this.fetchSectors(1);
    await this.loadmatrix(this.props.match.params.id);
    await this.loadColumns(this.props.match.params.id);
    await this.loadLevel(this.props.match.params.id);
    let idxProject = this.state.matrix.project.substring(
      this.state.matrix.project.lastIndexOf("/") + 1,
      this.state.matrix.project.length
    );
    this.setState({ indexProject: idxProject });
  }

  //Load Sectors
  async fetchSectors(page) {
    console.log("aaabbb");
    this.setState({ isLoading: true });
    await fetch(
      "https://risk-module-api.herokuapp.com/api/v1/sectors?page=" + page,
      {
        headers: new Headers({
          /*'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers':'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',*/
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          sectors: data["hydra:member"],
        });
      });
  }

  //FORM VALIDATION
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["matrixName"]) {
      formIsValid = false;
      errors["matrixName"] = "Matrix name cannot be empty";
    }

    if (!fields["matrixSector"]) {
      formIsValid = false;
      errors["matrixSector"] = "Select one option";
    }

    if (!fields["matrixType"]) {
      formIsValid = false;
      errors["matrixType"] = "Select one option";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  submitForm(e) {
    console.log("submitgroup");
    if (this.handleValidation()) {
      this.editMatrix(this.props.match.params.id);
      let idxProject = this.state.matrix.project.substring(
        this.state.matrix.project.lastIndexOf("/") + 1,
        this.state.matrix.project.length
      );
      this.props.history.push(`/projects/${idxProject}/matrixs`);
    } else {
      e.preventDefault();
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  //Load matrix
  async loadmatrix(id) {
    console.log("loadmatrix");
    this.setState({ isLoading: true });
    await fetch(`https://risk-module-api.herokuapp.com/api/v1/matrices/${id}`, {
      headers: new Headers({
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          matrix: data,
          sector: data["sector"],
          project: data["project"],
        });
      });
    console.log(this.state.matrix);
  }

  //editMatrix
  editMatrix(id) {
    console.log("editMatrix");
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        Accept: "application/ld+json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      },
      body: JSON.stringify({
        name: this.state.fields["matrixName"],
        description: this.state.fields["matrixDescription"],
        project: "/api/v1/projects/" + this.state.idxProject,
        frequency: this.state.fields["matrixSector"],
        intensity: this.state.fields["matrixType"],
      }),
    };

    console.log(requestOptions);

    fetch(
      `https://risk-module-api.herokuapp.com/api/v1/matrixs/${id}`,
      requestOptions
    )
      .then((response) => {
        const data = response.json();
      })
      .catch((error) => {
        console.error("Error!");
      });
  }

  //loadColumns
  loadColumns(id) {
    console.log("loadColumns");
    this.setState({ isLoading: true });
    fetch(
      `https://risk-module-api.herokuapp.com/api/v1/matrices/${id}/columns`,
      {
        headers: new Headers({
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("loadColumns2");
        this.setState({
          columns: data["hydra:member"],
        });
      });
  }

  //deleteColumn
  deleteColumn(id) {
    fetch("https://risk-module-api.herokuapp.com/api/v1/columns/" + id, {
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      },
      method: "DELETE",
    });

    // actualiza
    const data = this.state.columns.filter((column) => column.id !== id);
    console.log(this.state.columns);
    this.setState({ columns: data });
    console.log(data);
  }

  //loadColumns
  loadLevel(id) {
    console.log("loadLevel");
    this.setState({ isLoading: true });
    fetch(
      `https://risk-module-api.herokuapp.com/api/v1/matrices/${id}/levels`,
      {
        headers: new Headers({
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("loadLevel2");
        this.setState({
          levelR: data["hydra:member"],
        });
      });
  }

  //deleteLR
  deleteLR(id) {
    fetch("https://risk-module-api.herokuapp.com/api/v1/level/" + id, {
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
      },
      method: "DELETE",
    });

    // actualiza
    const data = this.state.levelR.filter((lR) => lR.id !== id);
    console.log(this.state.levelR);
    this.setState({ levelR: data });
    console.log(data);
  }

  //deleteLV
  deleteLV(id) {
    // fetch("https://risk-module-api.herokuapp.com/api/v1/columns/" + id, {
    //   headers: {
    //     Authorization:
    //       "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs",
    //   },
    //   method: "DELETE",
    // });

    // actualiza
    const data = this.state.levelV.filter((lV) => lV.id !== id);
    console.log(this.state.levelV);
    this.setState({ levelV: data });
    console.log(data);
  }

  formatDate(date) {
    console.log(date);
    // console.log(new Date().toISOString().split('T')[0]);
    return date !== undefined ? date.split("T")[0] : "";

    //return new Date().toISOString().split('T')[0]
  }

  render() {
    const that = this;
    return (
      <>
        <HeaderPrivate auth={that.props.auth} />
        <div class="h-screen">
          <div className={styles.menuRezilio}>
            <div class="d-flex flex-col justify-center items-center mx-4 mt-3 ">
              <SideBar
                auth={that.props.auth}
                idPage={this.state.indexProject}
              />
              <div className={styles.fixMenu}>
                <div className={styles.createproject}>
                  <div class="container-lg pt-4">
                    <form onSubmit={this.submitForm.bind(this)}>
                      <div class="d-flex justify-content-between">
                        <h4 class="mb-4" className={styles.titleheader}>
                          matrix Edit #1 - matrix Settings
                        </h4>
                        <Link
                          to={buildUrl("LIST_RISK", this.state.indexProject)}
                        >
                          <button class="btn btn-light ml-4 px-4" type="submit">
                            Cancel
                          </button>
                        </Link>
                      </div>
                      {/* MATRIX NAME */}
                      <div class="mb-4 mt-3">
                        <label for="matrixName" class="form-label">
                          matrix Name +{this.state.matrix["last3"]}
                        </label>
                        <div class="">
                          <input
                            type="text"
                            class="col-6"
                            id="matrixName"
                            onChange={this.handleChange.bind(
                              this,
                              "matrixName"
                            )}
                            defaultValue={this.state.matrix["name"]}
                          />
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["matrixName"]}
                          </span>
                        </div>
                      </div>
                      {/* SECTOR */}
                      <div class="mb-3">
                        <label class="form-label">Sector</label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="matrixSector"
                            onChange={this.handleChange.bind(
                              this,
                              "matrixSector"
                            )}
                            value={this.state.fields["matrixSector"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            {this.state.sectors.map((item, index) => {
                              if (this.state.sector.name === item.name)
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
                            {this.state.errors["matrixSector"]}
                          </span>
                        </div>
                      </div>

                      {/* TYPE OF BUILDING */}
                      <div class="mb-3">
                        <label class="form-label">
                          Type of building / infrastructure
                        </label>
                        <div>
                          <select
                            className={styles.selectform}
                            id="matrixType"
                            onChange={this.handleChange.bind(
                              this,
                              "matrixType"
                            )}
                            value={this.state.fields["matrixType"]}
                          >
                            <option value="" hidden>
                              Select one
                            </option>
                            <option value="type1">Type 1</option>
                            <option value="type2">Type 2</option>
                            <option value="type3">Type 3</option>
                            {/* {this.state.rangeTimes.map((item, index)=>{
                            return <option value={item.id}>{item.name}</option>
                        })}                         */}
                          </select>
                        </div>
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["matrixType"]}
                          </span>
                        </div>
                      </div>
                      {/* COLUMNS SECTION */}
                      <div>
                        <div class=" mt-3">
                          <div class="d-flex justify-content-md-between">
                            <label class="form-label">Columns</label>
                            <Link
                              to={{
                                pathname: buildUrl(
                                  "CREATE_COLUMN",
                                  this.props.match.params.id
                                ),
                              }}
                            >
                              <button type="button" class="btn btn-primary">
                                Add new column
                              </button>
                            </Link>
                          </div>
                          {this.state.columns.length > 0
                            ? this.state.columns.map((col) => {
                                return (
                                  <table class="table table-hover">
                                    <thead>
                                      <tr>
                                        <th class="col ">Name</th>
                                        <th class="col ">R / V</th>
                                        <th class="col ">
                                          Evaluation criteria
                                        </th>
                                        <th class="col ">Variable weight</th>
                                        <th class="col ">Step</th>
                                        <th class="col ">Min</th>
                                        <th class="col ">Max</th>
                                        <th class="col ">EDIT</th>
                                        <th class="col ">DELETE</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td scope="row">{col.name}</td>
                                        <td>{col.type}</td>
                                        <td>Evaluation</td>
                                        <td>{col.weight}</td>
                                        <td>{col.step}</td>
                                        <td>{col.min}</td>
                                        <td>{col.max}</td>
                                        <td>
                                          <button class="btn btn-warning px-4 ">
                                            EDIT
                                          </button>
                                        </td>
                                        <td>
                                          <button
                                            class="btn btn-danger px-4 "
                                            onClick={() =>
                                              this.deleteColumn(col.id)
                                            }
                                          >
                                            DELETE
                                          </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                );
                              })
                            : "No hay Columns"}
                        </div>
                      </div>

                      {/* END COLUMNS SECTION */}
                      {/* LEVEL RISK SECTION */}
                      <div class="mb-3 mt-5 col-6 d-flex justify-content-between">
                        <label class="form-label">
                          Level of risk calculation
                        </label>
                        <Link
                          to={{
                            pathname: buildUrl(
                              "CREATE_LEVEL",
                              this.props.match.params.id
                            ),
                          }}
                        >
                          <button type="button" class="btn btn-primary">
                            Add new level
                          </button>
                        </Link>
                      </div>
                      {this.state.levelR.length > 0 ? (
                        <div class="col-10">
                          <div class="d-flex justify-content-between text-center">
                            <div class="col border">Name</div>
                            <div class="col border">Between</div>
                            <div class="col border">And</div>
                            <div class="col border">Color</div>
                            <div class="col border">EDIT</div>
                            <div class="col border">DELETE</div>
                          </div>
                        </div>
                      ) : null}

                      <div class="col-10">
                        {this.state.levelR.length > 0
                          ? this.state.levelR.map((lR) => {
                              return (
                                <div class="d-flex justify-content-between text-center">
                                  <div class="col border">{lR.name}</div>
                                  <div class="col border">{lR.lower}</div>
                                  <div class="col border">{lR.upper}</div>
                                  <div class="col border">{lR.color}</div>
                                  <div class="col border">
                                    <button class="btn btn-alert px-4 ">
                                      EDIT
                                    </button>
                                  </div>
                                  <div class="col border">
                                    <button
                                      class="btn btn-danger px-4 "
                                      onClick={() => this.deleteLR(lR.id)}
                                    >
                                      DELETE
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          : "No hay Level Risk"}
                      </div>

                      {/* END LEVEL RISK SECTION */}
                      {/* LEVEL VULNERABILITY SECTION */}
                      {/* <div class="mb-3 mt-5 col-6 d-flex justify-content-between">
                        <label class="form-label">
                          Level of vulnerability calculation
                        </label>
                        <Link
                          to={{
                            pathname: buildUrl(
                              "CREATE_LEVEL",
                              this.props.match.params.id
                            ),
                          }}
                        >
                          <button type="button" class="btn btn-primary">
                            Add new level
                          </button>
                        </Link>
                      </div>
                      {this.state.levelV.length > 0 ? (
                        <div class="col-10">
                          <div class="d-flex justify-content-between text-center">
                            <div class="col border">Name</div>
                            <div class="col border">Between</div>
                            <div class="col border">And</div>
                            <div class="col border">Color</div>
                            <div class="col border">EDIT</div>
                            <div class="col border">DELETE</div>
                          </div>
                        </div>
                      ) : null}

                      <div class="col-10">
                        {this.state.levelV.length > 0
                          ? this.state.levelV.map((lV) => {
                              return (
                                <div class="d-flex justify-content-between text-center">
                                  <div class="col border">{lV.name}</div>
                                  <div class="col border">{lV.lower}</div>
                                  <div class="col border">{lV.upper}</div>
                                  <div class="col border">{lV.color}</div>
                                  <div class="col border">
                                    <button class="btn btn-alert px-4 ">
                                      EDIT
                                    </button>
                                  </div>
                                  <div class="col border">
                                    <button
                                      class="btn btn-danger px-4 "
                                      onClick={() => this.deleteLV(lV.id)}
                                    >
                                      DELETE
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          : "No hay Level Vulnerability"}
                      </div> */}

                      {/* END LEVEL VULNERABILITY SECTION */}
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
              </div>
            </div>
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

export default connect(mapStateToProps)(withRouter(EditRisk));
