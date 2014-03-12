﻿var _ = require('underscore'),
    path = require('path');

module.exports = {
    apply: function (options) {
        _.extend(module.exports, options);
        return module.exports;
    },
    port: 1678,
    basePath: defaultBasePath(),
    dataPath: defaultBasePath() + 'Data/',
    modulePath: modulePath(),
    libPath: libPath(),
    testFramework: 'mocha',
    debugPort: process.debugPort
};

function defaultBasePath() {
    var path = process.argv[1];
    return path.substr(0, path.replace(/\\/g, '/').lastIndexOf('/')) + '/';
}

function modulePath() {
    return path.join(__dirname, '..');
}

function libPath() {
    return path.join(__dirname, '../lib/');
}