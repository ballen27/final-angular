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
var createFile = require("create-file");
var jsonfile = require("jsonfile");
var fs = require("fs");
var db = mongoose.connect('mongodb://localhost/it410database');

// Upload Photos
var create = function(file){
    createFile('app/image-info/' + file.originalname + "id.json",

 '{"name": "' + file.originalname + '", "imageUrl":"img/' + file.originalname + '", "imageId":"' + file.originalname + 'id"}',
        function(err) {
        console.log("error");
        }
    );
var filePlace = __dirname + '/' + 'images.json';
var object = ',{"name": "' + file.originalname + '", "imageUrl":"img/' + file.originalname + '", "imageId":"' + file.originalname + 'id"}]'
var obj = jsonfile.readFileSync(filePlace);
    console.log(obj);
    var newObj = JSON.stringify(obj);
    fs.unlinkSync(filePlace);
    var brandNew = newObj.replace(']', object);
    console.log(brandNew);
    jsonfile.writeFileSync(filePlace, brandNew);
};

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file, req.body);
        callback(null, 'app/img');
    },
    filename: function (req, file, callback) {
        create(file);
        callback(null, file.originalname);
    }
});

var upload = multer({ storage : storage}).single('userPhoto');

var User = require('./models/user');
module.exports = function(app, passport){
    app.get('/authenticate', function(req, res){
        res.render('authenticate.ejs');
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

    app.get('/', function(req, res){
        res.sendfile('app/index.html');
    });

    app.get('/admin', function(req, res){
        if(req.user) {
            if(req.user.local.admin || req.user.google.admin) {
                res.sendfile('app/admin.html');
            }
            else
                res.send('You are not authorized to view this page </br> <a href="/authenticate">Return Home</a>');
        }
        else
            res.render('authenticate.ejs');

    });

    app.get('/checkAdmin', function(req, res) {
       if (req.user.admin){
           res.sendfile('app/admin.html');
       }
       else {
           res.sendfile('app/index.html');
       }
    });

    app.get('/admin', function(req,res) {
        res.sendfile('app/admin.html');
    });

    app.get('/users', function(req,res){

        res.json(req.user);

            // Find some documents
            // User.find(function(err, docs) {
            //     console.log("Found the following records");
            //     console.dir(docs);
            //     res.json(req.user);
            // });
    });

    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/checkAdmin',
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
        passport.authenticate('facebook', { successRedirect: '/checkAdmin',
            failureRedirect: '/' }));

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/checkAdmin',
            failureRedirect: '/' }));


    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/authenticate');
    })
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}





