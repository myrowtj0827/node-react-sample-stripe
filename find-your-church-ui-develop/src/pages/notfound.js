import React, {Component} from "react";
import "../css/404.css";
import {Link, Redirect} from "react-router-dom";
import SiteHeader from "../components/site-header";

class Notfound extends Component{
	constructor(){
		super();

		this.state = {
			goingHome: false,
		}
	}

	render(){
		setTimeout(() => {
			this.setState({goingHome: true})
		}, 5000);
		return (
				this.state.goingHome ?
						<Redirect to={"/"}/>
						:
						<>
							<SiteHeader/>
							<main>
								<div className="notfound-body">
									<div className="w3-display-middle w3-text-gray">
										<h1 className={"jumbo-title"}>404</h1>
										<p className={"w3-small"}>Oops, the page was not found.</p>
										<p>This page will be <strong className={"w3-xlarge w3-text-purple"}>redirected</strong> to the HOME
											page <strong className={"w3-large w3-text-purple"}>automatically</strong>.</p>
										<p>Or you can click <Link to={"/"}><span
												className={"w3-text-purple w3-xxlarge"}>here</span></Link> directly.</p>
									</div>
								</div>
							</main>
						</>
		);
	}
}

export default Notfound;
