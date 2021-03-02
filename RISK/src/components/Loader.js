import React from "react";
import "../css/Loader.scss";

class Loader extends React.Component {
  render() {
    if (this.props.wrapper === true) {
      return (
        <div className="loader-wrapper">
          <div className="loader" />
        </div>
      );
    }

    return <div className="loader"></div>;
  }
}

export default Loader;
