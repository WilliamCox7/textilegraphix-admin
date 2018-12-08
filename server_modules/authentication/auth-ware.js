const findUser = require('./find-user');
const bcrypt = require('bcrypt');

module.exports = function authWare() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else if (req.headers.authorization) {
      let base64Creds =  req.headers.authorization.split(' ')[1];
      const creds = Buffer.from(base64Creds, 'base64').toString().split(":");
      return findUser(creds[0], (err, user) => {
        if (!err && user) {
          let valid = bcrypt.compareSync(creds[1], user.password);
          if (!valid) {
            res.status(401).send('Unauthorized');
          } else {
            return next();
          }
        }
      });
    }
    res.status(401).send('Unauthorized');
  }
}