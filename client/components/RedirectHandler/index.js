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
    if (this.pageNeedsAuth(window.location)) this.getUser();
    this.props.history.listen((location, action) => {
      if (this.state.currentLocation !== location.pathname && this.pageNeedsAuth(location)) {
        this.setState({currentLocation: location.pathname});
        this.getUser();
      } else {
        this.setState({currentLocation: location.pathname});
      }
    });
  }

  pageNeedsAuth(location) {
    return location.pathname !== '/admin/forgot' && location.pathname !== '/admin/reset';
  }

  getUser() {
    axios.get('/admin/user')
    .then((response) => this.props.history.push('/admin'))
    .catch((error) => this.props.history.push('/admin/login'));
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default withRouter(RedirectHandler);
