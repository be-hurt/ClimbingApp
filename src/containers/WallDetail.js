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
      //successMessage,
      data: []
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
      myRating.appendChild(star);
    }

    for (let i = this.state.data.rating; i < 5; i++) {
      let myRating = document.getElementById("rating");
      let star = document.createElement("SPAN");
      star.setAttribute("class", "glyphicon glyphicon-star-empty");
      myRating.appendChild(star);
    }
  }

  //check to see if there are any comment. If so, return the commentList component
  checkComments() {
    if(this.state.data.comments) {
      return (<CommentList data={this.state.data.comments}/>);
    } else {
      return (<p>There are no comments to diplay at this time.</p>);
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
          successMessage={this.successMessage}
          errors={this.state.errors}
          commentData={this.state.data.comments}
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
    /*const field = event.target.name;
    const comment = this.state.commentData;
    commentData[field] = event.target.value;
    this.setState({
      commentData
    });*/
  }

  //process the commentform
  processForm() {
  }

  componentDidMount() {
    this.getWallData();
  }

  render() {

    return (
      <div>
        <h1>{this.state.data.name}</h1>
        <img src={`/data/${this.state.data.image}`} alt={`Detailed view of ${this.state.data.name} climbing route.`}/>
        <p>Added: {this.state.data.date}</p>
        <p>Difficulty: {this.state.data.difficulty}</p>
        <p id="rating">Rating: {this.state.data.rating}</p>
        <p>Description: {this.state.data.description}</p>
        { this.checkComments() }
        { this.checkLogin() }
      </div>
    );
  }
}

export default WallDetail;