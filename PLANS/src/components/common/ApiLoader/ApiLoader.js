import React from "react";
import Overlay from "../Overlay";
import "./ApiLoader.scss";

const ApiLoader = () => {
  return (
    <>
      <Overlay />
      <div className="api-loader-wrapper">
        <div className="api-loader">
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default ApiLoader;
