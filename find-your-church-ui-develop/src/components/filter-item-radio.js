import React, {Component} from "react";
import community_config from "../conf/community-conf";

class FilterItemRadio extends Component{
	constructor(props){
		super(props);

		this.checks = this.props.value === undefined ?
			"0".repeat(community_config.FILTERS[this.props.filterName].length).split("")
			: this.props.value.split("");

		this.state = {
			collapsed: props.collapsed || false,
			is_empty: true,
		};

		this.toggleCollapse = this.toggleCollapse.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevProps.collapsed !== this.props.collapsed){
			this.setState({collapsed: this.props.collapsed});
		}
	}

	toggleCollapse(){
		this.setState({collapsed: !this.state.collapsed});
	}

	onCheck = e => {
		const new_value = "0".repeat(e.target.value) + '1' + "0".repeat(this.props.items.length - e.target.value - 1);
		this.checks = new_value.split("");
		this.props.send(new_value);
	};

	componentDidMount(){
		if(!this.props.send){
			for(let i = 0; i < this.props.items.length; i++){
				if(this.checks[i] === '1'){
					this.setState({is_empty: false});
				}
			}
		}
	}

	render(){
		return this.props.send ?
			(
				<div className="filter-div">
					<div className={"flexdiv-left labels"} onClick={this.toggleCollapse} style={{height: this.state.collapsed ? "40px" : "32px", padding: this.state.collapsed ? "10px 0" : "10px 0 5px", cursor: "pointer"}}>
						<label className={"filter-label" + (this.state.collapsed ? " collapsed" : "")}
						>{this.props.filterTitle}</label>
					</div>
					{
						this.state.collapsed ? null :
							this.props.items.map((item, index) => {
								return (
									<label className="filter-option" key={this.props.filterName + index}>{item}
										<input type="radio" id={this.props.filterName + "[" + index + "]"}
											   name={this.props.filterName} value={index} onClick={this.onCheck}
											   defaultChecked={this.checks[index] === '1'}
										/>
										<span className="filter-radiomark"> </span>
									</label>
								)
							})
					}
				</div>
			)
			: (
				<div className={"view-filter w3-row"} style={{display: this.state.is_empty ? "none" : "block"}}>
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

export default FilterItemRadio;
