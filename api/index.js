const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const session = require('express-session'); 
const routes = require('./routes/routes');
const pool = require('./db');
const morgan = require('morgan');


require('dotenv').config();

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000',
    preflightContinue: true,
    credentials: true,
  })
);

app.use(morgan('combined'))

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    name: 'sid',
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        },
}));

app.enable('trust proxy');

// test initial db connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('Connected to database');
  }
});

// routes
app.use('/', routes);

const PORT = 5002;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});