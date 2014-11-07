(function () {
    "use strict";
    var mongoose = require("mongoose"),
        Q        = require("q");

    var Counter  = mongoose.model("Counter"),
        Article  = mongoose.model("Article");
    

    module.exports = {
        getArticle: function (aid) {
            var deferred = Q.defer();
            if (!aid)
                deferred.reject({success: 0, msg: "Please specify the aid for the article."});
            else {
                Article.findOne({aid : aid}, function (err, article) {
                    if (!err)
                        deferred.resolve(article);
                    else 
                        deferred.reject(err);
                });
            }
            return deferred.promise;
        },

        getArticles: function () {
            var deferred = Q.defer();
            Article.find({}, {}, function (err, articles) {
                if (!err)
                    deferred.resolve(articles);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },

        addArticle: function (data) {
            var deferred = Q.defer();
            if ([null, undefined, ''].indexOf(data.title) != -1) 
                deferred.reject({success : 0, msg : "Please specify the name for the article."});
            else {
                data.date = new Date();
                var article = new Article(data);
                Counter.getNextSequence('article').then(function (aid) {
                    article.aid = aid;
                    article.save(function (err, product, numberAffected) {
                        if (err) 
                            deferred.reject(err);
                        else
                            deferred.resolve(product);
                    });
                });
            }
            return deferred.promise;
        },

        deleteArticle: function (aid) {
            var deferred = Q.defer();
            if ([undefined, null].indexOf(aid) != -1)
                deferred.reject({success: 0, msg: "Please specify the aid for the article."});
            else {
                Article.remove({aid: aid}, function (err, result) {
                    if (err)
                        deferred.reject(err);
                    else
                        deferred.resolve(result);
                });
            }
            return deferred.promise;
        },

        updateViews: function (aid) {
            var deferred = Q.defer();
            if ([undefined, null].indexOf(aid) != -1)
                deferred.reject({success: 0, msg: "Please specify the aid for the article."});
            else {
                Article.findOneAndUpdate(
                    {"aid": aid}, 
                    {$inc: { views: 1 } }, 
                    {new: true}, 
                    function (err, result) {
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
