'use strict';
require.config({
    shim: {
        'lib/underscore': {
            exports: '_'
        }
    }
});
require(['game'], function(gamemod) {
    gamemod.load().then(function(game) {
        game.start();
    }).then(null, function(e) {
        console.error(e.stack || e);
    });
});
