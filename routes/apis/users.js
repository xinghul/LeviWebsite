(function () {
    "use strict";

    var mongoose = require('mongoose'),
        passport = require('passport');

    var User     = mongoose.model('User'),
        ObjectId = mongoose.Types.ObjectId;

    
    module.exports = {
        addUser: function (req, res, next) {
            var newUser = new User(req.body);

            newUser.save(function (err) {
                if (err) {
                    return res.json(400, err);
                }

                req.logIn(newUser, function (err) {
                    if (err) 
                        return next(err);
                    return res.json(newUser.info_local);
                });
            });
        },
        getUser: function (req, res, next) {
            var userId = req.params.userId;

            User.findById(ObjectId(userId), function (err, user) {
                if (err) {
                    return next(new Error("Failed to load User"));
                }
                if (user) {
                    res.send(user.info_local);
                } else {
                    res.send(404, "USER_NOT_FOUND")
                }
            });
        },
        checkExists: function (req, res, next) {
            var username = req.params.username;
            User.findOne({ "local.username" : username }, function (err, user) {
                if (err) {
                    return next(new Error("Failed to load User " + username));
                }
                if (user) {
                    res.json({exists: true});
                } else {
                    res.json({exists: false});
                }
            });
        }
    };

}());