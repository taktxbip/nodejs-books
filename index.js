const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exprhbs = require('express-handlebars')
const homeRoutes = require('./routes/home');
const booksRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const addRoutes = require('./routes/add-book');

const app = express()

const hbs = exprhbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.use('/', homeRoutes);
app.use('/books', booksRoutes);
app.use('/add-book', addRoutes);
app.use('/cart', cartRoutes);

const { PORT = 3000 } = process.env;

async function start() {
  // ?retryWrites=true&w=majority
  try {
    const url = 'mongodb+srv://books-user:OalbEyCegqqYdwTP@test.xyenu4w.mongodb.net/library';
    await mongoose.connect(url, { useNewUrlParser: true });

    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    })
  } catch (e) {
    console.error(e);
  }
}

start();