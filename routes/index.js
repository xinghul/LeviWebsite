(function () {
    "use strict";
    var express        = require("express"),
        path           = require("path"),
        fs             = require("fs"),
        mime           = require("mime"),
        router         = express.Router();


    var api            = require("./api"),
        auth           = require("./auth");
    
    router.get('/', function (req, res) {
        if(req.user) {
            if ([undefined, null].indexOf(req.user.facebook.id) === -1) {
                res.cookie("user", JSON.stringify(req.user.info_facebook));
            }
            else if ([undefined, null].indexOf(req.user.twitter.id) === -1) {
                res.cookie("user", JSON.stringify(req.user.info_twitter));
            }
            else if ([undefined, null].indexOf(req.user.google.id) === -1) {
                res.cookie("user", JSON.stringify(req.user.info_google));
            }
            else
                res.cookie("user", JSON.stringify(req.user.info_local));
        }
        res.render('index', { title: 'Levi Lu' });
    });

    router.get('/about', function (req, res) {
        res.render('about', { title: 'About me'});
    });

    router.get('/blog', function (req, res) {
        res.render('blog', {title: 'Blog'});
    });

    router.get('/editor', function (req, res) {
      res.render('editor', { title: 'Editor'});
    });

    router.get('/demo', function (req, res) {
        res.render('demo', { title: 'Demo'});
    });

    router.get('/blog/:name', function (req, res) {
        res.render('blog/' + req.params.name);
    });

    router.get('/demo/:name', function (req, res) {
        res.render('demo/' + req.params.name);
    });

    router.get("/resume", function (req, res) {
        var file = __dirname + "/resources/Resume_LeviLu.pdf";

        var filename = path.basename(file);
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    });

    router.use("/api", api);

    router.use("/auth", auth);

    module.exports = router;
}());
    