import React, { Component } from 'react';
import WallList from '../components/WallList';
import axios from 'axios';

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.loadWallsFromServer = this.loadWallsFromServer.bind(this);

  }

  loadWallsFromServer() {
    axios.get("http://localhost:3001/api/walls")
    .then( res => {
      this.setState({ data: res.data });
    })
  }

  componentDidMount() {
    this.loadWallsFromServer();
    this.loadInterval = setInterval(this.loadWallsFromServer, 10000);
  }

  componentWillUnmount() {
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  render() {
    return (
      <div>
          <h1>Active Walls:</h1>
          <WallList data={this.state.data} />
      </div>
    );
  }
}

export default List;