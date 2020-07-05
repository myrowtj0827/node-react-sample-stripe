import React, {Component} from "react";
import '../../css/dashboard.css';
import '../../css/dashboard-results.css';
import '../../css/dashboard-iframe.css';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo, updateUserInfo} from "../../actions/auth-actions";
import {getBillingStatus, clearLastInvoice, showActivateDlg} from "../../actions/community-actions";
import SiteHeader from "../../components/site-header";
import {Link} from "react-router-dom";
import Popup from "reactjs-popup";
import {SketchPicker} from "react-color";
import community_config, {INIT_FILTERS} from "../../conf/community-conf";
import Tooltip from "rmc-tooltip/es";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import SiteFooter from "../../components/site-footer";
// import imgPoweredBy from "../../img/powered_by.png";
// import SiteFooter from "../../components/site-footer";
// import FaqItem from "../../components/faq-item";

class DashboardResults extends Component{
	constructor(props){
		super(props);

		let {user} = props.auth;

		this.cat_ref = React.createRef();

		this.previewCriteria = {
			owner: null,
			filter: {
				...INIT_FILTERS,
			}
		};

		this.refIframe = React.createRef();

		this.state = {
			errors: {},

			user_fname: user.fname,
			user_lname: user.lname,
			user_lat: user.location ? user.location.lat : null,
			user_lng: user.location ? user.location.lng : null,

			frameUrl: '',
			frameShortCode: '',
			frameCode: '',

			showedCopyNotification: false,

			iFrameHeight: 'calc(100vw * 9 / 16)',

			showed_tab: 0,

			showed_header_bg_color: false,
			showed_results_bg_color: false,
			showed_buttons_color: false,
			color_header_bg: user.colors === null || user.colors === undefined ? '#f3f2f5' : user.colors[0],
			color_results_bg: user.colors === null || user.colors === undefined ? '#e8e5ea' : user.colors[1],
			color_buttons: user.colors === null || user.colors === undefined ? '#2e89fe' : user.colors[2],

			showed_tooltip: false,
			tooltip_content: community_config.TOOL_TIPS[""],

			iframe_category: user.default_radius === undefined ? 'undefined' : user.default_category,
			iframe_radius: user.default_radius === null || user.default_radius === undefined ? (user.location && user.location.lat !== null ? 10 : 30) : user.default_radius,
			zip_code: user.zip_code,
			showed_tooltip_zipcode: false,

			tooltip_width: 0,
		};

		this.showSubDlg = this.showSubDlg.bind(this);
	}

	onResizeWindow = () => {
		if(this.cat_ref.current !== null && this.cat_ref.current !== undefined)
			this.setState({tooltip_width: this.cat_ref.current.clientWidth});
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	componentDidMount(){
		window.addEventListener('resize', this.onResizeWindow);
		this.onResizeWindow();

		const customer_info = {
			user_id: this.props.auth.user.id,
		};

		this.props.getUserInfo({
			user_id: this.props.auth.user.id,
		});
		this.props.getBillingStatus(customer_info, this.props.history);

		this.previewCriteria.owner = this.props.auth.user.id;
		this.applyUpdatedCriteria();

		if(this.state.showed_tab === 1)
			this.setState({iFrameHeight: this.refIframe.current.contentWindow.document.body.scrollHeight + 'px'});
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.onResizeWindow);
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.iframe_category !== this.state.iframe_category ||
			prevState.iframe_radius !== this.state.iframe_radius ||
			prevState.user_lat !== this.state.user_lat ||
			prevState.user_lng !== this.state.user_lng ||
			prevState.color_header_bg !== this.state.color_header_bg ||
			prevState.color_results_bg !== this.state.color_results_bg ||
			prevState.color_buttons !== this.state.color_buttons){
			this.applyUpdatedCriteria();
		}

