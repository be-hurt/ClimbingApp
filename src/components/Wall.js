import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import marked from 'marked';

class Wall extends Component {
	rawMarkup() {
		let rawMarkup = marked(this.props.children.toString());
		return { __html: rawMarkup };
	} 

	render() {
		return (
			<div className='wall'>
				<div className='wall-header'>
					<img src={`/data/${this.props.image}`} alt="Rock climbing wall"/>
				</div>
				<div className='wall-card-text'>
					<Link to={`/walls/${this.props.id}`}><h3>{this.props.name}</h3></Link>
					<p>Added: {this.props.date}</p>
					<p>Difficulty: {this.props.difficulty}</p>
					<p>Rating: {this.props.rating}</p>
					<span dangerouslySetInnerHTML={ this.rawMarkup() } />
				</div>
			</div>
		)
	}
}

export default Wall;