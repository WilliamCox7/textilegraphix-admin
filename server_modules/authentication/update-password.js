const mysql = require('promise-mysql');
const config = require('../../config');
const bcrypt = require('bcrypt');
const ErrorModule = require('../error');

module.exports = (requestBody) => {
  return mysql.createConnection(config.mysql).then((conn) => {


    return conn.query(`
      SELECT * 
      FROM tokens
      WHERE token = '${requestBody.token}'
    `)
    .then((result) => {
      if (result && result.length) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(requestBody.password, salt);
        return conn.query(`
          UPDATE users
          SET password = '${hash}'
          WHERE id = ${result[0].userId}
        `)
        .catch((err) => {
          conn.end();
          return Promise.reject(ErrorModule.handle(err, 'PN6Y'));
        });
      } else {
        conn.end();
        return Promise.reject('Short token has expired');
      }
    })
    .catch((err) => {
      conn.end();
      return Promise.reject(ErrorModule.handle(err, 'UO3E'));
    });


  });
}