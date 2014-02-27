﻿module.exports = {
    start: function (server) {
        var io = require('socket.io').listen(server),
            log = require('tribe/logger'),
            sagas = require('tribe/handlers/sagas'),
            statics = require('tribe/handlers/statics'),
            channels = require('tribe/server/channels'),
            options = require('tribe/options');

        module.exports.io = io;

        io.sockets.on('connection', function (socket) {
            log.debug('connected...');
            
            socket.on('message', function (envelope, ack) {
                // need persistent queue storage here. Sagas and statics will be invoked on the other side.
                channels.broadcast(envelope, socket);
                statics.start(envelope);
                sagas.handle(envelope);
                ack();
            });
            
            socket.on('join', function (channel) {
                log.debug('joined...');
                channels.join(channel, socket);
            });

            socket.on('startSaga', function(data) {
                log.debug('starting saga ' + data.path);
                socket.join(data.id);
                sagas.start(data.path, data.id, data.data);
            });

            socket.on('disconnect', function () {
                channels.leaveAll(socket);
            });
        });
    }
};