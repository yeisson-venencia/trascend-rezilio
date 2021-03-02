import React from "react";
import "./PlanRow.scss";

class PlanGroup extends React.Component {
  render() {
    return (
      <tr className="plan-group">
        <td colSpan="4" className="title">
          {this.props.value}
        </td>
      </tr>
    );
  }
}

export default PlanGroup;
