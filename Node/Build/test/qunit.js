﻿module.exports = {
    run: function (testPath, pubsub) {
        var load = require('tribe/load'),
            options = require('tribe/options'),
            testRequire = require('tribe/test/require'),
            utils = require('tribe/utilities'),
            _ = require('underscore'),
            sinon = require('sinon'),

            start,
            qunit = {},
            globals = {
                attachEvent: function (event, callback) {
                    if (event === 'onload')
                        start = callback;
                },
                require: require,
                sinon: sinon
            };

        loadQunit()
            .then(applyTestRequire)
            .then(loadTests)
            .then(startTests)
            .fail(error);

        function loadQunit() {
            return load.file({
                path: options.libPath + 'qunit.js',
                debugDomain: 'Tests',
                debugPath: 'qunit.js',
                global: globals,
                args: { exports: qunit }
            });            
        }

        // we need a way of setting up and tearing down mocked dependencies from require calls.
        // qunit testStart and testDone callbacks are not called at expected times
        // this ensures enable and disable are called immediately prior to and after each test.
        function applyTestRequire() {
            require.mock = testRequire.mock;
            var originalTest = qunit.test,
                originalModule = qunit.module,
                moduleSet = false;

            qunit.module = function (name, testEnvironment) {
                testEnvironment = testEnvironment || {};
                var originalSetup = testEnvironment.setup,
                    originalTeardown = testEnvironment.teardown;

                testEnvironment.setup = function () {
                    testRequire.enable();
                    originalSetup && originalSetup();
                };

                testEnvironment.teardown = function () {
                    testRequire.disable();
                    originalTeardown && originalTeardown();
                };

                return originalModule(name, testEnvironment);
            };

            qunit.test = function (testName, expected, callback, async) {
                if (arguments.length === 2) {
                    callback = expected;
                    expected = null;
                }
                var originalCallback = callback;
                callback = function () {
                    // we only need to enable and disable if it hasn't already been done from the module setup and teardown
                    if (!moduleSet) testRequire.enable();
                    originalCallback();
                    if (!moduleSet) testRequire.disable();
                };
                originalTest(testName, expected, callback, async);
            };
        }

        function loadTests() {
            return load.directory({
                path: testPath,
                debugDomain: 'Tests',
                debugPath: '',
                args: { qunit: qunit },
                global: globals,
                withArg: 'qunit'
            });
        }

        function startTests() {
            var assertions = [];

            qunit.testStart(function (test) {
                pubsub.publish('test.start', test);
            });

            qunit.log(function (assertion) {
                assertions.push(assertion);
            });

            qunit.testDone(function (test) {
                pubsub.publish('test.done', _.extend({ assertions: assertions }, test));
                require.cache = {};
                assertions = [];
            });

            start();
        }

        function error(ex) {
            pubsub.publish('test.error', utils.errorDetails(ex));
        }
    }
};