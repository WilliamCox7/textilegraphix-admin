const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = function getProductsColors(product) {
  return mysql.createConnection(config.mysql).then((conn) => {


    return conn.query(`
      SELECT * FROM productColors
      WHERE productId = ${product.id}
    `)
    .catch((err) => Promise.reject(ErrorModule.handle(err, '6RGM')));


  });
}