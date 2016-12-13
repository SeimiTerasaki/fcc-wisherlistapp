var passport = require('passport');
var RegisterStrategy = require('passport-local-register').Strategy;

var User = require('./models/user');
var init = require('./init');

passport.use(new RegisterStrategy(
  function verify(username, password, email, address, done) {
    User.findOne({
      'username' : username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(); // see section below 
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      done(null, user);
    });
  }, function create(username, password, email, address, done) {
    var newUser = new User();
      
	newUser.username = username;
	newUser.password = password;
	newUser.email = email;
	newUser.address = address;
	newUser.save(function (err, user) {
		if (err) {
			throw err;
		} if(!user) {
        err = new Error("User creation failed.");
        return done(err);
      }
		return done(null, newUser);
    });
  }
));

init();

module.exports = passport;