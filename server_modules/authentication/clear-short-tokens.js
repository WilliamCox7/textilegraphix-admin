const mysql = require('mysql');
const config = require('../../config');
const conn = mysql.createConnection(config.mysql);

conn.connect();

module.exports = () => conn.query(`DELETE FROM tokens`);