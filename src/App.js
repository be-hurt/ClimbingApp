import React from 'react';
import Main from './routes/Main';
import Nav from './components/Nav';

// this component will be rendered by our Router
const App = () => (
  <div id="app">
    <Nav />
    <div className="container">
      <Main />
    </div>
  </div>
)

export default App;
