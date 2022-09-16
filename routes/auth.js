const keys = require('../keys/index');
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = Router();

const User = require('../models/User');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');

// emails stuff
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = keys.SENDINBLUE_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    isLogin: true,
    error: req.flash('error')
  });
})

router.post('/login', async (req, res) => {

  const { email, password } = req.body;
  const candidate = await User.findOne({ email });

  if (candidate) {
    const areSame = await bcrypt.compare(password, candidate.password);

    if (areSame) {
      req.session.user = candidate;
      req.session.isAuthenticated = true;
      req.session.save(err => {
        if (err) {
          throw err;
        }

        res.redirect('/');
      })
    } else {
      req.flash('error', 'Password is wrong');
      res.redirect('/auth/login#login');
    }
  } else {
    req.flash('error', 'User not found');
    res.redirect('/auth/login#login');
  }
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  })
})

router.post('/register', async (req, res) => {
  try {
    const { email, password, confirm, name } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('error', 'User is already registered');
      res.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashPassword, name, cart: { items: [] } });
      await user.save();

      res.redirect('/auth/login#login');

      await tranEmailApi.sendTransacEmail(regEmail(email));
    }

  } catch (e) {
    console.log(e);
  }
})

router.get('/reset', async (req, res) => {
  res.render('auth/reset', {
    isLogin: true,
    error: req.flash('error')
  });
})

router.post('/reset', (req, res) => {
  const { email } = req.body;
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong');
        return res.redirect('/auth/reset');
      }

      // console.log('candidate');

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email });
      // console.log(candidate);
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await tranEmailApi.sendTransacEmail(resetEmail(email, token));
        return res.redirect('/auth/login');
      } else {
        req.flash('error', 'No such user');
        return res.redirect('/auth/reset');
      }
    })
  } catch (e) {
    console.log(e);
  }
})


module.exports = router