import React, {Component} from "react";
import {Link} from "react-router-dom";
// import {GoogleLogin} from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser, loginGoogleUser, clearErrors, hideWelcomeMessage} from "../actions/auth-actions";
import SiteFooter from "../components/site-footer";
import isEmpty from "../utils/isEmpty";
import SiteHeader from "../components/site-header";

class LoginPopup extends Component{
	constructor(props){
		super(props);

		this.state = {
			email: "",
			password: "",
		};
	}

	componentDidMount(){
		this.props.clearErrors();
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

		this.props.loginUser({
			email: this.state.email,
			password: this.state.password
		}, this.props.history);

		this.props.hideWelcomeMessage();
	};

	onFailure = (error) => {
		console.log(error);
	};

	/**
	 * get social token from google developer server
	 * @param response
	 */
	googleResponse = response => {
		this.props.loginGoogleUser({
			email: response.w3.U3,
			social_token: response.accessToken,
		});
	};

	facebookResponse = response => {

	};

	render(){
		return (
				<>
					<SiteHeader/>

					<main>
						<div className="sign-body">
							<div className="div-block-63">
								<div className="div-block-38 login">
									{this.props.auth.show_welcome ? (
											<h3 className={"welcome-message"}>
												Account created successfully.
											</h3>
									) : null}
									<div className="header1-div gradient shadow">
										<h3 className="header3 center">Sign in to your dashboard.</h3>
									</div>
									<div>
										<div className="form-div1">
											<div className="form-block1 w-form">
												<form noValidate onSubmit={this.onSubmit} id="wf-form-Registration"
															name="wf-form-Registration"
															data-name="Registration" className="form1 w3-row">
													<div className={"input-group"}>
														<div className={"forminput-div span-2"}>
															<label htmlFor={"email"} className={"form-label"}>Email</label>
															<input type="email"
																		 className="form-input center w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.email}
																		 id="email"
																		 style={{borderColor: this.props.errors.msg_login_email ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																		 required=""/>
														</div>
														<div className={"forminput-div span-2"}>
															<div className={"label-span-2"}>
																<label htmlFor={"email"} className={"form-label"}>
																	Password
																</label>
																<Link to="/forgot-password" class={"lost-password"}>
																	<span className="form-link termsofuse">Lost Password</span>
																</Link>
															</div>
															<input type="password"
																		 className="form-input center w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.password}
																		 id="password"
																		 style={{borderColor: this.props.errors.msg_login_password ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																		 required=""/>
														</div>
														<div className="submit-row forminput-div span-2">
															<input type="submit" value="Sign In"
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
												<div className="w-form-fail" style={{
													display:
															(!isEmpty(this.props.errors.msg_login_email) ||
																	!isEmpty(this.props.errors.msg_login_password)) ? "block" : "none"
												}}>
													<div>{this.props.errors.msg_login_email}</div>
													<div>{this.props.errors.msg_login_password}</div>
												</div>
											</div>
										</div>
									</div>
									<div style={{height: "20px"}}></div>
									<div className="strikethrough-div">
										<div className="or-div"></div>
									</div>
									{/*
									<div>
										<div className="strikethrough-div">
											<div className="or-div"><h4 className="or-text">or</h4></div>
										</div>
										<div className="container-subdiv">
											<div className="sdk-div">
												<GoogleLogin
														clientId={config.GOOGLE_CLIENT_ID}
														buttonText="Sign up with Google"
														onSuccess={this.googleResponse}
														onFailure={this.onFailure}/>
												<FacebookLogin
														appId={config.FACEBOOK_APP_ID}
														autoLoad={false}
														fields="name,email,picture"
														callback={this.facebookResponse}/>
											</div>
										</div>
									</div>
									*/}
									<div className="div-block-46">
										<h1 className="heading-11">
											<Link to="/register-popup" className="link-5">
												<div style={{display: "inline-block", marginRight: "4px"}}>Don't have an account yet?</div>
												<div style={{display: "inline-block", fontWeight: "600", color: "#2e89fe"}}>
													Create one for free
												</div>
											</Link>
										</h1>
									</div>
								</div>
							</div>
						</div>
						<SiteFooter/>
					</main>
				</>
		)
	}
}

LoginPopup.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	clearErrors: PropTypes.func.isRequired,
	loginUser: PropTypes.func.isRequired,
	loginGoogleUser: PropTypes.func.isRequired,
	hideWelcomeMessage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
		mapStateToProps,
		{
			clearErrors,
			loginUser,
			loginGoogleUser,
			hideWelcomeMessage,
		}
)(LoginPopup);
