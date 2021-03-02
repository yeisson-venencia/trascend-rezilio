import React from "react";
import _ from "lodash";
import { default as Modal } from "./ShortcutModal/ShortcutModal";
import Shortcut from "./Shortcut/Shortcut";
import { PlanSection as PlanSectionModel } from "../../../../models/PlanSection";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { buildUrl, endpoint } from "../../../../utils/UrlService";
import Settings from "../../../../utils/SettingsService";
import OnDropService from "./OnDrop";
import ApiService from "../../../../utils/ApiService";
import "./Toolbar.scss";

const Api = new ApiService();
const emptyShortcut = new OnDropService().emptyShortcut;
const nbShortcuts = window.appConfig.nbShortcuts;
const emptyShortcuts = [...Array(nbShortcuts).fill(emptyShortcut)];

const fillArray = (oldArray, newArray) => {
  if (newArray === null) {
    return oldArray;
  } else if (newArray.length > oldArray.length) {
    return oldArray;
  }

  for (let i = 0; i < oldArray.length; i++) {
    if (newArray[i]) {
      oldArray[i] = newArray[i];
    }
  }
  return oldArray;
};

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.plan, // plan (from HOC)
      shortcuts: emptyShortcuts, // array containing the shortcut items
      draggedItem: props.draggedItem, // draggedItem props from parent component
      draggedOver: null, // detect if drag over event (to control style),
      draggedShortcut: null, // shortcut (obj) being dragged from toolbar,
      draggedShortcutId: null, // shortcut (index) being dragged from toolbar,
      active: null, // shortcut (index) is / isn't dropped / active,
      editMode: null, // shortcut (index) that is in edit mode,
      shortcutRename: null, // shortcut (index) that is is in rename mode,
      shortcutDelete: null, // shortcut (index) that is in delete mode,
    };

    this.planId = this.state.model.id;
  }

  componentDidMount = () => {
    this.getShortcuts().then((data) => {
      if (data !== undefined) {
        // data has id, custom title, url from settings persisted object
        // need to get full objects now
        this.fetchShortcuts(data);
      } else {
        // no shortcuts from settings api, use defaults
        let shortcuts = this.fillEmptyShortcuts(this.getDefaultShortcuts());
        this.setState({ shortcuts: shortcuts });
        this.setShortcuts(shortcuts); // save defaults as my shortcuts within settingsApi
      }
    });

    // communicate to parent how many shortcuts are filled in
    if (this.props.onChange) {
      this.props.onChange(this.state.shortcuts);
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.draggedItem !== this.props.draggedItem) {
      this.setState({ draggedItem: this.props.draggedItem });
    }

    // communicate to parent how many shortcuts are filled in
    if (this.props.onChange && prevState.shortcuts !== this.state.shortcuts) {
      this.props.onChange(this.state.shortcuts);
    }
  };

  fillEmptyShortcuts = (data) => {
    let shortcuts = [...this.state.shortcuts];

    let newShortcuts = fillArray(shortcuts, data);
    return newShortcuts;
  };

  fetchShortcuts = (data) => {
    // this endpoint returns info about all objects
    let urls = data.reduce(function (res, item) {
      if (item.url) {
        res.push(item.url);
      }
      return res;
    }, []);

    if (urls.length > 0) {
      let persist = {
        url: urls,
      };

      Api.initAuth(this.props.history);
      Api.post(endpoint("planObjectInfo"), persist).then((res) => {
        if (res !== undefined && res.length === urls.length) {
          // set as models
          let items = [];

          for (let i = 0; i < nbShortcuts; i++) {
            if (!_.isEmpty(data[i])) {
              // find details by id
              try {
                // items with a shortcut
                let obj = res.find((item) => {
                  if (item !== null) {
                    return item.id === data[i].id;
                  }
                  return false;
                });

                if (obj !== undefined) {
                  let model = PlanSectionModel(obj, false);

                  // add custom title if any
                  if (data[i].customTitle !== undefined) {
                    model.customTitle = data[i].customTitle;
                  }

                  // replace permalink
                  // for text pages (end of a sub-section) the textUrl is not sent, use what we have in data
                  if (data[i].permalink === undefined) {
                    model.permalink = data[i].url;
                  }

                  items.push(model);
                } else {
                  // broken link, no details back
                  items.push({
                    title: this.props.intl.formatMessage({
                      id: "plan.toolbar.shortcut.broken.link",
                    }),
                  });
                }
              } catch (err) {
                // broken link, catches if something happen above
                items.push({
                  title: this.props.intl.formatMessage({
                    id: "plan.toolbar.shortcut.broken.link",
                  }),
                });
              }
            } else {
              // empty slots for shortcuts
              items.push({});
            }
          }

          // fill to number of slots and save to state
          this.setState({ shortcuts: this.fillEmptyShortcuts(items) });
        } else {
          this.props.history.replace(buildUrl("ERROR") + "#api");
        }
      });
    }
  };

  getDefaultShortcuts = () => {
    // returns full objects with title, icon, color, ...
    if (this.state.model.shortcuts) {
      return PlanSectionModel(this.state.model.shortcuts);
    } else {
      this.props.history.replace(buildUrl("ERROR") + "#api");
    }
    return null;
  };

  getShortcuts = () => {
    // get shortcuts object from settings api
    // possible cases:
    // 1. undefined (key doesn't exist, no shortcuts yet => show default)
    // 2. [...] array with items (show these shortcuts)
    // 3. [] empty array (show no shortcuts, user can remove all)
    const planId = this.state.model.id;
    return Settings.get(this.props.history, `shortcuts_${planId}`).then(
      (response) => {
        return response;
      }
    );
  };

  setShortcuts = (shortcuts) => {
    // saves only certain attributes for every shortcut
    let formatted = shortcuts.map((shortcut) => {
      return Settings.formatSettingsObj(shortcut);
    });

    Settings.set(this.props.history, `shortcuts_${this.planId}`, formatted);
  };

  handleDragOver = (e, key) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (
      this.state.draggedShortcutId === null &&
      this.state.draggedItem === null
    ) {
      e.dataTransfer.dropEffect = "none";
      this.props.onShortcutDragOver(true);
    }

    if (this.state.draggedOver !== key) {
      this.setState({ draggedOver: key });
    }
  };

  handleShortcutDragStart = (e, key, item) => {
    this.setState({
      draggedShortcutId: key,
      draggedShortcut: item,
    });

    this.props.onShortcutDragStart(false);
  };

  handleShortcutDragEnd = (e) => {
    if (e.dataTransfer.dropEffect === "none") {
      this.props.onShortcutDragEnd(true);
      this.setState({
        draggedShortcutId: null,
      });
    }
  };

  handleDropItem = (e, key) => {
    e.preventDefault();

    const { draggedItem, draggedShortcut, draggedShortcutId } = this.state;

    if (draggedShortcutId === key) {
      this.props.onDropItem(true);
    }

    const oldShortcuts = [...this.state.shortcuts];
    const OnDrop = new OnDropService(key, oldShortcuts);
    let newShortcuts = [];

    if (draggedShortcutId !== null) {
      newShortcuts = OnDrop.reorderShortcut(draggedShortcutId, draggedShortcut);
    } else {
      newShortcuts = OnDrop.fillShortcut(draggedItem);
    }

    if (JSON.stringify(this.state.shortcuts) !== JSON.stringify(newShortcuts)) {
      this.setState({
        draggedOver: null,
        active: key,
        shortcuts: newShortcuts,
        draggedShortcutId: null,
      });
    }

    this.setShortcuts(newShortcuts);
  };

  handleShortcutClick = (e, planId, permalink) => {
    if (permalink) {
      this.props.history.push(
        buildUrl("PLAN_LINK", [planId, encodeURIComponent(permalink)])
      );
      this.props.history.go();
    }
  };

  displayShortcutMenu = (e, key) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ editMode: key });
  };

  handleShortcutEdit = (e, action, key) => {
    e.stopPropagation();

    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);

    this.setState({ [`shortcut${capitalizedAction}`]: key, editMode: null });
  };

  handleShortcutOutside = () => {
    this.setState({ editMode: null });
  };

  hideShortcutEdit = () => {
    this.setState({
      shortcutRename: null,
      shortcutDelete: null,
    });
  };

  handleSubmit = (action, value, key) => {
    let shortcuts = [...this.state.shortcuts];
    if (action === "rename") {
      shortcuts[key].title = value;
      shortcuts[key].customTitle = value;

      this.setShortcuts(shortcuts);
      this.setState({ shortcuts: shortcuts, shortcutRename: null });
    }

    if (action === "delete") {
      shortcuts[key] = emptyShortcut;
      const OnDrop = new OnDropService(key, shortcuts);

      let newShortcuts = OnDrop.stackShortcuts();

      this.setShortcuts(newShortcuts);
      this.setState({ shortcuts: newShortcuts, shortcutDelete: null });
    }
  };

  render = () => {
    const {
      model,
      shortcuts,
      draggedOver,
      draggedItem,
      editMode,
      shortcutRename,
      shortcutDelete,
    } = this.state;

    const link = new URLSearchParams(this.props.history.location.search).get(
      "link"
    );

    return (
      <div className="plan-toolbar">
        <Link to={buildUrl("PLAN", model.id)} className="home-button">
          <FormattedMessage id="plan.toolbar.button" />
        </Link>

        <div className="shortcuts">
          {shortcuts &&
            shortcuts.map((item, key) => (
              <React.Fragment key={key}>
                <Shortcut
                  item={item}
                  onDragStart={(e) =>
                    this.handleShortcutDragStart(e, key, item)
                  }
                  onDragEnd={this.handleShortcutDragEnd}
                  onDropItem={(e) => this.handleDropItem(e, key)}
                  onDragOver={(e) => this.handleDragOver(e, key)}
                  draggedOver={draggedOver === key && !this.props.isDropAborted}
                  onClick={(e) =>
                    this.handleShortcutClick(e, model.id, item.permalink)
                  }
                  draggedItem={draggedItem}
                  active={!_.isEmpty(item)}
                  clicked={item.permalink === link}
                  onDotsClick={(e) => this.displayShortcutMenu(e, key)}
                  editMode={editMode === key}
                  onShortcutEdit={(e, action) =>
                    this.handleShortcutEdit(e, action, key)
                  }
                  onShortcutClickOutside={this.handleShortcutOutside}
                  isLinkBroken={
                    item.title ===
                    this.props.intl.formatMessage({
                      id: "plan.toolbar.shortcut.broken.link",
                    })
                  }
                  blurContextMenu={(boolean) => {
                    boolean &&
                      this.setState({
                        editMode: null,
                      });
                  }}
                />
                {shortcutRename === key || shortcutDelete === key ? (
                  <Modal
                    hide={this.hideShortcutEdit}
                    action={
                      (shortcutRename === key && "rename") ||
                      (shortcutDelete === key && "delete")
                    }
                    defaultValue={
                      item.customTitle ? item.customTitle : item.title
                    }
                    onSubmit={(action, value) =>
                      this.handleSubmit(action, value, key)
                    }
                  />
                ) : null}
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  };
}

export default withRouter(injectIntl(Toolbar));