		if(prevProps.auth.user !== this.props.auth.user){
			let {user} = this.props.auth;
			this.setState({
				user_lat: user.location ? user.location.lat : null,
				user_lng: user.location ? user.location.lng : null,
				zip_code: user.zip_code,
				color_header_bg: user.colors === null || user.colors === undefined ? '#f3f2f5' : user.colors[0],
				color_results_bg: user.colors === null || user.colors === undefined ? '#e8e5ea' : user.colors[1],
				color_buttons: user.colors === null || user.colors === undefined ? '#2e89fe' : user.colors[2],
				iframe_category: user.default_category === undefined ? 'undefined' : user.default_category,
				iframe_radius: user.default_radius === null || user.default_radius === undefined ? 'null' : user.default_radius,
			});
		}

		if(prevState.color_header_bg !== this.state.color_header_bg || prevState.color_results_bg !== this.state.color_results_bg || prevState.color_buttons !== this.state.color_buttons){
			this.props.updateUserInfo({
				id: this.props.auth.user.id,
				colors: [
					this.state.color_header_bg,
					this.state.color_results_bg,
					this.state.color_buttons,
				],
			});
		}

		if(prevState.iframe_category !== this.state.iframe_category){
			this.props.updateUserInfo({
				id: this.props.auth.user.id,
				default_category: this.state.iframe_category,
			});
		}

