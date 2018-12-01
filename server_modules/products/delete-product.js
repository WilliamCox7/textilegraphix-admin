const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = function deleteProduct(id) {
  return mysql.createConnection(config.mysql).then((conn) => {

    return Promise.all([

      conn.query(`
        DELETE FROM products
        WHERE id = ${conn.escape(id)}
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'QWD4'));
      }),

      conn.query(`
        DELETE FROM productPrintArea
        WHERE productId = ${conn.escape(id)}
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'NUC9'));
      }),

      conn.query(`
        DELETE FROM productImages
        WHERE productId = ${conn.escape(id)}
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'DHP0'));
      }),

      conn.query(`
        DELETE FROM productColors
        WHERE productId = ${conn.escape(id)}
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'VBR1'));
      })

    ]);

  });
}