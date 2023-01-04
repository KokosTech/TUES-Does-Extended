/* const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
const PORT = process.env.PORT || 5001;

const app = express();
const db = require('./user')

app.use(cors())
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//app.use('/',require('./routes'));
app.listen(PORT, ()=>{
console.log('server listening on port: ',PORT)})

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.post('/test-post', (request, response) => {console.log("based", request.body); response.json({ info: 'Node.js, Express, and Postgres API' })})
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

 */

const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const session = require('express-session'); 
const authRouter = require('./routes/authRouter');
const routes = require('./routes/routes');
const pool = require('./db');

require('dotenv').config();

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000',
    preflightContinue: true,
    credentials: true,
  })
);

const morgan = require('morgan');
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


app.use('/auth', authRouter);

app.use('/', routes);

const PORT = 5002;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});