import React, { Component } from 'react';
import Auth from '../modules/Auth';
import jwt_decode from 'jwt-decode';

/*in this class, check to see if there is a user logged in. If so,
return the component containing their account info. If not, return
the login or signup form*/

class Account extends Component {

  constructor(props) {
    super(props);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    //set the initial component state
    this.state = {
      errors:
      successMessage,
      user: {
        username: '',
        id: ''
      },
      data: [],
      completed: [],
      progress: []
    };

    //bind 'this' to class methods
    this.checkUser = this.checkUser.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.checkProgress = this.checkProgress.bind(this);
    this.makeCompletedList = this.makeCompletedList.bind(this);
  }
  //create class methods

  getUserData() {
    //get the token and grab the userId and username
    const token = Auth.getToken();
    const decoded = jwt_decode(token);
    const user = decoded.sub;
    //use the decoded payload to get the user's info from the database

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:3001/api/users/${user}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if(xhr.status === 200) {
        this.setState({
          data: xhr.response
        });
        console.log(this.state.data);
        this.checkProgress();
      } else {
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        this.setState({
          errors
        });
      }
    });
    xhr.send();
  }

  //check completed walls
  checkProgress() {
    const myProgress = this.state.data.inProgress;
    let completedWalls = [];
    let wallsInProgress = [];
    if(myProgress) {
      for(let i=0; i < myProgress.length; i++) {
        if(myProgress[i].completed === true) {
          completedWalls.push(myProgress[i].name);
        } else {
          wallsInProgress.push({name: myProgress[i].name, percent: myProgress[i].completionPercentage});
        }
      }
      this.setState({
        completed: completedWalls,
        progress: wallsInProgress
      });
    }
  }

  makeCompletedList() {
    if(this.state.completed.length === 0) {
      return(<li>You have not yet completed any walls.</li>);
    }
    for(let i=0; i < this.state.completed.length; i++) {
      return(<li>{this.state.completed[i]}</li>);
    }
  }

  makeProgressList() {
    if(this.state.progress.length === 0) {
      return(<li>You currently do not have any walls in progress.</li>);
    }
    for(let i=0; i < this.state.progress.length; i++) {
      return(<li>Wall: {this.state.progress[i].name}, Progress: {this.state.progress[i].percent}%</li>);
    }
  }

  //check if a user is logged in/has been validated
  checkUser() {
    if (Auth.isUserAuthenticated()) {
      return (
        <div>
          <header>
            <div id='bannerContainer'>
              <img className='banner' src='images/banner2.jpg'></img>
            </div>
            <h1>My Account</h1>
            <h2>{ this.state.data.username }</h2>
          </header>
          <div className='content'>
            <h3>In Progress:</h3>
              <ul>
                { this.makeProgressList() }
              </ul>
            <h3>Completed:</h3>
            <ul>
              { this.makeCompletedList() }
            </ul>
          </div>
        </div>
      );
    } else {
      //unauthorized
      return ('<h1>Oops!</h1><p>You are not authorized to view this page. Please log in and try again.</p>');
    }
  }

  componentDidMount() {
    this.getUserData();
  }

  render() {
    return (
      <div>
        { this.checkUser() }
      </div>
    );
  }
}

export default Account;