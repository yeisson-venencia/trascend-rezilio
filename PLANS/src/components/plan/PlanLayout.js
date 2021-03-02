import React from "react";
import { endpoint } from "../../utils/UrlService";
import "./PlanLayout.scss";
import { Plan as PlanModel } from "../../models/Plan";
import ApiService from "../../utils/ApiService";
import Skeleton from "../common/Skeleton";
import Header from "./detail/Header";
import PlanEdit from "./editing/PlanEdit/PlanEdit";
const Api = new ApiService();

/*
Plan layout component (HOC)
- since is complex there are several components loaded on lower level
- this compoenent is made for other components that needs to show something for specific plan id (detail)
- simply use it as HOC and you will get state.model
*/

export function withPlanLayout(WrappedComponent) {
  class PlanLayout extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        model: null, // plan model,
        editModel: { title: null, description: null }, // plan edit model object
        showEdit: false,
      };
    }

    componentDidMount = () => {
      const that = this;

      // get plan detail model and show sections
      that.fetchData().then(function (model) {
        that.setState({
          model: model,
        });
      });
    };

    // GET plan details (id, title, ...)
    fetchData = () => {
      const that = this;

      return new Promise((resolve, reject) => {
        Api.initAuth(that.props.history);
        Api.get(endpoint("planDetail", that.props.match.params.id))
          .then((res) => {
            if (res) {
              let plan = PlanModel(res, false);
              resolve(plan);
            } else {
              reject(false);
            }
          })
          .catch(function (err) {
            reject(false);
          });
      });
    };

    handleEditing = (model, refresh) => {
      this.setState({
        editModel: model,
        showEdit: true,
        refresh: refresh,
      });
    };

    toggleEditing = (val) => {
      this.setState({
        showEdit: val,
      });

      // refresh the section
      this.state.refresh();
    };

    render = () => {
      const that = this;
      const { model, editModel, showEdit } = that.state;

      if (model !== null) {
        return (
          <div className="plan-layout">
            <Header plan={model} />
            <WrappedComponent
              {...this.props}
              {...this.state}
              editing={this.handleEditing}
              multiLanguageEnabled={this.state.model.multiLanguageEnabled}
            />
            {showEdit && (
              <PlanEdit
                model={editModel}
                planId={model.id}
                show={this.toggleEditing}
              />
            )}
          </div>
        );
      }

      return (
        <div className="plan-layout">
          <div className="container-fluid full plan-header">
            <div className="col-8 col-lg-8 title-wrapper text-left">
              <div className="title">
                <Skeleton width={200} margin={"15px 0 15px 45px"} />
              </div>
            </div>

            <div className="col-4 col-lg-4 search-wrapper">
              <div className="search">
                <Skeleton width={350} margin={"15px 0px 15px 0"} />
              </div>
            </div>
          </div>
        </div>
      );
    };
  }

  return PlanLayout;
}
