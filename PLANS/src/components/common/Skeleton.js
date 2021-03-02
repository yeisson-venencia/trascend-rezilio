import React from "react";

import "./Skeleton.scss";

const Skeleton = (props) => {
  const {
    count = 1,
    width = null,
    height = null,
    margin = null,
    wrapper = null,
    circle = false,
  } = props;

  const elements = [];

  for (let i = 0; i < count; i++) {
    let style = {};

    if (width != null) {
      style.width = width;
    }

    if (height != null) {
      style.height = height;
    }

    if (width !== null && height !== null && circle) {
      style.borderRadius = "50%";
    }

    if (margin != null) {
      style.margin = margin;
    }

    elements.push(
      <span key={i} className="skeleton" style={style}>
        &zwnj;
      </span>
    );
  }

  const Wrapper = wrapper;

  if (elements.length > 1) {
    return (
      <span className="skeleton-wrapper">
        {Wrapper
          ? elements.map((element, i) => (
              <Wrapper key={i}>
                {element}
                &zwnj;
              </Wrapper>
            ))
          : elements}
      </span>
    );
  } else {
    return elements[0];
  }
};

export default Skeleton;
