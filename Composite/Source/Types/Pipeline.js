﻿T.Types.Pipeline = function (events, context) {
    this.execute = function (eventsToExecute, target) {
        var currentEvent = -1;
        var promise = $.Deferred();
        executeNextEvent();

        function executeNextEvent() {
            currentEvent++;
            if (currentEvent >= eventsToExecute.length) {
                promise.resolve();
                return;
            }

            var eventName = eventsToExecute[currentEvent];
            var thisEvent = events[eventName];

            if (!thisEvent) {
                T.logger.warn("No event defined for " + eventName);
                executeNextEvent();
                return;
            }

            $.when(thisEvent(target, context))
                .done(executeNextEvent)
                .fail(handleFailure);

            function handleFailure(error) {
                promise.reject(error);
                var targetDescription = target ? target.toString() : "empty target";
                T.logger.error("An error occurred in the '" + eventName + "' event for " + targetDescription, error);
            }
        }

        return promise;
    };
};