// Mr. Floppypants World

var fpWorld = require('../fpWorld');
var fpView = require('../fpView');

var fpBackdrop = require('../fpBackdrop');

var fpHomeSetup = require('./fpHomeSetup');

var context = fpView.context();

// ---

var groundBg = context.createLinearGradient(0, 0, 0, fpWorld.BOTTOM);
groundBg.addColorStop(0, '#8a4425');
groundBg.addColorStop(1, '#421a09');

fpWorld.addBackdrop(new fpBackdrop({
    polygon: [
        [fpWorld.LEFT, fpWorld.GROUND],
        [fpWorld.RIGHT, fpWorld.GROUND],
        [fpWorld.RIGHT, fpWorld.BOTTOM],
        [fpWorld.LEFT, fpWorld.BOTTOM]
    ],
    fill: groundBg
}));

// ---

fpHomeSetup([0, 0]);
