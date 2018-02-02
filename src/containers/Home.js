import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <div id='bannerContainer'>
            <img className='banner' src='images/banner1.jpeg'></img>
          </div>
          <h1>Welcome to Piton</h1>
        </header>
        <div className='content'>
          <p>
            Piton is a free online tracker for indoor rock climbers. It enables its users to keep track of their progress on individual walls in the gym in order to 
            help everyone set and meet their own personal climbing goals.
          </p>
        </div>
      </div>
    );
  }
}

export default Home;