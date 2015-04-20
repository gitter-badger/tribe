﻿var storage = require('tribe.storage'),
    expressions = require('tribe.expressions'),
    actors = require('tribe/actors'),
    log = require('tribe.logger'),
    Q = require('q'),
    messages, db;

module.exports = {
    store: function (scope, envelopes) {
        return Q.when(initialise()).then(function () {
            if(envelopes.constructor === Array)
                return messages.store(envelopes.map(createContainer));
            return messages.store(createContainer(envelopes));
        }).fail(function (error) {
            log.error('Failed to store message', error);
        });

        function createContainer(envelope) {
            return {
                envelope: envelope,
                scope: JSON.stringify(scope)
            };
        }
    },
    retrieve: function (scope) {
        return Q.when(initialise())
            .then(function () {
                return messages
                    .retrieve([
                        //{ p: 'clientSeq', o: '>', v: 0 }, // we should be sorting by this to be sure, but there is some bug in storage here
                        { p: 'scope', v: JSON.stringify(scope) }
                    ])
            })
            .then(function (messages) {
                return messages.map(function (message) {
                    return message.envelope;
                });
            })
            .fail(function (error) {
                log.error('Failed to retrieve messages', error);
            });
    },
    clear: function () {
        return Q.when(initialise())
            .then(function () {
                return messages.clear();
            });
    },
    close: function () {
        db && db.close();
        db = undefined;
    }
}

function initialise() {
    if(!db)
        return storage.open([{ name: 'messages', indexes: [['scope']], keyPath: 'clientSeq', autoIncrement: true }], { type: module.exports.type })
            .then(function (provider) {
                db = provider;
                messages = provider.entity('messages');
            })
}
