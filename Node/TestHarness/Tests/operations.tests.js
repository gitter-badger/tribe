﻿suite('tribe.testharness.operations', function () {
    var operations = require('operations'),
        suite;

    setup(function () {
        suite = {
            fixtures: ko.observableArray([{
                title: '1',
                tests: ko.observableArray([{ title: '1', pending: ko.observable() }]),
                fixtures: ko.observableArray([{
                    title: '2',
                    tests: ko.observableArray([{ title: '11', pending: ko.observable() }, { title: '12', pending: ko.observable() }]),
                    fixtures: ko.observableArray()
                }, {
                    title: '3',
                    tests: ko.observableArray([{ title: '21', pending: ko.observable() }, { title: '22', pending: ko.observable() }]),
                    fixtures: ko.observableArray()
                }])
            }]),
            tests: ko.observableArray()
        };
    });

    test("setPending sets pending on all tests in fixture if none specified", function () {
        operations.setPending(suite);
        expect(suite.fixtures()[0].tests()[0].pending()).to.be.true;
        expect(suite.fixtures()[0].fixtures()[0].tests()[0].pending()).to.be.true;
        expect(suite.fixtures()[0].fixtures()[0].tests()[1].pending()).to.be.true;
        expect(suite.fixtures()[0].fixtures()[1].tests()[0].pending()).to.be.true;
        expect(suite.fixtures()[0].fixtures()[1].tests()[1].pending()).to.be.true;
    });

    test("setPending sets pending on specified tests", function () {
        operations.setPending(suite, [
            { fixture: '1', title: '1' },
            { fixture: '1.2', title: '12' },
            { fixture: '1.3', title: '21' },
        ]);

        expect(suite.fixtures()[0].tests()[0].pending()).to.be.true;
        expect(suite.fixtures()[0].fixtures()[0].tests()[0].pending()).to.not.be.true;
        expect(suite.fixtures()[0].fixtures()[0].tests()[1].pending()).to.be.true;
        expect(suite.fixtures()[0].fixtures()[1].tests()[0].pending()).to.be.true;
        expect(suite.fixtures()[0].fixtures()[1].tests()[1].pending()).to.not.be.true;
    });
});
