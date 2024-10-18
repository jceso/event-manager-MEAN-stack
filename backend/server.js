const express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var createError = require('http-errors');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var indexRouter = require('./routes/index');
var eventsRouter = require('./routes/events');
var placesRouter = require('./routes/places');
var salesRouter = require('./routes/sales');
var userRouter = require('./routes/users');

mongoose.connect("mongodb+srv://mongo:rkIzmtdr4IbNrb4g@cluster0.ycsfw71.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { serverApi: { version: '1', strict: true, deprecationErrors: true } })
  .then(() => console.log("Connected to the database!"))
  .catch(err => console.log("Cannot connect to the database - " + err));

// view engine setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "http://localhost:4200" }));

app.use('/', indexRouter);
app.use('/events', eventsRouter);
app.use('/places', placesRouter);
app.use('/sales', salesRouter);
app.use('/users', userRouter);

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
  res.render('error');
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:8080/`);
});

module.exports = app;