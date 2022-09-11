const { Router } = require('express');
const Book = require('../models/Book');
const router = Router();

const calculateTotal = (cart) => {
  return cart.items.reduce((total, next) => total + +next.qty * +next.bookId.price, 0);
}

const transformCart = (cart) => {
  return cart.items.map(el => {
    return {
      title: el.bookId.title,
      price: el.bookId.price,
      img: el.bookId.img,
      id: el.bookId.id,
      qty: el.qty
    }
  });
}

router.get('/', async (req, res) => {

  const user = await req.user
    .populate('cart.items.bookId');

  const books = transformCart(user.cart);

  res.render('cart', {
    isCart: true,
    books,
    total: calculateTotal(user.cart)
  });

})


router.post('/add', async (req, res) => {
  const book = await Book.findById(req.body.id).lean();
  await req.user.addToCart(book);
  res.redirect('/cart');
})


router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate('cart.items.bookId');
  const books = transformCart(user.cart);
  
  res.status(200).json({
    books,
    total: calculateTotal(user.cart)
  });
})

module.exports = router