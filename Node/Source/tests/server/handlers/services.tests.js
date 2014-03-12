﻿suite('tribe.handlers.services', function () {
    test("registering a service adds the handler to the handlers collection", function () {
        var service = function () { },
            services = require('tribe/handlers/services');
        services.register('test', service);
        expect(services.handlers.test).to.equal(service);
    });

    test("invoking a service executes the registered handler", function () {
        var service = sinon.spy(),
            services = require('tribe/handlers/services');
        services.register('test', service);
        services.invoke('test', ['test']);
        expect(service.calledOnce).to.be.true;
        expect(service.firstCall.args[0]).to.equal('test');
    });

    test("http service invokes service specified in parameters", function () {
        var httpHandler;
        stub('tribe/server/http', {
            registerService: function (name, handler) {
                httpHandler = handler;
            }
        });

        var service = sinon.stub().returns('value'),
            send = sinon.spy(),
            services = require('tribe/handlers/services');
        services.register('test', service);

        return httpHandler({ params: { name: 'test', args: ['arg'] } }, { send: send })
            .then(function () {
                expect(service.calledOnce).to.be.true;
                expect(service.firstCall.args[0]).to.equal('arg');
                expect(send.calledOnce).to.be.true;
                expect(send.firstCall.args[0]).to.equal('"value"');
            });
    })
});