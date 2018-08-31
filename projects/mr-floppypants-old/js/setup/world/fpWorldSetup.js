var fpWorld = require('../../fpWorld');
var fpView = require('../../fpView');
var fpBody = require('../../fpBody');
var fpConfig = require('../../fpConfig');
var fpMrFloppypants = require('../mr-floppypants/fpMrFloppypants');

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

fpWorld.RIGHT = 9750;

var fenceSize = 1000;
addFence([[fpWorld.LEFT-fenceSize, fpWorld.TOP-fenceSize], [fpWorld.LEFT-fenceSize, fpWorld.TOP], [fpWorld.RIGHT+fenceSize, fpWorld.TOP], [fpWorld.RIGHT+fenceSize, fpWorld.TOP-fenceSize]]);
addFence([[fpWorld.LEFT-fenceSize, fpWorld.BOTTOM+fenceSize], [fpWorld.LEFT-fenceSize, fpWorld.BOTTOM], [fpWorld.RIGHT+fenceSize, fpWorld.BOTTOM], [fpWorld.RIGHT+fenceSize, fpWorld.BOTTOM+fenceSize]]);
addFence([[fpWorld.LEFT-fenceSize, fpWorld.TOP], [fpWorld.LEFT, fpWorld.TOP], [fpWorld.LEFT, fpWorld.BOTTOM], [fpWorld.LEFT-fenceSize, fpWorld.BOTTOM]]);
addFence([[fpWorld.RIGHT+fenceSize, fpWorld.TOP], [fpWorld.RIGHT, fpWorld.TOP], [fpWorld.RIGHT, fpWorld.BOTTOM], [fpWorld.RIGHT+fenceSize, fpWorld.BOTTOM]]);

var groundBg = context.createLinearGradient(0, 0, 0, fpWorld.BOTTOM);
groundBg.addColorStop(0, '#8a4425');
groundBg.addColorStop(1, '#421a09');

var groundBackdrop = new fpBackdrop({
    polygon: [
        [fpWorld.LEFT, fpWorld.GROUND],
        [fpWorld.RIGHT, fpWorld.GROUND],
        [fpWorld.RIGHT, fpWorld.BOTTOM],
        [fpWorld.LEFT, fpWorld.BOTTOM]
    ],
    fill: groundBg
});
fpWorld.addBackdrop(groundBackdrop);

// ---

require('../cave/fpCaveSetup')([0, 0]);

require('../house/fpHouseSetup')([0, 0]);

require('../yard/fpFrontYardSetup')([2425, 0], groundBackdrop);

require('../golf/fpGolfSetup')([-2025, 0]);

// ---

if (fpConfig.start in fpWorld.places) {
    var mrfp = fpMrFloppypants(fpWorld.places[fpConfig.start]);
    fpWorld.currentActor(mrfp);
} else {
    var mrfp = fpMrFloppypants(fpWorld.places['house-bed']);
    fpWorld.currentActor(mrfp);
}

if (fpWorld.currentActor())
    fpView.position(fpWorld.currentActor().head().body().position);
