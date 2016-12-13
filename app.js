var socketio = require('socket.io');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

require('dotenv').load();
var app = express();
var io = socketio();
app.io = io;

var index = require('./app/routes/index');

mongoose.connect(process.env.MONGO_URI);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'app')));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'bookies',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


var User = require('./app/auth/models/user.js');
io.on('connection',function(socket){
    console.log('socket connected');
    
    socket.on('addboard', function(data, callback){
    User.findOneAndUpdate({'username': data[0]},
      {$push: {'boards': {
      'title': data[1],
      'image': data[2],
      'likes': 0,
      'shares': 0
      }} }, {returnNewDocument: true},
       function(err, doc){
         if(err)throw err;
         else{
             console.log(doc);
           callback(doc);
          }
      });
    });
    
    socket.on('like', function(data){
      User.findOneAndUpdate({'boards.image': data[0], 'username': data[1]},
      {$inc: { 'boards.$.likes' : 1 }}, function(err, doc){
        if (err) throw err;
        else null;
        });
    });
    
    socket.on('share', function(data){
      User.findOneAndUpdate({ 'username': data[0], 'boards.image': data[2]},
      {$inc: { 'boards.$.shares' : 1 }}, function(err, doc){
        if (err) throw err;
        else console.log('sucess');
        });
    });
    
    socket.on('update-profile', function(data){
       var find = {};
       find[data[2]]=data[1];
      User.findOneAndUpdate({'username': data[0]},
      {$set: find }, function(err, doc){
        if (err) throw err;
        else null;
        });
    });
    
  socket.on('remove-board', function(data){
    User.findOneAndUpdate({'username': data[1]},
    {$pull: {'boards':{'image': data[0] } }},
     function(err, doc){
       if(err)throw err;
       else{
         null;
        }
    });
  });



});

app.use('/', index);

module.exports = app;
