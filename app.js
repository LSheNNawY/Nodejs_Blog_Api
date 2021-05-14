const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// mongodb connection
require('./helpers/dbConnection');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoutes');
const postsRouter = require('./routes/postsRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use('/api', express.static(path.join(__dirname, './public')));

app.set('trust proxy', 1)

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser({
    cookie: {
        sameSite: 'none',
        secure: true
    }
}));

app.use('/api', [usersRouter, postsRouter]);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;
