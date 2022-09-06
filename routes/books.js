const { Router } = require('express');
const Book = require('../models/Book');
const router = Router();

router.get('/', async (req, res) => {
    const books = await Book.getAll();
    res.render('books', {
        title: 'Books',
        isBooks: true,
        books
    });
})

router.get('/:id', async (req, res) => {
    const { title, price, img, id } = { ...await Book.getBook(req.params.id) };
    res.render('book', {
        layout: 'empty',
        title,
        price,
        img,
        id,
        isBooks: true
    });
})

router.get('/:id/edit', async (req, res) => {

    if (!req.query.allow) {
        return res.redirect('/');
    }

    const { title, price, img } = { ...await Book.getBook(req.params.id) };
    res.render('edit', {
        isBooks: true,
        title, price, img
    });
})

router.post('/:id/edit', async (req, res) => {
    await Book.update(req.params.id, req.body);
    res.redirect(`/books/${req.params.id}`);
})


module.exports = router