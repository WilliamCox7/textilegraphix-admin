const mysql = require('mysql');
const config = require('./config');
const conn = mysql.createConnection(config.mysql);
const bcrypt = require('bcrypt');
const passport = require('passport');
const AuthModule = require('./server_modules/authentication');
const ProductModule = require('./server_modules/products');

conn.connect();

module.exports = (app) => {
  
  app.post('/admin/user/create', passport.authWare(), (req, res) => {
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

  app.post('/admin/authenticate', passport.authenticate('local', {
    failureRedirect: '/admin/login'
  }), (req, res) => {
    res.status(200).send('Authenticated');
  });
  
  app.get('/admin/user', passport.authWare(), (req, res) => {
    res.status(200).send({ name: req.user.first });
  });

  app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('User logged out');
  });

  app.post('/admin/send-reset-email', (req, res) => {
    AuthModule.createShortToken(req.body)
    .then((token) => {
      AuthModule.sendResetEmail(req.body, token)
      .then(() => {
        res.status(200).send('Email Sent');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('A problem occurred while creating a short token');
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('A problem occurred while sending the reset email');
    });
  });

  app.put('/admin/update-password', (req, res) => {
    AuthModule.updatePassword(req.body)
    .then(() => {
      res.status(200).send('Password Updated');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('A problem occurred while updating the password');
    });
  });

  app.get('/admin/products', (req, res) => {
    ProductModule.getProducts()
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('A problem occured while getting the products');
    });
  });

  app.put('/admin/product', (req, res) => {
    ProductModule.updateProduct(req.body)
    .then(() => {
      res.status(200).send(`${req.body.brand} ${req.body.number} Updated`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`A problem occured while updating product with id ${req.body.id}`);
    });
  });

  app.post('/admin/product', (req, res) => {
    ProductModule.createProduct(req.body)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`A problem occured while creating product ${req.body.brand} ${req.body.number}`);
    });
  });

  app.delete('/admin/product/:id', (req, res) => {
    ProductModule.deleteProduct(req.params.id)
    .then(() => {
      res.status(200).send(`The product was deleted`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`A problem occured while deleting product with id ${req.body.id}`);
    });
  });

}