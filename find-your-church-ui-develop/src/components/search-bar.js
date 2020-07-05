import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from "react-places-autocomplete";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {doSearchCommunities, setSearchCriteria} from "../actions/community-actions";
import community_config, {INIT_FILTERS} from "../conf/community-conf";
import Tooltip from "rmc-tooltip";
import 'rmc-tooltip/assets/bootstrap.css';
import {getUserInfo} from "../actions/auth-actions";

class SearchBar extends Component{
	constructor(props){
		super(props);

		this.clear_obj = {
			filter: {
				...INIT_FILTERS,
			}
		};

		this.props.getUserInfo({user_id: props.auth.user.id,});

		this.state = {
			search_category: this.props.community.criteria.category,
			search_radius: this.props.community.criteria.radius,
			my_address: this.props.community.criteria.address,
			my_lat: this.props.community.criteria.lat,
			my_lng: this.props.community.criteria.lng,

			ready2go: false,

			showed_tooltip: false,
			tooltip_content: community_config.TOOL_TIPS[""],

			cats: [],
		};

		this.onChangeAddress = this.onChangeAddress.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		// if(prevProps.community.search_results !== this.props.community.search_results){
		// 	const results = this.props.community.search_results ? [...this.props.community.search_results] : [];
		// 	let cats = [];
		// 	for(let i = 0; i < results.length; i++){
		// 		const cat = results[i].data.category;
		// 		if(cats.includes(cat))
		// 			continue;
		// 		cats.push(cat);
		// 	}
		//
		// 	this.setState({cats: cats});
		// }

		if(prevProps.auth.user !== this.props.auth.user){
			if(this.props.path !== undefined){
				const params = this.props.path.split('/');
				if(params[1] === "iframe"){
					this.setState({
						my_address: this.props.auth.user.zip_code,
						my_lat: this.props.auth.user.location === undefined ? this.props.community.criteria.lat : this.props.auth.user.location.lat,
						my_lng: this.props.auth.user.location === undefined ? this.props.community.criteria.lng : this.props.auth.user.location.lng,
					});
				}
			}
		}
	}

	onChange = e => {
		if(e.target.id === 'search_radius'){
			const rad = parseInt(e.target.value);
			this.setState({[e.target.id]: rad});

			this.props.setSearchCriteria({
				radius: rad,
				...this.clear_obj,
			});

			this.props.doSearchCommunities({
				...this.props.community.criteria,
				radius: rad,
				...this.clear_obj,
			});
		}
		if(e.target.id === 'search_category'){
			this.setState({
				tooltip_content: community_config.TOOL_TIPS[e.target.value],
			});

			setTimeout(() => {
				this.setState({
					showed_tooltip: true,
				})
			}, 10);

			this.props.setSearchCriteria({
				category: e.target.value,
			});
			this.setState({[e.target.id]: e.target.value});
			this.props.setSearchCriteria({
				category: e.target.value,
				...this.clear_obj,
			});
			this.props.doSearchCommunities({
				...this.props.community.criteria,
				category: e.target.value,
				...this.clear_obj,
			});
		}
		else
			this.setState({[e.target.id]: e.target.value});
	};

	onBlurCategory = () => {
		this.setState({
			showed_tooltip: false,
		});
	};

	onChangeAddress = val => {
		this.setState({my_address: val, searchable: false});
	};

