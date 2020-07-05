import {combineReducers} from "redux";
import authReducer from "./auth-reducer";
import errorReducer from "./error-reducer";
import communityReducer from "./community-reducer";

export default combineReducers({
	auth: authReducer,
	errors: errorReducer,
	communities: communityReducer,
});
