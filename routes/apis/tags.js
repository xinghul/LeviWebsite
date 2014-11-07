(function () {
    "use strict";
    var mongoose = require("mongoose"),
        Q        = require("q");

    var Tag      = mongoose.model("Tag");

    module.exports =  {
        getTag: function (name) {
            var deferred = Q.defer();
            if (!name)
                deferred.reject({success: 0, msg: "Please specify the name for the tag."});
            else {
                Tag.findOne({name : name}, function (err, tag) {
                    if (!err)
                        deferred.resolve(tag)
                    else 
                        deferred.reject(err);
                });
            }
            return deferred.promise;
        },

        getTags: function () {
            var deferred = Q.defer();
            Tag.find({}, {}, function (err, tags) {
                if (!err)
                    deferred.resolve(tags);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },

        addTag: function (name) {
            var deferred = Q.defer();
            if ([null, undefined, ''].indexOf(name) != -1) {
                deferred.reject({success: 0, msg: "Please specify the name for the tag."});
            }
            else {
                var tag = new Tag({
                    "name": name
                });
                tag.save(function (err, product, numberAffected) {
                    if (err) 
                        deferred.reject(err);
                    else
                        deferred.resolve(product);
                });
            }
            return deferred.promise;
        },

        deleteTag: function (name) {
            var deferred = Q.defer();
            if ([undefined, null].indexOf(name) != -1)
                deferred.reject({success: 0, msg: "Please specify the name for the tag."});
            else {
                Tag.remove({name: name}, function (err, result) {
                    if (err)
                        deferred.reject(err);
                    else
                        deferred.resolve(result);
                });
            }    
            return deferred.promise;
        }
    };
}());