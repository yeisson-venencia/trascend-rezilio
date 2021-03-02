import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import cs from "classnames";
import _ from "lodash";
import store from "../../../../utils/store";
import Editor from "../../../editor/Editor";
import withTimeout from "../../../common/withTimeout";
import { withAutoTranslate } from "../../translate/AutoTranslate";
import Overlay from "../../../common/Overlay";
import { default as Modal } from "../EditModal/EditModal";
import ModalIcon from "../../../common/Modal/ModalIcon";
import Icon from "../../../common/Icon";
import ActionButton from "../../../common/ActionButton/ActionButton";
import { default as Loader } from "../../../common/ApiLoader/ApiLoader";
import EditApiService from "./EditApiService/EditApiService";
import DTS from "../../../../utils/DateTimeService";

import "./PlanEdit.scss";

class PlanEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoader: true,
      model: undefined, // we show edit when model is passed

      objectChange: false,
      objectEdit: {}, // currently edited (may not be saved yet)
      objectDraft: {}, // latest save via API

      datetimeNow: null, // tick
      datetimeSave: null,
      timestamp: null,
      language: undefined,

      showTranslationModal: false,
      showErrorModal: false,
      showActionModal: false,
      showConfirmationModal: false,
      showActionModalProgress: false,

      action: null, // save, submit, publish, delete
      showSaveProgress: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      datetimeEditing: this.state.datetimeNow,
      datetimeSave: this.state.datetimeNow,
    });

    setInterval(() => this.tick(), 1000);

    // do check what to show
    this.getEditStatus().then((isEditable) => {
      if (isEditable) {
        // set the model (and render edit panel) when file is not locked
        this.callApi("readDraft").then((response) => {
          if (!_.isEmpty(response)) {
            // we use existing draft as default values
            this.saveObject(
              ["edit", "draft"],
              response.title,
              response.content
            );

            this.setState({
              showLoader: false,
              model: this.props.model,
              timestamp: this.props.model.mode.unix, // latest save from mode
            });

            // if multi-language plan, pass the original content language to the editor
            if (this.props.model.multiLanguageEnabled) {
              this.setState({ language: this.props.interfaceLocaleFull });
            } else {
              // else set to interface language by default
              if (this.props.interfaceLocaleFull !== undefined) {
                this.setState({
                  language: this.props.model.contentLanguageFull,
                });
              }
            }
          } else {
            // we use props.model as default values
            this.saveObject(
              ["edit"],
              this.props.model.title,
              this.props.model.description
            );

            this.setState({
              showLoader: false,
              model: this.props.model,
            });

            // if multi-language plan, pass the original content language to the editor
            if (this.props.model.multiLanguageEnabled) {
              this.setState({ language: this.props.interfaceLocaleFull });
            } else {
              // else set to interface language by default
              if (this.props.interfaceLocaleFull !== undefined) {
                this.setState({
                  language: this.props.model.contentLanguageFull,
                });
              }
            }
          }
        });
      } else {
        // locked file is handled via getEditStatus catch
        this.setState({
          showLoader: false,
        });
      }
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      datetimeNow,
      datetimeEditing,
      datetimeSave,
      objectEdit,
      objectDraft,
      objectChange,
    } = this.state;

    if (
      datetimeNow - datetimeEditing >=
      window.appConfig.editorDelay /* typing delay */
    ) {
      if (
        datetimeNow - datetimeSave >=
        window.appConfig.editorAutosave /* autosave delay */
      ) {
        if (
          _.isEqual(objectEdit, objectDraft) === false &&
          objectChange === true
        ) {
          this.saveAction(objectEdit);
        }
        this.setState({ datetimeSave: datetimeNow });
      }
    }
  };

  getUnix = () => {
    return DTS.now();
  };

  tick = () => {
    this.setState({
      datetimeNow: this.getUnix(),
    });
  };

  getEditStatus = () => {
    return new Promise((resolve, reject) => {
      this.callApi("lockUnlockEdit")
        .then((response) => {
          if (response) {
            // unlocked => open editor
            resolve(true);
          }
        })
        .catch((error) => {
          // handled through API error
          if (error.status === 423) {
            let data = error.body.data;
            // locked => can't open editor
            this.setState({
              showLoader: false,
            });

            let user = JSON.parse(store.get("profile"));
            if (data.userId === user.user.id) {
              // I already sent a pending request which is waiting for approaval/reject
              this.setState({
                showErrorModal: {
                  header: this.props.intl.formatMessage({
                    id: "plan.edit.locked.pending.header",
                  }),
                  icon: "locked",
                  body: data.userName,
                },
              });
            } else {
              this.setState({
                showErrorModal: {
                  header: this.props.intl.formatMessage({
                    id: "plan.edit.locked.error.header",
                  }),
                  icon: "locked",
                  body: data.userName,
                },
              });
            }

            resolve(false);
          }
        });
    });
  };

  callApi = (mode) => {
    const payload = {
      planId: this.props.planId,
      section: this.props.model.sectionType,
      sectionId: this.props.model.id,
    };

    const EditApi = new EditApiService(payload);

    const { objectEdit } = this.state;

    return new Promise((resolve, reject) => {
      switch (mode) {
        case "lockUnlockEdit":
          return EditApi.callApi(this.props.history, "post", "planContentEdit")
            .then((response) => {
              if (response) {
                resolve(response);
              }
            })
            .catch((error) => {
              // handled through API error
              if (error.status === 423) {
                reject(error);
              }
            });
        case "readDraft":
          return EditApi.callApi(this.props.history, "post", "planContentRead")
            .then((response) => {
              if (response) {
                resolve(response);
              }
            })
            .catch(() => {
              // handled through API error
            });

        case "releaseEdit":
          return EditApi.callApi(
            this.props.history,
            "post",
            "planContentRelease"
          )
            .then(() => {
              this.setState({
                datetimeSave: this.props.model.mode.unix,
                objectEdit: {},
                objectDraft: {},
              });
              resolve(true);
            })
            .catch(() => {
              // handled through API error
            });

        case "updateContent":
          return EditApi.callApi(
            this.props.history,
            "post",
            "planContentUpdate",
            objectEdit
          )
            .then((response) => {
              if (response) {
                this.setState({
                  datetimeSave: this.props.model.mode.unix,
                });
                resolve(response);
              }
            })
            .catch(() => {
              // handled through API error
            });
        case "submitContent":
          return EditApi.callApi(
            this.props.history,
            "post",
            "planContentSubmit",
            objectEdit
          )
            .then((response) => {
              if (response) {
                resolve(response);
              }
            })
            .catch(() => {
              // handled through API error
            });
        case "publishContent":
          return EditApi.callApi(
            this.props.history,
            "post",
            "planContentPublish",
            objectEdit
          )
            .then((response) => {
              if (response) {
                resolve(response);
              }
            })
            .catch(() => {
              // handled through API error
            });

        default:
          break;
      }
    });
  };

  closeEdit = () => {
    const { objectEdit, objectDraft } = this.state;

    if (
      !_.isEmpty(objectDraft) &&
      _.isEqual(objectEdit, objectDraft) === false
    ) {
      this.setState({
        showActionModal: true,
        action: "saveQuit",
      });
    } else {
      if (_.isEmpty(objectDraft)) {
        this.setState({
          model: undefined,
        });
        // nothing saved as a draft, unlock edit mode
        this.callApi("releaseEdit").then((response) => {
          // notify parent component
          this.props.show(false);
        });
      } else {
        this.setState({
          model: undefined,
        });
        // notify parent component
        this.props.show(false);
      }
    }
  };

  handleEditSubmit = (e, action) => {
    const { objectEdit, objectDraft } = this.state;
    if (action !== "save") {
      // need action modal
      this.setState({
        action: action,
        showActionModal: true,
        showActionModalProgress: false,
      });
    } else {
      // no modal, regular save
      if (_.isEqual(objectEdit, objectDraft) === false) {
        this.saveAction(objectEdit);
      }
    }
  };

  submitAction = (obj) => {
    return this.callApi("submitContent")
      .then((response) => {
        this.setState({
          objectDraft: obj,
        });

        return response;
      })
      .catch(() => {
        // handled through API service
      });
  };

  publishAction = (obj) => {
    return this.callApi("publishContent")
      .then((response) => {
        this.setState({
          objectDraft: obj,
        });

        return response;
      })
      .catch(() => {
        // handled through API service
      });
  };

  saveAction = (obj) => {
    const { action } = this.state;

    if (action === "saveQuit") {
      this.setState({
        showSaveProgress: false,
      });
    } else {
      this.setState({ showSaveProgress: true });
    }

    return this.callApi("updateContent")
      .then((response) => {
        this.setState({
          objectEdit: obj,
          objectDraft: obj,
          showSaveProgress: false,
          timestamp: response.timeStamp,
        });

        return response;
      })
      .catch(() => {
        // handled through API service
      });
  };

  handleModalSubmit = (action) => {
    const { objectEdit, objectDraft } = this.state;

    switch (action) {
      case "submit":
        // creates new pending request (is approved/rejected later)
        this.setState({
          showActionModalProgress: true, // change modal button to loader
        });

        this.submitAction(objectEdit).then((response) => {
          this.setState({
            showActionModalProgress: false,
            showConfirmationModal: true,
          });
          this.props.setTimeout(() => {
            this.closeEdit();
          }, window.appConfig.modalAutoclose);
        });
        break;
      case "publish":
        // new version is set right away (without approval)
        this.setState({
          showActionModalProgress: true, // change modal button to loader
        });

        this.publishAction(objectEdit).then((response) => {
          this.setState({
            showActionModalProgress: false,
            showConfirmationModal: true,
          });
          this.props.setTimeout(() => {
            this.closeEdit();
          }, window.appConfig.modalAutoclose);
        });
        break;
      case "saveQuit":
        // when closing the edit mode, save as a draft if content has changed
        if (_.isEqual(objectEdit, objectDraft) === false) {
          this.setState({
            showActionModalProgress: true, // change modal button to loader
          });
          this.saveAction(objectEdit).then((response) => {
            if (response) {
              this.setState({
                showActionModalProgress: false,
                showActionModal: false,
              });
              this.closeEdit();
            }
          });
        }

        break;
      case "delete":
        // discard the draft
        this.setState({
          showActionModalProgress: true,
        });
        this.callApi("releaseEdit").then((response) => {
          // text is available for editing again now
          this.setState({
            showActionModal: false,
            showConfirmationModal: true,
          });
          this.props.setTimeout(() => {
            this.closeEdit();
          }, window.appConfig.modalAutoclose);
        });
        break;
      default:
        break;
    }
  };

  hideModal = () => {
    this.setState({
      showActionModal: false,
      showErrorModal: false,
    });
  };

  hideConfirmationModal = () => {
    this.setState({
      showConfirmationModal: false,
      model: undefined,
    });
    // notify parent component
    // important to go through componentDidMount again
    this.props.show(false);
  };

  hideErrorModal = () => {
    this.setState({
      showErrorModal: false,
    });

    // notify parent component
    // important to go through componentDidMount again
    this.props.show(false);
  };

  // save edited object
  saveObject = (type, title, content) => {
    let obj = {
      title: title,
      content: content,
    };

    // as array
    if (Array.isArray(type) === false) {
      type = [type];
    }

    // while you are typing
    if (type.includes("edit")) {
      this.setState({
        objectEdit: obj,
      });
    }

    // saved version via API
    if (type.includes("draft")) {
      this.setState({
        objectDraft: obj,
      });
    }
  };

  // text editor on change call
  onEditorChange = (text) => {
    if (text !== this.state.objectEdit.content) {
      this.saveObject("edit", this.state.objectEdit.title, text);
      // set edited text and timestamp for save / autosave purposes
      this.setState({
        objectChange: true,
        datetimeEditing: this.state.datetimeNow,
        datetimeSave: this.state.datetimeNow,
      });
    }
  };

  onTitleChange = (title) => {
    // set edited text and timestamp for save / autosave purposes
    this.setState({
      objectChange: true,
      datetimeEditing: this.state.datetimeNow,
      datetimeSave: this.state.datetimeNow,
    });
    this.saveObject("edit", title, this.state.objectEdit.content);
  };

  render() {
    const {
      showLoader,
      model,
      action,
      showErrorModal,
      showActionModal,
      showConfirmationModal,
      timestamp,
      showSaveProgress,
      objectEdit,
      objectDraft,
      objectChange,
      showActionModalProgress,
    } = this.state;

    const { intl } = this.props;

    if (showLoader === true) {
      return (
        <React.Fragment>
          <Loader />
        </React.Fragment>
      );
    }

    if (showErrorModal !== false) {
      return (
        <ModalIcon
          header={showErrorModal.header}
          icon={showErrorModal.icon}
          hide={this.hideErrorModal}
        >
          <div className="side-30">{showErrorModal.body}</div>
        </ModalIcon>
      );
    }

    if (this.state.model !== undefined) {
      return (
        <React.Fragment>
          <Overlay
            overlayClass={cs(
              "overlay",
              { action: showActionModal },
              { confirmation: showConfirmationModal }
            )}
          />
          {showActionModal && (
            <Modal
              overlayClass="action"
              action={action}
              title={
                <>
                  <FormattedMessage id={`plan.edit.modal.title.${action}`} />
                  {action === "publish" && (
                    <span className="lang">{model.contentLanguageFull}</span>
                  )}
                </>
              }
              info={<FormattedMessage id={`plan.edit.modal.info.${action}`} />}
              buttonText={
                <FormattedMessage id={`plan.edit.modal.button.${action}`} />
              }
              input={false}
              onSubmit={this.handleModalSubmit}
              hide={this.hideModal}
              inProgress={showActionModalProgress}
            />
          )}
          {showConfirmationModal && (
            <Modal
              overlayClass="confirmation"
              action={action}
              confirmation={true}
              info={
                <FormattedMessage
                  id={`plan.edit.confirmation.info.${action}`}
                />
              }
              hide={this.hideConfirmationModal}
              emphasis={
                <FormattedMessage
                  id={`plan.edit.confirmation.info.emphasis.${action}`}
                />
              }
            />
          )}
          <div className="plan-edit show" role="dialog">
            <div className="plan-edit-header">
              <Icon icon={model.icon} color={model.color} />
              {/*
              <h1 className="plan-edit-title">{model.title}</h1>
              */}

              <input
                className="plan-edit-title"
                value={this.state.objectEdit.title}
                onChange={(e) => this.onTitleChange(e.target.value)}
              />

              <div className="plan-edit-close">
                <div className="close" onClick={this.closeEdit}></div>
              </div>
            </div>

            <div className="plan-edit-body">
              <div className="versioning-info">
                <div className="versioning-info-current">
                  <FormattedMessage id="plan.edit.versioning.info.current" />
                </div>
                <div className="versioning-info-lang">
                  {this.state.language}
                </div>
                {timestamp && (
                  <>
                    <div className="versioning-info-icon"></div>
                    <div className="versioning-info-draft">
                      <span>
                        <FormattedMessage id="plan.edit.versioning.info.draft" />
                      </span>
                      <span>-</span>
                      <span className="timestamp">
                        {DTS.moment(this.state.timestamp).format(
                          intl.formatMessage({
                            id: "plan.edit.timestamp.date",
                          })
                        )}
                      </span>
                      <span>
                        {DTS.moment(this.state.timestamp).format(
                          intl.formatMessage({
                            id: "plan.edit.timestamp.time",
                          })
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="editor-wrapper">
                <Editor
                  planId={this.props.planId}
                  model={objectEdit.content}
                  onChange={this.onEditorChange}
                />
              </div>
              <div className="action-btn-wrapper">
                <ActionButton
                  text={intl.formatMessage({
                    id: "plan.edit.action.submit",
                  })}
                  action="submit"
                  onClick={this.handleEditSubmit}
                  disabled={_.isEmpty(objectDraft)}
                />
                <ActionButton
                  text={intl.formatMessage({
                    id: "plan.edit.action.publish",
                  })}
                  action="publish"
                  onClick={this.handleEditSubmit}
                  disabled={_.isEmpty(objectDraft)}
                />
                <ActionButton
                  text={intl.formatMessage({
                    id: "plan.edit.action.save",
                  })}
                  action="save"
                  onClick={this.handleEditSubmit}
                  showProgress={showSaveProgress}
                  disabled={
                    _.isEqual(objectEdit, objectDraft) || objectChange === false
                  }
                />
                <ActionButton
                  text={intl.formatMessage({
                    id: "plan.edit.action.delete",
                  })}
                  action="delete"
                  onClick={this.handleEditSubmit}
                  disabled={_.isEmpty(objectDraft)}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return null;
  }
}

PlanEdit.propTypes = {
  model: PropTypes.object.isRequired,
};

export default withRouter(withTimeout(withAutoTranslate(injectIntl(PlanEdit))));
