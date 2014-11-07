(function () {
    "use strict";
    var mongoose = require("mongoose");

    var Schema   = mongoose.Schema;

    var CommentSchema = mongoose.Schema({
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        date: {
            type: Date
        },
        content: {
            type: String,
            default: ""
        },
        comments: [{ 
            type: Schema.Types.ObjectId, 
            ref: "Comment"
        }]
    });

    mongoose.model("Comment", CommentSchema);
}());