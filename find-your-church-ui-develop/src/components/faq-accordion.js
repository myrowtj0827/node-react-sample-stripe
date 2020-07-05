import React from "react";
import "../css/faq-accordion.css";

class FaqAccordion extends React.Component{
	constructor(props){
		super(props);

		this.refContent = React.createRef();

		this.state = {
			collapsed: false,
			max_height: 500,
		}
	}

	componentDidMount(){
		this.setState({max_height: this.refContent.current.clientHeight});

		setTimeout(() => {
			this.setState({collapsed: true});
		}, 1000);
	}

	onClickTitle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		})
	};

	render(){
		const {title, content} = this.props;

		return (
			<div className={'faq-accordion-container'} onClick={this.onClickTitle}>
				<dt className={`title ${this.state.collapsed ? 'collapsed' : ''}`}>
					{title}
				</dt>
				<dd className={`content ${this.state.collapsed ? 'collapsed' : ''}`} style={{
					maxHeight: this.state.collapsed ? 0 : this.state.max_height,
				}} ref={this.refContent}>
					<p>{content}</p>
				</dd>
			</div>
		);

	}
}

export default FaqAccordion;
