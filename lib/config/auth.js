(function () {
    "use strict";
    var port = process.env.PORT || 3001;
    module.exports = {

        'facebookAuth' : {
            'clientID'      : '759631904072296',
            'clientSecret'  : 'e4803d3e14bea2f06a860a5b0cc85289',
            'callbackURL'   : 'http://levi-lu.net/auth/facebook/callback'
        },

        'twitterAuth' : {
            'consumerKey'       : 'KCtxYNqyJ0MmSWJMP7HOufqst',
            'consumerSecret'    : 'SFXz4puhunLVdDohShOpRp0agBczItkIVptlzHPPsU2C1hQ0Gx',
            'callbackURL'       : 'http://levi-lu.net/auth/twitter/callback'
        },

        'googleAuth' : {
            'clientID'      : '318050669830-gu9uvlu6o32vmcjr1l37r0f0hmna485u.apps.googleusercontent.com',
            'clientSecret'  : 'OuqV02tifMAclJCDonlkkYgY',
            'callbackURL'   : 'http://levi-lu.net/auth/google/callback'
        }

    };

}());