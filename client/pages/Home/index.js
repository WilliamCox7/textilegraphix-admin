import React, { Component } from 'react';
import HomeNav from '../../components/HomeNav';
import PageNav from '../../components/PageNav';
import axios from 'axios';
import './style.scss';

class Home extends Component {

  componentDidMount() {
    axios.get('/products')
    .then((response) => {
      console.log(response);
    });
  }

  render() {
    return (
      <div id="Home">
        <HomeNav header="PRODUCTS" />
        <div className="flex">
          <PageNav />
          <div className="page-content">

          </div>
        </div>
      </div>
    );
  }
}

export default Home;
