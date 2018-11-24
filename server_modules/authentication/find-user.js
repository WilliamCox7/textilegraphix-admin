const mysql = require('promise-mysql');
const config = require('../../config');

module.exports = function findUser(email, cb) {
  return mysql.createConnection(config.mysql).then((conn) => {

    return conn.query(`SELECT * FROM users WHERE email = '${email}'`)
    .then((users) => {
      conn.end();
      if (users.length) cb(null, users[0]);
      else {
        return cb(null);
      }
    })
    .catch((err) => {
      conn.end();
      return cb(null)
    });


  });
}