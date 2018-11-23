const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = function getProductsImages(product) {
  return mysql.createConnection(config.mysql).then((conn) => {


    return conn.query(`
      SELECT * FROM productImages
      WHERE productId = ${product.id}
    `)
    .then((images) => {
      let imgObj = {};
      images.forEach((image) => imgObj[image.hex] = [ image.frontUrl, image.backUrl ]);
      return imgObj;
    })
    .catch((err) => Promise.reject(ErrorModule.handle(err, 'QD1V')));


  });
}