import React, { Component } from 'react';
import HomeNav from '../../components/HomeNav';
import PageNav from '../../components/PageNav';
import axios from 'axios';
import getAsset from '../../modules/get-asset';
import './style.scss';

class Home extends Component {

  constructor() {
    super();
    this.state = {
      products: [],
      search: '',
      selected: {},
      index: 0,
      mode: 'read',
      loaded: false,
      selectedHex: ''
    }
    this.updateSearch = this.updateSearch.bind(this);
    this.updateField = this.updateField.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    axios.get('/products')
    .then((response) => {
      this.setState({
        products: response.data, 
        selected: Object.assign({}, response.data[0]), 
        loaded: true,
        selectedHex: response.data[0].colors[0].hex
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  updateSearch(e) {
    let newState = Object.assign({}, this.state);
    newState.search = e.target.value;
    this.setState(newState);
  }

  updateField(e) {
    let newState = Object.assign({}, this.state);
    newState.selected[e.target.name] = e.target.value;
    if (JSON.stringify(newState.selected) === JSON.stringify(newState.products[newState.index])) {
      newState.mode = 'read';
    } else {
      newState.mode = 'edit';
    }
    this.setState(newState);
  }

  clearSearch() {
    let newState = Object.assign({}, this.state);
    newState.search = '';
    this.setState(newState);
    document.getElementById('search-input').value = '';
  }

  render() {

    let products = this.state.products;

    products = products.filter((product) => {
      if (JSON.stringify(product).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1) {
        return product;
      }
    });

    let productList = products.map((product, i) => {
      return (
        <div className="product-item-wrapper" key={i}>
          <hr />
          <div className="product-item flex jc-sb ai-c">
            <h2>{product.brand.toUpperCase()} {product.number}</h2>
            <div className="icon-wrapper">
              <img src={getAsset('edit')} />
              <img src={getAsset('garbage')} />
            </div>
          </div>
        </div>
      );
    });

    return (
      <div id="Home">
        <HomeNav header="PRODUCTS" />
        <div className="flex">
          <PageNav />
          <div className="page-content flex">
            <div className="left-content">
              <div className="flex jc-sb ai-c">
                <h1>PRODUCT LIST</h1>
                <button>ADD NEW PRODUCT</button>
              </div>
              <div className="search-container">
                <div className="input-container">
                  <input id="search-input" onChange={this.updateSearch} type="text" placeholder="Product Select" />
                  {this.state.search ? (
                    <img onClick={this.clearSearch} className="search-icon cursor" src={getAsset('close')} />
                  ) : (
                    <img className="search-icon" src={getAsset('search')} />
                  )}
                </div>
                {productList}
              </div>
            </div>
            <div className="right-content">
              {this.state.loaded ? (
                <div>
                  <div className="action-header flex jc-sb ai-c">
                    {this.state.mode === 'edit' ? (
                      <h1><span>EDITING</span> - {this.state.selected.brand.toUpperCase()} {this.state.selected.number}</h1> 
                    ) : null}
                    {this.state.mode === 'read' ? (
                      <h1>{this.state.selected.brand.toUpperCase()} {this.state.selected.number}</h1> 
                    ) : null}
                    {this.state.mode === 'create' ? (
                      <h1><span>CREATING</span> - {this.state.selected.brand.toUpperCase()} {this.state.selected.number}</h1> 
                    ) : null}
                  </div>
                  <div className="right-content-wrapper flex">
                    <div className="fields">
                      <div className="field">
                        BRAND: <input value={this.state.selected.brand} name="brand" onChange={this.updateField} />
                      </div>
                      <div className="field">
                        STYLE NUMBER: <input value={this.state.selected.number} name="number" onChange={this.updateField} />
                      </div>
                      <div className="field">
                        CATEGORY: <select value={this.state.selected.type} name="type" onChange={this.updateField}>
                          <option value="t-shirts">T-Shirts</option>
                          <option value="long sleeve shirt">Long Sleeve</option>
                          <option value="hoodies">Hoodie</option>
                          <option value="sweaters">Sweater</option>
                        </select>
                        <img src={getAsset('select')} />
                      </div>
                      <div className="field">
                        QUALITY: <select value={this.state.selected.quality} name="quality" onChange={this.updateField}>
                          <option value="basic">Basic</option>
                          <option value="mid">Mid</option>
                          <option value="premium">Premium</option>
                        </select>
                        <img src={getAsset('select')} />
                      </div>
                      <div className="field">
                        MATERIAL: <select value={this.state.selected.material} name="material" onChange={this.updateField}>
                          <option value="cotton">100% Cotton</option>
                          <option value="cotton-poly">60/40 Cotton/Poly</option>
                          <option value="poly">100% Poly</option>
                        </select>
                        <img src={getAsset('select')} />
                      </div>
                      <div className="field">
                        OUR RATING: <input className="small" value={this.state.selected.rating} name="rating" onChange={this.updateField} /> / 10
                      </div>
                      {/* adding color varients.... */}
                    </div>
                    <div>
                      <img src={this.state.selected.images[this.state.selectedHex]} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
