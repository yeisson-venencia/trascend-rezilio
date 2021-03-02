import _ from "lodash";

export default class OnDrop {
  constructor(key, shortcuts) {
    this.key = key;
    this.shortcuts = shortcuts;
    this.emptyShortcut = {};
  }

  emptyIndex = () => {
    return this.shortcuts.findIndex(function (e) {
      return _.isEmpty(e);
    });
  };

  stackShortcuts = () => {
    let that = this;

    // stack from left
    var sorted = [];

    that.shortcuts.reverse(); // since we unshift, we need to reverse first
    that.shortcuts.forEach(function (el) {
      if (_.isEmpty(el)) {
        sorted.push(el);
      } else {
        sorted.unshift(el);
      }
    });

    return sorted;
  };

  reorderShortcut = (draggedShortcutId, draggedShortcut) => {
    let that = this;

    // remove from original position (draggedShortuctId is the key)
    that.shortcuts.splice(draggedShortcutId, 1);

    // add to wished position
    that.shortcuts.splice(that.key, 0, draggedShortcut);

    return that.stackShortcuts();
  };

  fillShortcut = (draggedItem) => {
    let that = this;

    // if key is inside shortcuts array
    if (that.key >= 0 && that.key <= that.shortcuts.length - 1) {
      // remove first available slot (pushes some left/right)
      that.shortcuts.splice(that.emptyIndex(), 1);

      // add to wished position
      that.shortcuts.splice(that.key, 0, that.emptyShortcut);
    }

    that.shortcuts[that.key] = draggedItem;

    return that.stackShortcuts();
  };
}
