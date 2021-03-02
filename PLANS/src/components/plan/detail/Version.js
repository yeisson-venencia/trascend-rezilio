import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import cs from "classnames";
import Icon from "../../common/Icon";
import ToggleButton from "../../common/ToggleButton";
import "./Version.scss";

class Version extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      class: props.class,
      icon: props.icon,
      iconTransform: props.iconTransform,
      intro: props.intro,
      user: props.user,
      update: props.update,
      type: props.type,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      this.setState({
        class: this.props.class,
        icon: this.props.icon,
        iconTransform: this.props.iconTransform,
        intro: this.props.intro,
        user: this.props.user,
        update: this.props.update,
        type: this.props.type,
      });
    }
  };

  render = () => {
    return (
      <div className="version-info">
        <div className={cs("info", this.state.class, this.state.type)}>
          <Icon
            className="icon"
            icon={this.state.icon}
            color=""
            transform={this.state.iconTransform}
          />

          <div className="user">
            <span>{this.state.intro}</span>
            <span>{this.state.user}</span>
          </div>

          <div className="update">
            <span>
              <FormattedMessage id="plan.description.update" />
            </span>
            <span>{this.state.update}</span>
          </div>

          {this.props.children}
        </div>
        {this.props.toggle && (
          <>
            <ToggleButton
              onToggle={this.props.compareVersion}
              isToggled={this.props.isVersionCompared}
              label={this.props.intl.formatMessage({
                id: "plan.description.version.toggle",
              })}
              intl={this.props.intl}
              tooltip={true}
              dataTip={this.props.intl.formatMessage({
                id: "plan.description.version.toggle.tooltip",
              })}
            />
          </>
        )}
      </div>
    );
  };
}

export default injectIntl(Version);
