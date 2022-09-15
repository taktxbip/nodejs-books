const { Router } = require('express');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('add-book', {
    title: 'Add Book',
    isAddBook: true
  });
})

router.post('/', authMiddleware, async (req, res) => {
  const { title, price, img } = req.body;

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