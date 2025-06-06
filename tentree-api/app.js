const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// Routing 

const indexRouter = require('./routes/index');
const spotsRouter = require('./routes/spots');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const countriesRouter = require('./routes/countries');
const amenitiesRouter = require('./routes/amenities');
const reviewsRouter = require('./routes/reviews');
const availabilityRouter = require('./routes/availability');
const bookingsRouter = require('./routes/bookings');
const photosRouter = require('./routes/spotphotos');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/', indexRouter);
app.use('/spots', spotsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/countries', countriesRouter);
app.use('/amenities', amenitiesRouter);
app.use('/reviews', reviewsRouter);
app.use('/availability', availabilityRouter);
app.use('/bookings', bookingsRouter);
app.use('/spotphotos', photosRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
