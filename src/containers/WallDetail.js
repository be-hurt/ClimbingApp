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
      commentData: {
        comment: '',
        user: '',
        date: ''
      },
      data: []
    }

    this.processForm = this.processForm.bind(this);
    this.commentChange = this.commentChange.bind(this);
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

  //add the commentList component to display all comments for this particular wall

  //check to see if user is logged in: if so, display the comment form. If not, display a message prompting them to login
  checkLogin() {
    if (Auth.isUserAuthenticated()) {
      return (<CommentForm />);
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
      console.log(this.state.data),
      <div>
        <h1>{this.state.data.name}</h1>
        <img src={`/data/${this.state.data.image}`} alt={`Detailed view of ${this.state.data.name} climbing route.`}/>
        <p>Added: {this.state.data.date}</p>
        <p>Difficulty: {this.state.data.difficulty}</p>
        <p>Rating: {this.state.data.rating}</p>
        <p>Description: {this.state.data.description}</p>
      </div>
    );
  }
}

export default WallDetail;