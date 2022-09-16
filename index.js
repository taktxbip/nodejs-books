const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exprhbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const homeRoutes = require('./routes/home');
const booksRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const addRoutes = require('./routes/add-book');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const keys = require('./keys');

const app = express()

const hbs = exprhbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);


app.use('/', homeRoutes);
app.use('/books', booksRoutes);
app.use('/add-book', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const { PORT = 3000 } = process.env;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true
    });

    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: 'b.boy.bip@gmail.com',
    //     name: 'Eugene',
    //     cart: { items: [] }
    //   });
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    })
  } catch (e) {
    console.error(e);
  }
}

start();