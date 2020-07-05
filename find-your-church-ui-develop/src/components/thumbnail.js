import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
	activateCommunity, clearActiveStatus, clearCouponStatus,
	deactivateCommunity,
	deleteCommunity,
	getBillingStatus,
	pickCommunity
} from "../actions/community-actions";

class Thumbnail extends Component{
	constructor(props){
		super(props);

		this.state = {
			is_editing: false,
			is_viewing: false,
			is_show_menu: false,
			checked: false,
		};

		this.goEdit = this.goEdit.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);
		this.onActivate = this.onActivate.bind(this);
		this.onDeactivate = this.onDeactivate.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	goEdit(e){
		// redirect to community-step with this.props.value (community object with full info).
		// console.log(this.props.value);

		this.setState({is_editing: true});
	}

	goView = e => {
		// redirect to community-step with this.props.value (community object with full info).
		// console.log(this.props.value);

		this.setState({is_viewing: true});
	};

	toggleMenu(e){
		this.setState({is_show_menu: !this.state.is_show_menu});
	}

	hideMenu(e){
		this.setState({is_show_menu: false});
	}

	onActivate(e){
		this.props.clearActiveStatus();
		this.props.clearCouponStatus(false);
		this.props.getBillingStatus({
			user_id: this.props.auth.user.id,
		}, this.props.history);

		// is available just move up?
		if(this.props.community.subscription && (this.props.community.my_communities.active.length < this.props.community.subscription.quantity + this.props.community.tickets)){
			this.props.activateCommunity({
				id: this.props.auth.user.id,
				community_id: this.props.value._id,
				source: null,
				coupon: null,
			});
		}
		else{
			// pick the community to be activated
			this.props.pickCommunity({
				community_id: this.props.value._id,
			});

			// show modal dialog
			this.props.handleShowSubDlg();
		}

		// hide thumbnail menu
		this.setState({is_show_menu: false});
	}

	onDeactivate(e){
		// do deactivate the community.
		this.props.deactivateCommunity({
			id: this.props.auth.user.id,
			community_id: this.props.value._id,
		});

		// hide thumbnail menu
		this.setState({is_show_menu: false});
	}

	onDelete(e){
		if(true === window.confirm(`Delete the community "${this.props.value.community_name}"?`)){
			this.props.deleteCommunity({
				community_id: this.props.value._id,
			}, this.props.history);
			this.setState({is_show_menu: false});
		}
	}

	handleCheck = e => {
		const new_value = !this.state.checked;
		this.setState({checked: new_value});
		this.props.handleSelect(this.props.value._id, new_value);
	};

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.props.status === "inactive" && prevProps.community.communities_activated !== this.props.community.communities_activated && this.props.community.communities_activated.length === 0){
			this.setState({checked: false});
		}

		if(prevProps.community.showing !== this.props.community.showing && !this.props.community.showing){
			this.setState({checked: false});
		}
	}

	render(){
		return (
				this.state.is_viewing ? (
						<Redirect to={{pathname: '/view', state: {obj: this.props.value}}}/>
				) : (
						this.state.is_editing ? (
								<Redirect to={{pathname: '/edit', state: {obj: this.props.value}}}/>
						) : (

								<div className="listing-container1" onMouseLeave={this.hideMenu}
										 style={{border: "1px solid rgba(14, 0, 25, 0.15)"}}
								>
									<Link to="#" onClick={this.goView}>
										<div
												className={"listingprofilepic-div"}
												style={{
													backgroundImage: `url('${this.props.value.pictures.length > 0 ? this.props.value.pictures[0]
															: "/img/default-community/5e2672d254abf8af5a1ec82c_Community-p-500.png"}')`
												}}>
										</div>
									</Link>
									<div className="listinginfo-div">
										<div className="listingrow">
											<div data-collapse="all" data-animation="default" data-duration="400"
													 className="listing-nav w-nav">
												<Link to="#" className="communityname" onClick={this.goView}>
													{this.props.value.community_name}
												</Link>
												<div className="listingnav-button w-nav-button" onClick={this.toggleMenu}>
													<i className={"fas fa-pen"} style={{fontSize: "12px", color: "rgba(14, 0, 25, 0.2)"}}/>
												</div>
												<nav role="navigation" className={"w3-animate-opacity listing-navmenu w-nav-menu"}
														 style={{display: this.state.is_show_menu ? "block" : "none"}}>
													<Link to="#" className="listing-navlink w-nav-link" onClick={this.goEdit}>
														Edit
													</Link>
													{/*
													<Link to="#" className="listing-navlink w-nav-link"
																onClick={this.props.value.activated ? this.onDeactivate : this.onActivate}>
														{this.props.value.activated ? "Deactivate" : "Activate"}
													</Link>
													*/}
													{this.props.status === "inactive" ? (
															<Link to="#" className="listing-navlink w-nav-link" onClick={this.onDelete}>
																Delete
															</Link>
													) : null}
												</nav>
												<div className="w-nav-overlay" data-wf-ignore="">
												</div>
											</div>
										</div>
										<div className="listingrow">
											<h5 className="communitycategory">{this.props.value.category}</h5>
										</div>
										<div className="listingrow">
											<h5 className="communityaddress">{this.props.value.address}</h5>
										</div>
										<div className="form-block-4">
											<label
													className="w-checkbox checkbox-field">
												<input type="checkbox" checked={this.state.checked} onChange={() => {}}
															 className="w-checkbox-input checkbox" onClick={this.handleCheck}/>
												<span
														className="checkbox-label w-form-label">.</span>
											</label>
										</div>
									</div>
								</div>
						)
				)
		);
	}
}

Thumbnail.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	activateCommunity: PropTypes.func.isRequired,
	deactivateCommunity: PropTypes.func.isRequired,
	deleteCommunity: PropTypes.func.isRequired,
	pickCommunity: PropTypes.func.isRequired,
	clearActiveStatus: PropTypes.func.isRequired,
	clearCouponStatus: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
});

export default connect(
		mapStateToProps,
		{
			activateCommunity,
			deactivateCommunity,
			deleteCommunity,
			pickCommunity,
			clearActiveStatus,
			clearCouponStatus,
			getBillingStatus,
		}
)(Thumbnail);
