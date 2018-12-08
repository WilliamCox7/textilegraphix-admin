const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');
const upsertColors = require('./upsert-colors');
const upsertImages = require('./upsert-images');

module.exports = function createProduct(product) {
  return mysql.createConnection(config.mysql).then((conn) => {

      return conn.query(`
        INSERT INTO products
        (brand, number, costOfShirt, type, rating, quality, material, weight)
        VALUES
        (
          ${conn.escape(product.brand)}, 
          ${conn.escape(product.number)}, 
          ${conn.escape(product.costOfShirt)}, 
          ${conn.escape(product.type)},
          ${conn.escape(product.rating)},
          ${conn.escape(product.quality)},
          ${conn.escape(product.material)},
          ${conn.escape(product.weight)}
        )
      `)
      .then((result) => {
        product.id = result.insertId;
        return Promise.all([

          conn.query(`
            INSERT INTO productPrintArea
            (productId, width, height, top, \`left\`, side)
            VALUES
            (
              ${conn.escape(product.id)},
              ${conn.escape(product.printArea[0].width)},
              ${conn.escape(product.printArea[0].height)},
              ${conn.escape(product.printArea[0].top)},
              ${conn.escape(product.printArea[0].left)},
              ${conn.escape(0)}
            )
          `)
          .catch((err) => {
            conn.end();
            return Promise.reject(ErrorModule.handle(err, 'LI7F'));
          }),

          conn.query(`
            INSERT INTO productPrintArea
            (productId, width, height, top, \`left\`, side)
            VALUES
            (
              ${conn.escape(product.id)},
              ${conn.escape(product.printArea[1].width)},
              ${conn.escape(product.printArea[1].height)},
              ${conn.escape(product.printArea[1].top)},
              ${conn.escape(product.printArea[1].left)},
              ${conn.escape(1)}
            )
          `)
          .catch((err) => {
            conn.end();
            return Promise.reject(ErrorModule.handle(err, 'NGW5'));
          }),

          upsertImages(product, conn),

          upsertColors(product, conn)

        ]);
      })
      .then(() => {
        conn.end();
        return {
          insertId: product.id
        };
      })
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'WTT7'));
      });

  });
}