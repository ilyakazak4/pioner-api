const sendOAuthMail = require('./sendOAuthMail')

async function sendMail(email, recipient, subject, html, attachments = []) {
  const options = {
    from: `Фотоновик <${email}>`,
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
