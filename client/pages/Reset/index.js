import React, { Component } from 'react';
import LoginNav from '../../components/LoginNav';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getAsset from '../../modules/get-asset';
import './style.scss';

class Reset extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: {
        password: '',
        confirm: '',
        token: parseQuery(props.history.location.search).t
      },
      errMsg: '',
      actionMsg: ''
    }
    this.update = this.update.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  update(e) {
    let newState = Object.assign({}, this.state);
    newState.form[e.target.name] = e.target.value;
    this.setState(newState);
  }

  updatePassword() {
    if (!this.state.form.password) {
      this.setState({errMsg: 'Please input your new password'});
    } else if (this.state.form.password !== this.state.form.confirm) {
      this.setState({errMsg: 'Your passwords do not match'});
    } else {
      axios.put('/update-password', this.state.form)
      .then((response) => {
        this.setState({actionMsg: 'Password has been updated'});
        setTimeout(() => this.props.history.push('/login'), 5000);
      })
      .catch((error) => {
        console.error(error);
        this.setState({errMsg: 'Something went wrong while updating your password'});
      });
    }
  }

  render() {
    return (
      <div id="Reset">
        <LoginNav />
        <div id="Reset-form" className="flex fd-c ai-c jc-c">
          <div className="logo-container">
            <img src={getAsset('logo-black')} />
          </div>
          <h1>INPUT YOUR NEW PASSWORD</h1>
          <div className="input-wrapper">
            <img src={getAsset('password-icon')} />
            <input type="password" placeholder="New Password" name="password" onChange={this.update} />
          </div>
          <div className="input-wrapper">
            <img src={getAsset('password-icon')} />
            <input type="password" placeholder="Re-Type New Password" name="confirm" onChange={this.update} />
          </div>
          {this.state.errMsg && !this.state.actionMsg ? (
            <h3>{this.state.errMsg}</h3>
          ) : null}
          <button onClick={this.updatePassword}>UPDATE PASSWORD</button>
          {this.state.actionMsg ? (
            <h2>{this.state.actionMsg}</h2>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(Reset);

function parseQuery(query) {
  let paramsStrs = query.substring(1, query.length).split('&');
  let params = {};
  paramsStrs.forEach((str) => {
    let parts = str.split('=');
    let key = parts[0];
    let value = parts[1];
    params[key] = value;
  });
  return params;
}