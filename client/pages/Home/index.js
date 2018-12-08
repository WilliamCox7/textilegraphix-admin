import React, { Component } from 'react';
import HomeNav from '../../components/HomeNav';
import PageNav from '../../components/PageNav';
import PromptModal from '../../components/PromptModal';
import axios from 'axios';
import Draggable from 'react-draggable';
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
      vIndex: 0,
      mode: 'read',
      loaded: false,
      selectedHex: '',
      imageIndex: 0,
      picker: false,
      showModal: false,
      deleteIndex: undefined,
      drag: {
        dragging: false,
        clientY: undefined,
        clientX: undefined,
        width: undefined,
        height: undefined
      }
    }
    this.updateSearch = this.updateSearch.bind(this);
    this.updateField = this.updateField.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.setVIndex = this.setVIndex.bind(this);
    this.setImageIndex = this.setImageIndex.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.drag = this.drag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.storeFile = this.storeFile.bind(this);
    this.addNewColor = this.addNewColor.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
    this.updatePickedColor = this.updatePickedColor.bind(this);
    this.setMode = this.setMode.bind(this);
    this.removeColor = this.removeColor.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.readProduct = this.readProduct.bind(this);
    this.addNewProduct = this.addNewProduct.bind(this);
    this.saveNew = this.saveNew.bind(this);
    this.delete = this.delete.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.promptDelete = this.promptDelete.bind(this);
  }

  componentDidMount() {
    axios.get('/admin/products')
    .then((response) => {
      console.log(response.data);
      if (response.data.length) {
        let selected = JSON.stringify(response.data[0]);
        selected = JSON.parse(selected);
        this.setState({
          products: response.data, 
          selected: selected, 
          loaded: true,
          selectedHex: response.data[0].colors[0].hex
        });
      } else {
        this.addNewProduct();
        this.setState({loaded: true});
      }
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
    newState.mode = this.setMode(newState);
    this.setState(newState);
  }

  clearSearch() {
    let newState = Object.assign({}, this.state);
    newState.search = '';
    this.setState(newState);
    document.getElementById('search-input').value = '';
  }

  setVIndex(i) {
    let selectedHex, index;
    if (i <= this.state.selected.colors.length - 1) {
      selectedHex = this.state.selected.colors[i].hex;
      index = i;
    } else {
      selectedHex = this.state.selected.colors[0].hex;
      index = 0;
    }
    this.setState({vIndex: index, selectedHex: selectedHex});
  }

  setImageIndex(index) {
    this.setState({imageIndex: index});
  }

  setPosition(e) {
    let transform = e.target.style.transform;
    let transformParams = transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')).split(', ');
    let offsetLeft = Number(transformParams[0].substring(0, transformParams[0].length - 2));
    let offsetTop = Number(transformParams[1].substring(0, transformParams[1].length - 2));
    let newState = Object.assign({}, this.state);
    newState.selected.printArea[newState.imageIndex].offsetLeft = offsetLeft;
    newState.selected.printArea[newState.imageIndex].offsetTop = offsetTop;
    newState.mode = this.setMode(newState);
    this.setState(newState);
  }

  startDrag(e) {
    let clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    let clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    let parent = e.target.parentElement;
    let width = Number(parent.style.width.substring(0, parent.style.width.length - 2));
    let height = Number(parent.style.height.substring(0, parent.style.height.length - 2));
    let newState = Object.assign({}, this.state);
    newState.drag.dragging = true;
    newState.drag.clientY = clientY;
    newState.drag.clientX = clientX;
    newState.drag.width = width;
    newState.drag.height = height;
    this.setState(newState);
  }

  drag(e) {
    let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    if (this.state.drag.dragging && clientY && clientX) {
      var newWidth = this.state.drag.width - (this.state.drag.clientX - clientX);
      var newHeight = this.state.drag.height - (this.state.drag.clientY - clientY);
      let newState = Object.assign({}, this.state);
      newState.selected.printArea[newState.imageIndex].width = newWidth + 'px';
      newState.selected.printArea[newState.imageIndex].height = newHeight + 'px';
      this.setState(newState);
    }
    e.preventDefault();
    return false;
  }

  stopDrag(e) {
    let newState = Object.assign({}, this.state);
    newState.drag = {
      dragging: false,
      clientY: undefined,
      clientX: undefined,
      width: undefined,
      height: undefined,
    };
    newState.mode = this.setMode(newState);
    this.setState(newState);
  }

  removeImage(hex, index) {
    let newState = Object.assign({}, this.state);
    newState.selected.images[hex][index] = "";
    newState.mode = this.setMode(newState);
    this.setState(newState);
  }

  storeFile(e, id, hex, index) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let newState = Object.assign({}, this.state);
      newState.selected.images[hex][index] = reader.result;
      newState.mode = this.setMode(newState);
      this.setState(newState);
    }
    reader.readAsDataURL(e.currentTarget.files[0]);
    document.getElementById(id).value = '';
  }

  addNewColor() {
    if (!this.state.selected.images['#ffffff']) {
      let newState = Object.assign({}, this.state);
      newState.selected.colors.push({
        hex: '#ffffff', name: 'White'
      });
      newState.selected.images['#ffffff'] = ['', ''];
      newState.mode = this.setMode(newState);
      this.setState(newState);
    }
  }

  togglePicker() {
    this.setState({picker: !this.state.picker});
  }

  updatePickedColor(e) {
    let newState = Object.assign({}, this.state);
    if (e.target.name === 'name') {
      newState.selected.colors[newState.vIndex][e.target.name] = e.target.value;
    } else {
      let oldValue = newState.selected.colors[newState.vIndex][e.target.name];
      newState.selected.colors[newState.vIndex][e.target.name] = e.target.value;
      newState.selected.images[e.target.value] = newState.selected.images[oldValue];
      newState.selectedHex = newState.selected.colors[newState.vIndex].hex;
      delete newState.selected.images[oldValue];
      newState.mode = this.setMode(newState);
    }
    this.setState(newState);
  }

  removeColor() {
    let newState = Object.assign({}, this.state);
    delete newState.selected.images[newState.selectedHex];
    newState.selected.colors = newState.selected.colors.filter((color, i) => {
      return i !== newState.vIndex;
    });
    newState.selectedHex = newState.selected.colors[0].hex;
    newState.vIndex = 0;
    newState.mode = this.setMode(newState);
    newState.picker = false;
    this.setState(newState);
  }

  setMode(newState) {
    if (newState.mode === 'create') return 'create';
    if (JSON.stringify(newState.selected) === JSON.stringify(newState.products[newState.index])) {
      return 'read';
    } else {
      return 'edit';
    }
  }

  cancel() {
    if (this.state.products.length) {
      let newState = Object.assign({}, this.state);
      let selected = JSON.stringify(newState.products[newState.index]);
      newState.selected = JSON.parse(selected);
      newState.vIndex = 0;
      newState.mode = 'read';
      newState.selectedHex = newState.selected.colors[0].hex;
      newState.imageIndex = 0;
      newState.picker = false;
      this.setState(newState);
    }
  }

  editProduct(product) {
    let newState = Object.assign({}, this.state);
    let selected = JSON.stringify(product);
    newState.selected = JSON.parse(selected);
    newState.index = newState.products.indexOf(product);
    newState.vIndex = 0;
    newState.mode = 'edit';
    newState.selectedHex = newState.selected.colors[0].hex;
    newState.imageIndex = 0;
    newState.picker = false;
    this.setState(newState);
  }

  readProduct(e, product) {
    if (e.target.tagName !== 'IMG') {
      let newState = Object.assign({}, this.state);
      let selected = JSON.stringify(product);
      newState.selected = JSON.parse(selected);
      newState.index = newState.products.indexOf(product);
      newState.vIndex = 0;
      newState.mode = 'read';
      newState.selectedHex = newState.selected.colors[0].hex;
      newState.imageIndex = 0;
      newState.picker = false;
      this.setState(newState);
    }
  }

  addNewProduct() {
    let newState = Object.assign({}, this.state);
    newState.selected = {
      brand: "",
      colors: [{ hex: "#FFFFFF", name: "White" }],
      costOfShirt: 0,
      images: { "#FFFFFF": ["", ""] },
      material: "60/40 Blend",
      number: "",
      printArea: [{
        height: "322px",
        left: "34px",
        top: "120px",
        width: "262px"
      }, {
        height: "322px",
        left: "34px",
        top: "120px",
        width: "262px"
      }],
      quality: "premium",
      rating: "",
      type: "t-shirts",
      weight: 0
    };
    newState.vIndex = 0;
    newState.mode = 'create';
    newState.selectedHex = newState.selected.colors[0].hex;
    newState.imageIndex = 0;
    newState.picker = false;
    this.setState(newState);
  }

  save() {
    let newState = Object.assign({}, this.state);
    let updSelected = JSON.stringify(newState.selected);
    newState.products[newState.index] = JSON.parse(updSelected);
    newState.vIndex = 0;
    newState.mode = 'read';
    newState.selectedHex = newState.selected.colors[0].hex;
    newState.imageIndex = 0;
    newState.picker = false;
    this.setState(newState, () => {
      axios.put('/admin/product', this.state.selected)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }

  saveNew() {
    let newState = Object.assign({}, this.state);
    newState.products.push(newState.selected);
    newState.index = newState.products.length - 1;
    newState.vIndex = 0;
    newState.mode = 'read';
    newState.selectedHex = newState.selected.colors[0].hex;
    newState.imageIndex = 0;
    newState.picker = false;
    this.setState(newState, () => {
      axios.post('/admin/product', this.state.selected)
      .then((response) => {
        let updState = Object.assign({}, this.state);
        updState.selected.id = response.data.insertId;
        updState.products[updState.index].id = response.data.insertId;
        this.setState(updState);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }

  promptDelete(product) {
    let deleteIndex = this.state.products.indexOf(product);
    console.log(deleteIndex);
    this.setState({deleteIndex: deleteIndex, showModal: true});
  }

  hideModal() {
    this.setState({deleteIndex: undefined, showModal: false});
  }

  delete() {
    let newState = Object.assign({}, this.state);
    let deleted = newState.products.splice(newState.deleteIndex, 1);
    if (newState.deleteIndex > 0 && newState.products.length) {
      let selected = JSON.stringify(newState.products[newState.deleteIndex - 1]);
      newState.selected = JSON.parse(selected);
      newState.selectedHex = newState.selected.colors[0].hex;
    } else if (newState.deleteIndex === 0 && newState.products.length) {
      let selected = JSON.stringify(newState.products[0]);
      newState.selected = JSON.parse(selected);
      newState.selectedHex = newState.selected.colors[0].hex;
    }
    let deleteId = deleted[0].id;
    newState.index = newState.deleteIndex - 1 || 0;
    newState.vIndex = 0;
    newState.mode = 'read';
    newState.imageIndex = 0;
    newState.picker = false;
    newState.deleteIndex = undefined;
    newState.showModal = false;
    this.setState(newState, () => {
      // axios delete product
      axios.delete(`/admin/product/${deleteId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
      if (!this.state.products.length) this.addNewProduct();
    });
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
        <div className="product-item flex jc-sb ai-c" key={i} onClick={(e) => this.readProduct(e, product)}>
          <h2>{product.brand.toUpperCase()} {product.number}</h2>
          <div className="icon-wrapper">
            <img onClick={() => this.editProduct(product)} src={getAsset('edit')} />
            <img onClick={() => this.promptDelete(product)} src={getAsset('garbage')} />
          </div>
        </div>
      );
    });

    let variants = [];

    if (this.state.selected.colors) {
      variants = this.state.selected.colors.map((color, i) => {
        return (
          <div className="variant flex jc-sb ai-c" key={i} onClick={() => this.setVIndex(i)}
            style={this.state.vIndex === i ? {borderColor: '#44B1DE'} : null}>
            {this.state.picker && this.state.vIndex === i ? (
              <div className="picker flex ai-c jc-sb">
                <div>
                  <input onChange={this.updatePickedColor} name="hex" type="text" placeholder="#ffffff" value={color.hex} />
                  <input onChange={this.updatePickedColor} name="name" type="text" placeholder="White" value={color.name} />
                </div>
                <div>
                  {this.state.selected.colors.length > 1 ? (
                    <img className="remove-color" src={getAsset('garbage')} onClick={this.removeColor} />
                  ) : null}
                  <img src={getAsset('red-x')} onClick={this.togglePicker} />
                </div>
              </div>
            ) : null}
            <div className="variant-name flex ai-c">
              <div className="variant-color" style={{background: color.hex}} onClick={this.togglePicker}></div> {color.name.toUpperCase()}
            </div>
            <div className="flex">
              <div className="flex">
                {this.state.selected.images[color.hex][0] ? (
                  <div className="variant-item flex ai-c">
                    <h3>{this.state.selected.images[color.hex][0].substring(0, 10)}...</h3>
                    <img onClick={() => this.removeImage(color.hex, 0)} src={getAsset('red-x')} />
                  </div>
                ) : (
                  <div className="variant-item flex ai-c">
                    <h3>FRONT IMG</h3>
                    <img onClick={() => document.getElementById('input-front').click()} src={getAsset('blue-plus')} />
                    <input id="input-front" type="file" accept="image/x-png,image/jpeg" onChange={(e) => this.storeFile(e, 'input-front', color.hex, 0)} />
                  </div>
                )}
              </div>
              <div className="flex">
                {this.state.selected.images[color.hex][1] ? (
                  <div className="variant-item flex ai-c">
                    <h3>{this.state.selected.images[color.hex][1].substring(0, 10)}...</h3>
                    <img onClick={() => this.removeImage(color.hex, 1)} src={getAsset('red-x')} />
                  </div>
                ) : (
                  <div className="variant-item flex ai-c">
                    <h3>BACK IMG</h3>
                    <img onClick={() => document.getElementById('input-back').click()} src={getAsset('blue-plus')} />
                    <input id="input-back" type="file" accept="image/x-png,image/jpeg" onChange={(e) => this.storeFile(e, 'input-back', color.hex, 1)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <div id="Home">
        {this.state.showModal ? (
          <PromptModal message="Are you sure you want to delete this product?" buttonAction="Delete" 
            callback={this.delete} cancel={this.hideModal} />
        ) : null}
        <HomeNav header="PRODUCTS" />
        <div className="flex">
          <PageNav />
          <div className="page-content flex">
            <div className="left-content">
              <div className="flex jc-sb ai-c">
                <h1>PRODUCT LIST</h1>
                <button onClick={this.addNewProduct}>ADD NEW PRODUCT</button>
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
                <div className="product-item-wrapper">
                  <hr />
                  {productList}
                </div>
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
                      <div className="field">
                        WEIGHT: <input className="small" value={this.state.selected.weight} name="weight" onChange={this.updateField} /> lbs
                      </div>
                      <div className="field">
                        BASE COST: $<input className="small" value={this.state.selected.costOfShirt} name="costOfShirt" onChange={this.updateField} />
                      </div>
                      <div className="color-variants">
                        <h1>COLOR VARIANTS</h1>
                        <hr />
                        {variants}
                        <div className="variant-add flex jc-sb ai-c" onClick={this.addNewColor}>
                          <div className="variant-add-text flex ai-c">
                            <div className="variant-button flex jc-c ai-c"><span>+</span></div> ADD COLOR VARIANT
                          </div> 
                        </div>
                      </div>
                      {this.state.mode === 'edit' ? (
                        <div className="edit-buttons">
                          <button onClick={this.save}>SAVE</button>
                          <button onClick={this.cancel}>CANCEL</button>
                        </div>
                      ) : null}
                      {this.state.mode === 'create' ? (
                        <div className="edit-buttons">
                          <button onClick={this.saveNew}>SAVE</button>
                          <button onClick={this.cancel}>CANCEL</button>
                        </div>
                      ) : null}
                    </div>
                    <div className="image-wrapper">
                      <div className="image-display">
                        {this.state.selected.images[this.state.selectedHex][this.state.imageIndex] ? (
                          <img src={this.state.selected.images[this.state.selectedHex][this.state.imageIndex]} />
                        ) : (
                          <img src={getAsset('placeholder', 'jpg')} />
                        )}
                      </div>
                      <div className="image-actions flex jc-sa">
                        <img onClick={() => this.setImageIndex(0)} src={getAsset('front-side-button')} />
                        <img onClick={() => this.setImageIndex(1)} src={getAsset('back-side-button')} />
                      </div>
                      {this.state.selected.images[this.state.selectedHex][0] && this.state.imageIndex === 0 ? (
                        <Draggable on bounds="parent" cancel=".resize" onStop={this.setPosition}
                          defaultPosition={this.state.selected.printArea[0].offsetLeft ? {
                            x: this.state.selected.printArea[0].offsetLeft, 
                            y: this.state.selected.printArea[0].offsetTop} 
                          : {x: 0, y: 0}}>
                          <div className="print-area" style={this.state.selected.printArea[0]}>
                            <img className="resize diagonal" draggable="true" onDragStart={this.startDrag} 
                              onDrag={this.drag} onDragEnd={this.stopDrag} src={getAsset('resize-diagonal')} />
                          </div>
                        </Draggable>
                      ) : null}
                      {this.state.selected.images[this.state.selectedHex][1] && this.state.imageIndex === 1 ? (
                        <Draggable on bounds="parent" cancel=".resize" onStop={this.setPosition}
                          defaultPosition={this.state.selected.printArea[1].offsetLeft ? {
                            x: this.state.selected.printArea[1].offsetLeft, 
                            y: this.state.selected.printArea[1].offsetTop} 
                          : {x: 0, y: 0}}>
                          <div className="print-area" style={this.state.selected.printArea[1]}>
                            <img className="resize diagonal" draggable="true" onDragStart={this.startDrag} 
                              onDrag={this.drag} onDragEnd={this.stopDrag} src={getAsset('resize-diagonal')} />
                          </div>
                        </Draggable>
                      ) : null}
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
