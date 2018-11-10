const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const authWare = require('./auth-ware');
const findUser = require('./find-user');

passport.serializeUser((user, cb) => cb(null, user.email));
passport.deserializeUser((email, cb) => findUser(email, cb));

module.exports = function initialize() {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    findUser(email, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      let isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) { return done(null, false); }
      return done(null, user);
    });
  }));
  passport.authWare = authWare;
}