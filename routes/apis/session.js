(function () {
    "use strict";

    var mongoose = require("mongoose"),
        Q        = require("q"),
        passport = require("passport");


    module.exports = {
        getSession: function (req, res) {
            if (req.isAuthenticated()) {
                res.json(req.user.info_local);
            }
            res.send(401);
        },
        removeSession: function (req, res) {
            if (req.user) {
                req.logout();
                res.send(200);
            } else {
                res.send(400, "Not logged in");
            }
        },
        addSession: function (req, res, next) {
            passport.authenticate("local", function (err, user, info) {
                var error = err || info;
                if (error) { 
                    return res.json(400, error); 
                }
                req.logIn(user, function (err) {
                    if (err) { 
                        return res.send(err); 
                    }
                    res.json(req.user.info_local);
                });
            })(req, res, next);
        }
    };
}());