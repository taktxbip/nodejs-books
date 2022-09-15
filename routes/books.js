const { Router } = require('express');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');
const router = Router();

router.get('/', async (req, res) => {

  const books = await Book.find()
    .populate('userId', 'email name')
    .select('title price img')
    .lean();

  res.render('books', {
    title: 'Books',
    isBooks: true,
    books
  });
})

router.get('/:id', async (req, res) => {

  const book = await Book.findById(req.params.id).lean();

  res.render('book', {
    // layout: 'empty',
    isBooks: true,
    book
  });
})

router.get('/:id/edit', authMiddleware, async (req, res) => {

  if (!req.query.allow) {
    return res.redirect('/');
  }

  const book = await Book.findById(req.params.id).lean();

  res.render('edit', {
    isBooks: true,
    book
  });
})

router.post('/:id/edit', authMiddleware, async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/books/${req.params.id}`);
})

router.post('/remove', authMiddleware, async (req, res) => {
  try {
    await Book.deleteOne({ _id: req.body.id });
    res.redirect(`/books`);
  } catch (e) {
    console.log(e);
  }
})


module.exports = router