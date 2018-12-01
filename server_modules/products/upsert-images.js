module.exports = function upsertImages(product, conn) {
  let promises = [];
  return conn.query(`
    DELETE FROM productImages 
    WHERE productId = ${conn.escape(product.id)}
  `)
  .then(() => {
    for (var prop in product.images) {
      promises.push(
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
      )
    }
    return Promise.all(promises);
  })
  .catch((err) => {
    conn.end();
    return Promise.reject(ErrorModule.handle(err, 'RN8W'));
  });
}