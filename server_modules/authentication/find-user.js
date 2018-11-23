const mysql = require('promise-mysql');
const config = require('../../config');

module.exports = function findUser(email, cb) {
  return mysql.createConnection(config.mysql).then((conn) => {

    return conn.query(`SELECT * FROM users WHERE email = '${email}'`)
    .then((users) => {
      if (users.length) cb(null, users[0]);
      else cb(null);
    })
    .catch((err) => cb(null));


  });
}