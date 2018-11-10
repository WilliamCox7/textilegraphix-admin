const mysql = require('mysql');
const config = require('./config');
const conn = mysql.createConnection(config.mysql);
const bcrypt = require('bcrypt');
const passport = require('passport');

conn.connect();

module.exports = (app) => {
  
  app.post('/user/create', (req, res) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    conn.query(`
      INSERT INTO users (email, password, first, last)
      VALUES ('${req.body.email}', '${hash}', '${req.body.first}', '${req.body.last}')
    `, (error, result) => {
      if (error) throw error;
      res.status(200).send(`User Created for ${req.body.email}`);
    });
  });

  app.post('/authenticate', passport.authenticate('local', {
    failureRedirect: '/login'
  }), (req, res) => {
    res.status(200).send('Authenticated');
  });
  
  app.get('/user', passport.authWare(), (req, res) => {
    res.status(200).send({ name: req.user.first });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy();
  });

}