import React, {Component} from "react";
import {Link} from "react-router-dom";
import '../css/home.css';
import '../css/landing-page.css';
import SiteFooter from "../components/site-footer";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo} from "../actions/auth-actions";
import SiteHeader from "../components/site-header";
import community_config from "../conf/community-conf";

class Home extends Component{
	constructor(props){
		super(props);

		this.refTab = React.createRef();
		this.refLp31 = React.createRef();
		this.refLp32 = React.createRef();
		this.refLp33 = React.createRef();
		this.refLp41 = React.createRef();
		this.refLp42 = React.createRef();
		this.refLp43 = React.createRef();
		this.refLp44 = React.createRef();
		this.refLp45 = React.createRef();
		this.refLp46 = React.createRef();
		this.refLp47 = React.createRef();

		this.area_height = 1;
		this.red_line = 1;

		this.state = {
			selected_tab: -1,
			tab_width: 1,
			iframe_width: 1,
			iframe_height: 1,
			iframe_screen_width: 1,
			iframe_screen_height: 1,

			ani_text: '',
			ani_selected: false,
			ani_cursor: true,
		};

		this.ani_labels = [];
		for(const cat of community_config.CATEGORIES){
			this.ani_labels.push(cat.toLowerCase().substr(0, cat.length - (cat === 'Churches' ? 2 : 1)));
		}
		this.ani_index = 0;
		this.char_index = 0;
		this.ani_status = 0; // 0 - empty, 1 - typing, 2 - full, 3 - selected
	}

	typingAnimation = () => {
		let timeout = 150;
		switch(this.ani_status){
			case 0: // empty
				this.setState({
					ani_selected: false,
					ani_text: '',
					ani_cursor: true,
				});
				this.ani_status = 1;
				timeout = 500;
				break;
			case 1: // typing
				this.setState({
					ani_text: this.ani_labels[this.ani_index].substring(0, this.char_index),
				});

				this.char_index++;
				if(this.char_index > this.ani_labels[this.ani_index].length){
					this.ani_status = 2;
				}
				break;
			case 2: // full
				this.ani_status = 3;
				timeout = 2000;
				break;
			case 3: // selected
				this.setState({
					ani_selected: true,
					ani_cursor: false,
				});
				this.ani_index++;
				if(this.ani_index === this.ani_labels.length){
					this.ani_index = 0;
				}
				this.char_index = 0;
				this.ani_status = 0;
				timeout = 500;
				break;
		}

		setTimeout(this.typingAnimation, timeout);
	};

	onResizeWindow = () => {
		if(this.refTab.current !== null && this.refTab.current !== undefined){
			this.setState({
				tab_width: this.refTab.current.clientWidth,
			});
		}

		this.area_height = window.innerHeight / 3;
		this.red_line = this.area_height * 2;
	};

	getOpacityOnScroll = pos => {
		let opacity = (pos - this.red_line) / this.area_height;
		if(opacity < 0.5) // 0
			opacity = 0;
		else if(opacity >= 0.5) // 1
			opacity = 1;

		return opacity;
	}

	onScrollWindow = () => {
		this.setState({lp31_opacity: 1 - this.getOpacityOnScroll(this.refLp31.current.getBoundingClientRect().top)});
		this.setState({lp32_opacity: 1 - this.getOpacityOnScroll(this.refLp32.current.getBoundingClientRect().top)});
		this.setState({lp33_opacity: 1 - this.getOpacityOnScroll(this.refLp33.current.getBoundingClientRect().top)});
		this.setState({lp41_opacity: 1 - this.getOpacityOnScroll(this.refLp41.current.getBoundingClientRect().top)});
		this.setState({lp42_opacity: 1 - this.getOpacityOnScroll(this.refLp42.current.getBoundingClientRect().top)});
		this.setState({lp43_opacity: 1 - this.getOpacityOnScroll(this.refLp43.current.getBoundingClientRect().top)});
		this.setState({lp44_opacity: 1 - this.getOpacityOnScroll(this.refLp44.current.getBoundingClientRect().top)});
		this.setState({lp45_opacity: 1 - this.getOpacityOnScroll(this.refLp45.current.getBoundingClientRect().top)});
		this.setState({lp46_opacity: 1 - this.getOpacityOnScroll(this.refLp46.current.getBoundingClientRect().top)});
		this.setState({lp47_opacity: 1 - this.getOpacityOnScroll(this.refLp47.current.getBoundingClientRect().top)});
	};

