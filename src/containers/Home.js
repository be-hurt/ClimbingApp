import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <img className='banner' src='images/banner1.jpeg'></img>
          <h1>Welcome to Rocks</h1>
        </header>
        <p>
          Yes, that name is a placeholder. This'll look pretty eventually.
        </p>
      </div>
    );
  }
}

export default Home;