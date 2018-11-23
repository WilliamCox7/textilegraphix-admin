const mysql = require('promise-mysql');
const config = require('../../config');
const ErrorModule = require('../error');

module.exports = () => {
  return mysql.createConnection(config.mysql).then((conn) => {


    return conn.query(`DELETE FROM tokens`)
    .catch((err) => Promise.reject(ErrorModule.handle(err, 'UK7E')));


  });
}