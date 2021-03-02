import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import "./Menu.scss";
import Icon from "../../common/Icon";
import StackedDots from "../../common/StackedDots";
import { injectIntl } from "react-intl";
import ReactTooltip from "react-tooltip";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.model,
      plan: props.plan,
      level: props.level,
      items: props.items,
      active: true,
      draggableItem: props.draggableItem,
    };
  }

  componentDidMount = () => {
    // get link url if any and show as active
    let params = new URLSearchParams(this.props.location.search);

    if (params.get("link") !== null && params.get("link") !== undefined) {
      let items = this.state.items;

      items.forEach(function (it) {
        if (it.permalink === params.get("link")) {
          it.active = true;
        } else {
          it.active = false;
        }
      });

      this.setState({
        items: items,
        link: params.get("link"),
      });
    }
  };

  clickMenu = (e) => {
    e.stopPropagation();

    this.props.onSectionClick();
  };

  clickItem = (e, item, level, type) => {
    e.stopPropagation();
    // remove active state from all items
    let items = this.state.items;

    items.forEach(function (it) {
      if (it === item) {
        it.active = true;
      } else {
        it.active = false;
      }
    });

    this.setState({
      items: items,
      active: false,
    });

    this.props.onItemClick(item, level, type);
  };

  clickPrint = () => {
    window.open(this.props.profile.homeUrl + this.state.model.printUrl);
  };

  handleDragStart = (e, item) => {
    this.props.onDragStart(item);
  };

  handleDragEnd = (e, item) => {
    this.props.onDragEnd(e.dataTransfer.dropEffect);
  };

  render = () => {
    const that = this;

    if (that.state.items.length > 0) {
      return (
        <div className={classnames("plan-menu")}>
          <div className="menu-click-area" onClick={(e) => that.clickMenu(e)} />
          <div
            className={classnames("title", { active: that.state.active })}
            onClick={(e) =>
              that.clickItem(e, that.state.model, that.state.level, ["text"])
            }
          >
            <div className="icon">
              <Icon
                icon={that.state.model.icon}
                color={that.state.model.color}
              />
            </div>

            <div className="item">{that.state.model.title}</div>

            {that.state.model.printUrl !== undefined ? (
              <React.Fragment>
                <div
                  className="print"
                  onClick={(e) => that.clickPrint()}
                  data-tip={this.props.intl.formatMessage({
                    id: "plan.menu.print",
                  })}
                  data-for="print-tooltip"
                ></div>
                <ReactTooltip
                  className="dark"
                  id="print-tooltip"
                  effect="solid"
                />
              </React.Fragment>
            ) : null}
          </div>

          <div className="items">
            <ul>
              {that.state.items.map((item, key) => (
                <li
                  key={item.id}
                  className={classnames({ active: item.active })}
                  onClick={(e) => that.clickItem(e, item, that.state.level)}
                  draggable={
                    that.props.draggableItem === item.id &&
                    that.props.isMenuDraggable
                  }
                  onDragStart={(e) => that.handleDragStart(e, item)}
                  onDragEnd={(e) => that.handleDragEnd(e, item)}
                >
                  <StackedDots
                    disabled={!that.props.isMenuDraggable}
                    double={true}
                    mode="hover"
                    onDotsMouseDown={(e) =>
                      that.props.onDotsMouseDown(e, item.id)
                    }
                    onDotsMouseUp={(e) => that.props.onDotsMouseUp(e, item.id)}
                    dataTip={this.props.intl.formatMessage({
                      id: "plan.menu.shortcut.drag.error.message",
                    })}
                    data-for="shortcut-tooltip"
                  />
                  <ReactTooltip
                    className={classnames({
                      "menu-tooltip": true,
                      disabled: that.props.isMenuDraggable,
                    })}
                    data-for="shortcut-tooltip"
                    effect="solid"
                    offset={{ left: -55 }}
                    disable={that.props.isMenuDraggable}
                  />
                  <div className="icon">
                    <Icon icon={item.icon} color={item.color} />
                  </div>
                  <div className="item">{item.title}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    } else {
      return <div className="plan-menu"></div>;
    }
  };
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(withRouter(injectIntl(Menu)));
