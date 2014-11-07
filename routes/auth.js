(function () {
    "use strict";
    var express        = require("express"),
        passport       = require('passport'),
        router         = express.Router();

    var session        = require("./apis/session"),
        users          = require("./apis/users");

    router.post('/users', users.addUser);
    router.get('/users/:userId', users.getUser);
    router.get('/check_username/:username', users.checkExists);

    router.get('/session', session.getSession);
    router.post('/session', session.addSession);
    router.delete('/session', session.removeSession);

    // =====================================
    // Facebook routes =====================
    // =====================================
    router.get('/facebook', passport.authenticate('facebook', { 
        scope: "email",
        display: "popup"
    }));

    router.get('/facebook/callback', function (req, res, next) {
        passport.authenticate('facebook', function (err, user) {
            if (err)
                res.end(err);
            req.logIn(user, function (err) {
                if (err) {
                    console.log(err);
                    res.end(err);
                }
                else {
                    res.redirect("/");
                }
            });
        })(req, res, next);
    });

    // =====================================
    // Twitter routes ======================
    // =====================================
    router.get('/twitter', passport.authenticate("twitter"));

    router.get('/twitter/callback', function (req, res, next) {
        passport.authenticate('twitter', function (err, user) {
            if (err)
                res.end(err);
            req.logIn(user, function (err) {
                if (err) {
                    console.log(err);
                    res.end(err);
                }
                else {
                    res.redirect("/");
                }
            });
        })(req, res, next);
    });

    // =====================================
    // Google routes =======================
    // =====================================
    router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    router.get('/google/callback', function (req, res, next) {
        passport.authenticate('google', function (err, user) {
            if (err)
                res.end(err);
            req.logIn(user, function (err) {
                if (err) {
                    console.log(err);
                    res.end(err);
                }
                else {
                    res.redirect("/");
                }
            });
        })(req, res, next);
    });


    module.exports = router;
}());