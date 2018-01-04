import React, { Component } from 'react';
import axios from 'axios';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import Auth from '../modules/Auth';

class WallDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      commentData: {
        comment: '',
        name: ''
      },
      data: {}
    }

    this.processForm = this.processForm.bind(this);
    this.commentChange = this.commentChange.bind(this);
    this.checkComments = this.checkComments.bind(this);
  }
  //declare methods
  //retrieve the wall data and display it()
  getWallData() {
    //get the id from the url
    let id = this.props.match.params.wall_id;
    let getUrl = "http://localhost:3001/api/walls/" + id;
    axios.get(getUrl)
    .then( res => {
      this.setState({ data: res.data });
    })
  }

  //function for displaying rating stars
  ratingDisplay() {
    for (let i = 0; i < this.state.data.rating; i++) {
      let myRating = document.getElementById("rating");
      let star = document.createElement("SPAN");
      star.setAttribute("class", "glyphicon glyphicon-star");
      //this is triggering with every change in the page as it is being re-rendered
      myRating.appendChild(star);
    }

    for (let i = this.state.data.rating; i < 5; i++) {
      let myRating = document.getElementById("rating");
      let star = document.createElement("SPAN");
      star.setAttribute("class", "glyphicon glyphicon-star-empty");
      //this is triggering with every change in the page as it is being re-rendered
      myRating.appendChild(star);
    }
  }

  //check to see if there are any comments. If so, return the commentList component
  checkComments() {
    if(this.state.data.length) {
      if(this.state.data.comments.length !== 0) {
        return (
          <CommentList data={this.state.data.comments}/>
        );
      } else {
        console.log(this.state.data.comments);
        return (
          <p>There are no comments to diplay at this time.</p>
        );
      }
    }
  }

  //check to see if the user has completed the wall
  checkCompletion() {

  }

  //allow the user to mark the wall as completed
  updateCompletion() {
    
  }

  //add the commentList component to display all comments for this particular wall

  //check to see if user is logged in: if so, display the comment form. If not, display a message prompting them to login
  checkLogin() {
    if (Auth.isUserAuthenticated()) {
      return (
        <CommentForm 
          onSubmit={this.processForm}
          onChange={this.commentChange}
          //successMessage={this.successMessage}
          errors={this.state.errors}
          commentData={this.state.commentData}
        />
      );
    } else {
      return (
        <div>
          <p>You must be logged in to post a comment. Login <a href="/login">here</a>.</p>    
        </div>
      );
    }
  }

  //add changes to the commentForm to the state
  commentChange(event) {
    const field = event.target.name;
    const commentData = this.state.commentData;
    commentData[field] = event.target.value;
    this.setState({
      commentData
    });
  }

  //process the commentform
  processForm(e) {
    e.preventDefault();

    //create a string for our HTTP body message
    //need to get the current userid
    const name = localStorage.getItem('username');
    const comment = this.state.commentData.comment;
    const formData = `name=${name}&comment=${comment}`;
    const id = this.props.match.params.wall_id;

    //Create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://localhost:3001/api/walls/${id}/comments`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        // change the component-container state
        this.setState({
          errors: {}
        });

        //reset the state
        this.setState({ commentData: {comment: '', name: ''}});
      } else {
        // failure  
       // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });

        console.log(this.state.errors);
        console.log(xhr.response);
      }
    });
    xhr.send(formData);
  }

  componentDidMount() {
    this.getWallData();
    //add a function to get the current user
  }

  render() {

    return (
      <div>
        <h1>{this.state.data.name}</h1>
        <img className='wall-detail' src={`/data/${this.state.data.image}`} alt={`Detailed view of ${this.state.data.name} climbing route.`}/>
        <p>Added: {this.state.data.date}</p>
        <p>Difficulty: {this.state.data.difficulty}</p>
        <p id="rating">Rating: { this.ratingDisplay() }</p>
        <p>Description: {this.state.data.description}</p>
        { this.checkComments() }
        { this.checkLogin() }
      </div>
    );
  }
}

export default WallDetail;