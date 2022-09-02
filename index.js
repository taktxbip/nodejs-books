const express = require('express')
const exprhbs = require('express-handlebars')
const homeRoutes = require('./routes/home');
const booksRoutes = require('./routes/books');
const addRoutes = require('./routes/add-book');

const app = express()

const hbs = exprhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use('/', homeRoutes);
app.use('/books', booksRoutes);
app.use('/add-book', addRoutes);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})