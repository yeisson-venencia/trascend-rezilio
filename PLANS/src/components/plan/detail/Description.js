import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import ReactTooltip from "react-tooltip";
import cs from "classnames";
import DTS from "../../../utils/DateTimeService";
import { Version as VersionModel } from "../../../models/Version";
import Loader from "../../Loader";
import DescriptionLoader from "./DescriptionLoader";
import Version from "./Version";
import ModeBar from "../editing/ModeBar/ModeBar";
import { withAutoTranslate } from "../translate/AutoTranslate";
import Icon from "../../common/Icon";
import Skeleton from "../../common/Skeleton";
import StackedDots from "../../common/StackedDots";
import ModalSimple from "../../common/Modal/ModalSimple";
import ModalClose from "../../common/Modal/ModalClose";
import ActionButton from "../../common/ActionButton/ActionButton";
import ContextMenu from "../../common/ContextMenu/ContextMenu";
import ContextMenuExtended from "../../common/ContextMenu/ContextMenuExtended";
import EditorText from "../../editor/EditorText";
import { withRouter } from "react-router-dom";
import ApiService from "../../../utils/ApiService";
import { endpoint } from "../../../utils/UrlService";
import EditApiService from "../editing/PlanEdit/EditApiService/EditApiService";

import "./Description.scss";

