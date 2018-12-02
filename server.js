const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const fs = require('fs');
const config = require('./config');
const passport = require('passport');
const session = require('express-session');
const AuthModule = require('./server_modules/authentication');
const app = module.exports = express();

app.set('port', (process.env.PORT || 3002));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/build'));

require('./server_modules/authentication').initialize(app);

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

require('./routes')(app);

AuthModule.clearShortTokens();

app.get(['/src/*.png', '/src/*.jpg'], (req, res) => {
  res.sendFile(req.url, { root: process.cwd() });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build/index.html'));
});

const options = {
  key: fs.readFileSync(config.ssl.key, 'utf8'),
  cert: fs.readFileSync(config.ssl.crt, 'utf8')
};

if (process.env.NODE_ENV === 'production') {
  options.ca = [fs.readFileSync(config.ssl.ca, 'utf8')];
}

https.createServer(options, app)
.listen(app.get('port'), () => {
  console.log('localhost:' + app.get('port'));
});
