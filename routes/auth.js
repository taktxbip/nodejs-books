const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = Router();
const User = require('../models/User');

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
    }

  } catch (e) {
    console.log(e);
  }
})


module.exports = router