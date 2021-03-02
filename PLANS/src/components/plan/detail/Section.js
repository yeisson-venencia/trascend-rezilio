import React from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { buildUrl } from "../../../utils/UrlService";
import { PlanSection as PlanSectionModel } from "../../../models/PlanSection";
import Description from "./Description";
import Menu from "./Menu";
import MenuLoader from "./MenuLoader";
import ApiService from "../../../utils/ApiService";
import "./Menu.scss";

const Api = new ApiService();

class Section extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      model: props.model,
      plan: props.plan,
      level: props.level,
    };
  }

  componentDidMount = () => {
    /*
    three cases
     - text
     - sub-sections
     - sub-sections + text
    */
    this.fetchData(this.state.model);
  };

  fetchSection = (model) => {
    const that = this;

    // create queue with all api calls to do for given model
    let calls = [];

    if (model.sectionUrl !== undefined && model.type.includes("menu")) {
      model.sectionUrl.forEach((url) => {
        calls.push({
          type: "menu",
          url: url,
        });
      });
    }

    if (model.textUrl !== undefined && model.type.includes("text")) {
      calls.push({
        type: "text",
        url: model.textUrl,
      });
    }

    // do api calls
    let promisses = calls.map((obj) => {
      return new Promise((resolve, reject) => {
        Api.initAuth(that.props.history);
        Api.get(obj.url)
          .then((res) => {
            if (res) {
              // based on type we create model
              if (obj.type === "menu") {
                let items = PlanSectionModel(res["hydra:member"]);
                resolve({
                  type: "menu",
                  value: items,
                });
              }
              if (obj.type === "text") {
                let item = PlanSectionModel(res, false);
                resolve({
                  type: "text",
                  value: item,
                });
              }
            } else {
              that.props.history.replace(buildUrl("ERROR") + "#api");
              reject(false);
            }
          })
          .catch(function (err) {
            reject(false);
          });
      });
    });

    return promisses;
  };

  fetchData = (model) => {
    const that = this;

    // itterate over all sections and do API calls to get sub-sections or text
    Promise.all(that.fetchSection(model)).then((res) => {
      res.forEach((res_item) => {
        // if array of items add to the menu
        if (res_item.type === "menu") {
          model.items = _.compact(_.concat(model.items, res_item.value));
        }

        // if text add extra attributes (detail API call has more items than list item call but doesn't have all)
        if (res_item.type === "text") {
          model = _.merge(model, res_item.value);
        }
      });

      // look for sub-sections
      if (model.callbackId !== undefined) {
        let result = model.items.find(function (item) {
          return item.id === model.callbackId;
        });

        if (result !== undefined) {
          that.props.sectionCallback(result);
        }
      }

      that.setState({
        isLoaded: true,
        model: model,
      });
    });
  };

  clickSection = () => {
    this.props.onSectionClick();
  };

  clickItem = (item, level, type) => {
    this.props.onItemClick(item, level, type);
  };

  refreshSection = (item) => {
    this.setState({
      isLoaded: false,
    });
    this.props.showInfo(undefined);

    this.fetchData(this.state.model);
  };

  dotsMouseDown = (e, id) => {
    this.props.onDotsMouseDown(e, id);
  };

  dotsMouseUp = (e, id) => {
    this.props.onDotsMouseUp(e, id);
  };

  createMarkup = (model) => {
    return { __html: model.description };
  };

  render = () => {
    const that = this;

    if (that.state.isLoaded === true) {
      // decide what to return
      if (
        that.state.model.items &&
        that.state.model.items.length > 0 &&
        that.state.model.type.includes("menu")
      ) {
        return (
          <Menu
            level={that.state.level}
            model={that.state.model}
            plan={that.state.plan}
            items={that.state.model.items}
            refresh={that.refreshSection}
            onSectionClick={that.clickSection}
            onItemClick={that.clickItem}
            onDragStart={that.props.onDragStart}
            onDragEnd={that.props.onDragEnd}
            onDotsMouseDown={that.dotsMouseDown}
            onDotsMouseUp={that.dotsMouseUp}
            draggableItem={that.props.draggableItem}
            isMenuDraggable={that.props.isMenuDraggable}
          />
        );
      }

      if (that.state.model.type.includes("text")) {
        return (
          <Description
            plan={that.state.plan}
            model={that.state.model}
            showInfo={that.props.showInfo}
            editing={that.props.editing}
            refresh={that.refreshSection}
            multiLanguageEnabled={that.props.multiLanguageEnabled}
          />
        );
      }
    }
    return <MenuLoader type={that.state.model.type} />;
  };
}

export default withRouter(Section);
