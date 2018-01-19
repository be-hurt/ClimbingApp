import React, { Component } from 'react';
import axios from 'axios';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import Auth from '../modules/Auth';
import formatDate from '../scripts/formatDate';
import jwt_decode from 'jwt-decode';

class WallDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      commentData: {
        comment: '',
        name: ''
      },
      successMessage: '',
      data: {},
      active: false,
      completed: false,
      progress: 0,
      message: '',
      completionMessage: ''
    }

    this.processForm = this.processForm.bind(this);
    this.commentChange = this.commentChange.bind(this);
    this.checkComments = this.checkComments.bind(this);
    this.imageClick = this.imageClick.bind(this);
    this.checkProgress = this.checkProgress.bind(this);
    this.markProgress = this.markProgress.bind(this);
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

  checkProgress() {
    //check the user's progress on the current wall (will be used for display)
    const userid = jwt_decode(Auth.getToken()).sub;
    const wallid = this.props.match.params.wall_id;
    const getUrl = `http://localhost:3001/api/users/${userid}/inProgress/wall/${wallid}`;
    axios.get(getUrl)
    .then( res => {
      this.setState({ progress: res.data.completionPercentage }, () => { this.markProgress(); });
    })
  }

  markProgress() {
    //display the user's progress on the wall's image
    let previousProgress = document.getElementsByClassName('currentProgress');
    let previousCompleted = document.getElementsByClassName('completed');

    if (previousProgress.length !== 0) {
      for (let i=0; i < previousProgress.length; i++) {
        previousProgress[i].removeAttribute('class');
      }
    }
    if (previousCompleted){
      while (previousCompleted[0]) {
        previousCompleted[0].classList.remove('completed');
      }
    }

    let myProgress = document.getElementById('wallProgress' + this.state.progress);
    if (myProgress) {
      myProgress.setAttribute('class', 'currentProgress');

      for (let i=10; i < this.state.progress; i+=10) {
        let completed = document.getElementById('wallProgress' + i);
        completed.setAttribute('class', 'completed');
      }
    } 
  }

  imageClick(percent) {
    //need to get the current userid from the token
    const userid = jwt_decode(Auth.getToken()).sub;
    const wallid = this.props.match.params.wall_id;

    if (percent === 100) {
      //add current wallid to the user's completed list
      const completion = `wallid=${wallid}`;
      const xhrCompletion = new XMLHttpRequest();
      xhrCompletion.open('PUT', `http://localhost:3001/api/users/${userid}/complete`);
      xhrCompletion.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhrCompletion.responseType = 'json';
      xhrCompletion.addEventListener('load', () => {
        if(xhrCompletion.status === 200) {
          this.setState({
            errors: {},
            completionMessage: xhrCompletion.response.message
          });
        } else {
          const errors = xhrCompletion.response.errors ? xhrCompletion.response.errors : {};
          errors.summary = xhrCompletion.response.message;
          this.setState({
            errors,
            completionMessage: xhrCompletion.response.message
          });
        }
      });
      xhrCompletion.send(completion);
    }
    const formData = `userid=${userid}`;
    //assign a variable to store the userdata in
    let inProgress;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:3001/api/users/${userid}/inProgress/wall/${wallid}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          errors: {},
        });

        inProgress = xhr.response;
        if (inProgress) {
          //update the record
          //need to have the trackerid
          const trackerid = inProgress._id;
          const updateData = `percent=${percent}&wallid=${wallid}`;
          const xhr2 = new XMLHttpRequest();
          xhr2.open('PUT', `http://localhost:3001/api/users/${userid}/inProgress/${trackerid}`);
          xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhr2.responseType = 'json';
          xhr2.addEventListener('load', () => {
            if(xhr2.status === 200) {
              console.log(xhr2.response);
              this.setState({
                errors: {},
                progress: xhr2.response.completionPercentage,
                message: 'Progress tracker updated'
              }, () => { this.markProgress(); }
              );
            } else {
              const errors = xhr2.response.errors ? xhr2.response.errors : {};
              errors.summary = xhr2.response.message;
              this.setState({
                errors,
                message: xhr2.response.message
              });
              alert('error');
            }
          });
          xhr2.send(updateData);
        } else{
          //create a new record
          const createData = `percent=${percent}&wall=${wallid}`;
          const xhr3 = new XMLHttpRequest();
          xhr3.open('POST', `http://localhost:3001/api/users/${userid}/inProgress/`);
          xhr3.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhr3.responseType = 'json';
          xhr3.addEventListener('load', () => {
            if(xhr3.status === 200) {
              this.setState({
                errors: {},
                message: xhr3.response.message
              });
            } else {
              const errors = xhr3.response.errors ? xhr3.response.errors : {};
              errors.summary = xhr3.response.message;
              this.setState({
                errors,
                message: xhr3.response.message
              });
              alert('error');
            }
          });
          xhr3.send(createData);
        }
      } else {
        // failure  
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        this.setState({
          errors,
          message: xhr.response.message
        });
      }
    });
    xhr.send(formData);
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

  //check to see if there are any comments. If so, return the commentList component
  checkComments() {
    if(this.state.data.comments) {
      return (
        <CommentList data={this.state.data.comments}/>
      );
    } else {
      return (
        <p>There are no comments to diplay at this time.</p>
      );
    }
  }

  //check to see if the user has completed the wall
  //if so, display a congrats message
  checkCompletion() {
    const userid = jwt_decode(Auth.getToken()).sub;
    const wallid = this.props.match.params.wall_id;
    const getUrl = `http://localhost:3001/api/users/${userid}/complete`;
    axios.get(getUrl)
    .then( res => {
      if (res.data.completed.includes(wallid)) {
        this.setState({completed: true, completionMessage: 'Congrats! This wall has been completed!'});
      } else {
        this.setState({completionMessage: 'This wall has not yet been completed.'});
      }
    })
  }

  //check to see if user is logged in: if so, display the comment form. If not, display a message prompting them to login
  checkLogin() {
    if (Auth.isUserAuthenticated()) {
      return (
        <CommentForm 
          onSubmit={this.processForm}
          onChange={this.commentChange}
          successMessage={this.state.successMessage}
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
    const token = Auth.getToken();
    const decoded = jwt_decode(token);

    const name = localStorage.getItem('username');
    const comment = this.state.commentData.comment;
    const id = decoded.sub;
    const formData = `name=${name}&id=${id}&comment=${comment}`;
    const wallId = this.props.match.params.wall_id;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://localhost:3001/api/walls/${wallId}/comments`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        // change the component-container state
        this.setState({
          errors: {},
          commentData: {
            comment: '', 
            name: ''
          },
          successMessage: xhr.response.successMessage
        });
        this.getWallData();
        this.checkComments();
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

  componentWillUpdate() {
    if(this.state.active === false){
      this.ratingDisplay();
      this.setState({active: true});
    }
  }

  componentDidMount() {
    this.getWallData();
    this.checkProgress();
    this.checkCompletion();
  }

  render() {

    return (
      <div id="wall">
        <div className="image">
          <img className='wall-detail' src={`/data/${this.state.data.image}`} alt={`Detailed view of ${this.state.data.name} climbing route.`}/>
          <div id="wallProgress100" onClick={() => { this.imageClick(100) }}><p className="percent">100%</p></div>
          <div id="wallProgress90" onClick={() => { this.imageClick(90) }}><p className="percent">90%</p></div>
          <div id="wallProgress80" onClick={() => { this.imageClick(80) }}><p className="percent">80%</p></div>
          <div id="wallProgress70" onClick={() => { this.imageClick(70) }}><p className="percent">70%</p></div>
          <div id="wallProgress60" onClick={() => { this.imageClick(60) }}><p className="percent">60%</p></div>
          <div id="wallProgress50" onClick={() => { this.imageClick(50) }}><p className="percent">50%</p></div>
          <div id="wallProgress40" onClick={() => { this.imageClick(40) }}><p className="percent">40%</p></div>
          <div id="wallProgress30" onClick={() => { this.imageClick(30) }}><p className="percent">30%</p></div>
          <div id="wallProgress20" onClick={() => { this.imageClick(20) }}><p className="percent">20%</p></div>
          <div id="wallProgress10" onClick={() => { this.imageClick(10) }}><p className="percent">10%</p></div>
        </div>
        <p className="message">{this.state.completionMessage}</p>
        <p className="message">{this.state.message}</p>
        <p>Added: {formatDate(this.state.data.date)}</p>
        <p>Difficulty: {this.state.data.difficulty}</p>
        <p id="rating">Rating: </p>
        <p>Description: {this.state.data.description}</p>
        { this.checkComments() }
        { this.checkLogin() }
      </div>
    );
  }
}

export default WallDetail;