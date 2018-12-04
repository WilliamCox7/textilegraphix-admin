import React, { Component } from 'react';
import LoginNav from '../../components/LoginNav';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getAsset from '../../modules/get-asset';
import './style.scss';

class Forgot extends Component {

  constructor() {
    super();
    this.state = {
      form: {
        email: ''
      },
      errMsg: '',
      actionMsg: ''
    }
    this.update = this.update.bind(this);
    this.sendResetEmail = this.sendResetEmail.bind(this);
  }

  update(e) {
    let newState = Object.assign({}, this.state);
    newState.form[e.target.name] = e.target.value;
    this.setState(newState);
  }

  sendResetEmail() {
    if (!this.state.form.email) {
      this.setState({errMsg: 'Please input your email'});
    } else {
      axios.post('/admin/send-reset-email', this.state.form)
      .then((response) => {
        this.setState({actionMsg: 'An email was sent to your inbox'});
        setTimeout(() => this.props.history.push('/admin/login'), 5000);
      })
      .catch((error) => {
        console.error(error);
        this.setState({errMsg: 'Something went wrong while sending the reset email'});
      });
    }
  }

  render() {
    return (
      <div id="Forgot">
        <LoginNav />
        <div id="Forgot-form" className="flex fd-c ai-c jc-c">
          <div className="logo-container">
            <img src={getAsset('logo-black')} />
          </div>
          <h1>RESET PASSWORD</h1>
          <div className="input-wrapper">
            <img src={getAsset('email-icon')} />
            <input type="text" placeholder="Email" name="email" onChange={this.update} />
          </div>
          {this.state.errMsg && !this.state.actionMsg ? (
            <h3>{this.state.errMsg}</h3>
          ) : null}
          <button onClick={this.sendResetEmail}>RESET</button>
          {this.state.actionMsg ? (
            <h2>{this.state.actionMsg}</h2>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(Forgot);
