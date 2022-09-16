const keys = require('../keys');

module.exports = function (email) {
  return {
    sender: {
      email: keys.EMAIL_FROM,
      name: 'Admin',
    },
    to: [{ email }],
    subject: 'Account created',
    htmlContent: `
          <h1>Welcome to the library</h1>
          <p>Account created:</p>
          <p><strong>${email}</strong></p>
          <hr/>
          <a href="${keys.BASE_URL}">Books library</a>
        `
  }
}


