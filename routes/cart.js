const { Router } = require('express');
const Cart = require('../models/Cart');
const Book = require('../models/Book');
const router = Router();

router.get('/', async (req, res) => {
    const cart = await Cart.fetch();
    res.render('cart', {
        isCart: true,
        books: cart.books,
        total: cart.total
    });
})


router.post('/add', async (req, res) => {
    // const book = await Book.getBook(req.body.id);
    // await Cart.add(book);
    res.redirect('/cart');
})


router.delete('/remove/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id);
    res.status(200).json(cart);
})


module.exports = router