	componentDidMount(){
		window.addEventListener('resize', this.onResizeWindow);
		this.onResizeWindow();
		window.addEventListener('scroll', this.onScrollWindow);

		this.setState({
			selected_tab: 0,
		});

		this.props.getUserInfo({user_id: this.props.auth.user.id,});

		this.typingAnimation();
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.onResizeWindow);
		window.removeEventListener('scroll', this.onScrollWindow);
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.selected_tab !== this.state.selected_tab || prevState.tab_width !== this.state.tab_width){
			switch(this.state.selected_tab){
				case 1: // tablet
					this.setState({
						iframe_width: this.state.tab_width * 0.421875,
						iframe_height: this.state.tab_width * 0.5625,
						iframe_screen_width: 768,
						iframe_screen_height: 1024,
					});
					break;
				case 2: // mobile
					this.setState({
						iframe_width: this.state.tab_width * 0.26,
						iframe_height: this.state.tab_width * 0.5625,
						iframe_screen_width: 375,
						iframe_screen_height: 812,
					});
					break;
				case 0: // desktop
				default:
					this.setState({
						iframe_width: this.state.tab_width,
						iframe_height: this.state.tab_width * 0.5625,
						iframe_screen_width: 1366,
						iframe_screen_height: 768,
					});
					break;
			}
		}
	}

	selectTab = index => {
		this.setState({
			selected_tab: index,
		});
	};

	render(){
		return (
			<div className={"landing-body"}>
				<SiteHeader for1st={true}/>
				<main className="home-main">
					<div className="lp1-div">
						<div className="fadein-page">
							<div className="section1-grid">
								<h1 id="w-node-b317dca94991-5ad274e5" className="lp-header1">
									From international ministries to neighborhood barbecues, <span className="text-span-5"><br/>we are the church.</span>
								</h1>
								<p className="paragraph-6">BeTheChurch.io is a platform engineered to equip ministries with
									enterprise technology<br/>
									<br/>reach more of His people so that we can collectively as a body make more
									and maturing disciples of Jesus while strengthening our herd as we strive to reach those being
									tossed by the winds and waves of the sea.<br/>
								</p>
								<div id="w-node-8c49888ab37b-5ad274e5" className="div-block-321">
									<Link id="w-node-665fc2586de7-5ad274e5"
												to="/search-results/undefined/null/44.989999/-93.256088/undefined"
												className="lp-button purple w-button">
										Find a community</Link>
									<Link to={this.props.auth.isAuthenticated ? "/dashboard" : "/register-popup"}
												className="lp-button white w-button">
										Create a free account
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className="lp2-div">
						<div className="fadein-scroll">
							{/*
							<h1 id="w-node-2c02e75c52e0-5ad274e5"
									data-w-id="1a4127ed-5c94-7113-f8c1-2c02e75c52e0"
									className="lp-header3">We're
								striving to equip organizations and everyday believers alike, with enterprise technology engineered to
								empower and further their own ministries; while glorifying and fortifying His kingdom.
							</h1>
							*/}
							<div className={"animation-text"}>
								<span className={"find-your"}>Find your</span>&nbsp;
								<span>
									<span className={`community-category ${this.state.ani_selected ? "selected" : ""}`}>
										{this.state.ani_text}
										{this.state.ani_cursor ? (
											<span className={"cursor"}>&nbsp;</span>
										) : null}
									</span>
								</span>
							</div>
						</div>
					</div>
				</main>
				<div className="lp-div lp3">
					<div>
						<div className="_20bottom-div opacity-transition" ref={this.refLp41}
								 style={{opacity: this.state.lp41_opacity, borderBottom: "1px solid #fff"}}>
							<h1 data-w-id="a5851cf8-b2e4-fa22-7bd7-af6a508bbfb7" className="lp-header2">
								Whether it be one or one-million, every community creates a beacon of light. We want to help them shine
								brighter.
							</h1>
						</div>
						<div className="lp4-grid">
							<div className="fadein-scroll">
								<div className="lp-grid">
									<div className="lp-grid1 opacity-transition" ref={this.refLp42}
											 style={{opacity: this.state.lp42_opacity}}>
										<h2 className="lp-header4">Add one to infinity.</h2>
										<p className="lp-paragraph">
											It doesn't matter if you're an international ministry reaching the globe, or an individual sitting
											in your parents basement hosting a weekly small group - we are the church. When you add your
											community or communities to the global database, you create a beacon of light for someone that's
											new, lost, or wandering to find and navigate towards. Whether it be a casual neighborhood bbq, or
											a weekly deep dive into scripture - we want there to be a community of everyday believers for
											anyone and everyone to plug into, lean on, and walk with.
										</p>
									</div>
									<div>
										<img
											src={"/img/5ec919d2107e4666d5215cf7_Screen%20Shot%202020-05-23%20at%207.38.25%20AM.png"}
											srcSet={"/img/5ec919d2107e4666d5215cf7_Screen%20Shot%202020-05-23%20at%207.38.25%20AM-p-500.png 500w, /img/5ec919d2107e4666d5215cf7_Screen%20Shot%202020-05-23%20at%207.38.25%20AM-p-800.png 800w, /img/5ec919d2107e4666d5215cf7_Screen%20Shot%202020-05-23%20at%207.38.25%20AM-p-1080.png 1080w, /img/5ec919d2107e4666d5215cf7_Screen%20Shot%202020-05-23%20at%207.38.25%20AM.png 1584w"}
											sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 96vw, (max-width: 3683px) 43vw, 1584px"
											alt="" className="lp-thumbnail opacity-transition" ref={this.refLp43}
											style={{opacity: this.state.lp43_opacity}}/>
									</div>
								</div>
							</div>
							<div className="fadein-scroll">
								<div className="lp-grid">
									<div className="lp-grid1 opacity-transition" ref={this.refLp44}
											 style={{opacity: this.state.lp44_opacity}}>
										<h2 className="lp-header4">Showcase your community ecosystem.</h2>
										<p className="lp-paragraph">
											In addition to making it easier for others to find and plug into your communities, you can also feature yours on your own website using our enterprise search engine technology. The display itself is fully customizable to match your brand or personality, and the functionality is compatible on any device or browser. In addition, you can embed it on as many different pages as you would like in just three clicks, with the added peace of mind of knowing you have our incredible community support team behind you every step of the way.
										</p>
									</div>
									<img
										src={"/img/5ec81fc21cebeb48fa4ec7a3_Screen%20Shot%202020-05-22%20at%201.52.35%20PM.png"}
										srcSet={"/img/5ec81fc21cebeb48fa4ec7a3_Screen%20Shot%202020-05-22%20at%201.52.35%20PM-p-500.png 500w, /img/5ec81fc21cebeb48fa4ec7a3_Screen%20Shot%202020-05-22%20at%201.52.35%20PM-p-800.png 800w, /img/5ec81fc21cebeb48fa4ec7a3_Screen%20Shot%202020-05-22%20at%201.52.35%20PM-p-1080.png 1080w, /img/5ec81fc21cebeb48fa4ec7a3_Screen%20Shot%202020-05-22%20at%201.52.35%20PM.png 1444w"}
										sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 96vw, (max-width: 3438px) 42vw, 1444px"
										id="w-node-576db9485deb-5ad274e5" alt="" className="lp-thumbnail opacity-transition"
										ref={this.refLp45} style={{opacity: this.state.lp45_opacity}}/>
								</div>
							</div>
							<div className="fadein-scroll">
								<div className="lp-grid">
									<div className="lp-grid1 opacity-transition" ref={this.refLp46}
											 style={{opacity: this.state.lp46_opacity}}>
										<h2 className="lp-header4">Manage your communities.</h2>
										<p className="lp-paragraph">
											You can add, remove or edit any community anytime you would like from your simple, yet robust dashboard. Any changes you make will instantly be reflected anywhere and everywhere your communities are displayed the moment you click 'Save'. We're hoping that by increasing the accessibility of information to both everyday and non believers, while streamlining internal operations - we can scale both yours and the kingdoms community ecosystems and make His light shine ever brighter beyond the confines of the 'church'.
										</p>
									</div>
									<img
										src={"/img/5ec919c8a391aa56b673b661_Screen%20Shot%202020-05-23%20at%207.39.02%20AM.png"}
										srcSet={"/img/5ec919c8a391aa56b673b661_Screen%20Shot%202020-05-23%20at%207.39.02%20AM-p-800.png 800w, /img/5ec919c8a391aa56b673b661_Screen%20Shot%202020-05-23%20at%207.39.02%20AM-p-1080.png 1080w, /img/5ec919c8a391aa56b673b661_Screen%20Shot%202020-05-23%20at%207.39.02%20AM.png 1582w"}
										sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 96vw, (max-width: 3679px) 43vw, 1582px"
										id="w-node-576db9485de5-5ad274e5" alt="" className="lp-thumbnail opacity-transition"
										ref={this.refLp47} style={{opacity: this.state.lp47_opacity}}/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="lp-div lp4">
					<div className="_20bottom-div opacity-transition" ref={this.refLp31}
							 style={{opacity: this.state.lp31_opacity}}>
						<h1 data-w-id="a5851cf8-b2e4-fa22-7bd7-af6a508bbfb7" className="lp-header2">
							Showcase your communities on our own website.
						</h1>
					</div>
					<div className="_20top-div topborder opacity-transition" ref={this.refLp32}
							 style={{opacity: this.state.lp32_opacity}}>
						<h1 data-w-id="e8a8a1ad-a79a-7812-40e8-2a63b00abef5" className="lp-paragraph">
							Below is a preview of what your communities would look like if you chose to use our technology to feature them on your website. The functionality is fully responsive and compatible on any device or browser, and the display itself can be customized to match your brand or personality. Best part? It only takes three clicks to install. Go ahead, try it out!
						</h1>
					</div>
					<div className={" opacity-transition"} ref={this.refLp33} style={{opacity: this.state.lp33_opacity}}>
						<div data-duration-in="300" data-duration-out="100" data-w-id="b4f3efd6-7373-d185-48b1-4a4456eb9d02"
								 className="w-tabs">
							<div className="lp-tabsmenu w-tab-menu" role="tablist" ref={this.refTab}>
								<div data-w-tab="Tab 1"
										 className={`demo-tab w-inline-block ${this.state.selected_tab === 0 ? "w--current" : ""}`}
										 id="w-tabs-0-data-w-tab-0">
									<div className={"iframe-demo-link"} onClick={() => {
										this.selectTab(0);
									}}>
										<i className="fas fa-desktop"/>
									</div>
								</div>
								<div data-w-tab="Tab 2"
										 className={`demo-tab w-inline-block ${this.state.selected_tab === 1 ? "w--current" : ""}`}
										 id="w-tabs-0-data-w-tab-1">
									<div className={"iframe-demo-link"} onClick={() => {
										this.selectTab(1);
									}}>
										<i className="fas fa-tablet-alt"/>
									</div>
								</div>
								<div data-w-tab="Tab 3"
										 className={`demo-tab w-inline-block ${this.state.selected_tab === 2 ? "w--current" : ""}`}
										 id="w-tabs-0-data-w-tab-2">
									<div className={"iframe-demo-link"} onClick={() => {
										this.selectTab(2);
									}}>
										<i className="fas fa-mobile-alt"/>
									</div>
								</div>
							</div>
							<div className="w-tab-content">
								<div data-w-tab="Tab 1" className="w-tab-pane w--tab-active" id="w-tabs-0-data-w-pane-0" role="tabpanel"
										 aria-labelledby="w-tabs-0-data-w-tab-0">
									<div className="div-block-337">
										<div className="html-embed-12 w-embed w-iframe" style={{
											maxWidth: this.state.iframe_width,
											height: this.state.iframe_height,
										}}>
											<iframe title={"preview communities"}
															src="https://develop.findyourchurch.org/iframe/John-Smith-5ebe7354f9f9970e0c327de5/undefined"
															style={{
																width: this.state.iframe_screen_width,
																height: this.state.iframe_screen_height,
																transform: `scale(${this.state.iframe_width / this.state.iframe_screen_width})`,
																transformOrigin: "0 0",
																border: "none", outline: "none",
															}}
															__idm_frm__="459"/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="div-block-298-copy">
					<div id="w-node-99ff29a3cf9c-5ad274e5" className="div-block-341">
						<Link id="w-node-99ff29a3cf9d-5ad274e5"
									to="/search-results/undefined/null/44.989999/-93.256088/undefined"
									className="lp-button purple w-button">Find a community</Link>
						<Link id="w-node-99ff29a3cf9f-5ad274e5"
									to={this.props.auth.isAuthenticated ? "/dashboard" : "/register-popup"}
									className="lp-button white margin w-button">
							Create a free account</Link>
					</div>
				</div>
				<SiteFooter/>
			</div>
		);
	}
}

Home.propTypes = {
	auth: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{getUserInfo}
)(Home);
