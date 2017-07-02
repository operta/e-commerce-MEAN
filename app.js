var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var productRoutes = require('./routes/product');
var storeRoutes = require('./routes/store');
var cartRoutes = require('./routes/cart');
var categoryRoutes = require('./routes/category');
var learningRoutes = require('./routes/learning');

var app = express();
mongoose.connect('minimarket:minimarket@ds147072.mlab.com:47072/minimarket');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/store', storeRoutes);
app.use('/cart', cartRoutes);
app.use('/category', categoryRoutes);
app.use('/learning', learningRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('index');
});



module.exports = app;
