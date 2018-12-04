const fs = require('fs');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = function upsertImages(product, conn) {
  let promises = [];
  return conn.query(`
    DELETE FROM productImages 
    WHERE productId = ${conn.escape(product.id)}
  `)
  .then(() => {
    for (var prop in product.images) {
      let frontUrl = handleData(product.images[prop][0]);
      let backUrl = handleData(product.images[prop][1]);
      promises.push(
        conn.query(`
          REPLACE INTO productImages
          (productId, hex, frontUrl, backUrl)
          VALUES
          (${conn.escape(product.id)}, ${conn.escape(prop)}, ${conn.escape(frontUrl)}, ${conn.escape(backUrl)})
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

function handleData(data) {
  if (data && data.indexOf(config.host) === -1) {
    let guid = createGuid();

    let fileType = data.indexOf('png') > -1 ? 'png' : 'jpg';
    if (fileType === 'png') data = data.replace(/^data:image\/png;base64,/, "");
    else data = data.replace(/^data:image\/jpeg;base64,/, "");

    let fileName = `${config.host}/src/${guid}.${fileType}`;
    let fileLocation = `${getRepoDir()}/src/${guid}.${fileType}`;
    fs.writeFile(fileLocation, data, 'base64', (err) => err ? ErrorModule.handle(err, 'XZ9S') : null);
    return fileName;
  }
  return data;
}

function createGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4();
}

function getRepoDir() {
  let folders =  __dirname.split("/")
  folders.pop();
  folders.pop()
  return folders.join("/");
}