import {MESSAGE_FROM_API, RESET_MESSAGES} from "../actions/action-types";

const initialState = {};
export default function(state = initialState, action){
	switch(action.type){
		case MESSAGE_FROM_API:
			return action.payload;
		case RESET_MESSAGES:
			return {};
		default:
			return state;
	}
}
