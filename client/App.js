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
          <Route exact path="/admin/" component={Home} />
          <Route path="/admin/login" component={Login} />
          <Route path="/admin/forgot" component={Forgot} />
          <Route path="/admin/reset" component={Reset} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
