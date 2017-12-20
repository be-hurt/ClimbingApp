import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import Auth from '../modules/Auth';
import {PropTypes} from 'prop-types';

class Login extends Component {

  constructor(props) {
    super(props);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user_login: {
        login_name: '',
        login_password: ''
      },
      data: []
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  changeUser(event) {
    const field = event.target.name;
    const user_login = this.state.user_login;
    user_login[field] = event.target.value;

    this.setState({
      user_login
    });
  }

  //NOTE: will need to do ALL user auth in this component before submitting.
  processForm(e) {
    // prevent default action. in this case, action is the form submission event
    e.preventDefault();

    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user_login.login_name);
    const password = encodeURIComponent(this.state.user_login.login_password);
    const formData = `username=${username}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:3001/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // save the token
        Auth.authenticateUser(xhr.response.token);

        //reset the state
        this.setState({ user_login: {login_name: '', login_password: ''}});

        // change the current URL to /
        this.props.history.push("/account");
        console.log('Login successful!');
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

  // Render the component.//
  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user_login={this.state.user_login}
      />
    );
  }

}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Login;