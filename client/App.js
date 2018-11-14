import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import RedirectHandler from './components/RedirectHandler';
import './reset.scss';
import './main.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <RedirectHandler />
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/reset" component={Reset} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
