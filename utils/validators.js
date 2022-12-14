const { body } = require('express-validator');
const User = require('../models/User');

exports.registerValidators = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name must be 3 symbols length minimum')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Set correct email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('User exists');
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body('password', 'The password must be 6 symbols length')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match');
    }
    return true;
  })
    .trim()
]


exports.bookValidators = [
  body('title').isLength({ min: 3 }).withMessage('Minimal length must be 3 at least').trim(),
  body('price').isNumeric().withMessage('Must be correct price'),
  body('img', 'Set correct url for image').isURL()
]