class Description extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plan: props.plan,
      model: props.model,
      displayContextMenu: false,
      displayVersionMenu: false,
      versions: null,
      selectedVersion: undefined, // by default the current one
      show: "model", // "model" || "pending" || "version" || "translation",
      versionLoading: true, // until we have versions loaded
      objectLoading: false,
      objectPending: undefined,
      objectVersion: undefined,
      objectTranslation: undefined,
      isVersionCompared: false,
      allowTranslation: props.allowTranslation,
      autoTranslated: false,
      showTranslationWarning: false,
      showTranslationWarningModal: false,
      showTranslationEditModal: false,
      contentLanguage: undefined,
    };

    this.payload = {
      planId: this.state.plan.id,
      section: this.state.model.sectionType,
      sectionId: this.state.model.id,
    };
    this.Api = new ApiService();
    this.EditApi = new EditApiService(this.payload);
  }

  componentDidMount = () => {
    // notify the info section and show there a component
    switch (this.state.model.mode.type) {
      // existing draft for this user (can continue with editing)
      case "MODE_DRAFT":
        // case "draft":
        this.props.showInfo(
          <ModeBar mode={this.state.model.mode} action={this.openEdit} />
        );
        break;

      case "MODE_REJECTED":
        // case "rejected by approver":
        this.props.showInfo(
          <ModeBar mode={this.state.model.mode} action={this.openEdit} />
        );
        break;

      // currently edited by someone else (can't access edit)
      case "MODE_LOCKED":
        // case "locked":
        this.props.showInfo(<ModeBar mode={this.state.model.mode} />);
        break;

      // pending request (can't access edit, can see the new version of the text when request created by current user)
      case "MODE_PENDING":
        // case "pending":
        this.props.showInfo(
          <ModeBar
            mode={this.state.model.mode}
            action={this.togglePendingVersion}
          />
        );
        break;

      // available for edit (nothing shown)
      default:
      // "MODE_EDIT"
    }

    // set language only if subsection text is loaded
    if (this.props.model.language !== undefined) {
      this.setState(
        {
          contentLanguage: this.props.model.language.replace("_", " "),
        },
        () => {
          // notify AutoTranslate HOC
          const multiLanguageEnabled = this.props.multiLanguageEnabled;
          this.props.setContentLanguage(
            multiLanguageEnabled,
            this.state.contentLanguage
          );
        }
      );
    }

    // lazy-load available versions
    this.getVersions();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.allowTranslation !== prevProps.allowTranslation) {
      this.setState({
        allowTranslation: this.props.allowTranslation,
      });
    }

    if (this.props.model.id !== prevProps.model.id) {
      this.setState({
        model: this.props.model,
      });
    }
  };

  getVersions = () => {
    const that = this;

    this.EditApi.callApi(that.props.history, "post", "planContentHistory").then(
      (response) => {
        if (response) {
          if (response.history.length === 0) {
            // no history, show actual version only
            let versions = VersionModel([
              {
                firstName: that.props.model.user,
                lastName: "",
                microtime: that.props.model.update,
                revision: that.props.model.id,
              },
            ]);

            versions.forEach((version) => {
              if (version.update !== undefined) {
                version.update = DTS.moment(version.update).format(
                  that.props.intl.formatMessage({
                    id: DTS.format("plan.description.update.format"),
                  })
                );
              }
            });

            this.setState({
              versionLoading: false,
              versions: versions,
              selectedVersion: versions[0],
            });

            return;
          } else {
            // version model (array) is split into 2 groups: model[0]=current, model[1+]=history
            let versions = VersionModel(response.history);
            // datetime formatting for all versions
            versions.forEach((version) => {
              if (version.update !== undefined) {
                version.update = DTS.moment(version.update).format(
                  this.props.intl.formatMessage({
                    id: DTS.format("plan.description.update.format"),
                  })
                );
              }
            });

            this.setState({
              versionLoading: false,
              versions: versions,
              selectedVersion: versions[0],
            });
          }
        }
      }
    );
  };

  refresh = () => {
    this.props.refresh(this.state.model);
  };

  togglePendingVersion = (bool) => {
    if (this.state.objectPending === undefined) {
      this.setState({
        show: "pending",
        objectLoading: true,
      });

      this.EditApi.callApi(this.props.history, "post", "planContentRead").then(
        (response) => {
          if (response) {
            this.setState({
              objectLoading: false,
              objectPending: {
                title: response.title,
                content: response.content,
              },
            });
          }
        }
      );
    } else {
      // we already have pending text, just change what to show
      if (bool === true) {
        this.setState({
          show: "pending",
        });
      } else {
        this.setState({
          // we go to current version
          show: "model",
          selectedVersion: this.state.versions[0],
        });
      }
    }
  };

  openEdit = () => {
    const {
      selectedVersion,
      model,
      autoTranslated,
      showTranslationEditModal,
      objectTranslation,
    } = this.state;

    // if translated content, modify model object with translation
    const contentLanguageFull = this.state.contentLanguage
      ? this.props.intl.formatMessage({
          id:
            "locale." +
            this.state.contentLanguage.substring(0, 2) +
            "." +
            this.state.contentLanguage.substring(3, 5).toLowerCase() +
            ".full.translated",
        })
      : "";

    if (
      selectedVersion !== undefined &&
      selectedVersion.type === "history" &&
      model.mode.type !== undefined &&
      model.mode.type !== "MODE_DRAFT"
    ) {
      // if historical version, modify model object with selection version
      this.fetchContent(selectedVersion._revisionId).then((response) => {
        const historicalModel = {
          ...model,
          title: response.title,
          description: response.content,
          contentLanguageFull: contentLanguageFull,
        };
        this.props.editing(historicalModel, this.refresh);
      });
    } else if (autoTranslated && showTranslationEditModal === false) {
      this.setState({
        showTranslationEditModal: {
          header: this.props.intl.formatMessage({
            id: "plan.description.autotranslate.edit.modal.header",
          }),
        },
      });
    } else if (
      this.state.show === "translation" &&
      showTranslationEditModal !== false
    ) {
      const translationModel = {
        ...model,
        title: objectTranslation.title,
        description: objectTranslation.content,
        multiLanguageEnabled: this.props.multiLanguageEnabled,
        autoTranslated: this.state.autoTranslated,
        contentLanguage: this.state.contentLanguage,
        contentLanguageFull: contentLanguageFull,
      };

      this.setState({ showTranslationEditModal: false });

      this.props.editing(translationModel, this.refresh);
    } else {
      // default model
      this.props.editing(
        {
          ...model,
          multiLanguageEnabled: this.props.multiLanguageEnabled,
          contentLanguageFull: contentLanguageFull,
        },
        this.refresh
      );
    }
  };

  openContextMenu = () => {
    this.setState({
      displayContextMenu: true,
    });
  };

  handleContextMenuClick = (e, action, model) => {
    if (action === "edit") {
      this.openEdit();
      this.setState({ displayContextMenu: false });
    }
  };

  handleContextMenuClickOutside = () => {
    this.setState({ displayContextMenu: false });
  };

  openVersionMenu = () => {
    this.setState({
      displayVersionMenu: true,
    });
  };

  handleVersionMenuClick = (e, version) => {
    // on version click
    this.setState({
      objectLoading: true,
      displayVersionMenu: false,
      selectedVersion: version,
      isVersionCompared: false,
    });
    this.getVersionContent(version);
  };

  handleVersionMenuClickOutside = () => {
    this.setState({ displayVersionMenu: false });
  };

  getVersionContent = (version) => {
    return this.fetchContent(version._revisionId).then((response) => {
      if (response) {
        this.setState({
          show: "version",
          objectLoading: false,
          objectVersion: {
            title: response.title,
            content: response.content,
            id: version._revisionId,
          },
        });
      }
    });
  };

  fetchContent = (revisionId) => {
    return this.EditApi.callApi(this.props.history, "post", "planContentRead", {
      revisionId,
    }).then((response) => {
      if (response) {
        return response;
      }
    });
  };

  getTitle = () => {
    switch (this.state.show) {
      case "model":
        return { __html: this.state.model.title };
      case "pending":
        return { __html: this.state.objectPending.title };
      case "version":
        return { __html: this.state.objectVersion.title };
      case "translation":
        return { __html: this.state.objectTranslation.title };
      default:
        return { __html: this.state.model.title };
    }
  };

  getContent = () => {
    switch (this.state.show) {
      case "model":
        return { __html: this.state.model.description };
      case "pending":
        return { __html: this.state.objectPending.content };
      case "version":
        return { __html: this.state.objectVersion.content };
      case "translation":
        return { __html: this.state.objectTranslation.content };
      default:
        return { __html: this.state.model.description };
    }
  };

  compareVersion = () => {
    this.setState(
      { objectLoading: true, isVersionCompared: !this.state.isVersionCompared },
      () => {
        if (this.state.isVersionCompared) {
          this.EditApi.callApi(this.props.history, "post", "planContentDiff", {
            revisionId: this.state.objectVersion.id,
          }).then((response) => {
            let objectVersion = {
              title: response.title,
              content: response.result,
              id: this.state.objectVersion.id,
            };

            this.setState({
              objectLoading: false,
              objectVersion: objectVersion,
            });
          });
        } else {
          this.setState({
            objectLoading: true,
          });
          this.getVersionContent(this.state.selectedVersion);
        }
      }
    );
  };

  toggleTranslationWarning = () => {
    this.setState({
      showTranslationWarning: !this.state.showTranslationWarning,
    });
  };

  toggleTranslationModal = (e, action) => {
    if (action === "close-warning") {
      this.setState({
        showTranslationWarningModal: false,
      });
    } else {
      this.setState({
        showTranslationWarningModal: true,
      });
    }
  };

  toggleTranslation = () => {
    this.setState({ autoTranslated: !this.state.autoTranslated }, () => {
      this.setState({
        show: "pending",
        objectLoading: true,
      });

      if (this.state.autoTranslated) {
        Object.keys(this.state.model).forEach((key) => {
          if (key !== "title" && key !== "description") {
            return;
          } else {
            this.translateContent(this.state.model[key]).then((translation) =>
              this.setState({
                show: "translation",
                objectLoading: false,
                objectTranslation: {
                  ...this.state.objectTranslation,
                  [key === "description" ? "content" : key]: translation,
                },
                contentLanguage: this.props.interfaceLocale,
              })
            );
          }
        });
      } else {
        this.setState({
          // we go to current version
          show: "model",
          objectLoading: false,
          contentLanguage: this.props.model.language.replace("_", " "),
        });
      }
    });
  };

  translateContent = (content) => {
    const payload = {
      source: this.props.contentLanguage,
      target: this.props.interfaceLanguage,
      content: content,
    };

    this.Api.initAuth(this.props.history);
    this.Api.init(this.props.history);

    return new Promise((resolve, reject) => {
      this.Api.post(endpoint("planContentTranslate"), payload).then(
        (response) => {
          resolve(response.data.translations[0].text);
        }
      );
      // .catch((error) => {});
    });
  };

  render = () => {
    const {
      show,
      model,
      displayContextMenu,
      displayVersionMenu,
      versions,
      versionLoading,
      objectLoading,
      selectedVersion,
      isVersionCompared,
      allowTranslation,
      autoTranslated,
      showTranslationWarningModal,
      showTranslationEditModal,
    } = this.state;

    const { intl, interfaceLocale } = this.props;

    return (
      <div className="plan-description">
        <div className="title">
          <div className="icon">
            <Icon icon={model.icon} color={model.color} />
          </div>
          {objectLoading === true ? (
            <Skeleton width="90%" height="20px" margin="0px 0px 0px 0px" />
          ) : (
            <div
              className="item html-diff"
              dangerouslySetInnerHTML={this.getTitle()}
            ></div>
          )}

          {allowTranslation === true ? (
            <AutoTranslate
              intl={intl}
              active={autoTranslated}
              toggleTranslation={this.toggleTranslation}
              interfaceLocaleFull={this.props.interfaceLocaleFull}
              disabled={!this.props.allowTranslation}
              showWarning={this.toggleTranslationModal}
            />
          ) : null}

          <StackedDots onClick={this.openContextMenu} mode="visible" />
          {displayContextMenu === true && (
            <ContextMenu
              actions={["edit"]}
              tags={this.props.multiLanguageEnabled ? [interfaceLocale] : null}
              onClick={(e, action) =>
                this.handleContextMenuClick(e, action, model)
              }
              onClickOutside={this.handleContextMenuClickOutside}
            />
          )}
        </div>

        {show === "pending" && allowTranslation === false ? (
          <Version
            class="highlight"
            icon="far-arrow-alt-circle-right"
            iconTransform="rotate--45"
            intro={intl.formatMessage({
              id: "plan.description.version.type.pending",
            })}
            user={model.mode.user}
            update={DTS.moment(model.mode.unix).format(
              intl.formatMessage({
                id: DTS.format("plan.description.update.format"),
              })
            )}
          />
        ) : null}

        {show !== "pending" &&
        allowTranslation === false &&
        selectedVersion !== undefined &&
        selectedVersion.user !== "" &&
        selectedVersion.update !== undefined ? (
          <Version
            class={selectedVersion.class}
            icon={selectedVersion.icon}
            intro={intl.formatMessage({
              id: "plan.description.version.type." + selectedVersion.type,
            })}
            type={selectedVersion.type}
            user={selectedVersion.user}
            update={selectedVersion.update}
            toggle={selectedVersion !== versions[0]}
            isVersionCompared={isVersionCompared}
            compareVersion={this.compareVersion}
          >
            {versions.length > 1 && (
              <React.Fragment>
                <div
                  className="icon-arrow-down"
                  onClick={this.openVersionMenu}
                  data-tip={intl.formatMessage({
                    id: "plan.description.version.tooltip",
                  })}
                  data-for="version-tooltip"
                ></div>
                {displayVersionMenu === false && (
                  <ReactTooltip
                    className="version-tooltip"
                    id="version-tooltip"
                    effect="solid"
                    place="bottom"
                  />
                )}
                {displayVersionMenu === true && (
                  <ContextMenuExtended
                    items={versions}
                    onClick={(e, item) => this.handleVersionMenuClick(e, item)}
                    onClickOutside={this.handleVersionMenuClickOutside}
                  />
                )}
              </React.Fragment>
            )}
          </Version>
        ) : null}

        {versionLoading === true ? <Loader className="version-loader" /> : null}

        <div className="text html-diff fr-element">
          {objectLoading === true ? (
            <DescriptionLoader />
          ) : (
            <EditorText content={this.getContent()} />
          )}
        </div>

        {showTranslationWarningModal && (
          <ModalWarning intl={intl} onClick={this.toggleTranslationModal} />
        )}

        {showTranslationEditModal !== false && (
          <ModalTranslationEdit
            intl={intl}
            header={showTranslationEditModal.header}
            hide={this.openEdit}
          />
        )}
      </div>
    );
  };
}

