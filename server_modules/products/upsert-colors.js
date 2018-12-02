const ErrorModule = require('../error');

module.exports = function upsertColors(product, conn) {
  return Promise.all(product.colors.map((color) => {
    return conn.query(`
      DELETE FROM productColors 
      WHERE productId = ${conn.escape(product.id)}
    `)
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