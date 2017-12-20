import React, { Component } from 'react';
import axios from 'axios';
import WallForm from '../components/WallForm';


class WallSubmit extends Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      successMessage: '',
      wallInfo: {
        name: '',
        difficulty: '',
        description: ''
      }
    };

    //this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeInfo = this.changeInfo.bind(this);
  }

  changeInfo(event) {
    const field = event.target.name;
    const wallInfo = this.state.wallInfo;
    wallInfo[field] = event.target.value;

    this.setState({
      wallInfo
    });
  }

  handleSubmit(e) {
    // prevent default action. in this case, action is the form submission event
    e.preventDefault();
    let name = this.state.wallInfo.name.trim();
    let difficulty = this.state.wallInfo.difficulty.trim();
    let description = this.state.wallInfo.description.trim();

    if (!name || !difficulty || !description) {
      
      return;
    }
    this.handleWallSubmit({name: name, difficulty: difficulty, description: description});
    this.setState({ wallInfo: {name: '', difficulty: '', description: ''}});
    }

  handleWallSubmit(wall) {
    axios.post('http://localhost:3001/auth/wallSubmit', wall)
      .then(function (response) {
        //success!
        console.log(response);
        this.setState({
          errors: {},
          successMessage: 'The wall was successfully added to the database.'
        });

        localStorage.setItem('successMessage');

        // change the current URL to /
        //this.context.router.replace('/login');
      })
      .catch(function (error) {
        //failure
        console.log(error);
      });
  }

  // Render the component.//
  render() {
    return (
      <WallForm
        onSubmit={this.handleSubmit}
        onChange={this.changeInfo}
        errors={this.state.errors}
        wallInfo={this.state.wallInfo}
        successMessage={this.state.successMessage}
      />
    );
  }

}

export default WallSubmit;