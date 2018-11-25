const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = function getProductsPrintArea(product) {
  return mysql.createConnection(config.mysql).then((conn) => {


    return conn.query(`
      SELECT * FROM productPrintArea
      WHERE productId = ${product.id}
    `)
    .then((areas) => {
      conn.end();
      let printAreas = [];
      areas.forEach((area) => {
        if (area.side === 0) {
          printAreas.unshift({
            width: area.width,
            height: area.height,
            top: area.top,
            left: area.left
          });
        } else {
          printAreas.push({
            width: area.width,
            height: area.height,
            top: area.top,
            left: area.left
          });
        }
      });
      return printAreas;
    })
    .catch((err) => {
      conn.end();
      return Promise.reject(ErrorModule.handle(err, 'MBG0'));
    });


  });
}