	handleSelect = address => {
		const self = this;
		// remove ", USA" from address.
		const trimmed_address = address.replace(", USA", "");
		self.setState({my_address: trimmed_address});

		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				self.setState({my_lat: latLng.lat, my_lng: latLng.lng});
				this.props.setSearchCriteria({
					address: trimmed_address,
					lat: latLng.lat,
					lng: latLng.lng,
					...this.clear_obj,
				});
				this.props.doSearchCommunities({
					...this.props.community.criteria,
					address: trimmed_address,
					lat: latLng.lat,
					lng: latLng.lng,
					...this.clear_obj,
				});
			})
			.catch(error => console.error('Error', error));
	};

	handleSearch = () => {
		// -> /search-results
		this.props.setSearchCriteria({
			category: this.state.search_category,
			radius: this.state.search_radius,
			address: this.state.my_address,
			lat: this.state.my_lat,
			lng: this.state.my_lng,
			...this.clear_obj,
		});

		this.props.doSearchCommunities({
			...this.props.community.criteria,
			category: this.state.search_category,
			radius: this.state.search_radius,
			address: this.state.my_address,
			lat: this.state.my_lat,
			lng: this.state.my_lng,
			...this.clear_obj,
		});

		// go to the search results!
		this.setState({ready2go: true});
	};

	render(){
		const searchable = !isNaN(this.state.my_lat) && !isNaN(this.state.my_lng);

		return this.state.ready2go && !this.props.init ? (
			<Redirect to={"/search-results"}/>
		) : (
			<div className="search-form-container w-form">
				<form id="search-form" name="email-form" data-name="Email Form" className="search-form">
					{this.props.showedCategory ? (
						this.props.buttonTitle === "Update" ? (
								<select id="search_category" onChange={this.onChange} onBlur={this.onBlurCategory}
												defaultValue={this.props.community.criteria.category}
												value={this.props.community.criteria.category}
												style={{
													backgroundImage: "url('/img/icon-down3-purple.svg')",
												}}
												className="search-form-dropdown w-node-5cf6ee0e50f1-ddb46e0f w-select">
									<option value="">All Communities</option>
									{
										//community_config.CATEGORIES.map(cat => {
											// return this.props.buttonTitle !== "Update" || this.state.cats.includes(cat) ? (
											// 	<option value={cat} key={"search-" + cat}>{cat}</option>
											// ) : null;
										this.props.community.categories.map(cat => {
											return  (
												<option value={cat} key={"search-" + cat}>{cat}</option>
											);
										})
									}
								</select>
							)
							: (
								<Tooltip placement={"top"}
												 overlay={this.state.tooltip_content}
												 align={{offset: [0, 2],}}
												 visible={this.state.tooltip_content === '' || this.state.tooltip_content === undefined ? false : this.state.showed_tooltip}
								>
									<select id="search_category" onChange={this.onChange} onBlur={this.onBlurCategory}
													defaultValue={this.props.community.criteria.category}
													value={this.props.community.criteria.category}
													style={{
														backgroundImage: "url('/img/icon-down3-purple.svg')",
													}}
													className="search-form-dropdown w-node-5cf6ee0e50f1-ddb46e0f w-select">
										<option value="">All Communities</option>
										{
											community_config.CATEGORIES.map(cat => {
												// return this.props.buttonTitle !== "Update" || this.state.cats.includes(cat) ? (
												// 	<option value={cat} key={"search-" + cat}>{cat}</option>
												// ) : null;
												return (
													<option value={cat} key={"search-" + cat}>{cat}</option>
												);
											})
										}
									</select>
								</Tooltip>
							)
					) : null}
					<select id="search_radius" onChange={this.onChange}
									defaultValue={isNaN(this.props.community.criteria.radius) || this.props.community.criteria.radius === null ? "" : this.props.community.criteria.radius}
									value={isNaN(this.props.community.criteria.radius) || this.props.community.criteria.radius === null ? "" : this.props.community.criteria.radius}
									style={{
										backgroundImage: "url('/img/icon-down3-purple.svg')",
									}}
									className="search-form-dropdown w-node-5cf6ee0e50f2-ddb46e0f w-select">
						<option value=''>Radius...</option>
						{
							community_config.SEARCH_RADIUS.map(r => {
								const pl = r > 1 ? "s" : "";
								return (
									<option value={r} key={"search-" + r}>within {r} mile{pl} of</option>
								);
							})
						}
					</select>
					<PlacesAutocomplete
						style={{position: "relative"}}
						value={this.state.my_address}
						onChange={this.onChangeAddress}
						onSelect={this.handleSelect}
					>
						{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
							<>
								<input className="search-form-input w-node-5cf6ee0e50f3-ddb46e0f w-input"
											 title={`Lat: ${this.state.my_lat}, Lng: ${this.state.my_lng}, ${this.state.my_address}`}
											 {...getInputProps({
												 placeholder: this.props.community.criteria.address || "Address, City or Zip Code",
											 })}
											 required=""/>
								<div className={"search-address-candidates"}>
									{loading ?
										<div
											className={"w3-container w3-white we-text-grey w3-padding-large"}>...Loading</div> : null}
									{suggestions.map((suggestion) => {
										const style = {
											color: suggestion.active ? "#ffffff" : "#254184",
											backgroundColor: suggestion.active ? "#41b6e6" : "#e6e6e6",
											backgroundImage: "url('/img/icon/icon-address-fill.svg')",
										};

										return (
											<div className={"address-item"}
													 onClick={() => alert(suggestion.terms)}
													 {...getSuggestionItemProps(suggestion, {style})}>
												{suggestion.description}
											</div>
										);
									})}
								</div>
							</>
						)}
					</PlacesAutocomplete>
					{this.props.buttonTitle === "Update" ? null : (
						<Link to={"#"}
									onClick={searchable ? this.handleSearch : null}
									className={"search-form-button w-button"}
									style={{cursor: (searchable ? "pointer" : "not-allowed")}}
						>
							{this.props.buttonTitle}
						</Link>
					)}
				</form>
				<div className="w-form-done" style={{display: "none"}}>
					<div>Thank you! Your submission has been received!</div>
				</div>
				<div className="w-form-fail" style={{display: "none"}}>
					<div>Oops! Something went wrong while submitting the form.</div>
				</div>
			</div>
		);
	}
}

SearchBar.propTypes = {
	errors: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	setSearchCriteria: PropTypes.func.isRequired,
	doSearchCommunities: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors,
	auth: state.auth,
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{getUserInfo, setSearchCriteria, doSearchCommunities}
)(SearchBar);
