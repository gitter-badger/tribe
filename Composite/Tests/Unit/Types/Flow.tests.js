﻿(function () {
    var spy;
    var pubsub;
    var pane;
    var node;
    
    module('Unit.Types.Flow', {
        setup: function () {
            spy = sinon.spy();
            pubsub = new Tribe.PubSub({ sync: true });
            pane = new TC.Types.Pane({ pubsub: pubsub });
            node = new TC.Types.Node(null, pane);
            node.findNavigation = function () { return { node: { navigate: spy, pane: pane } }; };
        }
    });
    
    test("constructor arguments are passed to definition constructor", function () {
        expect(2);
        var f = new TC.Types.Flow(node, constructor, 'arg1', 'arg2');
        function constructor(flow, arg1, arg2) {
            equal(arg1, 'arg1');
            equal(arg2, 'arg2');
        }
    });

    test("arguments to Node.startFlow are passed to definition constructor", function () {
        expect(2);
        var f = node.startFlow(constructor, 'arg1', 'arg2');
        function constructor(flow, arg1, arg2) {
            equal(arg1, 'arg1');
            equal(arg2, 'arg2');
        }
    });

    test("arguments to Pane.startFlow are passed to definition constructor", function () {
        expect(2);
        var f = pane.startFlow(constructor, 'arg1', 'arg2');
        function constructor(flow, arg1, arg2) {
            equal(arg1, 'arg1');
            equal(arg2, 'arg2');
        }
    });

    test("Flow calls navigate on navigation pane when navigatesTo is called", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        f.navigatesTo('path', 'data')();
        ok(spy.calledOnce);
        equal(spy.firstCall.args[0], 'path');
        equal(spy.firstCall.args[1], 'data');
    });

    test("Flow calls navigate on navigation pane when message is received for navigatesTo event", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        pubsub.publish('navigatesTo');
        ok(spy.calledOnce);
        equal(spy.firstCall.args[0], 'path');
        equal(spy.firstCall.args[1], 'data');
    });

    test("No handlers are executed after flow ends", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        pubsub.publish('navigatesTo');
        pubsub.publish('end');
        pubsub.publish('navigatesTo');
        ok(spy.calledOnce);
    });

    test("No handlers are executed after flow ends with null handler", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        pubsub.publish('navigatesTo');
        pubsub.publish('null');
        pubsub.publish('navigatesTo');
        ok(spy.calledOnce);
    });

    test("Child onstart handler is executed when start child message is received", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        pubsub.publish('startChild');
        ok(spy.calledOnce);
        equal(spy.firstCall.args[0], 'child');
    });

    test("Child handlers are executed after start child message is received", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        pubsub.publish('navigateChild');
        pubsub.publish('startChild');
        pubsub.publish('navigateChild');
        ok(spy.calledTwice);
    });

    test("Child handlers are not executed after end child message is received", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        pubsub.publish('startChild');
        pubsub.publish('navigateChild');
        pubsub.publish('endChild');
        pubsub.publish('navigateChild');
        ok(spy.calledTwice);
    });

    test("Child handlers are not executed after end flow message is received", function () {
        var f = new TC.Types.Flow(node, TestFlow).start();
        pubsub.publish('startChild');
        pubsub.publish('navigateChild');
        pubsub.publish('end');
        pubsub.publish('navigateChild');
        ok(spy.calledTwice);
    });

    function TestFlow(flow) {
        this.handles = {
            'navigatesTo': flow.navigatesTo('path', 'data'),
            'startChild': {
                onstart: flow.navigatesTo('child'),
                'navigateChild': flow.navigatesTo('child2'),
                'endChild': null
            },
            'end': flow.end,
            'null': null
        };
    }
})();