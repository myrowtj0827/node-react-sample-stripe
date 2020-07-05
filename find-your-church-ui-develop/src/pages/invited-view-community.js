import React, {Component} from "react";
import {Slide} from 'react-slideshow-image';
import {Helmet} from 'react-helmet';
import "../css/community-steps.css";
import FilterItemCheck from "../components/filter-item-check";
import FilterItemRadio from "../components/filter-item-radio";
import {Link} from "react-router-dom";
import community_config from "../conf/community-conf";
import ListMembers from "../components/list-members";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {viewCommunity} from "../actions/community-actions";
import SiteHeader from "../components/site-header";

class InvitedViewCommunity extends Component{
	constructor(props){
		super(props);

		this.aboutLimit = 200;

		const param = props.location.pathname.substr(16); // 16 - length of "/view-community/", which is URL prefix for reset.
		this.community_id = param.split("-").pop();
		this.props.viewCommunity({id: this.community_id});

		this.slide_options = {
			duration: 4000,
			transitionDuration: 500,
			infinite: true,
			indicators: true,
			arrows: true,
			onChange: (oldIndex, newIndex) => {
				//console.log(`slide transition from ${oldIndex} to ${newIndex}`);
			}
		};

		this.state = {
			is_show_menu: false,
			showedDetails: true,

			showedAboutShort: true,

			collapsedAboutPart: true,
			collapsedContactPart: true,
			collapsedLinksPart: true,
			collapsedMorePart: true,
		};
	}

	componentDidMount(){
		this.props.viewCommunity({id: this.community_id});
	}

	toggleMenu = () => {
		this.setState({is_show_menu: !this.state.is_show_menu});
	};

	hideMenu = () => {
		this.setState({is_show_menu: false});
	};

	selectTabDetails = isActive => {
		this.setState({showedDetails: isActive});
	};

	redirectURL(url){
		window.open(url, "_blank", "width=800, height=600, location=no, toolbar=no");
	}

	handleReadMore = () => {
		this.setState({showedAboutShort: !this.state.showedAboutShort});
	};

	toggleAboutPart = () => {
		this.setState({collapsedAboutPart: !this.state.collapsedAboutPart});
	};

	toggleContactPart = () => {
		this.setState({collapsedContactPart: !this.state.collapsedContactPart});
	};

	toggleLinksPart = () => {
		this.setState({collapsedLinksPart: !this.state.collapsedLinksPart});
	};

	toggleMorePart = () => {
		this.setState({collapsedMorePart: !this.state.collapsedMorePart});
	};

