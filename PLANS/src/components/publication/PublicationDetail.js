import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import cs from "classnames";
import _ from "lodash";
import Skeleton from "../common/Skeleton";
import Overlay from "../common/Overlay";
import ModalClose from "../common/Modal/ModalClose";
import { default as Modal } from "./PublicationModal";
import Icon from "../common/Icon";
import ActionButton from "../common/ActionButton/ActionButton";
import ToggleButton from "../common/ToggleButton";
import { default as Loader } from "../common/ApiLoader/ApiLoader";
import EditApiService from "../plan/editing/PlanEdit/EditApiService/EditApiService";
import DescriptionLoader from "../plan/detail/DescriptionLoader";
import EditorText from "../editor/EditorText";
import DTS from "../../utils/DateTimeService";

import "./PublicationDetail.scss";

class PublicationDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoader: true,
      showObjectLoader: false,
      model: undefined, // we show the publication detail when model is passed
      objectOriginal: undefined,
      objectDiff: undefined,
      showActionModal: false,
      showActionModalProgress: false,
      showConfirmationModal: false,
      showErrorModal: false,
      action: null, // publish, reject
      isVersionCompared: false,
    };
  }

  componentDidMount() {
    this.setContent();
  }

  componentWillUnmount() {
    // notify parent to re-render
    this.props.refresh();
  }

  callApi = (mode) => {
    const payload = this.state.model.payload;

    const EditApi = new EditApiService(payload);

    return new Promise((resolve, reject) => {
      switch (mode) {
        case "publish":
          return EditApi.callApi(
            this.props.history,
            "post",
            "planContentPublish",
            {
              title: this.state.objectOriginal.title,
              content: this.state.objectOriginal.content,
            }
          )
            .then((response) => {
              if (_.isEmpty(response)) {
                this.showUnavailableModal();
              } else {
                resolve(response);
              }
            })
            .catch((error) => {
              if (error.status === 204) {
                this.showUnavailableModal();
              }
              if (error.status === 423) {
                this.showLockedModal();
              }
            });

        case "reject":
          return EditApi.callApi(
            this.props.history,
            "post",
            "planContentReject"
          )
            .then((response) => {
              if (_.isEmpty(response)) {
                this.showUnavailableModal();
              } else {
                resolve(response);
              }
            })
            .catch((error) => {
              if (error.status === 204) {
                this.showUnavailableModal();
              }
              if (error.status === 423) {
                this.showLockedModal();
              }
            });
        case "diff":
          return EditApi.callApi(this.props.history, "post", "planContentDiff")
            .then((response) => {
              if (response) {
                resolve(response);
              }
            })
            .catch(() => {
              // handled through API error
            });
        case "readContent":
          return EditApi.callApi(this.props.history, "post", "planContentLook")
            .then((response) => {
              if (_.isEmpty(response)) {
                this.showUnavailableModal();
              } else {
                resolve(response);
              }
            })
            .catch((error) => {
              if (error.status === 204) {
                this.showUnavailableModal();
              }
              if (error.status === 423) {
                this.showLockedModal();
              }
            });

        case "releaseContent":
          return EditApi.callApi(
            this.props.history,
            "post",
            "planContentUnlook"
          )
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              // handled through API error
            });
        default:
          break;
      }
    });
  };

  showLockedModal = () => {
    this.setState({
      showLoader: false,
      showErrorModal: {
        header: this.props.intl.formatMessage({
          id: "publication.detail.error.modal.locked.header",
        }),
        body: this.props.intl.formatMessage({
          id: "publication.detail.error.modal.locked.body",
        }),
        icon: "locked",
      },
    });
  };

  showUnavailableModal = () => {
    this.setState({
      showLoader: false,
      showErrorModal: {
        header: this.props.intl.formatMessage({
          id: "publication.detail.error.modal.unavailable.header",
        }),
        body: this.props.intl.formatMessage({
          id: "publication.detail.error.modal.unavailable.body",
        }),
        icon: "locked",
      },
    });
  };

  setContent = () => {
    this.setState({ model: this.props.model }, () => {
      this.callApi("readContent").then((response) => {
        this.setState({
          objectOriginal: {
            title: response.title,
            content: response.content,
          },
          showLoader: false,
        });
      });
    });
  };

  closePublicationDetail = () => {
    // notify parent component
    this.props.refresh();

    this.callApi("releaseContent")
      .then(() => {})
      .catch(() => {
        // handled through API error
      });
  };

  handlePublicationSubmit = (e, action) => {
    this.setState({ showActionModal: true, action });
  };

  handleModalSubmit = (action) => {
    this.setState({ showActionModalProgress: true });
    this.callApi(action).then((response) => {
      if (response) {
        this.setState({
          showActionModalProgress: false,
          showConfirmationModal: true,
        });
        setTimeout(() => {
          this.setState({
            showActionModal: false,
            showConfirmationModal: false,
          });
        }, window.appConfig.modalAutoclose);
        //this.closePublicationDetail();
        this.props.refresh();
      }
    });
  };

  getTitle = () => {
    switch (this.state.show) {
      case "original":
        return { __html: this.state.objectOriginal.title };
      case "difference":
        return { __html: this.state.objectDiff.title };
      default:
        return { __html: this.state.objectOriginal.title };
    }
  };

  getContent = () => {
    switch (this.state.show) {
      case "original":
        return { __html: this.state.objectOriginal.content };
      case "difference":
        return { __html: this.state.objectDiff.content };
      default:
        return { __html: this.state.objectOriginal.content };
    }
  };

  compareVersion = () => {
    this.setState(
      {
        isVersionCompared: !this.state.isVersionCompared,
      },
      () => {
        if (this.state.isVersionCompared) {
          if (this.state.objectDiff === undefined) {
            this.setState({ showObjectLoader: true });
            this.callApi("diff").then((response) => {
              this.setState({
                show: "difference",
                objectDiff: {
                  title: response.title,
                  content: response.result,
                },
                showObjectLoader: false,
              });
            });
          } else {
            this.setState({
              showObjectLoader: false,
              show: "difference",
            });
          }
        } else {
          this.setState({
            show: "original",
          });
        }
      }
    );
  };

  hideActionModal = () => {
    this.setState({
      showActionModal: false,
    });
  };

  hideErrorModal = () => {
    this.props.refresh();
  };

  render() {
    const {
      showLoader,
      showObjectLoader,
      model,
      action,
      showActionModal,
      showActionModalProgress,
      showConfirmationModal,
      showErrorModal,
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
        <ModalClose
          class="error"
          header={showErrorModal.header}
          hide={this.hideErrorModal}
          actionButton={true}
          actionButtonText={intl.formatMessage({
            id: "publication.detail.error.modal.button",
          })}
        >
          {showErrorModal.body}
        </ModalClose>
      );
    }

    if (this.state.model !== undefined && showErrorModal === false) {
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
                  <FormattedMessage
                    id={`publication.detail.modal.${action}.title`}
                  />
                </>
              }
              info={
                <FormattedMessage
                  id={`plan.edit.modal.info.${action}`}
                  values={{
                    u: (chunks) => <u>{chunks}</u>,
                  }}
                />
              }
              buttonText={
                <FormattedMessage id={`plan.edit.modal.button.${action}`} />
              }
              input={false}
              onSubmit={this.handleModalSubmit}
              hide={this.hideActionModal}
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
              emphasis={
                <FormattedMessage
                  id={`plan.edit.confirmation.info.emphasis.${action}`}
                />
              }
            />
          )}
          <div className="plan-publication show" role="dialog">
            <div className="plan-publication-header">
              <div className="versioning-info">
                <span className="versioning-info-user">
                  <FormattedMessage id="publication.detail.versioning.user" />
                </span>
                <span className="timestamp">{model.user}</span>
                <span className="versioning-info-date">
                  <FormattedMessage id="publication.detail.versioning.date" />
                </span>
                <span className="timestamp">
                  {DTS.moment(model.update).format(
                    intl.formatMessage({
                      id: "plan.edit.timestamp.date",
                    })
                  )}
                </span>
                <span>-</span>
                <span>
                  {DTS.moment(model.update).format(
                    intl.formatMessage({
                      id: "plan.edit.timestamp.time",
                    })
                  )}
                </span>
                <ToggleButton
                  onToggle={this.compareVersion}
                  isToggled={this.state.isVersionCompared}
                  label={intl.formatMessage({
                    id: "publication.detail.versioning.toggle",
                  })}
                  tooltip={true}
                  dataTip={intl.formatMessage({
                    id: "plan.description.version.toggle.tooltip",
                  })}
                  intl={this.props.intl}
                />
              </div>

              <div className="action-btn-wrapper">
                <ActionButton
                  text={intl.formatMessage({
                    id: "publication.detail.action.publish",
                  })}
                  action="publish"
                  onClick={this.handlePublicationSubmit}
                />
                <ActionButton
                  text={intl.formatMessage({
                    id: "publication.detail.action.reject",
                  })}
                  action="reject"
                  onClick={this.handlePublicationSubmit}
                />
              </div>
              <div
                className="close"
                onClick={this.closePublicationDetail}
              ></div>
            </div>

            <div className="plan-publication-body">
              <div className="plan-publication-body-header">
                <Icon
                  className="plan-publication-icon"
                  icon={model.icon}
                  color={model.color}
                />
                {showObjectLoader ? (
                  <h1 className="plan-publication-title">
                    <Skeleton
                      width="200px"
                      height="20px"
                      margin="5px 0px 5px 0px"
                    />
                  </h1>
                ) : (
                  <>
                    <h1
                      className="plan-publication-title html-diff"
                      dangerouslySetInnerHTML={this.getTitle()}
                    ></h1>
                    <span className="lang">
                      <FormattedMessage id={`locale.${model.localeId}.full`} />
                    </span>
                  </>
                )}
              </div>

              <div className="text-wrapper">
                {showObjectLoader ? (
                  <DescriptionLoader />
                ) : (
                  <EditorText content={this.getContent()} />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return null;
  }
}

PublicationDetail.propTypes = {
  model: PropTypes.object.isRequired,
  show: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default withRouter(injectIntl(PublicationDetail));
