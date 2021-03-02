import React from "react";
import classnames from "classnames";
import _ from "lodash";
import Icon from "../../../../common/Icon";
import StackedDots from "../../../../common/StackedDots";
import ContextMenu from "../../../../common/ContextMenu/ContextMenu";

class Shortcut extends React.Component {
  onClickOutside = () => {
    // currently does nothing
  };

  render() {
    const { draggedOver, editMode, item, clicked } = this.props;

    return (
      <div
        ref={this.ref}
        className={classnames("shortcut", {
          "drag-over": draggedOver,
          "edit-mode": editMode,
          disabled: _.isEmpty(item),
          "broken-link": item.id === undefined && !_.isEmpty(item),
          clicked: clicked,
        })}
        draggable={true}
        onDragStart={this.props.onDragStart}
        onDragEnd={this.props.onDragEnd}
        onDrop={this.props.onDropItem}
        onDragOver={this.props.onDragOver}
        onClick={this.props.onClick}
      >
        <div className="shortcut-icon">
          <Icon icon={this.props.item.icon} color={this.props.item.color} />
        </div>
        <span className="shortcut-title">
          {editMode}
          {this.props.item.customTitle
            ? this.props.item.customTitle
            : this.props.item.title}
        </span>
        <StackedDots mode="active" onClick={this.props.onDotsClick} />

        {item.id === undefined && !_.isEmpty(item) && editMode === true ? (
          // if broken link
          <ContextMenu
            actions={["delete"]}
            onClick={(e, action) => this.props.onShortcutEdit(e, action)}
            onClickOutside={this.props.onShortcutClickOutside}
          />
        ) : null}

        {item.id !== undefined && !_.isEmpty(item) && editMode === true ? (
          <ContextMenu
            actions={["rename", "delete"]}
            onClick={(e, action) => this.props.onShortcutEdit(e, action)}
            onClickOutside={this.props.onShortcutClickOutside}
          />
        ) : null}
      </div>
    );
  }
}

export default Shortcut;
