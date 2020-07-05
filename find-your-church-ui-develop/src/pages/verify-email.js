import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {doVerifyEmail} from "../actions/auth-actions";
import SiteHeader from "../components/site-header";

class VerifyEmail extends Component{
	constructor(props){
		super(props);

		this.key = props.location.pathname.substr(14); // 14 - length of "/verify-email/", which is URL prefix for reset.

		this.state = {
			errors: {}
		};
	}

	componentDidMount(){
		const userData = {
			key: this.key,
		};
		// since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
		this.props.doVerifyEmail(userData, this.props.history);
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
								{this.state.errors.msg_verify}
							</h4>
						</div>
						<SiteFooter/>
					</main>
				</>
		);
	}
}

VerifyEmail.propTypes = {
	errors: PropTypes.object.isRequired,
	doVerifyEmail: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors
});

export default connect(
		mapStateToProps,
		{doVerifyEmail}
)(VerifyEmail);
