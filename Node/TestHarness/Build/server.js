(function(T) {
//

// Handlers/test.run.js


T.scriptEnvironment = { resourcePath: '/test.run' };

var qunit = require('tribe/test/qunit');

T.registerHandler('test.run', function (handler, envelope) {
    qunit.run(handler);
});

       
})({
    registerSaga: function(constructor) {
        require('tribe/handlers/sagas').register(this.scriptEnvironment.resourcePath, constructor);
    },
    registerHandler: function(messageFilter, handler) {
        require('tribe/handlers/statics').register(messageFilter, handler);
    }
})