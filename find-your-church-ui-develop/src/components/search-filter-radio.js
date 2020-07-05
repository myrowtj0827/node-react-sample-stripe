import React, {Component} from "react";
import community_config from "../conf/community-conf";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class SearchFilterRadio extends Component{
	constructor(props){
		super(props);

		this.max_length = this.props.value.length;

		this.checks = this.props.value.split("");

		this.state = {
			collapsed: props.collapsed || true,
		};

		this.toggleCollapse = this.toggleCollapse.bind(this);
	}

	toggleCollapse(){
		this.setState({collapsed: !this.state.collapsed});
	}

	onClearCheck = e => {
		const new_value = "0".repeat(this.props.items.length);
		this.checks = new_value.split("");
		this.props.send(new_value);
	};

	onCheck = e => {
		const new_value = "0".repeat(e.target.value) + '1' + "0".repeat(this.props.items.length - e.target.value - 1);
		this.checks = new_value.split("");
		this.props.send(new_value);
	};

	render(){
		return this.props.send ? (
				<div className="filter-div">
					<div className={"flexdiv-left labels"} onClick={this.toggleCollapse}>
						<label className={"filter-label" + (this.state.collapsed ? " collapsed" : "")}
							  >{this.props.filterTitle}</label>
					</div>
					{
						this.state.collapsed ? null : (
							<>
								<label className="filter-option">Any
									<input type="radio"
										   name={this.props.filterName} onClick={this.onClearCheck}
									/>
									<span className="filter-radiomark"> </span>
								</label>
								{this.props.items.map((item, index) => {
									const count = this.props.community.counts[this.props.filterName] ? this.props.community.counts[this.props.filterName][index] : 0;
									const checked = this.props.community.criteria.filter[this.props.filterName].split("")[index] === "1";
									return (
										<label className={"filter-option" + (count === 0 ? " disabled" : "")}
											   key={this.props.filterName + index}>{item}
											<input type="radio" id={this.props.filterName + "[" + index + "]"}
												   name={this.props.filterName} value={index} onClick={this.onCheck}
												   defaultChecked={this.checks[index] === '1'}
												   disabled={count === 0}
												   checked={checked}
											/>
											<span
												className={"filter-radiomark" + (count === 0 ? " disabled" : "")}> </span>
											&nbsp;
											{count > 0 ? <>({count})</> : null}
										</label>
									)
								})}
							</>
						)
					}
				</div>
			)
			: (
				<div className={"view-filter w3-row"}>
					<div className={"filter-title w3-col s4"}>{this.props.filterTitle}</div>
					<div className={"filter-value w3-col s8"}>
						{this.props.items.map((item, index) => {
							return this.checks[index] === '1' ? (
									<span className={"filter-value-item"} key={this.props.filterName + "radio" + index}>
									{community_config.FILTERS[this.props.filterName][index]}
									</span>
								)
								: null;
						})}
					</div>
				</div>
			)
	}
}

SearchFilterRadio.propTypes = {
	community: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{}
)(SearchFilterRadio);
