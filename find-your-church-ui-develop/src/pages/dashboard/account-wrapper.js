import React, {Component} from "react";
import {Elements} from "react-stripe-elements";
import Account from "./account";
import SiteHeader from "../../components/site-header";

class AccountWrapper extends Component{
	render(){
		return (
				<>
					<SiteHeader/>
					<Elements>
						<Account/>
					</Elements>
				</>
		);
	}
}

export default AccountWrapper;
