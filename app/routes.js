/**
 * Created by andyf on 4/14/2017.
 */
//------------------------------------------//
//------------------ROUTES------------------//
//------------------------------------------//

var multer = require("multer");
var express = require("express");
var app = express();
var multer =  require("multer");
var mongoose = require("mongoose");
var db = mongoose.connect('mongodb://localhost/it410database');

var User = require('./models/user');
module.exports = function(app, passport){
    app.get('/authenticate', function(req, res){
        res.render('authenticate.ejs');
    });

    app.get('/', function(req, res){
        res.sendfile('app/index.html');
    });

    app.get('/users', function(req,res){

            // Find some documents
            User.find(function(err, docs) {
                console.log("Found the following records");
                console.dir(docs);
                res.json(docs);
            });
    });

    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function(req, res){
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', { user: req.user });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
            failureRedirect: '/' }));

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/profile',
            failureRedirect: '/' }));


    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

// Upload Photos

var upload = multer({ storage : storage}).single('userPhoto');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file, req.body);
        callback(null, '/img');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

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

