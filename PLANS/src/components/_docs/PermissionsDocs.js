import React from "react";
import { connect } from "react-redux";
import Permission from "../../utils/Permission";
import { checkPermission, getRole } from "../../utils/PermissionService";

class PermissionsDocs extends React.Component {
  componentDidMount() {
    console.log(this.props.profile);

    if (checkPermission(this.props.profile, window.const.DRAFT_UPDATE)) {
      console.log("I have permissions for DRAFT_UPDATE");
    }

    if (checkPermission(this.props.profile, window.const.DRAFT_UPDATE)) {
      console.log("I have permissions for DRAFT_UPDATE");
    } else {
      console.log("I don't have permissions for DRAFT_UPDATE");
    }

    console.log("I am " + getRole(this.props.profile) + " role");
  }

  render() {
    return (
      <div>
        <h1>Permissions & roles components</h1>
        <p>You have role/roles {this.props.profile.role}</p>
        <div>See console.log</div>

        <div>This content is available to anyone</div>

        <Permission allow={[window.const.PLAN_READ]}>
          <div>
            This content is available when you have PLAN_READ permission
          </div>
        </Permission>

        <Permission allow={[window.const.DRAFT_UPDATE]}>
          <div>
            This content is available when you have DRAFT_UPDATE permission
          </div>
        </Permission>

        <Permission
          and={[window.const.DRAFT_UPDATE, window.const.DRAFT_DELETE]}
        >
          <div>
            This content is available when you have DRAFT_UPDATE and
            DRAFT_DELETE
          </div>
        </Permission>

        <Permission or={[window.const.DRAFT_UPDATE, window.const.DRAFT_DELETE]}>
          <div>
            This content is available when you have DRAFT_UPDATE or DRAFT_DELETE
          </div>
        </Permission>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps)(PermissionsDocs);
