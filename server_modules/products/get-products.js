const mysql = require('promise-mysql');
const config = require('../../config');
const getProductsPrintArea = require('./get-products-print-area');
const getProductsImages = require('./get-products-images');
const getProductsColors = require('./get-products-colors');
const ErrorModule = require('../error');

module.exports = function getProducts() {
  return mysql.createConnection(config.mysql).then((conn) => {


  let products;
  return conn.query(`SELECT * FROM products`)
  .then((results) => products = results)
  .then(() => iterate(products.entries(), getProductDetails))
  .then(() => products)
  .catch((err) => Promise.reject(ErrorModule.handle(err, 'JKL6')));


  });
}

function iterate(iter, cb) {
  let iteration = iter.next();
  if (iteration.done) {
    return Promise.resolve();
  }
  let product = iteration.value[1];
  return cb(product)
  .then((p) => {
    product = p;
    iterate(iter, cb);
  })
  .catch((err) => Promise.reject(err));
}

function getProductDetails(product) {
  return getProductsPrintArea(product)
  .then((printArea) => product.printArea = printArea)
  .then(() => getProductsImages(product))
  .then((images) => product.images = images)
  .then(() => getProductsColors(product))
  .then((colors) => product.colors = colors)
  .then(() => product)
  .catch((err) => Promise.reject(err));
}