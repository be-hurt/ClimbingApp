import React, { Component } from 'react';
import formatDate from '../scripts/formatDate';

class Comment extends Component {
	render() {
		return (
			<div className='comment'>
				<p>User: {this.props.author}</p>
				<p>Posted: {formatDate(this.props.date)}</p>
				<p>{this.props.text}</p>
			</div>
		)
	}
}

export default Comment;