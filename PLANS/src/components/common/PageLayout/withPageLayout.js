import React, { Component } from "react";
import "./PageLayout.scss";

function withPageLayout(WrappedComponent) {
  return class withPageLayout extends Component {
    constructor(props) {
      super(props);
      this.el = document.createElement("div");
    }

    render() {
      return (
        <div className="page-layout">
          <div className="container-fluid">
            <div className="col-12 col-lg-10 offset-lg-1">
              <WrappedComponent {...this.props} />
            </div>
          </div>
        </div>
      );
    }
  };
}

export default withPageLayout;
