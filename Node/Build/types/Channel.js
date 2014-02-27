﻿
module.exports = function Channel(id) {
    var io = require('tribe/server/socket').io;

    // for the moment, this is a simple wrapper around socket.io rooms
    // we may want to add client IDs, so we'll need to add cleanup on disconnect

    this.id = id;

    this.join = function (socket) {
        socket.join(id);
    };

    this.leave = function (socket) {
        sockets.leave(id);
    };

    this.broadcast = function (envelope, origin) {
        if (origin)
            origin.broadcast.to(id).emit('message', envelope);
        else
            io.sockets.in(id).emit('message', envelope);
    };

    this.clients = function () {
        return io.sockets.clients(id);
    };
};