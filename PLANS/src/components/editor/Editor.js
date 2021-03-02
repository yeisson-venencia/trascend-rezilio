import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import ApiService from "../../utils/ApiService";
import { endpoint } from "../../utils/UrlService";
import cs from "classnames";

import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "./Editor.scss";

// SEE DOCS https://froala.com/wysiwyg-editor/docs/framework-plugins/react/
import FroalaEditor from "react-froala-wysiwyg";
import "@fortawesome/fontawesome-free/js/all.js";

// Import a language file.
import "froala-editor/js/languages/en_ca.js";
import "froala-editor/js/languages/fr.js";

// list of available plugins
// Align
import "froala-editor/js/plugins/align.min.js";

// Char Counter
import "froala-editor/js/plugins/char_counter.min.js";
import "froala-editor/css/plugins/char_counter.min.css";

// Code Beautifier
import "froala-editor/js/plugins/code_beautifier.min.js";

// Code View
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/css/plugins/code_view.min.css";

// Colors
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/css/plugins/colors.min.css";

// Draggable
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/css/plugins/draggable.min.css";

// Embedly
import "froala-editor/js/third_party/embedly.min.js";
import "froala-editor/css/third_party/embedly.min.css";

// Emoticons
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/css/plugins/emoticons.min.css";

// Entities
import "froala-editor/js/plugins/entities.min.js";

// File
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/css/plugins/file.min.css";

// Font Awesome
//import "froala-editor/js/plugins/font_awesome.min.js";

// Font Family
//import "froala-editor/js/plugins/font_family.min.js";

// Font Size
import "froala-editor/js/plugins/font_size.min.js";

// Fullscreen
import "froala-editor/js/plugins/fullscreen.min.js";
import "froala-editor/css/plugins/fullscreen.min.css";

// Help
import "froala-editor/js/plugins/help.min.js";
import "froala-editor/css/plugins/help.min.css";

// Image
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/css/plugins/image.min.css";

// Image Manager
import "froala-editor/js/plugins/image_manager.min.js";
import "froala-editor/css/plugins/image_manager.min.css";

// Image Tui
import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/css/third_party/image_tui.min.css";

// Inline Class
import "froala-editor/js/plugins/inline_class.min.js";

// Inline Style
import "froala-editor/js/plugins/inline_style.min.js";

// Line Breaker
import "froala-editor/js/plugins/line_breaker.min.js";
import "froala-editor/css/plugins/line_breaker.min.css";

// Line Height
import "froala-editor/js/plugins/line_height.min.js";

// Link
import "froala-editor/js/plugins/link.min.js";

// Lists
import "froala-editor/js/plugins/lists.min.js";

// Paragraph Format
import "froala-editor/js/plugins/paragraph_format.min.js";

// Paragraph Style
import "froala-editor/js/plugins/paragraph_style.min.js";

// Print
import "froala-editor/js/plugins/print.min.js";

// Quick Insert
import "froala-editor/js/plugins/quick_insert.min.js";
import "froala-editor/css/plugins/quick_insert.min.css";

// Quote
import "froala-editor/js/plugins/quote.min.js";

// Save
import "froala-editor/js/plugins/save.min.js";

// Special Characters
import "froala-editor/js/plugins/special_characters.min.js";
import "froala-editor/css/plugins/special_characters.min.css";

// Spell Checker
//import "froala-editor/js/third_party/spell_checker.min.js";
//import "froala-editor/css/plugins/spell_checker.min.css";

// Table
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/css/plugins/table.min.css";

// Url
import "froala-editor/js/plugins/url.min.js";

// Video
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/css/plugins/video.min.css";

// Word Paste
//import "froala-editor/js/plugins/word_paste.min.js";

