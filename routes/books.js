const { Router } = require('express');
const Book = require('../models/Book');

const router = Router();

router.get('/', async (req, res) => {

  const books = await Book.find().lean();

  res.render('books', {
    title: 'Books',
    isBooks: true,
    books
  });
})

router.get('/:id', async (req, res) => {

  console.log('id');
  console.log(req.params.id);

  const book = await Book.findById(req.params.id).lean();

  res.render('book', {
    layout: 'empty',
    isBooks: true,
    book
  });
})

router.get('/:id/edit', async (req, res) => {

  if (!req.query.allow) {
    return res.redirect('/');
  }

  const book = await Book.findById(req.params.id).lean();

  res.render('edit', {
    isBooks: true,
    book
  });
})

router.post('/:id/edit', async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/books/${req.params.id}`);
})

router.post('/remove', async (req, res) => {
  try {
    await Book.deleteOne({ _id: req.body.id });
    res.redirect(`/books`);
  } catch (e) {
    console.log(e);
  }
})


module.exports = router