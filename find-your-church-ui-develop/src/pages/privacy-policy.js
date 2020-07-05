import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

class PrivacyPolicy extends Component{
	render(){
		return (
				<>
					<SiteHeader/>
					<main>
						<div className="sign-body other">
							<div className="w3-xxlarge w3-display-middle w3-center w3-text-blue">
								Privacy Policy
							</div>
						</div>
						<SiteFooter/>
					</main>
				</>
		);
	}
}

export default PrivacyPolicy;
