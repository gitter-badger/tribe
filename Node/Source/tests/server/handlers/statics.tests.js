﻿suite('tribe.handlers.statics', function () {
    test("register adds handler to handlers array", function () {
        var statics = require('tribe/handlers/statics');
        var handler = {};

        statics.register('message', handler);
        expect(statics.handlers[0].func).to.equal(handler);
    });

    test("start executes handler with corresponding topic", function () {
        var handler = sinon.spy();
        var statics = require('tribe/handlers/statics');

        statics.register('message', handler);
        statics.start({ topic: 'message' });
        expect(handler.calledOnce).to.be.ok;
    });

    test("start executes handler when filter passes", function () {
        var handler = sinon.spy();
        var statics = require('tribe/handlers/statics');

        statics.register(filter, handler);
        statics.start({ topic: 'message' });
        expect(handler.notCalled).to.be.ok;
        statics.start({ topic: 'message2' });
        expect(handler.calledOnce).to.be.ok;

        function filter(envelope) {
            return envelope.topic === 'message2';
        }
    });

    test("handler.publish from static handler broadcasts message", function () {
        var channels = { broadcast: sinon.spy() };
        stub('tribe/server/channels', channels);
        var statics = require('tribe/handlers/statics');

        statics.register('message', function (handler, envelope) {
            handler.publish('message2');
        });
        statics.start({ topic: 'message' });
        expect(channels.broadcast.calledOnce).to.be.ok;
        expect(channels.broadcast.firstCall.args[0].topic).to.equal('message2');
    });
});
