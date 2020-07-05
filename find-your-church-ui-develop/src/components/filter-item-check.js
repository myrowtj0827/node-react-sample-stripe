import React, {Component} from "react";
import community_config from "../conf/community-conf";

class FilterItemCheck extends Component{
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
		if(this.props.filterName === 'ages'){
			if(parseInt(e.target.value) === 0){
				const new_value = (e.target.checked ? '1' : '0') + "0".repeat(this.props.items.length - 1);
				this.checks = new_value.split("");
				this.props.send(new_value);
			}
			else if(parseInt(e.target.value) !== 0){
				this.checks[0] = '0';
				this.checks[e.target.value] = e.target.checked ? '1' : '0';
				this.props.send(this.checks.join(""));
			}
		}
		else{
			this.checks[e.target.value] = e.target.checked ? '1' : '0';
			this.props.send(this.checks.join(""));
		}
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
										<input type="checkbox" id={this.props.filterName + "[" + index + "]"}
											   value={index} onClick={this.onCheck} onChange={this.onCheck}
											   checked={this.checks[index] === '1'}
										/>
										<span className="filter-checkmark"
											  key={this.props.filterName + "check" + index}> </span>
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
									<span className={"filter-value-item"} key={this.props.filterName + "check" + index}>
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

export default FilterItemCheck;
