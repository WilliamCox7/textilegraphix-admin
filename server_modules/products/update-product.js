const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');
const upsertColors = require('./upsert-colors');
const upsertImages = require('./upsert-images');

module.exports = function updateProduct(product) {
  return mysql.createConnection(config.mysql).then((conn) => {

    product.printArea = product.printArea.map((area) => {
      if (area.offsetTop) {
        area.top = (Number(area.top.substring(0, area.top.length - 2)) + area.offsetTop) + 'px';
      }
      if (area.offsetLeft) {
        area.left = (Number(area.left.substring(0, area.left.length - 2)) + area.offsetLeft) + 'px';
      }
      return area;
    });

    return Promise.all([

      conn.query(`
        UPDATE products
        SET 
          brand = ${conn.escape(product.brand)},
          number = ${conn.escape(product.number)},
          costOfShirt = ${conn.escape(product.costOfShirt)},
          type = ${conn.escape(product.type)},
          rating = ${conn.escape(product.rating)},
          quality = ${conn.escape(product.quality)},
          material = ${conn.escape(product.material)},
          weight = ${conn.escape(product.weight)}
        WHERE id = ${conn.escape(product.id)}
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'DF2O'));
      }),

      conn.query(`
        UPDATE productPrintArea
        SET 
          width = ${conn.escape(product.printArea[0].width)},
          height = ${conn.escape(product.printArea[0].height)},
          top = ${conn.escape(product.printArea[0].top)},
          \`left\` = ${conn.escape(product.printArea[0].left)}
        WHERE productId = ${conn.escape(product.id)} AND side = ${conn.escape(0)}
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'BYO0'));
      }),

      conn.query(`
        UPDATE productPrintArea
        SET 
          width = ${conn.escape(product.printArea[1].width)},
          height = ${conn.escape(product.printArea[1].height)},
          top = ${conn.escape(product.printArea[1].top)},
          \`left\` = ${conn.escape(product.printArea[1].left)}
        WHERE productId = ${conn.escape(product.id)} AND side = ${conn.escape(1)}
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'KH1E'));
      }),

      upsertImages(product, conn),

      upsertColors(product, conn)

    ])
    .then(() => conn.end())
    .catch((err) => {
      conn.end();
      return Promise.reject(err);
    });

  });
}