const Api = new ApiService();

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideLoader: false,
      planId: props.planId,
      model: props.model,
      config: undefined,
    };
  }

  componentDidMount = () => {
    this.fetchS3config();
  };

  fetchS3config = () => {
    // do API call to get s3 upload config
    Api.initAuth(this.props.history);
    Api.get(
      endpoint("uploadConfig", [
        this.state.planId,
        60 * 60 * 24, // s3 policy is valid for 24h
      ])
    ).then((res) => {
      if (res.status === "success") {
        this.createConfig(res.data);
      }
    });
  };

  createConfig = (s3) => {
    const { intl } = this.props;
    const that = this;

    const config = {
      key: window.appConfig.FROALA_KEY,
      //iconsTemplate: "font_awesome_5",
      language: intl.formatMessage({
        id: "lang", // doesnt work
      }),
      // Note the height is quite buggy so maybe for the future
      // this way may require a change
      height: this.state.height - 100,
      heightMin: this.state.height - 100,
      heightMax: this.state.height - 100,
      placeholderText: intl.formatMessage({
        id: "editor.placeholderText",
      }),
      charCounterCount: false,
      attribution: false,
      linkAlwaysBlank: true,
      fontSizeSelection: false,
      fontSizeDefaultSelection: "14",
      fontSizeUnit: "px",
      inlineMode: false,
      pastePlain: true,

      "editor.placeholderText": " ",
      paragraphFormat: {
        N: intl.formatMessage({
          id: "editor.format.normal",
        }),
        h1: intl.formatMessage({
          id: "editor.format.h1",
        }),
        h2: intl.formatMessage({
          id: "editor.format.h2",
        }),
        h3: intl.formatMessage({
          id: "editor.format.h3",
        }),
        h4: intl.formatMessage({
          id: "editor.format.h4",
        }),
        h5: intl.formatMessage({
          id: "editor.format.h5",
        }),
        h6: intl.formatMessage({
          id: "editor.format.h6",
        }),
        PRE: intl.formatMessage({
          id: "editor.format.code",
        }),
      },
      toolbarButtons: {
        moreText: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "strikeThrough",
            "subscript",
            "superscript",
            //"fontFamily",
            //"fontSize",
            "textColor",
            "backgroundColor",
            //"inlineClass",
            //"inlineStyle",
            "clearFormatting",
          ],
          align: "left",
          buttonsVisible: 3,
        },
        moreParagraph: {
          buttons: [
            "alignLeft",
            "paragraphFormat",
            "paragraphStyle",
            "alignCenter",
            "alignRight",
            "alignJustify",
            "formatOLSimple",
            "formatOL",
            "formatUL",
            //"outdent", //see bug https://github.com/froala/wysiwyg-editor/issues/4089
            //"indent",
            "quote",
          ],
          align: "left",
          buttonsVisible: 3,
        },
        moreRich: {
          buttons: [
            "insertLink",
            "insertImage",
            "insertVideo",
            "insertTable",
            "emoticons",
            "specialCharacters",
            "insertFile",
            "insertHR",
          ],
          align: "left",
          buttonsVisible: 3,
        },
        moreMisc: {
          buttons: ["undo", "redo", "fullscreen", "print", "selectAll", "html"],
          align: "right",
          buttonsVisible: 3,
        },
      },
      pluginsEnabled: [
        "align",
        "codeBeautifier",
        "codeView",
        "colors",
        "embedly",
        "emoticons",
        "file",
        //"fontFamily",
        "fontSize",
        "fullscreen",
        "image",
        "inlineClass",
        "inlineStyle",
        "link",
        "lists",
        "paragraphFormat",
        "paragraphStyle",
        "print",
        "quote",
        "specialCharacters",
        "table",
        "video",
      ],

      fileUploadToS3: {
        bucket: "",
        region: s3.bucket + ".s3." + s3.region,
        keyStart: s3.keyStart,
        params: {
          acl: s3.acl,
          AWSAccessKeyId: s3.accessKeyId,
          Policy: s3.policy,
          signature: s3.signature,
        },
      },

      imageUploadToS3: {
        bucket: "",
        region: s3.bucket + ".s3." + s3.region,
        keyStart: s3.keyStart,
        params: {
          acl: s3.acl,
          AWSAccessKeyId: s3.accessKeyId,
          Policy: s3.policy,
          signature: s3.signature,
        },
      },

      fileMaxSize: 100 * 1024 * 1024, // Set max file size to 20MB.
      fileAllowedTypes: [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "video/avi",
        "video/x-ms-wmv",
        "video/mp4",
        "video/mpeg",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "text/csv",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
      ],

      imageMaxSize: 100 * 1024 * 1024, // Set max image size to 5MB.
      imageAllowedTypes: ["jpg", "jpeg", "png", "gif"],
      events: {
        initialized: function () {
          that.setState({
            hideLoader: true,
          });
        },
        "image.uploadedToS3": function (link, key, response) {
          let url = s3.cdn + key.substring(key.lastIndexOf("/") + 1);

          this.image.insert(url, false, null, this.image.get(), response);
          return false;
        },
        "file.uploadedToS3": function (link, key, response) {
          let url = s3.cdn + key.substring(key.lastIndexOf("/") + 1);
          let filename = key.substring(key.indexOf("-") + 1);

          this.file.insert(url, filename, { link: url });
          return false;
        },
        "image.error": function (error, response) {
          console.log(error);
        },
        "file.error": function (error, response) {
          console.log(error);
        },
      },
    };

    // save config and change editor id to re-render (and init editor with new config)
    this.setState({
      id: Math.random(),
      config: config,
    });
  };

  refCallback = (element) => {
    if (element !== null) {
      let obj = element.getBoundingClientRect();

      if (obj !== undefined && obj.height !== undefined) {
        this.setState({
          height: obj.height,
        });
      }
    }
  };

  // called every time model has changed
  // usefull for save, autosave and etc.
  handleModelChange = (model) => {
    this.setState({
      model: model,
    });

    if (this.props.onChange) {
      this.props.onChange(model);
    }
  };

  createMarkup = () => {
    return { __html: this.state.model };
  };

  render() {
    const { model, height, config, id } = this.state;

    return (
      <React.Fragment>
        <div
          className={cs("editor-loader", { loaded: this.state.hideLoader })}
          ref={this.refCallback}
        >
          <div className="toolbar" />
          <div dangerouslySetInnerHTML={this.createMarkup()}></div>
        </div>
        {height !== undefined && config !== undefined ? (
          <FroalaEditor
            key={id}
            tag="div"
            model={model}
            onModelChange={this.handleModelChange}
            config={config}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

Editor.propTypes = {
  model: PropTypes.string.isRequired, // html / text string loaded in the editor
};

export default withRouter(injectIntl(Editor));
