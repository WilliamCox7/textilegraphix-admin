const mysql = require('mysql');
const config = require('../../config');
const conn = mysql.createConnection(config.mysql);

module.exports = function findUser(email, cb) {
  conn.query(`SELECT * FROM users WHERE email = '${email}'`, (error, users) => {
    if (error) cb(null);
    else if (users.length) cb(null, users[0]);
    else cb(null);
  });
}