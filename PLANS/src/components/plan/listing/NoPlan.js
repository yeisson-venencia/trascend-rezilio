import React from "react";
import { FormattedMessage } from "react-intl";
import "./NoPlan.scss";

class NoPlan extends React.Component {
  render() {
    return (
      <div className="no-plan">
        <FormattedMessage id="plans.no_plan.line1" />
        <div className="hidden-mobile">
          <FormattedMessage id="plans.no_plan.line2" />
        </div>
        <div className="image"></div>
      </div>
    );
  }
}

export default NoPlan;
