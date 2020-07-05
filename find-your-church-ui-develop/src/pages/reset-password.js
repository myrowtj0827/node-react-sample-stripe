import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {doResetPassword} from "../actions/auth-actions";
import SiteHeader from "../components/site-header";

class ResetPassword extends Component{
	constructor(props){
		super(props);

		this.key = props.location.pathname.substr(16); // 16 - length of "/reset-password/", which is URL prefix for reset.

		this.state = {
			errors: {}
		};
	}

	componentDidMount(){
		const userData = {
			key: this.key,
		};
		// since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
		this.props.doResetPassword(userData, this.props.history);
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	render(){
		return (
				<>
					<SiteHeader/>
					<main>
						<div className="sign-body">
							<h4 className="w3-display-middle w3-text-grey">
								{this.state.errors.error}
							</h4>
						</div>
						<SiteFooter/>
					</main>
				</>
		);
	}
}

ResetPassword.propTypes = {
	doResetPassword: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	errors: state.errors
});

export default connect(
		mapStateToProps,
		{doResetPassword}
)(ResetPassword);
