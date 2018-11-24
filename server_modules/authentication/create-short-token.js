const mysql = require('promise-mysql');
const config = require('../../config');
const deleteShortToken = require('./delete-short-token');
const ErrorModule = require('../error');

module.exports = (requestBody) => {
  return mysql.createConnection(config.mysql).then((conn) => {

  
    let shortToken = `${s4()}${s4()}${s4()}${s4()}`;
    return conn.query(`
      SELECT id 
      FROM users
      WHERE email = '${requestBody.email}'
    `)
    .then((result) => {
      return conn.query(`
        INSERT INTO tokens (userId, token)
        VALUES ('${result[0].id}', '${shortToken}')
      `)
      .then((result) => {
        setTimeout(() => deleteShortToken(shortToken), 300000);
        conn.end();
        return shortToken;
      })
      .catch((err) => {
        conn.end();
        return Promise.reject(ErrorModule.handle(err, 'HIW5'));
      });
    })
    .catch((err) => {
      conn.end();
      return Promise.reject(ErrorModule.handle(err, '4JOD'));
    });


  });
}


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}