var fpWorld = require('../../fpWorld');
var fpView = require('../../fpView');
var fpBody = require('../../fpBody');

var fpBackdrop = require('../../fpBackdrop');

var context = fpView.context();

// ---

function addFence(polygon) {
    fpWorld.addBody(new fpBody({
        polygon: polygon,
        mass: 0,
        position: [0, 0]
    }));
}

addFence([[fpWorld.LEFT-100, fpWorld.TOP-100], [fpWorld.LEFT-100, fpWorld.TOP], [fpWorld.RIGHT+100, fpWorld.TOP], [fpWorld.RIGHT+100, fpWorld.TOP-100]]);
addFence([[fpWorld.LEFT-100, fpWorld.BOTTOM+100], [fpWorld.LEFT-100, fpWorld.BOTTOM], [fpWorld.RIGHT+100, fpWorld.BOTTOM], [fpWorld.RIGHT+100, fpWorld.BOTTOM+100]]);
addFence([[fpWorld.LEFT-100, fpWorld.TOP], [fpWorld.LEFT, fpWorld.TOP], [fpWorld.LEFT, fpWorld.BOTTOM], [fpWorld.LEFT-100, fpWorld.BOTTOM]]);
addFence([[fpWorld.RIGHT+100, fpWorld.TOP], [fpWorld.RIGHT, fpWorld.TOP], [fpWorld.RIGHT, fpWorld.BOTTOM], [fpWorld.RIGHT+100, fpWorld.BOTTOM]]);

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

require('../house/fpHouseSetup')([0, 0]);
require('../yard/fpFrontYardSetup')([2425, 0]);

// ---

if (fpWorld.currentActor())
    fpView.position(fpWorld.currentActor().head().body().position);
