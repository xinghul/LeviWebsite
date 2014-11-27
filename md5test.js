var bcrypt = require("bcrypt-nodejs"),
    fs     = require("fs"),
    crypto = require('crypto');

// fs.readFile("Gruntfile.js", "utf8", function (err, data) {
//     if (err) 
//         console.log(err, err.stack);
//     else {
//         console.log(data);
//         fs.exists(".Gruntfile.js.MD5", function (exists) {
//             if (exists) {
//                 fs.readFile(".Gruntfile.js.MD5", "utf8", function (err, hashedData) {
//                     var same = bcrypt.compareSync(data, hashedData);
//                     if (same)
//                         console.log("same file!");
//                     else
//                         console.log("changed file!");
//                 });
//             }
//             else {
//                 bcrypt.hash(data, bcrypt.genSaltSync(8), null, function (err, data) {
//                     fs.writeFile(".Gruntfile.js.MD5", data, function (err) {
//                         if (err)
//                             console.log(err, err.stack);
//                         else
//                             console.log("MD5 file for Gruntfile.js generated!");
//                     })
//                 })
//             }
//         })
//     }
// });
fs.readFile("Gruntfile.js", "utf8", function (err, data) {
    var hashObj = crypto.createHash('md5');
    hashObj.update(data);
    var hash = hashObj.digest('hex');
    console.log(hash);
});

