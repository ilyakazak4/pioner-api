const sendOAuthMail = require('./sendOAuthMail')

async function sendMail(email, recipient, subject, html, attachments = []) {
  const options = {
    from: `ПКП Пионер <${email}>`,
    to: recipient,
    subject,
    html,
    attachments,
    // generateTextFromHTML: true,
  }

  const result = await sendOAuthMail(email, { options })
  return result
}

module.exports = sendMail
