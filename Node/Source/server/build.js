﻿var options = require('tribe/options');

module.exports = {
    configure: function () {
        var pack = require('packscript').pack,
            options = require('tribe/options');

        Pack.context.configPath = options.basePath;
        Pack.api.Log.setLevel('info');
        pack.options.throttleTimeout = 0;

        pack([
            T.scripts('Infrastructure', true),
            T.panes('Panes', true),
            T.sagas('Sagas', true)
        ]).to('Build/site.js');

        pack({
            include: [T.sagas('Sagas'), T.staticHandlers('Handlers')],
            outputTemplate: 'registerResource'
        }).to('Build/server.js');

        pack([T.scripts(options.modulePath + '/client/build/*.js')]).to('Build/dependencies.js');

        pack({ outputTemplate: 'index' }).to('Build/index.html');

        pack.scanForResources(__dirname + '/../pack/')
            .all()
            .watch(options.basePath);
    }
};