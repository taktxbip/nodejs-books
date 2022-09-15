const { Router } = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = Router();

router.post('/', authMiddleware, async (req, res) => {

  try {
    const user = await req.user
      .populate('cart.items.bookId');

    const books = user.cart.items.map(el => {
      return {
        book: { ...el.bookId._doc },
        qty: el.qty
      }
    });

    const order = new Order({
      user: {
        name: user.name,
        userId: user.id
      },
      books: books,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }

})

router.get('/', authMiddleware, async (req, res) => {
  try {

    const orders = await Order.find({
      'user.userId': req.user.id
    })
      .populate('user.userId')
      .lean();

    res.render('orders', {
      isOrders: true,
      orders: orders.map(o => {
        const output = {
          ...o,
          total: o.books.reduce((total, el) => total + el.qty * el.book.price, 0)
        }
        return output;
      })
    });
  } catch (e) {
    console.log(e);
  }
})


module.exports = router