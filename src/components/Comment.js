import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import marked from 'marked';

class Comment extends Component {
	render() {
		return (
			<div className='comment'>
				<p>{this.props.author}</p>
				<p>Posted: {this.props.date}</p>
				<p>{this.props.text}</p>
			</div>
		)
	}
}

export default Comment;