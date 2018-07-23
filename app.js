var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('dotenv').config()

var app = express();

var request = require('request');
var rp = require('request-promise');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/getMemes', function(req, res, next) {
  var urls = [];
	// Comment out this line:
  //res.send('respond with a resource');
  var cloudinary_call =  {
    uri: process.env.CLOUDINARY_BASE_URL + "/resources/video",
    /*qs: {
      "bool": {
        "must": [
          { "match": { "max_results": 500 }}
        ]
      }
    } */
    qs: {
      max_results: 500
    }
  }
  //console.log(cloudinary_call)
/*
  request(cloudinary_call, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    var parsed = JSON.parse(body).resources
    parsed.forEach(meme => {
      urls.push(meme.url)
      //console.log(meme.url)
    })
    console.log(urls)
  });
  */
  rp(cloudinary_call)
    .then(function(body) {
      var parsed = JSON.parse(body).resources
      parsed.forEach(meme => {
        urls.push(meme.url)
      })
    })
    .then(function() {
      console.log(urls)
      res.json([{
        urls: urls
      }]);
    });
})


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
