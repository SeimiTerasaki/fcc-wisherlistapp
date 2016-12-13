var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('./models/user');
var config = require('./config');
var init = require('./init');

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
  },
  function(accessToken, refreshToken, profile, done) {

    var searchQuery = {
      'username': profile.displayName
    };

    var updates = {
      'username': profile.displayName,
      'displayName': profile.displayName
    };

    var options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      }
      if(user) {
					return done(null, user);
      } else {
      var newUser = new User();

					newUser.username = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
      }
    });
  }

));

// serialize user into the session
init();

module.exports = passport;
