/**
 * Created by andyf on 4/14/2017.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var promise = require('promise');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var morgan = require('morgan');
var flash = require('connect-flash');
var passportLocalMongoose = require('passport-local-mongoose');

require('./config/passport')(passport);
// mongoose.connect('mongodb://localhost/it410database');

var app = express();



app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + 'index.html'));
app.use(express.static('./app/'));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use('/api', require('./api'));

require('./app/routes.js')(app, passport);

app.listen(3000);
console.log("Api is running on port 3000");