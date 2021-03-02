import store from "../../utils/store";
import * as ACTION_TYPES from "../actions/action_types";

let initialState = {
  is_authenticated: false,
  profile: null,
};

if (store.get("id_token") !== null) {
  initialState = {
    is_authenticated: true,
    profile: JSON.parse(store.get("profile")),
  };
}

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        is_authenticated: true,
      };
    case ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        is_authenticated: false,
      };
    case ACTION_TYPES.ADD_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case ACTION_TYPES.REMOVE_PROFILE:
      return {
        ...state,
        profile: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
