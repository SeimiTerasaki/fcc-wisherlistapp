var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var User = require('./models/user');
var config = require('./config');
var init = require('./init');

passport.use(new GitHubStrategy({
  clientID: config.github.clientID,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
  },
  
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      User.findOne( {'username': profile.username}, function(err, user) {
      if(err) {
        return done(err);
      }
      if(user) {
					return done(null, user);
      } else {
      var newUser = new User();
      
					newUser.username = profile.username;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
      }
    });
    });
  }

));

// serialize user into the session
init();

module.exports = passport;

