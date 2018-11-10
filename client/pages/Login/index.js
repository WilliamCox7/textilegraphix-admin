import React, { Component } from 'react';
import Nav from '../../components/Nav';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';
import getAsset from '../../modules/get-asset';
import './style.scss';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      form: {
        email: '',
        password: ''
      },
      errMsg: ''
    }
    this.update = this.update.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  componentDidMount() {
    axios.get('/logout');
  }

  update(e) {
    let newState = Object.assign({}, this.state);
    newState.form[e.target.name] = e.target.value;
    this.setState(newState);
  }

  authenticate() {
    if (!this.state.form.email) {
      this.setState({errMsg: 'Please input your email'});
    } else if (!this.state.form.password) {
      this.setState({errMsg: 'Please input your password'});
    } else {
      axios.post('/authenticate', this.state.form)
      .then((response) => {
        if (response.status === 200) {
          this.props.history.push('/');
        } else {
          this.setState({errMsg: `Wrong email or password`});
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({errMsg: 'Something went wrong while authenticating'});
      });
    }
  }

  render() {
    return (
      <div id="Login">
        <Nav />
        <div id="login-form" className="flex fd-c ai-c jc-c">
          <div className="logo-container">
            <img src={getAsset('logo-black')} />
          </div>
          <h1>DASHBOARD LOGIN</h1>
          <div className="input-wrapper">
            <img src={getAsset('email-icon')} />
            <input type="text" placeholder="Email" name="email" onChange={this.update} />
          </div>
          <div className="input-wrapper">
            <img src={getAsset('password-icon')} />
            <input type="password" placeholder="Password" name="password" onChange={this.update} />
          </div>
          {this.state.errMsg ? (
            <h3>{this.state.errMsg}</h3>
          ) : null}
          <button onClick={this.authenticate}>LOGIN</button>
          <h2>Forgot Password? <Link to="/reset">Reset</Link></h2>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
