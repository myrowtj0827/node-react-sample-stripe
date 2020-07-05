import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import SiteHeader from "../components/site-header";

class WelcomePage extends Component{
	render(){
		return (
				<>
					<SiteHeader/>
					<main>
						<div className="sign-body">
							<div className="w3-xxlarge w3-display-middle w3-center w3-text-blue">
								Congrats! Your account was successfully created. Login now to access your dashboard!
								<h3 className={"w3-margin"}>You just joined us.</h3>
								<Link to={"/login-popup"} className={"w3-button w3-blue w3-large"}>SIGN IN</Link>
							</div>
						</div>
						<SiteFooter/>
					</main>
				</>
		);
	}
}

WelcomePage.propTypes = {
	auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
	auth: state.auth,
});
export default connect(
		mapStateToProps,
		{}
)(WelcomePage);
