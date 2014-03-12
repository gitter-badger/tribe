﻿T.registerModel(function (pane) {
    var self = this,
        test = pane.data;

    this.test = test;

    this.error = ko.computed(function () {
        var error = test.error();
        return error && error.replace(/\n/g, '<br/>');
    });

    this.fixture = test.fixture ?
        test.fixture.join('.') :
        'No fixture';

    this.showDetails = ko.observable(test.state() === 'failed');

    this.toggleDetails = function () {
        self.showDetails(!self.showDetails());
    };

});