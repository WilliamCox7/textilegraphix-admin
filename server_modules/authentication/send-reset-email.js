const config = require('../../config');
const nodemailer = require('nodemailer');

module.exports = (requestBody, token) => {

  var auth = {
    user: config.graphix.email,
    pass: config.graphix.password
  }

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: auth
  });

  var options = {
    to: requestBody.email,
    subject: `Reset Password`,
    html: `<div>Click <a href="${config.host}/reset?t=${token}">here</a> to reset your password</div>`
  }

  return transporter.sendMail(options);

}
