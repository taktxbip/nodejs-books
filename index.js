const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exprhbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');

const homeRoutes = require('./routes/home');
const booksRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const addRoutes = require('./routes/add-book');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// middlewares
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const error404 = require('./middleware/error');
const file = require('./middleware/file');

const keys = require('./keys');

const app = express()

const hbs = exprhbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-utils')
})
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(file.single('avatar'));
app.use(csrf());
app.use(flash());
// app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);


app.use('/', homeRoutes);
app.use('/books', booksRoutes);
app.use('/add-book', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// must be at the end
app.use(error404);

const { PORT = 3000 } = process.env;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true
    });

    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    })
  } catch (e) {
    console.error(e);
  }
}

start();