import React, { Component } from 'react';
import formatDate from '../scripts/formatDate';
import Auth from '../modules/Auth';
import jwt_decode from 'jwt-decode';

class Comment extends Component {
	constructor(props) {
    super(props);
    this.checkUser = this.checkUser.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.editComment = this.editComment.bind(this);
  }
	//create method to check if comment belongs to current user
	checkUser() {
		const userid = jwt_decode(Auth.getToken()).sub;
		if(this.props.authorid === userid) {
			return (
				<div>
					<button className='editButton' onClick={() => { this.editComment }}>edit</button>
					<button className='editButton' onClick={() => { this.deleteComment }}>delete</button>
				</div>
			);
		}
	}

	deleteComment() {
		
	}

	editComment() {
		
	}

	render() {
		return (
			<div className='comment'>
				<p>User: {this.props.author}</p>
				{ this.checkUser() }
				<p>Posted: {formatDate(this.props.date)}</p>
				<p>{this.props.text}</p>
			</div>
		)
	}
}

export default Comment;