		if(prevState.iframe_radius !== this.state.iframe_radius){
			this.props.updateUserInfo({
				id: this.props.auth.user.id,
				default_radius: this.state.iframe_radius,
			});
		}
	}

	copyDynamicUrl = () => {
		if(this.state.showedCopyNotification)
			return;

		const copyText = document.querySelector("#frame-url");
		copyText.select();
		document.execCommand("copy");

		this.setState({
			showedCopyNotification: true
		});

		setTimeout(() => {
			this.setState({
				showedCopyNotification: false
			});
		}, 3000);
	};

	filters2url = () => {
		const filter_keys = Object.keys(community_config.FILTERS4URL);

		let url_result = '';
		let is1st = true;
		for(let key of filter_keys){
			if(this.previewCriteria.filter[key] === undefined)
				continue;

			const key_value = this.previewCriteria.filter[key].split("");
			for(let i = 0; i < key_value.length; i++){
				if(key_value[i] === "1"){
					url_result += (is1st ? "" : "-") + community_config.FILTERS4URL[key][i];
					is1st = false;
				}
			}
		}

		return url_result === '' ? 'undefined' : url_result;
	};

	applyUpdatedCriteria = () => {
		const iframe_param = `${this.state.user_fname}-${this.state.user_lname}-${this.previewCriteria.owner}/${this.filters2url()}`;

		const preview_url = `${window.location.protocol}//${window.location.host}/iframe/${iframe_param}`;
		const iframe_style = `display: block; width: 100%; height: 100vh; outline: none; border: none; overflow: hidden;`;

		this.setState({
			frameUrl: preview_url,
			frameShortCode: `<iframe id="iframe-community" src="${preview_url}" style="${iframe_style}"/>`,
			frameCode: `<iframe id="iframe-community" src="${preview_url}" style="${iframe_style}"/>`,
			frameStyle: iframe_style,
		});
	};

	showSubDlg(){
		this.props.showActivateDlg();
	}

	selectTabDetail = tab_num => {
		this.setState({showed_tab: tab_num});
	}

	onChange = e => {
		if(e.target.id === 'iframe_category'){
			this.setState({
				tooltip_content: community_config.TOOL_TIPS[e.target.value],
				showed_tooltip: true,
			});

			setTimeout(() => {
				this.setState({showed_tooltip: true});
			}, 10);
		}

		this.setState({[e.target.id]: e.target.value});
		this.applyUpdatedCriteria();
	};

	onBlurCategory = () => {
		this.setState({
			showed_tooltip: false,
		});
	};

	onChangeAddress = val => {
		this.setState({zip_code: val});
	};

	handleSelect = address => {
		const self = this;

		// const matches = address.match(/(\d+)/);
		const trimmed_address = address.replace(", USA", "");

		self.setState({zip_code: trimmed_address /*matches[0]*/});

		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				self.setState({
					user_lat: latLng.lat,
					user_lng: latLng.lng,
				});

				// save zip_code and location to db.
				this.props.updateUserInfo({
					id: this.props.auth.user.id,
					zip_code: trimmed_address,
					location: {
						lat: latLng.lat,
						lng: latLng.lng,
					},
				});
			})
			.catch(error => console.error('Error', error));
	};

	onFocusZipCode = () => {
		// this.setState({showed_tooltip: true});
	};

	onBlurZipCode = () => {
		this.setState({showed_tooltip_zipcode: false});
	};

	render(){
		return (
			<>
				<SiteHeader/>
				<div>
					<main className="admin-body dashboard-results w3-row"
								style={{filter: (this.props.community.activating || this.props.community.deactivating || this.props.community.showing) ? "blur(4px)" : "none"}}>
						<div className={"admin-wrapper"}>
							<div className="page-header-container">
								<div className={"page-header-sub-container"}>
									<div id="w-node-5ba554098c6d-44cf2aa3" className="div-block-171">
										<div className="div-block-231">
											<Link to="/create-new-community" className="button-create w-button">
												<i className={"fas fa-users"}/>
											</Link>
										</div>
									</div>
									<div className="page-header-title">
										Iframe
									</div>
									<div id="w-node-5ba554098c5f-44cf2aa3" className="div-block-210">
										<div className="div-block-215">
											<Link to="/dashboard" className="link-6">
												<em className="italic-text-7 gray">
													<i className="fas fa-th"/>
												</em>
											</Link>
										</div>
										<div className="div-block-215 underline">
											<Link to="/dashboard-results" className="link-6">
												<em className="italic-text-7 current">
													<i className="fas fa-code"/>
												</em>
											</Link>
										</div>
									</div>
								</div>
							</div>
							<div className="tabs-menu-6 w-tab-menu" role="tablist">
								<div data-w-tab="Tab 1"
										 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_tab === 0 ? "w--current" : ""}`}
										 onClick={() => this.selectTabDetail(0)}>
									<div>Customize</div>
								</div>
								<div data-w-tab="Tab 2"
										 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_tab === 1 ? "w--current" : ""}`}
										 onClick={() => this.selectTabDetail(1)}>
									<div>Preview</div>
								</div>
								<div data-w-tab="Tab 3"
										 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_tab === 2 ? "w--current" : ""}`}
										 onClick={() => this.selectTabDetail(2)}>
									<div>Instructions</div>
								</div>
							</div>
							{
								this.state.showed_tab === 0 ? (
									<div className={"iframe-details w3-animate-opacity"}>
										<div className="accordionheader-div" style={{
											color: "#333",
										}}>
											<h4 className="accountcontainer-header">
												Customize your iframe search engine and community profiles:
											</h4>
										</div>
										<div className="div-block-239" style={{marginTop: "20px"}}>
											<div className="accordionheader-div">
												<h4 className="accountcontainer-header">
													Default search values:
												</h4>
											</div>
											<div className="iframe-container">
												<div className="form-block-6 w-form">
													<form id="email-form" name="email-form" data-name="Email Form">
														<div className="customiframe-grid">
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Default category:</label>
																	<Popup
																		trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			Set the default category that will be displayed and applied on your iframe search
																			results.
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<Tooltip placement={"top"}
																					 overlay={this.state.tooltip_content}
																					 align={{offset: [0, 2],}}
																					 visible={this.state.showed_tooltip}
																					 overlayStyle={{maxWidth: this.state.tooltip_width}}
																	>
																		<select id="iframe_category" className="iframe-dropdown w-select"
																						onChange={this.onChange} onBlur={this.onBlurCategory}
																						ref={this.cat_ref}
																						value={this.state.iframe_category}
																						style={{backgroundImage: `url("/img/icon-down3-purple.svg")`}}>
																			<option value="undefined">All Communities</option>
																			{
																				community_config.CATEGORIES.map(cat => {
																					return (
																						<option value={cat} key={cat}
																										title={community_config.TOOL_TIPS[cat]}>{cat}</option>
																					);
																				})
																			}
																		</select>
																	</Tooltip>
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Default radius:</label>
																	<Popup
																		trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			Set the default radius that will be displayed and applied on your iframe search
																			results.
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<select id="iframe_radius" className="iframe-dropdown w-select"
																					onChange={this.onChange}
																					value={this.state.iframe_radius}
																					style={{backgroundImage: `url("/img/icon-down3-purple.svg")`}}>
																		<option value="null">Radius...</option>
																		{
																			community_config.SEARCH_RADIUS.map(r => {
																				const pl = r > 1 ? "s" : "";
																				return (
																					<option value={r} key={"radius-" + r}>within {r} mile{pl} of</option>
																				);
																			})
																		}
																	</select>
																</div>
															</div>
															<div className="forminput-div" style={{position: "relative"}}>
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Address, city or zip code</label>
																	<Popup
																		trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			This coordinate is used as the point of origin for the search results displaying
																			your active communities on your own website. If you or your organization does not
																			have a website, or you have communities located in more than one state - you can
																			leave this field blank.
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<PlacesAutocomplete
																		value={this.state.zip_code === undefined ? "" : this.state.zip_code}
																		onChange={this.onChangeAddress}
																		onSelect={this.handleSelect}
																	>
																		{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
																			<>
																				<input className="iframe-input w-input"
																							 title={`Lat: ${this.state.user_lat}, Lng: ${this.state.user_lng}, ${this.state.zip_code}`}
																							 {...getInputProps({
																								 placeholder: "",
																							 })}
																							 onFocus={this.onFocusZipCode}
																							 onBlur={this.onBlurZipCode}
																							 style={{borderColor: this.props.errors.msg_reg_zip_code ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																							 required=""/>
																				<div className={"search-address-candidates"}
																						 style={{right: "0", top: "72px", minWidth: "100%", maxWidth: "100%"}}>
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
																</div>
															</div>
														</div>
													</form>
												</div>
											</div>
										</div>
										<div className="div-block-239">
											<div className="accordionheader-div">
												<h4 className="accountcontainer-header">
													Theme colors:
												</h4>
											</div>
											<div className="iframe-container">
												<div className="form-block-6 w-form">
													<form id="email-form" name="email-form" data-name="Email Form">
														<div className="customiframe-grid">
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Header backgrounds:</label>
																	<Popup
																		trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			This will change the color of the search results header and profile headers.
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="text" readOnly={true} id={"color_header_bg"}
																				 className="iframe-input w-input"
																				 value={this.state.color_header_bg}/>
																	<div className="color-button w-button" style={{
																		backgroundColor: this.state.color_header_bg
																	}} onClick={() => {
																		this.setState({showed_header_bg_color: !this.state.showed_header_bg_color});
																	}}/>
																	{
																		this.state.showed_header_bg_color ? (
																			<div style={{position: "absolute"}} onMouseLeave={() => {
																				this.setState({showed_header_bg_color: false});
																			}}>
																				<SketchPicker disableAlpha={true} color={this.state.color_header_bg}
																											onChange={(color, e) => {
																												this.setState({color_header_bg: color.hex});
																											}}/>
																			</div>
																		) : null
																	}
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Page backgrounds:</label>
																	<Popup
																		trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			This will change the color of the search results and profile pages.
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="text" readOnly={true} id={"color_results_bg"}
																				 className="iframe-input w-input"
																				 value={this.state.color_results_bg}/>
																	<div className="color-button w-button" style={{
																		backgroundColor: this.state.color_results_bg
																	}} onClick={() => {
																		this.setState({showed_results_bg_color: !this.state.showed_results_bg_color});
																	}}/>
																	{
																		this.state.showed_results_bg_color ? (
																			<div style={{position: "absolute"}} onMouseLeave={() => {
																				this.setState({showed_results_bg_color: false});
																			}}>
																				<SketchPicker disableAlpha={true} color={this.state.color_results_bg}
																											onChange={(color, e) => {
																												this.setState({color_results_bg: color.hex});
																											}}/>
																			</div>
																		) : null
																	}
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Links and buttons:</label>
																	<Popup
																		trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			This will change the color of the links, buttons, community names and map pins.
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="text" readOnly={true} id={"color_buttons"}
																				 className="iframe-input w-input"
																				 value={this.state.color_buttons}/>
																	<div className="color-button w-button" style={{
																		backgroundColor: this.state.color_buttons
																	}} onClick={() => {
																		this.setState({showed_buttons_color: !this.state.showed_buttons_color});
																	}}/>
																	{
																		this.state.showed_buttons_color ? (
																			<div style={{position: "absolute"}} onMouseLeave={() => {
																				this.setState({showed_buttons_color: false});
																			}}>
																				<SketchPicker disableAlpha={true} color={this.state.color_buttons}
																											onChange={(color, e) => {
																												this.setState({color_buttons: color.hex});
																											}}/>
																			</div>
																		) : null
																	}
																</div>
															</div>
														</div>
													</form>
												</div>
											</div>
										</div>
									</div>
								) : (
									this.state.showed_tab === 1 ? (
										<>
											<div className="div-block-184 w3-animate-opacity">
												<div className="div-block-185"/>
												<h1 className="heading-28">Find a community near you.</h1>
												<p className="paragraph-5">This could be a header on your communities page or a section above
													the
													iframe that provides definitions of the community categories your ministry supports. The
													preview
													below is exactly what your search results will look like when displayed on your own web page.
													If
													you have any questions, please do not hesitate to contact our <a
														href="mailto:support@findyourchurch.org" className="link-10">support team</a>.
												</p></div>
											<iframe id="iframe-community" src={this.state.frameUrl} title={"preview communities"}
															ref={this.refIframe} title={"preview communities"}
															style={{
																display: "block",
																width: "100%",
																height: "100vh",
																outline: "none",
																border: "none",
																overflow: "hidden"
															}}/>
											{/*
											<div className="div-block-295">
												<img src={imgPoweredBy} alt="" className="image-13"/>
											</div>
											<SiteFooter/>
											*/}
										</>
									) : (
										<>
											<div className={"iframe-details w3-animate-opacity"}>
												<div className="dashboardheader-div" style={{
													paddingBottom: "10px",
													borderBottom: "1px solid #ddd9e1",
													color: "#333",
												}}>
													<h4 className="accountcontainer-header">How to display your communities on your own site:</h4>
												</div>
												<div className="div-block-267">
													<div>
														<div className="div-block-269">
															<h4 className="heading-55">
																Add an HTML iframe element to the
																page and/or section you wish to display your communities.
															</h4>
															<h5 className="heading-60">
																Every website builder such as Wix, SquareSpace, or WordPress will have the ability to
																embed
																an iframe code anywhere on your site. Contact our <a
																href="mailto:support@findyourchurch.org">support team</a> if you're having trouble!
															</h5>
															<div className="div-block-270 t1"/>
														</div>
													</div>
													<div>
														<div className="div-block-269">
															<h4 className="heading-55">
																Copy / paste the code above into the HTML iframe element you just added and save your
																site.
															</h4>
															<h5 className="heading-60">
																Your search results should appear on your website after pasting / saving and be fully
																functional. You may need to update or publish your site to refresh and display the
																iframe.
															</h5>
															<div className="div-block-270 t2"/>
														</div>
													</div>
													<div>
														<div className="div-block-269">
															<h4 className="heading-55">
																That's it! If you need any help please do not hesitate to contact our <a
																href="mailto:support@findyourchurch.org" className="link-10">support team</a>.
															</h4>
															<h5 className="heading-60">
																The iframe is automatically connected to your dashboard so anytime you add, update, or
																remove a community - it will <b>automatically</b> update anywhere you have your search
																results displayed.
															</h5>
															<div className="div-block-270 t3"/>
														</div>
													</div>
												</div>
												<div className="div-block-239">
													<div className="accordionheader-div">
														<h4 className="accountcontainer-header">
															Copy your iframe code
														</h4>
														<Popup
															trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
															position={"left top"}>
															<div>
																Copy and paste this code into an iframe embed on your website. Look below for a quick
																3-step
																tutorial and
																don't hesitate to contact our support team if you run into any issues.
															</div>
														</Popup>
													</div>
													<div className="div-block-182">
														<h4 id="w-node-2d27cd76105d-78e24ec3" className="table-header"
																title={"Parameters: /iframe/owner/category/radius/lat/lng/colors/filter"}>
															<div>{this.state.frameShortCode}</div>
															<input id={"frame-url"} value={`${this.state.frameCode}`} onChange={() => {
															}} style={{opacity: "0", width: "8px", height: "8px"}}/>
														</h4>
													</div>
													<div className="">
														<h4 id="w-node-2d27cd761060-78e24ec3" className="heading-27">
															<div className={"copy-code-link"} onClick={this.copyDynamicUrl}>Copy Code</div>
														</h4>
													</div>
													<div className="_20top-div"
															 style={{display: this.state.showedCopyNotification ? "inline-block" : "none"}}>
														<h4 id="w-node-2d27cd761068-78e24ec3"
																className="copied-message">Code has been copied to clipboard.</h4>
													</div>
													{/*
													<h4 id="w-node-2d27cd761060-78e24ec3" className="heading-27" style={{paddingTop: "20px"}}>
														<div className={"copy-code-link"} onClick={this.copyDynamicUrl}>
															Send code and instructions to your developer
														</div>
													</h4>
													*/}
												</div>
												{/*
												<div className="dashboardheader-div" style={{
													padding: "20px 0 10px",
													borderBottom: "1px solid #d3ced7",
													color: "#333",
												}}>
													<h4 className="accountcontainer-header">Frequently asked questions:</h4>
												</div>
												<div>
													<div className="_20top-div">
														<FaqItem content={
															`Lorem ipsum dolor sit amet, consectetur adipiscing telit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`
														}/>
														<FaqItem content={
															`Lorem ipsum dolor sit amet, consectetur adipiscing telit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`
														}/>
														<FaqItem content={
															`Lorem ipsum dolor sit amet, consectetur adipiscing telit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`
														}/>
														<FaqItem content={
															`Lorem ipsum dolor sit amet, consectetur adipiscing telit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`
														}/>
														<FaqItem content={
															`Lorem ipsum dolor sit amet, consectetur adipiscing telit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`
														}/>
														<FaqItem content={
															`Lorem ipsum dolor sit amet, consectetur adipiscing telit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`
														}/>
														<FaqItem content={
															`Lorem ipsum dolor sit amet, consectetur adipiscing telit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`
														}/>
													</div>
												</div>
											*/}
											</div>
										</>
									)
								)
							}
						</div>
					</main>
				</div>
				{this.state.showed_tab === 1 ? null : (
					<SiteFooter/>
				)}
			</>
		);
	}
}

DashboardResults.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
	clearLastInvoice: PropTypes.func.isRequired,
	showActivateDlg: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{
		getUserInfo,
		updateUserInfo,
		getBillingStatus,
		clearLastInvoice,
		showActivateDlg,
	}
)(DashboardResults);
