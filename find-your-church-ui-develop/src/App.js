import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {Provider} from "react-redux";
import 'w3-css/w3.css';
import './App.css';
import Home from "./pages/home";
import SearchResults from "./pages/search-results";
import LoginPopup from "./pages/login-popup";
import RegisterPopup from "./pages/register-popup";
import PrivateRoute from "./components/private-route";
import setAuthToken from "./utils/setAuthToken";
import store from "./reducers/store"
import {logoutUser, setCurrentUser} from "./actions/auth-actions";
import CommunityStep from "./pages/dashboard/community-step";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import Notfound from "./pages/notfound";
import Admin from "./pages/dashboard/admin";
import ViewCommunity from "./pages/dashboard/view-community";
import {StripeProvider} from "react-stripe-elements";
import app_config from "./conf/config";
import ChangePassword from "./pages/change-password";
import AccountWrapper from "./pages/dashboard/account-wrapper";
import VerifyEmail from "./pages/verify-email";
import WelcomePage from "./pages/welcome-page";
import MakeSuggestionPage from "./pages/make-suggestion-page";
import TermsNConditionsPage from "./pages/terms-n-conditions-page";
import PrivacyPolicy from "./pages/privacy-policy";
import InvitedViewCommunity from "./pages/invited-view-community";
import PreviewSearchResults from "./pages/preview-search-results";
import SearchResultsIframe from "./pages/search-results-iframe";
import DashboardResults from "./pages/dashboard/dashboard-results";

if(localStorage.jwtToken){
	// Set auth token header auth
	const token = localStorage.jwtToken;
	setAuthToken(token);
	// Decode token and get user info and exp
	const decoded = jwt_decode(token);
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));
	// Check for expired token
	const currentTime = Date.now() / 1000; // to get in milliseconds
	if(decoded.exp < currentTime){
		// Logout user
		store.dispatch(logoutUser());
		// Redirect to login
		window.location.href = "./login";
	}
}

/**
 * Main component including router.
 */
class App extends Component{
	constructor(props){
		super(props);

		this.state = {
			stripe: null,
		}
	}

	componentDidMount(){
		if(window.Stripe){
			this.setState({stripe: window.Stripe(app_config.STRIPE_PK)});
		}
		else{
			document.querySelector("#stripe-js").addEventListener("load", () => {
				// Creat Stripe instance once Stripe.js loads
				this.setState(({stripe: window.Stripe(app_config.STRIPE_PK)}));
			});
		}
	}

	render(){
		return (
			<Provider store={store}>
				<StripeProvider stripe={this.state.stripe}>
					<Router>
						<Switch>
							<Route exact path="/" component={Home}/>
							<Route exact path="/search-results" component={SearchResults}/>
							<Route path="/search-results/:category/:radius/:lat/:lng/:filter" component={SearchResults}/>
							<Route path="/iframe/:owner/:filter" component={SearchResultsIframe}/>
							<Route path="/preview-search-results/:owner/:filter" component={PreviewSearchResults}/>

							<Route exact path="/login-popup" component={LoginPopup}/>
							<Route exact path="/register-popup" component={RegisterPopup}/>
							<Route exact path="/welcome" component={WelcomePage}/>
							<Route exact path="/forgot-password" component={ForgotPassword}/>
							<Route path="/reset-password/:id?" component={ResetPassword}/>
							<Route path="/change-password/:id?" component={ChangePassword}/>
							<Route path="/verify-email/:id?" component={VerifyEmail}/>

							<PrivateRoute exact path="/create-new-community" component={CommunityStep}/>

							<Route exact path="/view" component={ViewCommunity}/>
							<Route path="/view-community/:id" component={InvitedViewCommunity}/>
							<PrivateRoute exact path="/edit" component={CommunityStep}/>

							<PrivateRoute exact path="/dashboard" component={Admin}/>
							<PrivateRoute exact path="/dashboard-results" component={DashboardResults}/>
							<PrivateRoute exact path="/dashboard/admin" component={Admin}/>
							<PrivateRoute exact path="/dashboard/account" component={AccountWrapper}/>
							<Route exact path="/make-suggestion" component={MakeSuggestionPage}/>
							<Route exact path="/terms-n-conditions" component={TermsNConditionsPage}/>
							<Route exact path="/privacy-policy" component={PrivacyPolicy}/>

							<Route component={Notfound}/>
						</Switch>
					</Router>
				</StripeProvider>
			</Provider>
		);
	}
}

export default App;
