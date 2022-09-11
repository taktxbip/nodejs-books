const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exprhbs = require('express-handlebars')
const homeRoutes = require('./routes/home');
const booksRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const addRoutes = require('./routes/add-book');
const User = require('./models/User');

const app = express()

const hbs = exprhbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(async (req, res, next) => {
  try {
    const user = await User.findById('631de91fcd08a0a1ec3af5db');
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.use('/', homeRoutes);
app.use('/books', booksRoutes);
app.use('/add-book', addRoutes);
app.use('/cart', cartRoutes);

const { PORT = 3000 } = process.env;

async function start() {
  try {
    const url = 'mongodb+srv://books-user:OalbEyCegqqYdwTP@test.xyenu4w.mongodb.net/library';
    await mongoose.connect(url, {
      useNewUrlParser: true
    });

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'b.boy.bip@gmail.com',
        name: 'Eugene',
        cart: { items: [] }
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    })
  } catch (e) {
    console.error(e);
  }
}

start();