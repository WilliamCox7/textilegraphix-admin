const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = function updateProduct(product) {
  return mysql.createConnection(config.mysql).then((conn) => {


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

function upsertImages(product, conn) {
  let promises = [];
  for (var prop in product.images) {
    promises.push(
      conn.query(`DELETE FROM productImages WHERE productId = ${conn.escape(product.id)}`)
      .then(() => {
        conn.query(`
          REPLACE INTO productImages
          (productId, hex, frontUrl, backUrl)
          VALUES
          (${conn.escape(product.id)}, ${conn.escape(prop)}, ${conn.escape(product.images[prop][0])}, ${conn.escape(product.images[prop][1])})
        `)
        .catch((err) => {
          conn.end();
          return Promise.reject(ErrorModule.handle(err, 'EV8N'));
        })
      })
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'RN8W'));
      })
    )
  }
  return Promise.all(promises);
}

function upsertColors(product, conn) {
  let promises = [];
  return Promise.all(product.colors.map((color) => {
    return conn.query(`DELETE FROM productColors WHERE productId = ${conn.escape(product.id)}`)
    .then(() => {
      return conn.query(`
        REPLACE INTO productColors
        (productId, hex, name)
        VALUES
        (${conn.escape(product.id)}, ${conn.escape(color.hex)}, ${conn.escape(color.name)})
      `)
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'RT9M'));
      })
    })
    .catch((err) => {
      conn.end();
      return Promise.reject(ErrorModule.handle(err, 'HOE8'));
    })
  }));
}
