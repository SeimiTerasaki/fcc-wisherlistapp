'use strict';

var User = require('../auth/models/user.js');

function dataController() {

this.getData = function(req, res, next){
  User.find({}, function(err, doc){
    if(err)throw err;
      else{
    req.Data = doc;
    next();
    }
  });
};

this.getUser = function(req, res, next){
  User.find({'username': req.user.username}, function(err, doc){
    if(err)throw err;
      else{
     req.UserInfo = doc;
     req.UserAva = doc[0].avatar;
     next();
    }
  });
};

}

module.exports = dataController;