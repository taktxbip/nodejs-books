const { Router } = require('express');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { bookValidators } = require('../utils/validators');
const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('add-book', {
    title: 'Add Book',
    isAddBook: true
  });
})

router.post('/', authMiddleware, bookValidators, async (req, res) => {
  const { title, price, img } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('add-book', {
      title: 'Add Book',
      isAddBook: true,
      error: errors.array()[0].msg,
      formData: { title, price, img }
    });
  }


  const book = new Book({
    title,
    price,
    img,
    userId: req.user
  });

  try {
    await book.save();
    res.redirect('/books');
  } catch (e) {
    console.warn(e);
  }

})

module.exports = router