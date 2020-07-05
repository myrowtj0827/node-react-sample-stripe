import React, {Component} from 'react';

// ref to https://medium.com/kirsten-werner/clickable-markers-in-a-google-maps-react-component-3e9a522e1fff
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setPicking} from "../actions/community-actions";

class CommunityMap extends Component{
	constructor(props){
		super(props);

		this.refMap = React.createRef();

		this.state = {
			lat: this.props.criteria.lat,
			lng: this.props.criteria.lng,
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevProps.criteria.lat !== this.props.criteria.lat || prevProps.criteria.lng !== this.props.criteria.lng){
				this.setState({
					lat: this.props.criteria.lat,
					lng: this.props.criteria.lng,
				});
		}

		// if(this.props.community.picking !== -1 && this.props.community.picking !== prevProps.community.picking){
		// 	this.setState({
		// 		lat: parseFloat(this.props.results[this.props.community.picking].data.coordinate.lat),
		// 		lng: parseFloat(this.props.results[this.props.community.picking].data.coordinate.lng),
		// 	});
		// }
	}

	radiusToZoom(radius){
		if(radius === null || radius === undefined || isNaN(radius))
			return 3;

		if(radius > 8)
			return Math.round(14 - Math.log(radius) / Math.LN2);

		let zoom;
		switch(radius){
			case 1:
				zoom = 14;
				break;
			case 2:
			case 3:
				zoom = 13;
				break;
			case 4:
			case 5:
				zoom = 12;
				break;
			default:
				zoom = 14;
		}
		return zoom; //
	}

	/**
	 *
	 * @param index
	 */
	onClickMarker = (index) => {
		this.props.setPicking(index);
		this.props.handleScroll(index);
	};

	onMovedMap = () => {
		const center_pos = this.refMap.current.getCenter();
		this.setState({
			lat: center_pos.lat(),
			lng: center_pos.lng(),
		});
	};

	render(){
		const zoom = this.radiusToZoom(this.props.criteria.radius);
		const hover_icon = {
			path: "M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z",
			fillColor: this.props.colorTheme === undefined ? "#8900fe" : this.props.colorTheme,
			fillOpacity: 1,
			anchor: {x: 12, y: 24},
			strokeWeight: 0,
			scale: 1
		};

		return (
			<GoogleMap ref={this.refMap} defaultZoom={zoom} zoom={zoom}
								 mapOptions={{mapTypeControl: false}}
								 center={{
										 lat: this.state.lat,
										 lng: this.state.lng,
									 }}
								 onCenterChanged={this.onMovedMap}
			>
				{/*
					GoogleMap's attribute removed: center={{lat: this.props.community.criteria.lat, lng: this.props.community.criteria.lng}}
				*/}
				{this.props.results.map((item, index) => {
					const lat = parseFloat(item.data.coordinate.lat);
					const lng = parseFloat(item.data.coordinate.lng);
					return (
						<Marker key={"marker" + index} onClick={() => this.onClickMarker(index)}
										position={{lat: lat, lng: lng}}
										icon={this.props.community.picking === index ? hover_icon
											: {url: "/img/icon/icon-address-marker.svg"}
										}
										title={item.data.community_name}
										zIndex={this.props.community.picking === index ? 1000 : 900}
						/>
					)
				})}
			</GoogleMap>
		);
	}
}

CommunityMap.propTypes = {
	community: PropTypes.object.isRequired,
	setPicking: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{setPicking}
)(withGoogleMap(CommunityMap));
