import React from "react";
import Skeleton from "../../common/Skeleton";
import _ from "lodash";
import "./DescriptionLoader.scss";

const DescriptionLoader = (props) => {
  return (
    <div className="description-loader">
      <Paragraph />
      <Paragraph />
      <Paragraph />
    </div>
  );
};

const Word = () => {
  const random = [20, 30, 50, 80, 100, 130];

  return (
    <Skeleton width={_.sample(random)} height="16px" margin="0px 5px 5px 0px" />
  );
};

const Paragraph = () => {
  const random = [15, 30, 60];

  let words = _.sample(random),
    paragraph = [];

  for (let i = 0; i < words; i++) {
    paragraph.push(<Word key={i} />);
  }

  return <div className="paragraph">{paragraph}</div>;
};

export default DescriptionLoader;
