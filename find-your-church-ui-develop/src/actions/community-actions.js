import {
	ACTIVATE_COMMUNITY,
	DEACTIVATE_COMMUNITY,
	DELETE_COMMUNITY,
	MESSAGE_FROM_API,
	RESET_MESSAGES,
	GET_MY_COMMUNITIES,
	SET_BILLING_INFO,
	SET_STT_HIDE,
	PICK_COMMUNITY,
	SET_STT_SET_CARD,
	CLEAR_LAST_INVOICE,
	SEARCH_CRITERIA,
	COUPON_VERIFIED,
	SET_SEARCH_FILTER,
	SET_SEARCH_RESULTS,
	DEACTIVATING,
	ACTIVATING,
	SHOW_ACT_DLG,
	ACTIVE_STATUS,
	SORT_ORDER,
	SET_PICKING,
	VIEW_COMMUNITY,
	GET_PLAN,
	CLEAR_FILTER_MASK,
	SEARCHING,
	SET_BACK_URL,
	ACTIVATE_MULTI_COMMUNITY,
	PICK_MULTI_COMMUNITY,
	DEACTIVATE_MULTI_COMMUNITY,
	DELETE_MULTI_COMMUNITY,
	CLEAR_COUPON_STATUS,
} from "./action-types";
import axios from "axios";
import app_config from "../conf/config";

/**
 * Send 2nd step info with 1st step info to BE via axios.
 * When succeed, remove 1st step info in global state.
 *
 * @param is_new new or edit?
 * @param owner_id email of user who create new community.
 * @param community_id
 * @param info_1 base information on 1st form.
 * @param info_2 filters specified on 2nd form.
 * @param history
 * @returns {function(...[*]=)}
 */
export const createCommunityStep = (is_new, owner_id, community_id, info_1, info_2, history) => dispatch => {
	const info = {
		is_new: is_new,
		community_id: community_id,
		data: {
			owner_id: owner_id,
			...info_1,
			...info_2,
		}
	};

	axios
		.post(app_config.FYC_API_URL + "/api/communities/create", info)
		.then(res => {
			//if(is_new)
			dispatch({
				type: RESET_MESSAGES,
				payload: null
			});
			return history.push("/dashboard/admin");
		})
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

/**
 *
 * @param owner_id
 * @param activated
 * @returns {function(...[*]=)}
 */
export const getMyCommunities = (owner_id, activated = true) => dispatch => {
	// get communities list via axios.
	const info = {
		owner_id: owner_id,
		activated: activated,
	};

	axios
		.post(app_config.FYC_API_URL + "/api/communities/mine", info)
		.then((res) => {
			dispatch({
				type: RESET_MESSAGES,
				payload: null
			});
			return dispatch({
				type: GET_MY_COMMUNITIES,
				payload: res.data,
			})
		})
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response !== undefined ? err.response.data : {msg_community: "Unknown error"},
			})
		);
};

/**
 *
 * @param info
 * @returns {function(...[*]=)}
 */
export const registerCard = (info) => dispatch => {
	dispatch({
		type: SET_STT_SET_CARD,
		payload: true,
	});
	axios
		.post(app_config.FYC_API_URL + "/api/communities/setcard", info)
		.then(res => {
			dispatch({
				type: SET_BILLING_INFO,
				payload: res.data,
			});
			dispatch({
				type: SET_STT_SET_CARD,
				payload: false,
			});
		})
		.catch(err => {
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			});
			dispatch({
				type: SET_STT_SET_CARD,
				payload: false,
			});
		});
};

export const pickCommunity = (info) => dispatch => {
	dispatch({
		type: PICK_COMMUNITY,
		payload: info.community_id,
	});
};

export const pickMultiCommunity = (info) => dispatch => {
	dispatch({
		type: PICK_MULTI_COMMUNITY,
		payload: info.community_ids,
	});
};

export const clearLastInvoice = () => dispatch => {
	dispatch({
		type: CLEAR_LAST_INVOICE,
		payload: {},
	});
};

/**
 *
 * @param info
 * @returns {function(...[*]=)}
 */
export const activateCommunity = (info) => dispatch => {
	dispatch({
		type: ACTIVATING,
		payload: true,
	});
	dispatch({
		type: ACTIVE_STATUS,
		payload: 0,
	});
	axios
			.post(app_config.FYC_API_URL + "/api/communities/activate", info)
			.then(res => {
				dispatch({
					type: ACTIVATE_COMMUNITY,
					payload: info.community_id,
				});
				dispatch({
					type: SET_BILLING_INFO,
					payload: res.data,
				});
				getBillingStatus({user_id: info.id});
				dispatch({
					type: ACTIVE_STATUS,
					payload: 1,
				});
				dispatch({
					type: ACTIVATING,
					payload: false,
				});

				setTimeout(() => dispatch({
					type: SHOW_ACT_DLG,
					payload: false,
				}), 2000);
			})
			.catch(err => {
				dispatch({
					type: MESSAGE_FROM_API,
					payload: err.response !== undefined ? err.response.data : {errors: ""}
				});
				dispatch({
					type: ACTIVE_STATUS,
					payload: 2,
				});
				dispatch({
					type: ACTIVATING,
					payload: false,
				});

				setTimeout(() => dispatch({
					type: SHOW_ACT_DLG,
					payload: false,
				}), 2000);
			});
};

