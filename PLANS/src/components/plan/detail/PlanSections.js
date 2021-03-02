import React from "react";
import { buildUrl, getUrl } from "../../../utils/UrlService";
import classnames from "classnames";
import _ from "lodash";
import { injectIntl } from "react-intl";
import { PlanSection as PlanSectionModel } from "../../../models/PlanSection";
import { PlanSectionExtended as PlanSectionExtendedModel } from "../../../models/PlanSectionExtended";
import { withPlanLayout } from "../PlanLayout";
import HeaderMobile from "./HeaderMobile";
import Toolbar from "./Toolbar/Toolbar.js";
import Breadcrumb from "./Breadcrumb";
import Section from "./Section";
import ApiService from "../../../utils/ApiService";
const Api = new ApiService();

/*
Plan detail component (sections) shown inside the PlanLayout
- since is complex there are several components loaded on lower level
- some actions / events / features goes from low level components to here or even to top level (Plan Layout)

@focus functionality
within this page multiple sections are shown from left to right
as a user you can see full tree back to root section (Plan) when you keep clicking on left edge
there are up to two sections visible, others are hidden (on mobile TBD, TODO later on)

@link functionality
every time you click on a section or sub-section we keep the link for future use
you can make a shortcut or bookmark any section  
when component is loaded from a link full tree is not loaded, instead we show
- last section + sub-sections (one box, no text, no parents)
- last section + sub-sections + description (when section has text)
*/