	render(){
		if(this.props.community.view_community === null){
			return null;
		}
		else{
			let aboutShort = this.props.community.view_community.about.substr(0, this.aboutLimit);
			let isMore = false;
			if(aboutShort.length !== this.props.community.view_community.about.length){
				aboutShort += "...";
				isMore = true;
			}

			const in_frame = window.location !== window.parent.location;

			return (
				<>
					<Helmet>
						<title>{this.props.community.view_community.community_name}</title>
						<meta name={"description"} content={this.props.community.view_community.about}/>
					</Helmet>
					{in_frame ? null : (
						<SiteHeader/>
					)}
					<main className="steps-body" style={{marginTop: in_frame ? "0" : "70px"}}>
						<div className="page-header-container"
								 style={this.props.location.state !== undefined && this.props.location.state.colorTheme !== undefined ? {backgroundColor: this.props.location.state.colorTheme.header_bg} : null}>
							<div className={"page-header-sub-container"}>
								<div className="create-menu w3-left">
									<Link to={this.props.community.back_url} className="w3-button cancel">Back</Link>
								</div>
								<div className="page-header-title">
									{this.props.community.view_community.community_name}
								</div>
							</div>
						</div>
						<div className="tabs-menu-6 w-tab-menu" role="tablist"
								 style={this.props.location.state !== undefined && this.props.location.state.colorTheme !== undefined ? {backgroundColor: this.props.location.state.colorTheme.header_bg} : null}>
							<div data-w-tab="Tab 1"
									 className={`iframe-tab w-inline-block w-tab-link ${this.state.showedDetails ? "w--current" : ""}`}
									 onClick={() => this.selectTabDetails(true)}
									 style={this.props.location.state !== undefined && this.props.location.state.colorTheme !== undefined ? {backgroundColor: this.props.location.state.colorTheme.header_bg} : null}>
								<div>Details</div>
							</div>
							<div data-w-tab="Tab 2"
									 className={`iframe-tab w-inline-block w-tab-link ${this.state.showedDetails ? "" : "w--current"}`}
									 onClick={() => this.selectTabDetails(false)}
									 style={this.props.location.state !== undefined && this.props.location.state.colorTheme !== undefined ? {backgroundColor: this.props.location.state.colorTheme.header_bg} : null}>
								<div>Admin</div>
							</div>
						</div>
						<div className={"view-wrapper"} style={{
							minHeight: in_frame ? "100vh" : "calc(100vh - 210px)",
							backgroundColor: this.props.location.state !== undefined && this.props.location.state.colorTheme !== undefined ? this.props.location.state.colorTheme.results_bg : "initial"
						}}>
							<div className="container-inline">
								{!this.state.showedDetails ?
									(
										<ListMembers editable={false} user={this.props.community.view_community.owner_id} fromPublic={true}/>
									)
									: (
										<>
											<div className="info-body w3-row">
												<div className="left-part w3-col s4 m4">
													<div id={"community-info-container"}
															 style={{border: "1px solid rgba(14, 0, 25, 0.15)", borderRadius: "3px"}}>
														{this.props.community.view_community.pictures.length > 1 ? (
																<div className="slide-container">
																	<Slide {...this.slide_options}>
																		{this.props.community.view_community.pictures.map((pic, index) => {
																			return (
																				<div className="each-slide" key={index}>
																					<div style={{backgroundImage: `url(${pic})`}}>
																					</div>
																				</div>
																			);
																		})}
																	</Slide>
																</div>
															)
															: (this.props.community.view_community.pictures.length > 0 ? (
																<div className="slide-container">
																	<div className="each-slide">
																		<div
																			style={{backgroundImage: `url(${this.props.community.view_community.pictures[0]})`}}>
																		</div>
																	</div>
																</div>
															) : (
																<img
																	className={"community-picture"}
																	alt="Community" title={this.props.community.view_community.community_name}
																	src={this.props.community.view_community.picture ? this.props.community.view_community.picture : "/img/default-community/5e2672d254abf8af5a1ec82c_Community-p-500.png"}/>
															))}
														<div className="basic-info view">
															<div className="listingrow view" style={{position: "relative"}}>
																<strong>{this.props.community.view_community.community_name}</strong>
																{/*
															<Link to="#" className={"menu-icon-3dot w3-right"}
																		onClick={this.toggleMenu}>
																<i className={"fas fa-ellipsis-h"} style={{color: "#a1a1a1"}}/>
															</Link>
															<nav role="navigation"
																	 className="w3-animate-opacity listing-navmenu view w-nav-menu"
																	 onClick={this.toggleMenu} onMouseLeave={this.hideMenu}
																	 style={{display: this.state.is_show_menu ? "block" : "none"}}>
																<Link to="#" className="listing-navlink view w-nav-link">
																	Request to Join
																</Link>
																<Link to="#" className="listing-navlink view w-nav-link">
																	Add to Favorites
																</Link>
																<Link to="#" className="listing-navlink view w-nav-link">
																	Copy Link
																</Link>
																<Link to="#" className="listing-navlink view w-nav-link">
																	Share
																</Link>
																<Link to="#" className="listing-navlink view w-nav-link">
																	Flag / Report
																</Link>
															</nav>
															*/}
															</div>
															<div className="listingrow view">
																{this.props.community.view_community.category}
															</div>
															<div className="listingrow view">
																{this.props.community.view_community.address}
															</div>
														</div>
													</div>
												</div>
												<div className="right-part view w3-col s8 m8">
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels" onClick={this.toggleAboutPart}>
															<h4 className="form-header">About</h4>
														</div>
														<div className="input-div about"
																 style={{display: this.state.collapsedAboutPart ? "block" : "none"}}>
															{this.state.showedAboutShort ? (
																	<>
																							<pre>
																								{aboutShort}&nbsp;
																							</pre>
																		{isMore ? (
																			<div className={"read-more"}
																					 onClick={this.handleReadMore}>read more</div>
																		) : null}
																	</>
																)
																: (
																	<>
																							<pre>
																								{this.props.community.view_community.about}
																							</pre>
																		{isMore ? (
																			<div className={"read-more"}
																					 onClick={this.handleReadMore}>show less</div>
																		) : null}
																	</>
																)
															}
														</div>
													</div>
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels" onClick={this.toggleContactPart}>
															<h4 className="form-header">Community Contact</h4>
														</div>
														<div className="input-div w3-row"
																 style={{display: this.state.collapsedContactPart ? "block" : "none"}}>
															{this.props.community.view_community.community_contact ?
																<div className="view-item w3-col l12"
																		 style={{backgroundImage: "url('/img/icon/icon-contact.svg')"}}>
																	{this.props.community.view_community.community_contact ||
																	<span style={{color: "#aaa"}}>Contact name</span>}
																</div>
																: null}
															{this.props.community.view_community.email ?
																<a href={"mailto:" + this.props.community.view_community.email}
																	 className="view-item w3-half"
																	 style={{backgroundImage: "url('/img/icon/icon-email.svg')"}}>
																	{this.props.community.view_community.email ||
																	<span style={{color: "#aaa"}}>Email</span>}
																</a>
																: null}
															{this.props.community.view_community.phone ?
																<a href={"tel:" + this.props.community.view_community.phone}
																	 className="view-item w3-half"
																	 style={{backgroundImage: "url('/img/icon/icon-phone.svg')"}}>
																	{this.props.community.view_community.phone ||
																	<span style={{color: "#aaa"}}>Phone</span>}
																</a>
																: null}
														</div>
													</div>
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels" onClick={this.toggleLinksPart}>
															<h4 className="form-header">Links and Resources</h4>
														</div>
														<div className={"social-link-group"}
																 style={{display: this.state.collapsedLinksPart ? "block" : "none"}}>
															{community_config.SOCIALS.map(item => {
																const key_name = item.toLowerCase();
																return this.props.community.view_community[key_name] ? (
																	<Link to="#" key={item}
																				onClick={() => this.redirectURL(this.props.community.view_community[key_name])}
																				className={"social-link"}>
																		<div className={`view-link-icon ${key_name}`} title={item}/>
																	</Link>
																) : null;
															})}
														</div>
													</div>
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels" onClick={this.toggleMorePart}>
															<h4 className="form-header">More Info</h4>
														</div>
														<div className="input-div"
																 style={{display: this.state.collapsedMorePart ? "block" : "none"}}>
															<FilterItemCheck filterTitle="Day(s)" filterName="days"
																							 value={this.props.community.view_community.days}
																							 items={community_config.FILTERS.days}/>
															<FilterItemCheck filterTitle="Time(s)" filterName="times"
																							 value={this.props.community.view_community.times}
																							 items={community_config.FILTERS.times}/>
															<FilterItemRadio filterTitle="Frequency" filterName="frequency"
																							 value={this.props.community.view_community.frequency}
																							 items={community_config.FILTERS.frequency}/>
															<FilterItemCheck filterTitle="Hosting" filterName="hosting"
																							 value={this.props.community.view_community.hosting}
																							 items={community_config.FILTERS.hosting}/>
															<FilterItemCheck filterTitle="Age(s)" filterName="ages"
																							 value={this.props.community.view_community.ages}
																							 items={community_config.FILTERS.ages}/>
															<FilterItemRadio filterTitle="Gender" filterName="gender"
																							 value={this.props.community.view_community.gender}
																							 items={community_config.FILTERS.gender}/>
															<FilterItemRadio filterTitle="Kids Welcome" filterName="kids_welcome"
																							 value={this.props.community.view_community.kids_welcome}
																							 items={community_config.FILTERS.kids_welcome}/>
															<FilterItemCheck filterTitle="Parking" filterName="parking"
																							 value={this.props.community.view_community.parking}
																							 items={community_config.FILTERS.parking}/>
															<FilterItemCheck filterTitle="Other Ministries"
																							 filterName="ministries"
																							 value={this.props.community.view_community.ministries}
																							 items={community_config.FILTERS.ministries}/>
															<FilterItemCheck filterTitle="Other Services"
																							 filterName="other_services"
																							 value={this.props.community.view_community.other_services}
																							 items={community_config.FILTERS.other_services}/>
															{this.props.community.view_community.average_attendance > 0 ?
																<div className="view-filter w3-row">
																	<div className={"filter-title w3-col l4"}>
																		Average Attendance
																	</div>
																	{this.props.community.view_community.average_attendance ?
																		<span className={"filter-value-item"}>
																		{this.props.community.view_community.average_attendance}
																	</span>
																		: null}
																</div>
																: null}
															<FilterItemRadio filterTitle="Ambiance" filterName="ambiance"
																							 value={this.props.community.view_community.ambiance}
																							 items={community_config.FILTERS.ambiance}/>
															<FilterItemRadio filterTitle="Event Type"
																							 filterName="event_type"
																							 value={this.props.community.view_community.event_type}
																							 items={community_config.FILTERS.event_type}/>
															<FilterItemRadio filterTitle="Support Type"
																							 filterName="support_type"
																							 value={this.props.community.view_community.support_type}
																							 items={community_config.FILTERS.support_type}/>
														</div>
													</div>
												</div>
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
}

InvitedViewCommunity.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	viewCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{viewCommunity}
)(InvitedViewCommunity);
