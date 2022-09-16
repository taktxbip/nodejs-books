const keys = require('../keys');

module.exports = function (email, token) {
  return {
    sender: {
      email: keys.EMAIL_FROM,
      name: 'Admin',
    },
    to: [{ email }],
    subject: 'Reset password',
    htmlContent: `
          <h1>Reset password</h1>
          <p>Click link to reset password:</p>
          <p><a href="${keys.BASE_URL}auth/password/${token}">Recover an access</a></p>
          <hr/>
          <a href="${keys.BASE_URL}">Books library</a>
        `
  }
}


