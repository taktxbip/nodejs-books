const { Router } = require('express');
const router = Router();
const User = require('../models/User');

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    isLogin: true
  });
})

router.post('/login', async (req, res) => {
  req.session.user = await User.findById('631de91fcd08a0a1ec3af5db');
  req.session.isAuthenticated = true;
  req.session.save(err => {
    if (err) {
      throw err;
    }

    res.redirect('/');
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  })
})


module.exports = router