import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Popup from "reactjs-popup";
import isEmpty from "../utils/isEmpty";
import redirectURL from "../utils/redirectURL";

class ProfileContainer extends Component{
	constructor(props){
		super(props);

		this.state = {
			is_show_menu: false,
		};

		this.toggleMenu = this.toggleMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);
	}

	toggleMenu(){
		this.setState({is_show_menu: !this.state.is_show_menu});
	}

	hideMenu(){
		this.setState({is_show_menu: false});
	}

	render(){
		return (
				<div className="profile-container">
					<div className="containerheader-div underline">
						<div className={"profile-header-wrapper"}>
							<h5 className="profile-header">Admin Profile</h5>
							<Popup
									className={"profile-tooltip"}
									trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
									position={"left top"}>
								<div>This is the information that will be displayed on each of the communities you are an admin of. You
									can update the information on your Admin Profile from your "Account" page.
								</div>
							</Popup>
						</div>
					</div>
					<div className={"profile-container-wrapper"}>
						<div className="div-block-55">
							<div className="profpic-container">
								<div className="profpic-div">
									<img src={isEmpty(this.props.auth.user.pic) ?
											"/img/default-user.png"
											: this.props.auth.user.pic}
											 alt="" className="image-4"/>
								</div>
							</div>
						</div>
						<div className="profile-info">
							<div data-collapse="all" data-animation="default" data-duration="400"
									 className="w-nav profile-info-header">
								<h3 className="community-name">
									{this.props.auth.user.fname} {this.props.auth.user.lname}
								</h3>
								{/*
								<Link to="#" className={"profile-3dot w3-right"} onClick={this.toggleMenu}>
									<i className={"fas fa-ellipsis-h"} style={{color: "#a1a1a1"}}/>
								</Link>
								<nav role="navigation" className="w3-animate-opacity listing-navmenu w-nav-menu"
									 onMouseLeave={this.hideMenu}
									 style={{display: this.state.is_show_menu ? "block" : "none"}}>
									<Link to="/dashboard/account" className="listing-navlink w-nav-link">
										Edit
									</Link>
								</nav>
								*/}
							</div>
							<div className="personal-info">
								{isEmpty(this.props.auth.user.admin_email) ? null :
										<Link to="#" className={"members"} title={this.props.auth.user.admin_email}
													onClick={() => redirectURL("mailto:" + this.props.auth.user.admin_email)}>
											<img src={"/img/icon/account-email.svg"}
													 alt="" className="personal-pic"/>
										</Link>
								}
								{isEmpty(this.props.auth.user.phone) ? null :
										<Link to="#" className={"members"} title={this.props.auth.user.phone}
													onClick={() => redirectURL("tel:" + this.props.auth.user.phone)}>
											<img src={"/img/icon/account-phone.svg"}
													 alt="" className="personal-pic"/>
										</Link>
								}
							</div>
						</div>
					</div>
				</div>
		);
	}
}

ProfileContainer.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
		mapStateToProps,
		{}
)(ProfileContainer);
