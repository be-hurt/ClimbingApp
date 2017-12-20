import React, { Component } from 'react';

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
  }
  //create class methods

  //check if a user is logged in/has been validated
  checkUser() {

  }

  render() {
    return (
      <div>
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