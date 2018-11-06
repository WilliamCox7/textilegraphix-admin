const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const fs = require('fs');
const config = require('./config');
const app = module.exports = express();

app.set('port', (process.env.PORT || 3002));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/build'));

require('./routes')(app);

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
