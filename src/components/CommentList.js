import React, { Component } from 'react';
import Comment from './Comment';

class CommentList extends Component {
	render() {
		let commentNodes = this.props.data.map(comment => {
			return (
				<Comment 
					author={ comment.author } authorid={ comment.authorId} key={ comment._id } id={ comment._id } 
					date={ comment.date } text={ comment.text } wall={this.props.wall}
				>
				</Comment>
			)
		})
		return (
			<div>
				{ commentNodes }
			</div>
		)
	}
}

export default CommentList;