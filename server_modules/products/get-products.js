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
    .then((results) => {
      conn.end();
      return products = results;
    })
    .catch((err) => {
      conn.end();
      return Promise.reject(ErrorModule.handle(err, 'JKL6'));
    })
    .then(() => iterate(products.entries(), getProductDetails, []))
    .then((fullProducts) => fullProducts);

  });
}

function iterate(iter, cb, fullProducts) {
  let iteration = iter.next();
  if (iteration.done) {
    return Promise.resolve(fullProducts);
  }
  let product = iteration.value[1];
  return cb(product)
  .then((p) => {
    fullProducts.push(p);
    return iterate(iter, cb, fullProducts);
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