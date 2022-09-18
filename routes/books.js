const { Router } = require('express');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');
const router = Router();
const { validationResult } = require('express-validator/check');
const { bookValidators } = require('../utils/validators');

const isOwner = (book, req) => {
  return book.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {

  try {
    const books = await Book.find()
      .populate('userId', 'email name')
      .select('title price img')
      .lean();

    res.render('books', {
      title: 'Books',
      isBooks: true,
      userId: req.user ? req.user._id.toString() : undefined,
      books
    });
  } catch (e) {
    console.log(e);
  }

})

router.get('/:id', async (req, res) => {

  try {
    const book = await Book.findById(req.params.id).lean();

    res.render('book', {
      // layout: 'empty',
      isBooks: true,
      book
    });
  } catch (e) {
    console.log(e);
  }
})

router.get('/:id/edit', authMiddleware, async (req, res) => {

  try {
    const book = await Book.findById(req.params.id).lean();

    if (!isOwner(book, req)) {
      return res.redirect('/books');
    }

    res.render('edit', {
      isBooks: true,
      book
    });

  } catch (e) {
    console.log(e);
  }

})

router.post('/:id/edit', authMiddleware, bookValidators, async (req, res) => {

  try {

    const { id } = req.params;
    const book = await Book.findById(id).lean();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('edit', {
        isBooks: true,
        error: errors.array()[0].msg,
        book
      });
    }

    if (!isOwner(book, req)) {
      return res.redirect('/books');
    }

    Object.assign(book, req.body);
    await book.save();

    res.redirect(`/books/${id}`);
  } catch (e) {
    console.log(e);
  }
})

router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;

    await Book.deleteOne({
      _id: id,
      userId: req.user._id
    });

    res.redirect(`/books`);
  } catch (e) {
    console.log(e);
  }
})


module.exports = router