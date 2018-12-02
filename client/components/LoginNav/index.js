import React, { Component } from 'react';
import { Link } from "react-router-dom";
import getAsset from '../../modules/get-asset';
import './style.scss';

class LoginNav extends Component {
  render() {
    return (
      <div id="LoginNav" className="flex jc-sb">
        <Link to="/admin" className="logo-wrapper">
          <img src={getAsset('logo-text-white')} />
        </Link>
        <span></span>
      </div>
    );
  }
}

export default LoginNav;
