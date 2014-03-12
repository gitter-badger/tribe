﻿var Mocha = require('mocha'),
    _ = require('underscore');

// add the ability to return promises from tests
var originalAddTest = Mocha.Suite.prototype.addTest;
Mocha.Suite.prototype.addTest = function (test) {
    var tests = test.fn;

    test.async = true;
    test.sync = false;

    // override the original test function
    test.fn = function (done) {
        var returnValue = tests(done);
        if (isPromise(returnValue))
            // the done function passed from mocha will fail the test if we pass it an error
            returnValue.then(done).fail(done);
        else
            done();
    };
    return originalAddTest.call(this, test);
};

function isPromise(target) {
    return target && typeof(target.fin) === 'function' && typeof(target.fail) === 'function';
}


// arrange suites in a heirarchy by splitting suite names at each dot
// Suite.create is used exclusively throughout mocha
var originalCreate = Mocha.Suite.create;
Mocha.Suite.create = function (parent, title) {
    var titles = title.split('.');
    return _.reduce(titles, function (suite, title) {
        var existing = _.findWhere(suite.suites, { title: title });
        return existing || originalCreate(suite, title);
    }, parent);
};