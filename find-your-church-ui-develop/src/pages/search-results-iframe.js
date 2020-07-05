import React, {Component} from 'react';
import CommunityMap from "../components/community-map";
import SearchBar from "../components/search-bar";
import app_config from "../conf/config";
import community_config, {INIT_FILTERS} from "../conf/community-conf";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import SearchFilterCheck from "../components/search-filter-check";
import SearchFilterRadio from "../components/search-filter-radio";
import {Link} from "react-router-dom";
import {
	clearPicking,
	doSearchCommunities, setBackUrl,
	setPicking,
	setSearchCriteria,
	setSearchFilter,
	setSortOrder
} from "../actions/community-actions";
import {
	clearOwners,
	getOwners, getUserInfo,
} from "../actions/auth-actions";
import PublicThumbnail from "../components/public-thumbnail";
import '../css/search-results-iframe.css';
import sorters from "../actions/sorters";
import {sorter_closest, sorter_farthest, sorter_name_asc, sorter_name_desc, sorter_newest} from "../utils/sorter-func";
import isEmpty from "../utils/isEmpty";
import SelectedFilters from "../components/selected-filters";

class SearchResultsIframe extends Component{
	constructor(props){
		super(props);

		this.myref = [];

		const {owner, filter} = props.match.params;
		this.owner = owner;
		this.filter = filter === 'undefined' || filter === undefined ? {...INIT_FILTERS} : this.url2filters(filter);

		this.state = {
			showed_filter: false,
			keyword_organization: '',
			...INIT_FILTERS,
			showed_owners: false,
			showed_organization_name: false,
			color_header_bg: '#f3f2f5',
			color_results_bg: '#e8e5ea',
			color_buttons: '#2e89fe',
		};
	}

	static getDerivedStateFromProps(nextProps, prevState){
		let state_obj = {};

		if(nextProps.days){
			state_obj.days = nextProps.days;
		}
		if(nextProps.times){
			state_obj.times = nextProps.times;
		}
		if(nextProps.frequency){
			state_obj.frequency = nextProps.frequency;
		}
		if(nextProps.hosting){
			state_obj.hosting = nextProps.hosting;
		}
		if(nextProps.ages){
			state_obj.ages = nextProps.ages;
		}
		if(nextProps.gender){
			state_obj.gender = nextProps.gender;
		}
		if(nextProps.kids_welcome){
			state_obj.kids_welcome = nextProps.kids_welcome;
		}
		if(nextProps.parking){
			state_obj.parking = nextProps.parking;
		}
		if(nextProps.ministries){
			state_obj.ministries = nextProps.ministries;
		}
		if(nextProps.other_services){
			state_obj.other_services = nextProps.other_services;
		}
		if(nextProps.ambiance){
			state_obj.ambiance = nextProps.ambiance;
		}
		if(nextProps.event_type){
			state_obj.event_type = nextProps.event_type;
		}
		if(nextProps.support_type){
			state_obj.support_type = nextProps.support_type;
		}

		return state_obj;
	}

	componentDidMount(){
		this.props.getUserInfo({
			user_id: this.owner.split("-").pop(),
		});

		this.props.getOwners({keyword: ""});
	}

	filters2url = () => {
		const filter_keys = Object.keys(community_config.FILTERS4URL);

		let url_result = '';
		let is1st = true;
		for(let key of filter_keys){
			if(this.props.community.criteria.filter[key] === undefined)
				continue;

			const key_value = this.props.community.criteria.filter[key].split("");
			for(let i = 0; i < key_value.length; i++){
				if(key_value[i] === "1"){
					url_result += (is1st ? "" : "-") + community_config.FILTERS4URL[key][i];
					is1st = false;
				}
			}
		}

		return url_result === '' ? 'undefined' : url_result;
	};

