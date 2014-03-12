﻿var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('q-io/fs'),
    log = require('tribe/logger'),
    store = require('tribe/store/fs'),
    options = require('tribe/options');

module.exports = {
    start: function () {
        app.get('/', function (req, res) {
            fs.read(options.basePath + 'Build/index.html').then(function (data) {
                res.send(data);
            });
        });

        app.use('/Build/', express.static(options.basePath + 'build'));

        app.get('/Data/:partition/:row', function (req, res) {
            store.get(req.params.partition, req.params.row)
                .then(function (data) {
                    res.send(data);
                })
                .fail(function () {
                    res.status(404).end();
                });
        });

        server.listen(options.port);

        return server;
    },
    registerService: function (uri, handler, verb) {
        app[verb || 'all'](uri, handler);
    }
};