﻿TC.registerModel(function(pane) {
    this.start = function () {
        pane.startFlow(CreditCardFlow, 'personal');
    };
});