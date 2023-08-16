const passport = require( 'passport' );
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const mongoose = require( 'mongoose' );
const User = mongoose.model('User');


module.exports = function (passport ) {
    passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback   : true
      },
      function(request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({ 
                googleId: profile.id, 
                email: profile.email, 
                name: profile.displayName,
            }, 
            function (err, user) {
                return done(err, user);
            }
        );
      }
    ));
    
    
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
      User.findById(id).then(user => {
        done(null, user);
      });
    });
}