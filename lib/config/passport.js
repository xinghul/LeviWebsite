(function () {
    "use strict";

    var mongoose         = require('mongoose'),
        passport         = require('passport');

    var LocalStrategy    = require('passport-local').Strategy,
        FacebookStrategy = require('passport-facebook').Strategy,
        TwitterStrategy  = require('passport-twitter').Strategy,
        GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

    var configAuth       = require('./auth'),
        User             = mongoose.model("User");

    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL ===================================================================
    // =========================================================================
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        process.nextTick(function () {
            User.findOne({ "local.email": email }, function (err, user) {
                if (err) {
                    done(err);
                }
                else if (!user) {
                    done(null, false, {
                        'errors': {
                            'email': { type: 'Email is not registered.' }
                        }
                    });
                }
                else if (!user.authenticate(password)) {
                    done(null, false, {
                        'errors': {
                            'password': { type: 'Password is incorrect.' }
                        }
                    });
                }
                else {
                    done(null, user);
                } 
            });
        });
    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ["id", "emails", "photos", "name"]
    },
    function (token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } 

                else {
                    // if there is no user found with that facebook id, create them
                    var newUser                = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id        = profile.id; // set the users facebook id                   
                    newUser.facebook.token     = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.fullname  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.nickname  = profile.name.givenName;
                    newUser.facebook.email     = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.facebook.photo     = profile.photos[0].value;

                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });
    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function (token, tokenSecret, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();

                    // set all of the user data that we need
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.displayName;
                    newUser.twitter.photo       = profile.photos[0].value;

                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function (token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function (err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser              = new User();

                    // set all of the relevant information
                    newUser.google.id        = profile.id;
                    newUser.google.token     = token;
                    newUser.google.email     = profile.emails[0].value; // pull the first email
                    newUser.google.fullname  = profile.displayName;
                    newUser.google.nickname  = profile.name.givenName;
                    newUser.google.photo     = profile._json.picture;

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
}());