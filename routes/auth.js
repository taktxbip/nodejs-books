const keys = require('../keys/index');
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = Router();
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { registerValidators } = require('../utils/validators');

// emails stuff
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = keys.SENDINBLUE_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

// emails templates
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');

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

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashPassword, name, cart: { items: [] } });
    await user.save();

    res.redirect('/auth/login#login');

    await tranEmailApi.sendTransacEmail(regEmail(email));

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

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email });
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

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }

  try {
    const candidate = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!candidate) {
      return res.redirect('/auth/login');
    }

    res.render('auth/password', {
      isLogin: true,
      error: req.flash('error'),
      userId: candidate._id.toString(),
      token: req.params.token
    });

  } catch (e) {
    console.log(e);
  }
})

router.post('/password/', async (req, res) => {
  try {
    const { userId, token, password, confirm } = req.body;

    if (password !== confirm) {
      req.flash('error', 'Passwords missmatch');
      return res.redirect(`/auth/password/${token}`);
    }

    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'No user with this token or token expired');
      return res.redirect('/auth/login');
    } else {
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();

      req.flash('error', 'Password updated')
      return res.redirect(`/auth/login`);
    }

  } catch (e) {
    console.log(e);
  }
})


module.exports = router