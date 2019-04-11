const express = require('express');
const app = express();
const session = require('express-session');
const db = require('./models/db');
const port = process.env.PORT || 5000;

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

const RedisStore = require('connect-redis')(session);
const url = require('url');
const REDIS_URL = process.env.REDIS_URL || 'redis://:@localhost:6379';
const redisOptions = url.parse(REDIS_URL);

app.use(session({
    store: new RedisStore({
        host: redisOptions.hostname,
        port: redisOptions.port,
        pass: redisOptions.auth.split(':')[1],
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: true,
    resave: false,
    unset: 'destroy',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

const index = require('./routers/index');
const login = require('./routers/login');
const register = require('./routers/register');
const todo = require('./routers/todo');
const logout = require('./routers/logout');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/todo', todo);
app.use('/logout', logout);

db.sync().then(function () {
    app.listen(port);
    console.log(`Server is listening on port ${port}`)
}).catch(function (err) {
    console.error(err);
});


