var express = require('express');
var router = express.Router();
var path = require('path');

var passportGithub = require('../auth/github');
var passportFacebook = require('../auth/facebook');
var passportLocal = require('../auth/local');
var localRegister = require('../auth/localRegister');

var DataController = require('../controller/dataController.js');
         
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
  	return next();
  } else {
    console.log("failed to log in!");
    next();
  }
}

var dataController = new DataController();

router.get('/', dataController.getData, function(req, res){
  res.render('index', {data: req.Data });
});

router.get('/home', isLoggedIn, dataController.getData, dataController.getUser, function(req, res){
   res.render('index', {
     userID: req.user.username,
     userAva: req.UserAva,
     userData: req.UserInfo,
     data: req.Data });
});

router.get('/myboards', isLoggedIn, dataController.getUser, function(req, res){
   res.render('myboards', {
     userID: req.user.username,
     userAva: req.UserAva,
     userData: req.UserInfo});
});

router.get('/logout', function(req, res){
	res.redirect('/');
});

router.get('/auth/github', passportGithub.authenticate('github'));

router.get('/auth/github/callback',
  passportGithub.authenticate('github', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

router.get('/auth/facebook', passportFacebook.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

router.post('/auth/local',
  passportLocal.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

router.post('/adduser',
  localRegister.authenticate('localRegister', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));
module.exports = router;
