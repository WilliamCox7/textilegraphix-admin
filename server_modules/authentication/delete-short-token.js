const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = (token) => {
  return mysql.createConnection(config.mysql).then((conn) => {


    return conn.query(`
      DELETE FROM tokens
      WHERE token = '${token}'
    `)
    .catch((err) => Promise.reject(ErrorModule.handle(err, 'WPL6')));


  });
}