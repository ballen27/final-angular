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
var passportLocalMongoose = require('passport-local-mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/rest_test');
mongoose.connect('mongodb://localhost/it410database');

var app = express();

// Define storage for uploaded videos
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file, req.body);
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({ storage : storage}).single('userPhoto');


// Define homepage
app.get('/', function(req,res){
    res.sendFile(path.resolve("../index.html"));
});

app.use(express.static('../'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', require('./api'));


// API/ROUTE to hit for video uploads
app.post('/api/photo',function(req,res) {
    console.log("got here", req.body);


    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file");
        }
        res.end("File has uploaded");
    });
});

///////////////////////////////////////////////////////////
////////////////////// PASSPORT STUFF ////////////////////
//////////////////////////////////////////////////////

// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
        UserDetails.findOne({
            'username': username,
        }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});



// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('../frontend'));


var Schema = mongoose.Schema;
var UserDetail = new Schema({
    username: String,
    password: String
}, {
    collection: 'userInfo'
});

UserDetail.plugin(passportLocalMongoose);

var UserDetails = mongoose.model('userInfo', UserDetail);

//routes -------------------------------------------------------------------------

app.get('/register', function(req, res) {
    res.sendFile(path.resolve('./../index.html'));
});

app.post('/api/register', function(req, res, next) {
    UserDetails.register(new UserDetails({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.send(err);
            // return res.render('register', { error : err.message });
        }
        else {
            UserDetails.authenticate()(req.body.username, req.body.password, function (err, user, options) {
                if (err) return next(err);
                if (user === false) {
                    res.send({
                        message: options.message,
                        success: false
                    });
                } else {
                    req.login(user, function (err) {
                        res.send({
                            success: true,
                            user: user
                        });
                    });
                }
            });
        }
    });
});

// Login URL.
app.post('/api/login', function(req, res, next ){
    UserDetails.authenticate()(req.body.username, req.body.password, function (err, user, options) {
        if (err) return next(err);
        if (user === false) {
            res.send({
                message: options.message,
                success: false
            });
        } else {
            req.login(user, function (err) {
                res.send({
                    success: true,
                    user: user
                });
            });
        }
    });
});

app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/brainstorm');
});

// Logout URL.
app.delete('/api/logout', function(req, res) {
    // if (!req.user) return res.sendStatus(401);
    req.logout();
    res.status(200).send("User has logged out.");
});

////////////////////////////////////////////////////
 ///////////////END PASSPORT STUFF/////////////////
  ////////////////////////////////////////////////


app.listen(3000);
console.log("Api is running on port 3000");