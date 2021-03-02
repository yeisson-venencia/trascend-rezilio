//import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

const Permission = (props) => {
  // decide which logic to use
  let array = [],
    logic,
    ret = null;

  if (props.allow !== undefined) {
    array = props.allow;
    logic = "and";
  }

  if (props.and !== undefined) {
    array = props.and;
    logic = "and";
  }

  if (props.or !== undefined) {
    array = props.or;
    logic = "or";
  }

  let same = _.intersection(props.profile.permissions, array);

  switch (logic) {
    case "and":
      if (same.length === array.length) {
        ret = props.children;
      }
      break;

    case "or":
      if (same.length > 0 && same.length <= array.length) {
        ret = props.children;
      }
      break;

    default:
      ret = null;
  }

  return ret;
};

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(Permission);
