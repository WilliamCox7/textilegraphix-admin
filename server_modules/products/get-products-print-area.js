const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = function getProductsPrintArea(product) {
  return mysql.createConnection(config.mysql).then((conn) => {


    return conn.query(`
      SELECT * FROM productPrintArea
      WHERE productId = ${product.id}
    `)
    .then((printArea) => {
      return {
        width: printArea[0].width,
        height: printArea[0].height,
        top: printArea[0].top,
        left: printArea[0].left,
      }
    })
    .catch((err) => Promise.reject(ErrorModule.handle(err, 'MBG0')));


  });
}