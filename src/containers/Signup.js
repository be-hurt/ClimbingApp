import React, { Component } from 'react';
import SignUpForm from '../components/SignupForm';


class Signup extends Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      err: {},
      message: '',
      user_signup: {
        name: '',
        email: '',
        password: ''
      }
    };

    //this.handleSubmit = this.handleSubmit.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.processForm = this.processForm.bind(this);
  }

  changeUser(event) {
    const field = event.target.name;
    const user_signup = this.state.user_signup;
    user_signup[field] = event.target.value;

    this.setState({
      user_signup
    });
  }

  processForm(e) {
   // prevent default action. in this case, action is the form submission event
    e.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user_signup.name);
    const email = encodeURIComponent(this.state.user_signup.email);
    const password = encodeURIComponent(this.state.user_signup.password);
    const formData = `username=${name}&email=${email}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:3001/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        //not posting?
        const message = xhr.response.message;

        console.log('signup SHOULD be successful.');
        // change the component-container state
        this.setState({
          err: {},
          message
        });

        //reset the state
        this.setState({ user_signup: {name: '', email: '', password: ''}});
      } else {
        // failure  
       // change the component state
        const err = xhr.response.errors ? xhr.response.errors : {};
        err.summary = xhr.response.message;
        err.name = xhr.response.err.name;
        err.email = xhr.response.err.email;
        err.password = xhr.response.err.password;

        this.setState({
          err
        });

        console.log(xhr.response);
      }
    });
    xhr.send(formData);
  }

  // Render the component.//
  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        err={this.state.err}
        user_signup={this.state.user_signup}
        message={this.state.message}
      />
    );
  }

}

export default Signup;