(function () {
    "use strict";
    var mongoose = require("mongoose"),
        Q        = require("q");

    var CounterSchema = mongoose.Schema({
        _id: {
            type: String,
            default: ""
        },
        seq: {
            type: Number,
            default: 0
        }
    });

    CounterSchema.statics = {
        getNextSequence: function (_id) {
            var deferred = Q.defer();
            this.findOneAndUpdate(
                {"_id": _id}, 
                { $inc: { seq: 1 } }, 
                {new: true}, 
                function (err, counter) {
                    if (err) 
                        deferred.reject(err);
                    else
                        deferred.resolve(counter.seq);
                }
            );
            return deferred.promise;
        }
    };

    mongoose.model("Counter", CounterSchema);
}());