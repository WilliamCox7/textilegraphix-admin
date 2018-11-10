import React, { Component } from 'react';
import { Link } from "react-router-dom";
import getAsset from '../../modules/get-asset';
import './style.scss';

class Nav extends Component {
  render() {
    return (
      <div id="Nav" className="flex jc-sb">
        <Link to="/" className="logo-wrapper">
          <img src={getAsset('logo-text-white')} />
        </Link>
        {window.location.pathname === '/' ? (
          <Link className="logout-button" to="/login">LOGOUT</Link>
        ) : (
          <span></span>
        )}
      </div>
    );
  }
}

export default Nav;
