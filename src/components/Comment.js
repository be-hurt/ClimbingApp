import React, { Component } from 'react';
import formatDate from '../scripts/formatDate';
import Auth from '../modules/Auth';
import jwt_decode from 'jwt-decode';

class Comment extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
	      errors: {},
	      commentData: {
	        comment: '',
	        name: ''
	      },
	      successMessage: '',
	      message: '',
	      editing: false,
	      deleted: false
   		}

	    this.checkUser = this.checkUser.bind(this);
	    this.deleteComment = this.deleteComment.bind(this);
	    this.editComment = this.editComment.bind(this);
	    this.submitEdit = this.submitEdit.bind(this);
	    this.onEditChange = this.onEditChange.bind(this);
	    this.cancelEdit = this.cancelEdit.bind(this);
  	}

	deleteComment() {
		//confirm the user wants to delete
		var confirmation = window.confirm("Are you sure you want to delete your comment?");
		if (confirmation && Auth.isUserAuthenticated()) {
    		//create a string for our HTTP body message
		    //need to get the current userid
		    const token = Auth.getToken();
		    const decoded = jwt_decode(token);
		    const userid = decoded.sub;
		    const formData = `userid=${userid}`;
		    const wall = this.props.wall;

		    const xhr = new XMLHttpRequest();
		    xhr.open('DELETE', `http://localhost:3001/api/walls/${wall}/comments/${this.props.id}`);
		    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.responseType = 'json';
		    xhr.addEventListener('load', () => {
		      if(xhr.status === 200) {
		        // change the component-container state
		        this.setState({
		          errors: {},
		          commentData: {
		            comment: '', 
		            name: ''
		          },
		          successMessage: xhr.response.message,
		          deleted: true
		        });
		      } else {
		        // failure  
		       // change the component state
		        const errors = xhr.response.errors ? xhr.response.errors : {};
		        errors.summary = xhr.response.message;
		        this.setState({
		          errors
		        });
		      }
		    });
		    xhr.send(formData);
		} 
	}

	editComment() {
		this.setState({editing: true});
	}

	cancelEdit() {
		this.setState({editing: false});
	}

	onEditChange(event) {
		const field = event.target.name;
    	const commentData = this.state.commentData;
    	commentData[field] = event.target.value;
    	this.setState({
      		commentData
    	});
	}

	submitEdit() {
		if(Auth.isUserAuthenticated()) {
			//create a string for our HTTP body message
		    //need to get the current userid
		    const token = Auth.getToken();
		    const decoded = jwt_decode(token);
		    const user = decoded.sub;
		    const formData = `user=${user}&comment=${this.state.commentData.comment}`;
		    const wall = this.props.wall;

		    const xhr = new XMLHttpRequest();
		    xhr.open('PUT', `http://localhost:3001/api/walls/${wall}/comments/${this.props.id}`);
		    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.responseType = 'json';
		    xhr.addEventListener('load', () => {
		      if(xhr.status === 200) {
		        // change the component-container state
		        this.setState({
		          errors: {},
		          commentData: {
		            comment: '', 
		            name: ''
		          },
		          successMessage: xhr.response.message
		        });
		      } else {
		        // failure  
		       // change the component state
		        const errors = xhr.response.errors ? xhr.response.errors : {};
		        errors.summary = xhr.response.message;
		        this.setState({
		          errors
		        });
		      }
		    });
		    xhr.send(formData);
		}
	}

	//create method to check if comment belongs to current user
	checkUser() {
		if(Auth.isUserAuthenticated()) {
			const userid = jwt_decode(Auth.getToken()).sub;
			if(this.props.authorid === userid) {
				return (
					<div>
						<button className='editButton' onClick={() => { this.editComment() }}>edit</button>
						<button className='editButton' onClick={() => { this.deleteComment() }}>delete</button>
					</div>
				);
			}
		} else {
			return;
		}
	}

	componentDidMount() {
    	this.setState({commentData: {
    		comment: this.props.text
    	}});
  	}

	render() {
		return (
			<div className='comment'>
				{
					this.state.deleted ?
					<p className="message">{this.state.successMessage}</p>
					:
					<div>
						<p className="message">{this.state.successMessage}</p>
						<p>User: {this.props.author}</p>
						<p>Posted: {formatDate(this.props.date)}</p>
					</div>
				}
				{
					this.state.editing ?

              		<div className="comment-form">
        				<form onSubmit={this.submitEdit}>
			            <div className="form-group">
			                <label htmlFor="fieldComment" className="control-label"><h2>Edit Comment: </h2></label>
			                <textarea rows="8" cols="50" className="form-control" id="fieldComment" name="comment" errortext={this.state.errors.comment} onChange={this.onEditChange} value={this.state.commentData.comment} />
			            </div>
			            <div className="form-group">
			                <div>
			                    <button type="submit" className="btn btn-default">Edit</button>
			                    <button className="btn btn-default" onClick={() => { this.cancelEdit() }}>Cancel</button>
			                </div>
			            </div>
			        	</form>
    				</div>

              		:
              		<div>
					</div>
            	}
            	{
            		this.state.deleted || this.state.editing ?
            		<div>
					</div>
					:
					<div>
						{ this.checkUser() }
						<p>{this.props.text}</p>
					</div>
            	}
			</div>
		)
	}
}

export default Comment;