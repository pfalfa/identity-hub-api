const nodemailer = require('nodemailer')
const config = require('../../config')

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: { user: config.email.username, pass: config.email.password },
})

function send(to, subject, body) {
  return new Promise((resolve, reject) => {
    if (!config.email.host || !config.email.username || config.email.password)
      return reject({ success: false, info: 'Please check the email service configuration' })

    transporter.sendMail(
      {
        to,
        subject,
        body,
      },
      (error, info) => {
        if (error) return reject({ success: false, info: error })
        console.log('Message %s sent: %s', info.messageId, info.response)
        return resolve({ success: true, info })
      }
    )
  })
}

const nodemail = {
  send,
}

module.exports = nodemail
