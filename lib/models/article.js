(function () {
    "use strict";
    var mongoose = require("mongoose");

    var Schema   = mongoose.Schema;

    var ArticleSchema = mongoose.Schema({
        aid: {
            type: Number,
            default: -1
        },
        editor: {
            type: String,
            default: "Markdown"
        },
        publish: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        author: {
            type: String,
            default: "Levi Lu"
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        date: {
            type: Date
        },
        tag: {
            type: [String],
            default: []
        },
        share: {
            facebook: {
                count: {
                    type: Number,
                    default: 0
                }
            },
            twitter: {
                count: {
                    type: Number,
                    default: 0
                }
            },
            googleplus: {
                count: {
                    type: Number,
                    default: 0
                }
            }
        },
        views: {
            type: Number,
            default: 0
        },
        content: {
            type: String,
            default: ""
        },
        comments: [{ 
            type: Schema.Types.ObjectId, 
            ref: "Comment"
        }],
        logo: {
            type: String,
            default: "placeholder"
        }
    });

    mongoose.model("Article", ArticleSchema);
}());