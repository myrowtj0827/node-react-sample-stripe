import React, {Component} from "react";
import {Link} from "react-router-dom";

class DashboardHeader extends Component{
	render(){
		return (
			<header className="dashboard-header w3-row w3-center">
				<div className="header-wrapper">
					<Link to="/dashboard/admin" className="w3-col l6 w3-hover-text-white">Admin</Link>
					<Link to="/dashboard/account" className="w3-col l6 w3-hover-text-white">Account</Link>
				</div>
			</header>
		);
	}
}

export default DashboardHeader;
