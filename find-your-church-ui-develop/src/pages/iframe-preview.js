import React, {Component} from "react";
import '../css/home.css';
import {connect} from "react-redux";

/**
 *
 */
class IframePreview extends Component{
	render(){
		return (
			<main className="home-main">

			</main>
		);
	}
}

IframePreview.propTypes = {
};
const mapStateToProps = state => ({
});
export default connect(
	mapStateToProps,
	{}
)(IframePreview);