/**
 *
 * @param info
 * @returns {function(...[*]=)}
 */
export const activateMultiCommunity = (info) => dispatch => {
	dispatch({
		type: ACTIVATING,
		payload: true,
	});
	dispatch({
		type: ACTIVE_STATUS,
		payload: 0,
	});
	axios
			.post(app_config.FYC_API_URL + "/api/communities/activatemulti", info)
			.then(res => {
				dispatch({
					type: ACTIVATE_MULTI_COMMUNITY,
					payload: info.community_ids,
				});
				dispatch({
					type: PICK_MULTI_COMMUNITY,
					payload: [],
				});
				dispatch({
					type: SET_BILLING_INFO,
					payload: res.data,
				});
				getBillingStatus({user_id: info.id});
				dispatch({
					type: ACTIVE_STATUS,
					payload: 1,
				});
				dispatch({
					type: ACTIVATING,
					payload: false,
				});

				setTimeout(() => dispatch({
					type: SHOW_ACT_DLG,
					payload: false,
				}), 2000);
			})
			.catch(err => {
				dispatch({
					type: MESSAGE_FROM_API,
					payload: err.response !== undefined ? err.response.data : {errors: ""}
				});
				dispatch({
					type: ACTIVE_STATUS,
					payload: 2,
				});
				dispatch({
					type: ACTIVATING,
					payload: false,
				});

				setTimeout(() => dispatch({
					type: SHOW_ACT_DLG,
					payload: false,
				}), 2000);
			});
};

export const clearActiveStatus = () => dispatch => {
	dispatch({
		type: ACTIVE_STATUS,
		payload: 0,
	});
};

/**
 *
 * @param info
 * @returns {function(...[*]=)}
 */
export const deactivateCommunity = (info) => dispatch => {
	dispatch({
		type: DEACTIVATING,
		payload: true,
	});
	axios
			.post(app_config.FYC_API_URL + "/api/communities/deactivate", info)
			.then(res => {
				dispatch({
					type: DEACTIVATE_COMMUNITY,
					payload: info.community_id,
				});
				dispatch({
					type: SET_BILLING_INFO,
					payload: res.data,
				});
				getBillingStatus({user_id: info.id});
				dispatch({
					type: DEACTIVATING,
					payload: false,
				});
			})
			.catch(err => {
				dispatch({
					type: MESSAGE_FROM_API,
					payload: err.response !== undefined ? err.response.data : {errors: ""}
				});
				dispatch({
					type: SET_STT_HIDE,
					payload: {},
				});
			});
	dispatch({
		type: ACTIVE_STATUS,
		payload: 0,
	});
};

export const deactivateMultiCommunity = (info) => dispatch => {
	dispatch({
		type: DEACTIVATING,
		payload: true,
	});
	axios
			.post(app_config.FYC_API_URL + "/api/communities/deactivatemulti", info)
			.then(res => {
				dispatch({
					type: DEACTIVATE_MULTI_COMMUNITY,
					payload: info.community_ids,
				});
				dispatch({
					type: SET_BILLING_INFO,
					payload: res.data,
				});
				getBillingStatus({user_id: info.id});
				dispatch({
					type: DEACTIVATING,
					payload: false,
				});
			})
			.catch(err => {
				dispatch({
					type: MESSAGE_FROM_API,
					payload: err.response !== undefined ? err.response.data : {errors: ""}
				});
				dispatch({
					type: SET_STT_HIDE,
					payload: {},
				});
			});
	dispatch({
		type: ACTIVE_STATUS,
		payload: 0,
	});
};

/**
 *
 * @param info
 * @param history
 * @returns {function(...[*]=)}
 */
export const deleteCommunity = (info, history) => dispatch => {
	axios
			.post(app_config.FYC_API_URL + "/api/communities/delete", info)
			.then(res => {
				dispatch({
					type: DELETE_COMMUNITY,
					payload: info.community_id,
				});
			})
			.catch(err =>
					dispatch({
						type: MESSAGE_FROM_API,
						payload: err.response !== undefined ? err.response.data : {errors: ""}
					})
			);
};

