const mysql = require('mysql');
const config = require('../../config');
const conn = mysql.createConnection(config.mysql);
const deleteShortToken = require('./delete-short-token');

conn.connect();

module.exports = (requestBody) => {
  return new Promise((resolve, reject) => {
    let shortToken = `${s4()}${s4()}${s4()}${s4()}`;
    conn.query(`
      SELECT id 
      FROM users
      WHERE email = '${requestBody.email}'
    `, (error, result) => {
      if (error) reject(error);
      conn.query(`
        INSERT INTO tokens (userId, token)
        VALUES ('${result[0].id}', '${shortToken}')
      `, (error, result) => {
        if (error) reject(error);
        setTimeout(() => deleteShortToken(shortToken), 300000);
        resolve(shortToken);
      });
    });
  });
}


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}