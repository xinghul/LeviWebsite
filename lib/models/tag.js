(function () {
    "use strict";
    var mongoose = require("mongoose");

    var TagSchema = mongoose.Schema({
        name: {
            type: String,
            default: ""
        }
    });
    mongoose.model('Tag', TagSchema);
}()); 
