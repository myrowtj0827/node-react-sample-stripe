import React, {Component} from "react";

class FaqItem extends Component{
	constructor(props){
		super(props);

		this.state = {
			showed_content: false,
		};
	}

	toggleContent = () => {
		this.setState({showed_content: !this.state.showed_content});
	}

	render(){
		return (
			<div>
				<div className="accordionrow-div">
					<div data-w-id="1f9809fe-e235-7ade-230e-4515d71a67c7" className="accordingcontainer-div" onClick={this.toggleContent}>
						<div className="accordionheader-div"><h3 className="accordion-header">Heading</h3></div>
						<div style={{maxHeight: this.state.showed_content ? "100vh" : "0"}} className="accordioncontent-div">
							<div className="_20topbottom-div"><p>{this.props.content}</p></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default FaqItem;
