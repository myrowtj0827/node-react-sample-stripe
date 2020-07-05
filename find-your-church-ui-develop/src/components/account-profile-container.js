import React, {Component} from "react";
import {Link} from "react-router-dom";
import "../css/account-profile-container.css";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import isEmpty from "../utils/isEmpty";
import redirectURL from "../utils/redirectURL";

class AccountProfileContainer extends Component{
	constructor(props){
		super(props);

		this.state = {
			is_show_menu: false,
		};
	}

	toggleMenu = () => {
		this.setState({is_show_menu: !this.state.is_show_menu});
	}

	hideMenu = () => {
		this.setState({is_show_menu: false});
	}

	render(){
		const user = this.props.owner === undefined || this.props.owner === null ? this.props.auth.user : this.props.owner;

		return (
			<div className="profile-container" style={{padding: "0"}}>
				<div className={"profile-container-wrapper"}>
					<div className="div-block-55" style={{marginTop: "0"}}>
						<div className="profpic-container">
							<div className="profpic-div">
								<img src={isEmpty(user.pic) ?
									"/img/default-user.png"
									: user.pic}
										 alt="" className="image-4"/>
							</div>
						</div>
					</div>
					<div className="profile-info" style={{marginBottom: "0"}}>
						<div data-collapse="all" data-animation="default" data-duration="400"
								 className="w-nav profile-info-header">
							<h3 className="community-name">
								{
									user.is_organization ? user.organization_name
										: `${user.fname} ${user.lname}`
								}
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
							{isEmpty(user.admin_email) ? null :
								<Link to="#" className={"members email"} title={user.admin_email}
											onClick={() => redirectURL("mailto:" + user.admin_email)}>
								</Link>
							}
							{isEmpty(user.phone) ? null :
								<Link to="#" className={"members phone"} title={user.phone}
											onClick={() => redirectURL("tel:" + user.phone)}>
								</Link>
							}
							{isEmpty(user.website) ? null :
								<Link to="#" className={"members website"} title={user.website}
											onClick={() => redirectURL(user.website)}>
								</Link>
							}
							{isEmpty(user.facebook) ? null :
								<Link to="#" className={"members facebook"} title={user.facebook}
											onClick={() => redirectURL(user.facebook)}>
								</Link>
							}
							{isEmpty(user.twitter) ? null :
								<Link to="#" className={"members twitter"} title={user.twitter}
											onClick={() => redirectURL(user.twitter)}>
								</Link>
							}
							{isEmpty(user.instagram) ? null :
								<Link to="#" className={"members instagram"} title={user.instagram}
											onClick={() => redirectURL(user.instagram)}>
								</Link>
							}
						</div>
						<div className={"info-zipcode"} title={user.zip_code}>
							{user.zip_code}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AccountProfileContainer.propTypes = {
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
)(AccountProfileContainer);
