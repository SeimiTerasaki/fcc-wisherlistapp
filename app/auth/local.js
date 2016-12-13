var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');
var init = require('./init');

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    User.findOne({
      'username': username, 
    }, function(err, user) {
      if (err) {
        return done(err);
      } if (!user) {
        return done(null, false);
      } if (user.password != password) {
        return done(null, false);
      } return done(null, user);
    });
  });
}));

// serialize user into the session
init();


module.exports = passport;