class PlanSections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.model, // plan model from PlanLayout HOC
      sections: [], // objects to display in main section (floats from left to right)
      focus: 0, // the section which is currently visible, see @focus above,
      shortcuts: [], // array of  shortcuts
      infoComponent: null, // show info
      draggedItem: null, // shortcut currently dragged to shortcuts,
      draggableItem: null, // menu item that is draggable,
      isMenuDraggable: false, // to check if shortcut space is full,
      isDropAborted: false, // to reinitialize dragover styling
    };
  }

  componentDidMount = () => {
    let link = this.getLinkParam();
    if (link !== null) {
      // set a sub-section
      this.fetchPermalinkSection(link);
    } else {
      //set plan main section
      this.setMainSection();
    }
  };

  getLinkParam = () => {
    let params = new URLSearchParams(this.props.location.search);

    if (params.get("link") !== null && params.get("link") !== undefined) {
      // set a sub-section
      return params.get("link");
    }
    return null;
  };

  // set only root section, all comes from state.model
  setMainSection = () => {
    const { intl } = this.props;
    let plan = this.state.model;

    this.setState({
      sections: [
        PlanSectionExtendedModel(plan, "menu", {
          title: intl.formatMessage({ id: "plan.section.main" }),
          sectionUrl: [plan.url],
          icon: "fas-list-ul",
          color: "",
          isRootSection: true,
        }),
      ],
      focus: 0,
      infoComponent: null,
    });
  };

  setSections = (item, type = ["menu", "text"]) => {
    let sections = [];

    // based on type we can add only menu/text or both
    if (item.sectionUrl !== undefined && item.textUrl !== undefined) {
      // new section has both sub-sections and text, add both of them
      if (type.includes("menu")) {
        sections.push(PlanSectionExtendedModel(item, "menu"));
      }
      if (type.includes("text")) {
        sections.push(PlanSectionExtendedModel(item, "text"));
      }
    } else if (item.sectionUrl !== undefined) {
      // new section has sub-sections, add once
      if (type.includes("menu")) {
        sections.push(PlanSectionExtendedModel(item, "menu"));
      }
    } else if (item.textUrl !== undefined) {
      // new section has text, add once
      if (type.includes("text")) {
        sections.push(PlanSectionExtendedModel(item, "text"));
      }
    }

    return sections;
  };

  setParentSection = (item, sectionId) => {
    let sections = [];

    if (item.sectionUrl !== undefined) {
      // add only menu (parent) no parent text
      sections.push(
        PlanSectionExtendedModel(item, "menu", {
          callbackId: sectionId,
        })
      );

      // parent may have items where one of these items is the sub-section we are focus
      // add return function to be able to add section in between if subsection menu is found
    }

    return sections;
  };

  // allows to add parent section from the section object
  // Example: we have a text page which has sub-items at the same time
  // API wise we need to get parent section for text page, get parent childs and look for same id between childs
  setParentSectionCallback = (item) => {
    let sections = this.state.sections;

    if (item.sectionUrl !== undefined) {
      // add only menu (parent) no parent text on given position (right before text)
      sections.splice(
        sections.length - 1,
        0,
        PlanSectionExtendedModel(item, "menu")
      );

      // save right away (will perform render function)
      this.setState({
        sections: sections,
        focus: sections.length - 1,
      });
    }
  };

  // when starting with a link (url), not full tree is loaded
  fetchPermalinkSection = (url) => {
    const that = this;

    if (url !== undefined) {
      let fullUrl = window.appConfig.api.url + url + "&trxId={trxId}";

      Api.initAuth(that.props.history);
      Api.get(fullUrl).then((res) => {
        if (res["hydra:member"] !== undefined) {
          // has sub-sections (childs) and no text (getting collection via API)
          let items = PlanSectionModel(res["hydra:member"]);

          // takes parentUrl from first child (we need to get parent object)
          let parentUrl = items[0].parentUrl;

          // get the parent section
          Api.initAuth(that.props.history);
          Api.get(window.appConfig.api.url + parentUrl + "&trxId={trxId}").then(
            (res) => {
              if (res) {
                let item = PlanSectionModel(res, false); // return object

                // overrides the sections
                that.setState({
                  sections: that.setParentSection(item),
                });
              } else {
                that.props.history.replace(buildUrl("ERROR") + "#api");
              }
            }
          );
        } else {
          // getting section with text (one object only)

          // add curent url to res
          res.permalink = url;

          let item = PlanSectionModel(res, false); // return object

          // current section object
          let section = PlanSectionExtendedModel(item, "text", {
            textUrl: fullUrl,
            permalink: url,
            description: item.description,
          });

          // get the parent section
          Api.initAuth(that.props.history);
          Api.get(
            window.appConfig.api.url + item.parentUrl + "&trxId={trxId}"
          ).then((res) => {
            if (res) {
              let item = PlanSectionModel(res, false), // return as object
                sections = that.setParentSection(item, section.id); // set parent section/s

              // current section as last
              sections.push(section);

              // override the sections
              that.setState({
                sections: sections,
              });
            } else {
              that.props.history.replace(buildUrl("ERROR") + "#api");
            }
          });
        }
      });
    }
  };

  // when you go back one level using section edge on left side
  onSectionClick = () => {
    let focus = this.state.focus - 1;

    if (focus < 0) {
      focus = 0;
    }

    this.setState({
      focus: focus,
    });

    window.scrollTo(0, 0);
  };

  // event from a section/menu component, set the new section and render
  onItemClick = (item, level, type = ["menu", "text"]) => {
    const that = this;

    // fallback for items with no link (e.g. dictionary now)
    if (item.permalink === undefined) {
      let sections = that.state.sections.slice(0, level + 1); // +1 because of focus starts from 0

      that.setState({
        sections: sections,
        focus: level,
        infoComponent: null,
      });

      window.scrollTo(0, 0);
    }

    // only change when navigating to different sections
    if (item.permalink !== that.getLinkParam()) {
      let sections = that.state.sections.slice(0, level + 1), // +1 because of focus starts from 0
        newSections = this.setSections(item, type); // there could be text page on last element

      sections = sections.concat(newSections);

      level = level + newSections.length;

      that.setState({
        sections: sections,
        focus: level,
        infoComponent: null,
      });

      window.scrollTo(0, 0);
    }
  };

  // on mobile the feature works different way and we remove sections at the same time
  // when you reach root level you go to listing
  onBackClick = () => {
    const that = this;

    let focus = that.state.focus,
      sections = that.state.sections;

    if (focus > 0) {
      that.setState({
        focus: focus - 1,
        sections: sections.slice(0, -1),
        infoComponent: null,
      });

      window.scrollTo(0, 0);
    } else {
      // go to plan collection
      that.props.history.push(getUrl("PLANS"));
    }
  };

  // this function handles click on breadcrumb items
  onBreadcrumbClick = (breadcrumb) => {
    let sections = this.state.sections;

    let index = sections.findIndex(function (item) {
      return item.id === breadcrumb.id;
    });

    if (index >= 0) {
      sections = sections.slice(0, index + 1);

      let focus = sections.length;

      // logic to show two menus or menu + text
      if (sections[sections.length - 1].type.includes("menu")) {
        focus = focus - 1;
      }

      this.setState({
        sections: sections,
        focus: focus,
        infoComponent: null,
      });
    }
  };

  // display component above the last section (description)
  showInfo = (component) => {
    this.setState({
      infoComponent: component,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    // add link to specific section when sections change
    if (this.state.sections !== prevState.sections) {
      let section = this.state.sections[this.state.sections.length - 1];

      if (section.isRootSection) {
        // set main url instead of root menu
        // Note does render / reload with first section
        this.props.history.push(buildUrl("PLAN", this.state.model.id));
      } else {
        // set url with link
        this.props.history.push(
          buildUrl("PLAN_LINK", [
            this.state.model.id,
            encodeURIComponent(section.permalink),
          ])
        );
      }
    }

    // detect link to "home" section
    if (
      this.props.location.search === "" &&
      this.props.location.search !== prevProps.location.search
    ) {
      this.setMainSection();
    }
  }

  handleDotsMouseDown = (e, id) => {
    this.setState({ draggableItem: id });
  };

  handleDotsMouseUp = (e, id) => {
    this.setState({ draggableItem: null });
  };

  handleDragStart = (item) => {
    const that = this;

    that.setState({
      isDropAborted: false,
      draggedItem: item,
      draggableItem: null, // reset in case drag is aborted
    });
  };

  handleDragEnd = (dropEffect) => {
    if (dropEffect === "none") {
      this.setState({ isDropAborted: true });
    }
  };

  handleShortcutDragStart = (boolean) => {
    this.setState({ isDropAborted: boolean });
  };

  handleShortcutDragEnd = (boolean) => {
    this.setState({ isDropAborted: boolean });
  };

  handleShortcutDragOver = (boolean) => {
    this.setState({ isDropAborted: boolean });
  };

  handleDropItem = (boolean) => {
    this.setState({ isDropAborted: boolean });
  };

  handleShortcutChange = (shortcuts) => {
    if (shortcuts !== undefined) {
      const emptyShortcuts = shortcuts.filter((shortcut) => _.isEmpty(shortcut))
        .length;
      if (emptyShortcuts > 0) {
        this.setState({ isMenuDraggable: true });
      } else {
        this.setState({ isMenuDraggable: false, draggableItem: null });
      }
    }
  };

  render = () => {
    const that = this;

    if (that.state.model !== null) {
      let objects = that.state.sections.map((item, i) => {
        let classes = [];

        // set classsnames to define what sections should be hidden
        // order: hide, ..., close, show, show
        if (i >= that.state.focus) {
          classes.push("show show-mobile");
        }
        if (i === that.state.focus - 1) {
          classes.push("show hide-mobile");
        }
        if (i === that.state.focus - 2) {
          classes.push("close hide-mobile");
        }
        if (i <= that.state.focus - 3) {
          classes.push("hide hide-mobile");
        }

        return (
          <div className={classnames(classes)} key={item.uuid}>
            <Section
              level={i}
              model={item}
              plan={that.state.model}
              showInfo={that.showInfo}
              sectionCallback={that.setParentSectionCallback}
              onSectionClick={that.onSectionClick}
              onItemClick={that.onItemClick}
              onDotsMouseDown={that.handleDotsMouseDown}
              onDotsMouseUp={that.handleDotsMouseUp}
              onDragStart={that.handleDragStart}
              onDragEnd={that.handleDragEnd}
              draggableItem={that.state.draggableItem}
              isMenuDraggable={that.state.isMenuDraggable}
              editing={that.props.editing}
              multiLanguageEnabled={that.props.multiLanguageEnabled}
            />
          </div>
        );
      });

      return (
        <React.Fragment>
          <HeaderMobile
            plan={that.state.model}
            onBackClick={that.onBackClick}
          />

          <Toolbar
            plan={that.state.model}
            draggedItem={that.state.draggedItem}
            shortcutEditMode={that.state.shortcutEditMode}
            shortcutRenameMode={that.state.shortcutRenameMode}
            shortcutDeleteMode={that.state.shortcutDeleteMode}
            onShortcutRename={that.handleShortcutRename}
            onShortcutDelete={that.handleShortcutDelete}
            onChange={that.handleShortcutChange}
            onDotsMouseDown={that.handleDotsMouseDown}
            onDotsMouseUp={that.handleDotsMouseUp}
            draggableItem={that.state.draggableItem}
            isDropAborted={that.state.isDropAborted}
            onShortcutDragOver={that.handleShortcutDragOver}
            onShortcutDragStart={that.handleShortcutDragStart}
            onShortcutDragEnd={that.handleShortcutDragEnd}
            onDropItem={that.handleDropItem}
          />

          <div className="plan-sections">
            <div className="plan-scroll">
              <div className="plan-row">
                <Breadcrumb
                  sections={that.state.sections}
                  callback={that.onBreadcrumbClick}
                />
                {that.state.infoComponent !== null ? (
                  <div className="section-info">{that.state.infoComponent}</div>
                ) : null}
              </div>

              <div className="wrapper-sections">{objects}</div>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return null;
  };
}

export default withPlanLayout(injectIntl(PlanSections));
