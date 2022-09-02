const { Router } = require('express');
const Book = require('../models/Book');

const router = Router();

router.get('/', (req, res) => {
    res.render('add-book', {
        title: 'Add Book',
        isAddBook: true
    });
})

router.post('/', async (req, res) => {
    const { title, price, img } = req.body;

    const book = new Book(title, price, img);
    await book.save();

    res.redirect('/books');
})

module.exports = router