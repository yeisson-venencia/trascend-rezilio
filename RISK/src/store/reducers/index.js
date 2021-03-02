import AuthReducer from "./auth";
import UserReducer from "./user";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
	auth: AuthReducer,
	user: UserReducer,
});

export default rootReducer;
