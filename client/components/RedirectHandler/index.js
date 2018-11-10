import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';

class RedirectHandler extends Component {

  constructor() {
    super();
    this.state = {
      currentLocation: ''
    }
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
    this.props.history.listen((location, action) => {
      if (this.state.currentLocation !== location.pathname) {
        this.setState({currentLocation: location.pathname});
        this.getUser();
      } else {
        this.setState({currentLocation: location.pathname});
      }
    });
  }

  getUser() {
    axios.get('/user')
    .then((response) => this.props.history.push('/'))
    .catch((error) => this.props.history.push('/login'));
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default withRouter(RedirectHandler);
