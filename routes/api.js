(function () {
    var express  = require('express'),
        Q        = require('q'),
        router   = express.Router();


    var dbeacon = require("./apis/dBeacon"),
        blog    = require("./apis/blog"),
        tag     = require("./apis/tags");

    //for dbeacon
    router.post('/dbeacon/query', dbeacon.query);
    router.post('/dbeacon/update', dbeacon.updateById);
    router.post('/dbeacon/addnode', dbeacon.addNode);
    router.post('/dbeacon/addrls', dbeacon.addRls);
    router.post('/dbeacon/delete', dbeacon.deleteById);

    router.get('/dbeacon/list', dbeacon.getAll);
    router.get('/dbeacon/relation', dbeacon.getRelation);
    router.get('/dbeacon/beacons/:_attr', dbeacon.getAttr);
    router.get('/dbeacon/list/:_type', dbeacon.getType);

    /***************************************/
    /*              api for blog           */
    /***************************************/
    router.get('/blog/article/:aid', function (req, res) {
        blog.getArticle(req.params.aid).then(function (article) {
            res.json(article);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post('/blog/article/update', function (req, res) {
        blog.updateViews(req.body.aid).then(function (result) {
            res.json(result);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.delete('/blog/article/:aid', function (req, res) {
        blog.deleteArticle(req.params.aid).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        })
    });

    router.get('/blog/articles', function (req, res) {
        blog.getArticles().then(function (articles) {
            res.json(articles);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post('/blog/articles', function (req, res) {
        blog.addArticle(req.body.data).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        });
    });

    /***************************************/
    /*              api for tag            */
    /***************************************/
    router.get('/tags', function (req, res) {
        tag.getTags().then(function (tags) {
            res.json(tags);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post('/tags', function (req, res) {
        tag.addTag(req.body.name).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        });
    });
    module.exports = router;

}());

    