const AutoTranslate = ({
  intl,
  active,
  toggleTranslation,
  interfaceLocaleFull,
  showWarning,
}) => {
  const tooltipMessage = intl.formatMessage({
    id: `plan.description.autotranslate.tooltip.${active ? "on" : "off"}`,
  });

  const dataTip = active
    ? tooltipMessage
    : tooltipMessage + "<br />" + interfaceLocaleFull;

  return (
    <div
      className={cs({
        translation: true,
        on: active,
      })}
    >
      {active && (
        <div className="warning">
          <FormattedMessage id="plan.description.autotranslate.warning" />
          <div className="link" onClick={showWarning}>
            <FormattedMessage id="plan.description.autotranslate.warning.link" />
          </div>
        </div>
      )}
      <div className="btn">
        <div
          className="icon"
          data-for="translation-tooltip"
          data-tip={dataTip}
          onClick={toggleTranslation}
        ></div>
      </div>
      <ReactTooltip
        id="translation-tooltip"
        effect="solid"
        offset={{ right: -60 }}
        html={true}
      />
    </div>
  );
};

const ModalWarning = ({ intl, onClick }) => {
  return (
    <ModalSimple class="warning">
      <div className="header">
        <div className="icon"></div>
        <FormattedMessage id="plan.description.autotranslate.warning.modal.header" />
      </div>
      <div className="text">
        <FormattedMessage
          id="plan.description.autotranslate.warning.modal.text"
          values={{ br: <br /> }}
        />
      </div>
      <ActionButton
        text={intl.formatMessage({
          id: DTS.format("plan.description.autotranslate.warning.modal.button"),
        })}
        action="close-warning"
        onClick={onClick}
      />
    </ModalSimple>
  );
};

const ModalTranslationEdit = ({ header, hide }) => {
  return (
    <ModalClose hide={hide} class="translation-edit" header={header}>
      <div className="image"></div>

      <div className="text">
        <FormattedMessage
          id={`plan.description.autotranslate.edit.modal.message`}
        />
      </div>

      <button className="button" onClick={hide}>
        <FormattedMessage
          id={`plan.description.autotranslate.edit.modal.button`}
        />
      </button>
    </ModalClose>
  );
};

export default withRouter(injectIntl(withAutoTranslate(Description)));