export const deleteMultiCommunity = (info, history) => dispatch => {
	axios
			.post(app_config.FYC_API_URL + "/api/communities/deletemulti", info)
			.then(res => {
				dispatch({
					type: DELETE_MULTI_COMMUNITY,
					payload: info.community_ids,
				});
			})
			.catch(err =>
					dispatch({
						type: MESSAGE_FROM_API,
						payload: err.response !== undefined ? err.response.data : {errors: ""}
					})
			);
};

export const getBillingStatus = (info, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/stripe/getstatus", info)
		.then(res => {
			dispatch({
				type: SET_BILLING_INFO,
				payload: res.data,
			});
		})
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

/**
 *
 * @returns {function(...[*]=)}
 */
export const showActivateDlg = () => dispatch => {
	dispatch({
		type: SHOW_ACT_DLG,
		payload: true,
	});
};

export const hideActivateDlg = () => dispatch => {
	dispatch({
		type: SHOW_ACT_DLG,
		payload: false,
	});
};

// info = {code: 'coupon_id'}
export const verifyCoupon = (info) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/stripe/verifycoupon", info)
		.then(res => {
			// console.log(res.data);
			dispatch({
				type: COUPON_VERIFIED,
				payload: res.data, // {verified = true, name, amount_off, percent_off}
			});
		})
		.catch(err => {
			dispatch({
				type: COUPON_VERIFIED,
				payload: err.response.data, // {verified = false, message}
			});
		});
};

export const clearCouponStatus = (only_message = true) => dispatch => {
	dispatch({
		type: CLEAR_COUPON_STATUS,
		payload: only_message,
	});
};

export const getPlan = () => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/stripe/getplan", {})
		.then(res => {
			dispatch({
				type: GET_PLAN,
				payload: {
					plan_price: res.data.amount,
					trial_period_days: res.data.trial_period_days,
				},
			});
		})
		.catch(err => {
			// nothing to here
		});
};

/**
 * set my position for searching the communities
 *
 * @param info
 * @returns {function(*): *}
 */
export const setSearchCriteria = (info) => dispatch => {
	return dispatch({
		type: SEARCH_CRITERIA,
		payload: info,
	});
};

/**
 *
 * @param info Object{key: value}
 * @returns {function(*): *}
 */
export const setSearchFilter = (info) => dispatch => {
	return dispatch({
		type: SET_SEARCH_FILTER,
		payload: info,
	});
};

export const doSearchCommunities = (criteria) => dispatch => {
	dispatch({
		type: SEARCHING,
		payload: true,
	});

	axios
		.post(app_config.FYC_API_URL + "/api/pub/search", criteria)
		.then(res => {
			dispatch({
				type: SET_SEARCH_RESULTS,
				payload: res.data,
			});

			dispatch({
				type: SEARCHING,
				payload: false,
			});
		})
		.catch(err => {
			dispatch({
				type: SET_SEARCH_RESULTS,
				payload: [],
			});

			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response !== undefined ? err.response.data : {msg_search: "Unknown error"}
			});

			dispatch({
				type: SEARCHING,
				payload: false,
			});
		});
};

export const setSortOrder = (sorter) => dispatch => {
	return dispatch({
		type: SORT_ORDER,
		payload: sorter,
	});
};

export const setPicking = (index) => dispatch => {
	return dispatch({
		type: SET_PICKING,
		payload: index,
	});
};

export const clearPicking = () => dispatch => {
	return dispatch({
		type: SET_PICKING,
		payload: -1,
	});
};

export const shareCommunity = (info) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/pub/sharecommunity", info)
		.then(res => {
		})
		.catch(err => {
				dispatch({
					type: MESSAGE_FROM_API,
					payload: err.response !== undefined ? err.response.data : {msg_search: "Unknown error"}
				});
			}
		);
};

export const reportCommunity = (info) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/pub/reportcommunity", info)
		.then(res => {
		})
		.catch(err => {
				dispatch({
					type: MESSAGE_FROM_API,
					payload: err.response !== undefined ? err.response.data : {msg_search: "Unknown error"}
				});
			}
		);
};

export const viewCommunity = (info) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/pub/viewCommunity", info)
		.then(res => {
			dispatch({
				type: VIEW_COMMUNITY,
				payload: res.data,
			});
		})
		.catch(err => {
				dispatch({
					type: MESSAGE_FROM_API,
					payload: err.response !== undefined ? err.response.data : {msg_search: "Unknown error"}
				});
			}
		);
};

export const clearFilterMask = (key, i) => dispatch => {
	dispatch({
		type: CLEAR_FILTER_MASK,
		payload: {key: key, index: i},
	});
};

export const setBackUrl = (url) => dispatch => {
	dispatch({
		type: SET_BACK_URL,
		payload: url,
	});
};
