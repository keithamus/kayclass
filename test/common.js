(function (global) {
    'use strict';
    // These are defined globally on a browser, so only care about node here
    if (typeof require !== 'undefined') {
        global.sinon = require('sinon');
        global.should = require('chai').use(require('sinon-chai')).should();
        require('sinomocha')();
    }

})(typeof global === 'undefined' ? window : global);
