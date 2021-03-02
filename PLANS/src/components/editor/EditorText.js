import React from "react";

import "froala-editor/css/froala_editor.pkgd.min.css";
import "./EditorDiff.scss";
import "./EditorText.scss";

const EditorText = (props) => {
  return (
    <div
      className="editor-text html-diff fr-element fr-view"
      dangerouslySetInnerHTML={props.content}
    ></div>
  );
};

export default EditorText;
