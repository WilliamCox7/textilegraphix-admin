const mysql = require('mysql');
const config = require('../../config');
const conn = mysql.createConnection(config.mysql);

conn.connect();

module.exports = (token) => {
  conn.query(`
    DELETE FROM tokens
    WHERE token = '${token}'
  `);
}