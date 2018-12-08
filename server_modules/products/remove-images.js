const config = require('../../config');
const fs = require('fs');

// not fully tested
module.exports = function removeImages(product, conn) {
  return conn.query(`SELECT * FROM productImages WHERE productId = ${conn.escape(product.id)}`)
  .then((results) => {
    let removals = [];
    for (var prop in product.images) {
      let productImage = results.find((r) => r.hex === prop);
      if (productImage && isBeingUpdated(product.images[prop][0])) {
        removals.push(getUrlFileName(productImage.frontUrl));
      }
      if (productImage && isBeingUpdated(product.images[prop][1])) {
        removals.push(getUrlFileName(productImage.backUrl));
      }
    }
    return Promise.all(removals.map((file) => {
      let fileLocation = `${getRepoDir()}/build/admin/src/${file}`;
      return fs.unlinkSync(fileLocation);
    }));
  })
}

function isBeingUpdated(data) {
  return data && data.indexOf(config.host) === -1;
}

function getUrlFileName(url) {
  let path = url.split('/');
  return path[path.length - 1];
}

function getRepoDir() {
  let folders =  __dirname.split("/")
  folders.pop();
  folders.pop()
  return folders.join("/");
}