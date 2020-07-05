import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import community_config from "../conf/community-conf";
import {clearFilterMask} from "../actions/community-actions";

class SelectedFilters extends Component{
	clearFilterValue = (key, i) => {
		this.props.clearFilterMask(key, i);
		this.props.handleRefresh(key, i);
	};

	render(){
		const filter_keys = Object.keys(community_config.FILTERS);
		return (
			<>
				{filter_keys.map(key => {
					if(key === "average_attendance")
						return null;

					if(this.props.filter[key] === undefined)
						return null;

					const key_value = this.props.filter[key].split("");
					const criteria_value = this.props.community.criteria.filter[key].split("");
					return key_value.map((val, i) => {
						if(val === "1" && criteria_value[i] === "1"){
							return (
								<div className={"selected-filter-item"} key={`filter_val_${key}_${i}`}>
									{community_config.FILTERS[key][i]}
									{this.props.handleRefresh ? (
										<>
											&nbsp;&nbsp;&nbsp;&nbsp;
											<i className={"far fa-times-circle"}
											   style={{cursor: "pointer", color: "#333"}}
											   onClick={() => this.clearFilterValue(key, i)}/>
										</>
									) : null}
								</div>
							);
						}
						return null;
					});
				})}
			</>
		);
	}
}

SelectedFilters.propTypes = {
	errors: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	clearFilterMask: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors,
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{clearFilterMask}
)(SelectedFilters);
