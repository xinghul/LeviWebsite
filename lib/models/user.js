(function () {
    "use strict";
    var mongoose = require("mongoose"),
        bcrypt   = require('bcrypt-nodejs');

    var Schema   = mongoose.Schema;

    var UserSchema = new Schema({
        local            : {
            email        : String,
            username     : String,
            password     : String
        },
        facebook         : {
            id           : String,
            token        : String,
            email        : String,
            fullname     : String,
            nickname     : String,
            photo        : String
        },
        twitter          : {
            id           : String,
            token        : String,
            username     : String,
            photo        : String
        },
        google           : {
            id           : String,
            token        : String,
            email        : String,
            fullname     : String,
            nickname     : String,
            photo        : String
        },
        isAdmin          : Boolean
    });


    UserSchema
        .virtual("info_local")
        .get(function () {
            return {
                "_id"      : this._id,
                "username" : this.local.username,
                "admin"    : this.isAdmin
            }
        });

    UserSchema
        .virtual("info_facebook")
        .get(function () {
            return {
                "_id"      : this._id,
                "username" : this.facebook.nickname || this.facebook.fullname,
                "photo"    : this.facebook.photo,
                "admin"    : this.isAdmin
            }
        });

    UserSchema
        .virtual("info_twitter")
        .get(function () {
            return {
                "_id"      : this._id,
                "username" : this.twitter.username,
                "photo"    : this.twitter.photo,
                "admin"    : this.isAdmin
            }
        });

    UserSchema
        .virtual("info_google")
        .get(function () {
            return {
                "_id"      : this._id,
                "username" : this.google.nickname || this.google.fullname,
                "photo"    : this.google.photo,
                "admin"    : this.isAdmin
            }
        });

    /**
     * Validations
     */

    var validatePresenceOf = function (value) {
        return value && value.length;
    };

    UserSchema.path("local.email").validate(function (email) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
    }, "The specified email is invalid.");

    UserSchema.path("local.email").validate(function (value, respond) {
        mongoose.models["User"].findOne({ "local.email": value }, function (err, user) {
            if (err) 
                throw err;
            if (user) 
                return respond(false);
            respond(true);
        });
    }, "The specified email address is already in use.");

    UserSchema.path("local.username").validate(function (value, respond) {
        mongoose.models["User"].findOne({ "local.username": value }, function (err, user) {
            if (err) 
                throw err;
            if (user) 
                return respond(false);
            respond(true);
        });
    }, "The specified username is already in use.");

    /**
     * Pre-save hook
     */

    UserSchema.pre('save', function(next) {
        if (!this.isNew) {
            return next();
        }
        else {
            if ([null, undefined].indexOf(this.local.password) === -1)
                this.local.password = encryptPassword(this.local.password);
            next();
        }
    });

    /**
    * Encrypt password
    */

    var encryptPassword = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    /**
    * Authenticate - check if the passwords are the same
    */
    UserSchema.methods.authenticate = function (plainText) {
            return bcrypt.compareSync(plainText, this.local.password);
    };

    mongoose.model('User', UserSchema);
}());