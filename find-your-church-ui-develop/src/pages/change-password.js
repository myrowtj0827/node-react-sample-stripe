import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {doChangePassword} from "../actions/auth-actions";
import SiteHeader from "../components/site-header";

class ChangePassword extends Component{
	constructor(props){
		super(props);

		this.key = props.location.pathname.substr(17); // 17 - length of "/change-password/", which is URL prefix for reset.

		this.state = {
			email: "",
			password: '',
			password2: '',
		};
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	/**
	 * when click the login button, call axios with email and password.
	 * @param e
	 */
	onSubmit = e => {
		e.preventDefault();

		this.props.doChangePassword({
			key: this.key,
			password: this.state.password,
			password2: this.state.password2,
		}, this.props.history);
	};

	render(){
		return (
				<>
					<SiteHeader/>
					<main>
						<div className="w3-modal" style={{display: this.props.is_sending ? "block" : "none"}}>
							<div className="w3-display-middle w3-text-white w3-jumbo">
								<i className="fas fa-spinner fa-spin"/>
							</div>
						</div>
						<div className="sign-body" style={{filter: this.props.is_sending ? "blur(4px)" : "none"}}>
							<div className="div-block-63">
								<div className="div-block-38">
									<div className="header1-div gradient shadow">
										<h3 className="header3 center">Create a new password for your account.</h3>
									</div>
									<div>
										<div className="form-div1">
											<div className="form-block1 w-form">
												<form noValidate onSubmit={this.onSubmit} id="wf-form-Registration"
															name="wf-form-Registration"
															data-name="Registration" className="form1">
													<div className={"input-group"}>
														<div className={"forminput-div span-2"}>
															<label htmlFor={"email"} className={"form-label"}>New password</label>
															<input type="password"
																		 className="form-input center w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.password}
																		 id="password"
																		 required=""/>
														</div>
														<div className={"forminput-div span-2"}>
															<label htmlFor={"email"} className={"form-label"}>Confirm password</label>
															<input type="password"
																		 className="form-input center w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.password2}
																		 id="password2"
																		 required=""/>
														</div>
														<div className={"forminput-div span-2"}>
															<input type="submit" value="Set password"
																		 data-wait="Please wait..."
																		 className="form-submit round w-button-sign"
																		 style={{marginTop: "0"}}
															/>
														</div>
													</div>
												</form>
												<div className="w-form-done">
													<div>Thank you! Your submission has been received!</div>
												</div>
												<div className="w-form-fail"
														 style={{display: this.props.errors.msg ? "block" : "none"}}>
													{this.props.errors.msg}
												</div>
											</div>
										</div>
									</div>
									<div className="div-block-46">
										<h1 className="heading-11">
											<Link to="/login-popup" className="link-5">
												Back to <span style={{fontWeight: "600", color: "#2e89fe"}}>Sign In</span>
											</Link>
										</h1>
									</div>
								</div>
							</div>
						</div>
						<SiteFooter/>
					</main>
				</>
		);
	}
}

ChangePassword.propTypes = {
	is_sending: PropTypes.bool.isRequired,
	errors: PropTypes.object.isRequired,
	doChangePassword: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	is_sending: state.auth.is_sending,
	errors: state.errors,
});

export default connect(
		mapStateToProps,
		{doChangePassword}
)(ChangePassword);