	/**
	 *
	 * @param url {string|null} filter1-filter2-filter3
	 */
	url2filters = (url) => {
		if(url === undefined)
			return;

		const url_filters = url.split("-");
		let filter_item = url_filters.shift();

		let criteria_filter = {...INIT_FILTERS};
		const filter_keys = Object.keys(community_config.FILTERS4URL);
		for(let key of filter_keys){
			let key_value = "0".repeat(community_config.FILTERS4URL[key].length).split("");
			for(let i = 0; i < key_value.length; i++){
				if(community_config.FILTERS4URL[key][i] === filter_item){
					key_value[i] = "1";
					filter_item = url_filters.shift();
				}
			}
			key_value = key_value.join("");
			criteria_filter[key] = key_value;
		}

		return criteria_filter;
	};

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.props.community.criteria !== prevProps.community.criteria || this.state.showed_filter !== prevState.showed_filter){
			const param = `${this.owner}/${this.filters2url()}`;
			const search_results_url = `${window.location.protocol}//${window.location.host}/iframe/${param}`;
			window.history.pushState("object or string", "Title", search_results_url);
			this.props.setBackUrl(`/iframe/${param}`);
		}

		if(prevProps.auth.user !== this.props.auth.user){
			this.setState({
				color_header_bg: this.props.auth.user.colors === null ? '#f3f2f5' : this.props.auth.user.colors[0],
				color_results_bg: this.props.auth.user.colors === null ? '#e8e5ea' : this.props.auth.user.colors[1],
				color_buttons: this.props.auth.user.colors === null ? '#2e89fe' : this.props.auth.user.colors[2],
			});

			this.criteria = {
				owner: this.owner.split("-").pop(),
				category: this.props.auth.user.default_category === undefined || this.props.auth.user.default_category === 'undefined' ? this.props.community.criteria.category : this.props.auth.user.default_category,
				radius: this.props.auth.user.default_radius === undefined ? this.props.community.criteria.radius : this.props.auth.user.default_radius,
				lat: this.props.auth.user.location === undefined ? this.props.community.criteria.lat : this.props.auth.user.location.lat,
				lng: this.props.auth.user.location === undefined ? this.props.community.criteria.lng : this.props.auth.user.location.lng,
				address: this.props.auth.user.zip_code === undefined ? this.props.community.criteria.address : this.props.auth.user.zip_code,
				filter: {...this.filter},
			};

			this.props.setSearchCriteria(this.criteria);
			this.props.doSearchCommunities(this.criteria);
		}
	}

	onChange = e => {
		this.props.setSortOrder(parseInt(e.target.value));
	};

	onChangeCommunityName = e => {
		const escaped_keyword = e.target.value; //.replace(/[.*?^${}()|[\]\\]/g, '');
		this.setState({
			keyword_organization: escaped_keyword,
			showed_owners: true,
		});

		// get names from BE API.
		//if(escaped_keyword.length > 0){
		this.props.getOwners({keyword: escaped_keyword});
		// }
		// else{
		// 	this.props.clearOwners();
		// }
	};

	toggleFilter = () => {
		this.setState({showed_filter: !this.state.showed_filter});
	};

	getDaysInfo = (checks) => {
		const obj = {days: checks};
		this.doSearchByFilter(obj);
	};
	getTimesInfo = (checks) => {
		const obj = {times: checks};
		this.doSearchByFilter(obj);
	};
	getFrequencyInfo = (checks) => {
		const obj = {frequency: checks};
		this.doSearchByFilter(obj);
	};
	getHostingInfo = (checks) => {
		const obj = {hosting: checks};

		if(this.props.community.criteria.filter.hosting[1] === '0' && checks[1] === '1'){
			this.props.setSearchCriteria({
				radius: null,
			});
			this.props.setSearchFilter(obj);
			this.setState(obj);
			this.props.doSearchCommunities({
				...this.props.community.criteria,
				radius: null,
				filter: {
					...this.props.community.criteria.filter,
					...obj,
				}
			});
		}
		else{
			this.doSearchByFilter(obj);
		}
	};
	getAgesInfo = (checks) => {
		const obj = {ages: checks};
		this.doSearchByFilter(obj);
	};
	getGenderInfo = (checks) => {
		const obj = {gender: checks};
		this.doSearchByFilter(obj);
	};
	getKidsWelcomeInfo = (checks) => {
		const obj = {kids_welcome: checks};
		this.doSearchByFilter(obj);
	};
	getParkingInfo = (checks) => {
		const obj = {parking: checks};
		this.doSearchByFilter(obj);
	};
	getMinistriesInfo = (checks) => {
		const obj = {ministries: checks};
		this.doSearchByFilter(obj);
	};
	getOtherServicesInfo = (checks) => {
		const obj = {other_services: checks};
		this.doSearchByFilter(obj);
	};
	getAmbianceInfo = (checks) => {
		const obj = {ambiance: checks};
		this.doSearchByFilter(obj);
	};
	getEventTypeInfo = (checks) => {
		const obj = {event_type: checks};
		this.doSearchByFilter(obj);
	};
	getSupportTypeInfo = (checks) => {
		const obj = {support_type: checks};
		this.doSearchByFilter(obj);
	};

	doSearchByFilter = (obj) => {
		this.props.setSearchFilter(obj);
		this.setState(obj);
		this.props.doSearchCommunities({
			...this.props.community.criteria,
			filter: {
				...this.props.community.criteria.filter,
				...obj,
			}
		});
	};

	hoverMarker = (index) => {
		this.props.setPicking(index);
	};

	clickMarker = (index) => {
		this.myref[index].current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	clearMarker = (index) => {
		this.props.clearPicking();
	};

	refreshComponent = (key, i) => {
		this.forceUpdate();
		const vals = this.props.community.criteria.filter[key] === undefined ?
			"0".repeat(community_config.FILTERS[key].length).split("")
			: this.props.community.criteria.filter[key].split("");
		vals[i] = "0";
		this.doSearchByFilter({[key]: vals.join("")});
	};

	/**
	 * @param owner {{title: string, value: string}}
	 */
	pickOwner = owner => {
		this.setState({
			showed_owners: false,
		});
		this.doSearchByFilter({
			owner_id: owner.value,
			owner_title: owner.title,
			owner_contact: owner.contact,
		});
	};

	clearOwner = () => {
		this.setState({
			showed_owners: false,
		});
		this.doSearchByFilter({
			owner_id: '',
			owner_title: '',
			owner_contact: '',
		});
	};

	toggleOrganizationName = () => {
		this.setState({
			showed_organization_name: !this.state.showed_organization_name,
		})
	};

	render(){
		// sort this.props.community.search_results
		const results = this.props.community.search_results ? [...this.props.community.search_results] : [];

		let fnSort;
		switch(this.props.community.sort_order){
			case sorters.SORT_NEWEST:
				fnSort = sorter_newest;
				break;
			case sorters.SORT_NAME_ASC:
				fnSort = sorter_name_asc;
				break;
			case sorters.SORT_NAME_DESC:
				fnSort = sorter_name_desc;
				break;
			case sorters.SORT_DIST_ASC:
				fnSort = sorter_closest;
				break;
			case sorters.SORT_DIST_DESC:
				fnSort = sorter_farthest;
				break;
			default:
				fnSort = sorter_newest;
				break;
		}

		results.sort(fnSort);

		const criteria_radius = isEmpty(this.props.criteria.radius) ? this.props.community.criteria.radius : this.props.criteria.radius;

		const pl = criteria_radius > 1 ? "s" : "";

		let selectedChurches = false;
		let selectedEvents = false;
		let selectedSupportGroups = false;
		let selectedNone = false;
		if(this.props.community.criteria.category === "Churches"){
			selectedChurches = true;
		}
		else if(this.props.community.criteria.category === "Events"){
			selectedEvents = true;
		}
		else if(this.props.community.criteria.category === "Support Groups"){
			selectedSupportGroups = true;
		}
		else if(this.props.community.criteria.category === ""){
			selectedNone = true;
		}

		return (
			<>
				<main id="content-body-iframe" className="w3-row">
					<div id={"spinning-modal"} className={"w3-modal"}
							 style={{display: this.props.community.searching ? "block" : "none"}}>
						<div className="w3-display-middle w3-text-white w3-jumbo">
							<i className="fas fa-spinner fa-spin"/>
						</div>
					</div>
					<div style={{filter: this.props.community.searching ? "blur(4px)" : "none"}}>
						<div id="search-results-header" className="w3-col s12"
								 style={{backgroundColor: this.state.color_header_bg}}>
							<SearchBar buttonTitle="Update" init={true} showedCategory={results.length > 0 || true}
												 path={this.props.location.pathname}/>
							<Link to={"#"} onClick={this.toggleFilter} className={"filter-link"}
										style={{color: this.state.color_buttons}}>
								{this.state.showed_filter ? "Hide Filters" : "Show Filters"}
							</Link>
							<span className={"sort-group"}>
						<label className={"sort-part-label"}>Sort by:&nbsp;</label>
						<select id={"sorter"} className={"sort-part"} onChange={this.onChange}
										style={{
											color: this.state.color_buttons,
											backgroundImage: "url('/img/icon-down3-blue.svg')",
										}}
						>
							<option value={sorters.SORT_NEWEST}>Newest</option>
							<option value={sorters.SORT_NAME_ASC}>A - Z</option>
							<option value={sorters.SORT_NAME_DESC}>Z - A</option>
							<option value={sorters.SORT_DIST_ASC}>Closet</option>
							<option value={sorters.SORT_DIST_DESC}>Farthest</option>
						</select>
					</span>
						</div>
						<CommunityMap isMarkerShown criteria={this.props.criteria}
													googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${app_config.GOOGLEMAP_API_KEY}`}
													loadingElement={<div/>}
													containerElement={<div className="map-body"/>}
													mapElement={<div className="map-content"/>}
													results={results}
													handleScroll={this.clickMarker}
													colorTheme={this.state.color_buttons}
						/>
						<div className={"filter-panel"} style={{display: this.state.showed_filter ? "block" : "none"}}>
							<div className={"selected-filters"}>
								{this.props.community.criteria.filter.owner_id !== '' ? (
									<div className={"selected-filter-item"}
											 title={`${this.props.community.criteria.filter.owner_title} (${this.props.community.criteria.filter.owner_contact})`}>
										{this.props.community.criteria.filter.owner_title}&nbsp;
										<i className={"far fa-times-circle"}
											 style={{cursor: "pointer", color: "#333"}}
											 onClick={this.clearOwner}/>
									</div>
								) : null}
								<SelectedFilters filter={this.props.community.criteria.filter}
																 handleRefresh={(key, i) => this.refreshComponent(key, i)}/>
							</div>
							<div className={"filter-header-div"}>
								<label className={"filter-label w3-large"}>Filters</label>
								{/*
									<Popup
											trigger={<i className={"fas fa-question-circle tooltip-icon w3-right"}/>}
											position={"left top"}>
										<div>Tell visitors more about your community...</div>
									</Popup>
									*/}
							</div>
							<div className={"filter-group-container"}>
								{/* search by organization name */}
								<div className={"filter-div"} style={{borderBottom: "none", marginBottom: "0"}}>
									<div className="flexdiv-left labels" onClick={this.toggleOrganizationName}
											 style={this.state.showed_organization_name ? null : {
												 paddingBottom: "10px",
												 height: "36px",
												 lineHeight: "20px",
												 borderBottom: "1px solid #ddd9e1",
											 }}>
										<label className={`filter-label ${this.state.showed_organization_name ? "" : "collapsed"}`}>Organization
											name</label>
									</div>
									<div style={{position: "relative", display: this.state.showed_organization_name ? "block" : "none"}}>
										<input type={"text"} id={"filter_community_name"}
													 className={"w-input search-filter-name"}
													 placeholder={"Search by name"}
													 value={this.state.keyword_organization}
													 onChange={this.onChangeCommunityName}
													 onClick={() => {
														 this.setState({showed_owners: true});
													 }}
													 onFocus={() => {
														 this.setState({showed_owners: true});
													 }}
										/>
										<div className={"owners-list"}
												 onMouseLeave={() => {
													 this.setState({showed_owners: false});
												 }}
												 style={{display: this.state.showed_owners ? "block" : "none"}}>
											{this.props.auth.owners.map(org => {
												let cnt = 0;
												for(let i = 0; i < results.length; i++){
													if(results[i].data.owner_id === org.value){
														cnt++;
													}
												}
												return cnt > 0 ? (
													<div key={`owner-${org.value}`}
															 className={"owner-item"}
															 onClick={() => {
																 this.pickOwner(org);
															 }}>
														{org.title}, {org.contact}: ({cnt})
													</div>
												) : null;
											})}
										</div>
									</div>
								</div>
								{/* filters group */}
								<SearchFilterCheck filterTitle="Day(s)" filterName="days"
																	 send={this.getDaysInfo}
																	 value={this.props.community.criteria.filter.days}
																	 items={community_config.FILTERS.days}/>
								<SearchFilterCheck filterTitle="Time(s)" filterName="times"
																	 send={this.getTimesInfo}
																	 value={this.props.community.criteria.filter.times}
																	 items={community_config.FILTERS.times}/>
								<SearchFilterRadio filterTitle="Frequency" filterName="frequency"
																	 send={this.getFrequencyInfo}
																	 value={this.props.community.criteria.filter.frequency}
																	 items={community_config.FILTERS.frequency}/>
								{selectedChurches || selectedNone ? null : (
									<>
										<SearchFilterCheck filterTitle="Hosting" filterName="hosting"
																			 send={this.getHostingInfo}
																			 value={this.props.community.criteria.filter.hosting}
																			 items={community_config.FILTERS.hosting}/>
										<SearchFilterCheck filterTitle="Age(s)" filterName="ages"
																			 send={this.getAgesInfo}
																			 value={this.props.community.criteria.filter.ages}
																			 items={community_config.FILTERS.ages}/>
										<SearchFilterRadio filterTitle="Gender" filterName="gender"
																			 send={this.getGenderInfo}
																			 value={this.props.community.criteria.filter.gender}
																			 items={community_config.FILTERS.gender}/>
										<SearchFilterRadio filterTitle="Kids Welcome" filterName="kids_welcome"
																			 send={this.getKidsWelcomeInfo}
																			 value={this.props.community.criteria.filter.kids_welcome}
																			 items={community_config.FILTERS.kids_welcome}/>
									</>
								)}
								<SearchFilterCheck filterTitle="Parking" filterName="parking"
																	 send={this.getParkingInfo}
																	 value={this.props.community.criteria.filter.parking}
																	 items={community_config.FILTERS.parking}/>
								{selectedChurches ?
									<SearchFilterCheck filterTitle="Other Ministries"
																		 filterName="ministries"
																		 send={this.getMinistriesInfo}
																		 value={this.props.community.criteria.filter.ministries}
																		 items={community_config.FILTERS.ministries}/>
									: null}
								{selectedChurches ?
									<SearchFilterCheck filterTitle="Other Services"
																		 filterName="other_services"
																		 send={this.getOtherServicesInfo}
																		 value={this.props.community.criteria.filter.other_services}
																		 items={community_config.FILTERS.other_services}/>
									: null}
								{selectedChurches ?
									<SearchFilterRadio filterTitle="Ambiance" filterName="ambiance"
																		 send={this.getAmbianceInfo}
																		 value={this.props.community.criteria.filter.ambiance}
																		 items={community_config.FILTERS.ambiance}/>
									: null}
								{selectedEvents ?
									<SearchFilterRadio filterTitle="Event Type" filterName="event_type"
																		 send={this.getEventTypeInfo}
																		 value={this.props.community.criteria.filter.event_type}
																		 items={community_config.FILTERS.event_type}/>
									: null}
								{selectedSupportGroups ?
									<SearchFilterRadio filterTitle="Support Type"
																		 filterName="support_type"
																		 send={this.getSupportTypeInfo}
																		 value={this.props.community.criteria.filter.support_type}
																		 items={community_config.FILTERS.support_type}/>
									: null}
							</div>
						</div>
						<div className={"communities-container communities-body communities search-results w3-row"}
								 style={{backgroundColor: this.state.color_results_bg}}>
							{results.length > 0 ? (
								<div className="listing-grid dashboard">
									<div className={"w3-row search-result-headline"}>
										<div className={"search-result-container-header w3-col m10"}>
									<span style={{fontWeight: "bold"}}>
										{isEmpty(this.props.criteria.category) ? "Communities" : this.props.criteria.category}
									</span>
											&nbsp;<span style={{fontWeight: "400"}}>near</span>&nbsp;
											<span
												style={{fontWeight: "bold"}}>
												{
													isEmpty(this.props.criteria.address) ||
													isEmpty(this.props.criteria.radius) ||
													isNaN(this.props.criteria.radius) ||
													this.props.criteria.radius === 'null' ?
														"any location" : this.props.criteria.address
												}
											</span>
										</div>
										<div className={"search-result-container-header-right w3-col m2"}>
											Results ({results.length})
										</div>
									</div>
									{results.map((item, index) => {
										this.myref[index] = React.createRef();
										return (
											<div
												className={"w3-half" + (this.props.community.picking === index ? " selected-thumbnail" : "")}
												key={"search" + index} ref={this.myref[index]}
												onMouseEnter={() => this.hoverMarker(index)}
												onMouseLeave={() => this.clearMarker()}>
												<PublicThumbnail
													value={item.data} isSelected={this.props.community.picking === index}
													colorTheme={{
														header_bg: this.state.color_header_bg,
														results_bg: this.state.color_results_bg,
														buttons: this.state.color_buttons
													}}/>
											</div>
										)
									})}
								</div>
							) : (
								<>
									<div className={"search-result-headline empty"}
											 style={{backgroundImage: "url(/img/icon/icon-warning.svg)"}}>
										<div>
											We couldn't find
											any {isEmpty(this.props.criteria.category) ? "communities" : this.props.criteria.category} near {isEmpty(this.props.criteria.address) ? "this location" : this.props.criteria.address}.
										</div>
										<div>
											Try expanding your search radius.
										</div>
										{this.props.auth.isAuthenticated ? null : (
											<>
												<div>
													Or join our mission and create the first one!
												</div>
												<div className="div-block-158">
													<div className="div-navlink noresults">
														<Link to={"/register-popup"}
																	className="link-headernav button-gradient w-button">
															Create an Account
														</Link>
													</div>
												</div>
											</>
										)}
									</div>
								</>
							)}
						</div>
					</div>
				</main>
			</>
		);
	}
}

SearchResultsIframe.propTypes = {
	errors: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	criteria: PropTypes.object.isRequired,
	setSearchCriteria: PropTypes.func.isRequired,
	setSearchFilter: PropTypes.func.isRequired,
	setSortOrder: PropTypes.func.isRequired,
	doSearchCommunities: PropTypes.func.isRequired,
	setPicking: PropTypes.func.isRequired,
	clearPicking: PropTypes.func.isRequired,
	setBackUrl: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors,
	auth: state.auth,
	community: state.communities,
	criteria: state.communities.criteria,

	days: state.communities.criteria.filter.days,
	times: state.communities.criteria.filter.times,
	frequency: state.communities.criteria.filter.frequency,
	hosting: state.communities.criteria.filter.hosting,
	ages: state.communities.criteria.filter.ages,
	gender: state.communities.criteria.filter.gender,
	kids_welcome: state.communities.criteria.filter.kids_welcome,
	parking: state.communities.criteria.filter.parking,
	ministries: state.communities.criteria.filter.ministries,
	other_services: state.communities.criteria.filter.other_services,
	ambiance: state.communities.criteria.filter.ambiance,
	event_type: state.communities.criteria.filter.event_type,
	support_type: state.communities.criteria.filter.support_type,
});

export default connect(
	mapStateToProps,
	{
		getUserInfo,
		setSearchCriteria,
		setSearchFilter,
		setSortOrder,
		doSearchCommunities,
		setPicking,
		clearPicking,
		setBackUrl,
		getOwners,
		clearOwners,
	}
)(SearchResultsIframe);
