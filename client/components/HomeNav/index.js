import React, { Component } from 'react';
import { Link } from "react-router-dom";
import getAsset from '../../modules/get-asset';
import './style.scss';

class HomeNav extends Component {
  render() {
    return (
      <div id="HomeNav" className="flex">
        <div className="logo-box flex">
          <img src={getAsset('logo-white')} />
        </div>
        <div className="action-wrapper flex jc-sb ai-c">
          <h1>{this.props.header}</h1>
          <Link className="logout-button" to="/admin/login">LOGOUT</Link>
        </div>
      </div>
    );
  }
}

export default HomeNav;
