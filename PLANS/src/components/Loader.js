import React from "react";
import "./Loader.scss";
import cs from "classnames";

class Loader extends React.Component {
  render() {
    if (this.props.wrapper === true) {
      return (
        <div className={cs("loader-wrapper", this.props.classNam)}>
          <div className="loader" />
        </div>
      );
    }

    return <div className={cs("loader", this.props.className)}></div>;
  }
}

export default Loader;
