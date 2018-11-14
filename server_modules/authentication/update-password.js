const mysql = require('mysql');
const config = require('../../config');
const conn = mysql.createConnection(config.mysql);
const bcrypt = require('bcrypt');

conn.connect();

module.exports = (requestBody) => {
  return new Promise((resolve, reject) => {
    conn.query(`
      SELECT * 
      FROM tokens
      WHERE token = '${requestBody.token}'
    `, (error, result) => {
      if (error) reject(error);
      if (result && result.length) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(requestBody.password, salt);
        conn.query(`
          UPDATE users
          SET password = '${hash}'
          WHERE id = ${result[0].userId}
        `, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      } else {
        reject('Short token has expired');
      }
    })
  });
}