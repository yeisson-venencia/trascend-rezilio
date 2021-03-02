import React from "react";

class PlanViewCompact extends React.Component {
  render() {
    return (
      <div className="container max">
        <div className="coll-compact">{this.props.collection}</div>
      </div>
    );
  }
}

export default PlanViewCompact;
