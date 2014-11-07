(function () {
    "use strict";
    var assert = require("assert"),
        should = require("should");
        
    describe('Array', function(){
        describe('#indexOf()', function(){
            it('should return -1 when the value is not present', function(){
                assert.equal(-1, [1,2,3].indexOf(5));
                assert.equal(-1, [1,2,3].indexOf(0));
                [1,2,3].indexOf(4).should.equal(-1);
            })
        })
        describe("#length()", function () {
            it("should return 0 when the array is empty", function () {
                assert.equal(0, [].length);
                assert.equal(3, [1, 2, 3].length);
            })
        })
    })
}());