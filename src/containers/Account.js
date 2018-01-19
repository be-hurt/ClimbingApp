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
      data: []
    };

    //bind 'this' to class methods
    this.checkUser = this.checkUser.bind(this);
  }
  //create class methods

  //check if a user is logged in/has been validated
  checkUser() {
    if (Auth.isUserAuthenticated()) {
      //get the token and grab the userId and username
      const token = Auth.getToken();
      const decoded = jwt_decode(token);
      const user = decoded.sub;
      //use the decoded payload to get the user's info from the database

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://localhost:3001/users/${user}`);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if(xhr.response === 200) {
          this.setState({
            data: xhr.response.data
          });
        }
      });
    } else {
      //unauthorized
      return ('<h1>Oops!</h1><p>You are not authorized to view this page. Please log in and try again.</p>');
    }
  }

  render() {
    return (
      <div>
        { this.checkUser() }
        <header>
          <h1>Welcome to Rocks</h1>
        </header>
        <p>
          This is the Account Page...or will be. Eventually.
        </p>
      </div>
    );
  }
}

export default Account;