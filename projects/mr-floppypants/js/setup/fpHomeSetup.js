// Mr. Floppypants Home setup

var fpWorld = require('../fpWorld');
var fpView = require('../fpView');
var fpBackdrop = require('../fpBackdrop');
var fpThings = require('./fpThings');
var fpActors = require('./fpActors');

var context = fpView.context();

function fpHomeSetup(position) {
    var houseBg = context.createLinearGradient(position[0] + 500, position[1] - 1650, position[0] + 1900, position[1]);
    houseBg.addColorStop(0, '#e0f4ca');
    houseBg.addColorStop(1, '#a9cb84');

    var homeBackdrop = new fpBackdrop({
        polygon: [
            [position[0], position[1]],
            [position[0], position[1] - 1650],
            [position[0] + 2400, position[1] - 1650],
            [position[0] + 2400, position[1]]
        ],
        fill: houseBg
    });
    fpWorld.addBackdrop(homeBackdrop);

    var atticPeak = [position[0] + 1250, position[1] - 1650 - 1350/2];
    var atticBg = context.createLinearGradient(atticPeak[0], atticPeak[1], atticPeak[0], position[1] - 1650);
    atticBg.addColorStop(0, '#5c3611');
    atticBg.addColorStop(1, '#835323');

    var atticBackdrop = new fpBackdrop({
        polygon: [
            [position[0] - 100, position[1] - 1650],
            atticPeak,
            [position[0] + 2500, position[1] - 1650]
        ],
        fill: atticBg
    });
    fpWorld.addBackdrop(atticBackdrop);

    function pos(blockOffset) {
        return [position[0] - 25 + 50 * blockOffset[0], position[1] - 25 + 50 * blockOffset[1]];
    }

    function addThing(thing, blockOffset) {
        return fpThings[thing](pos(blockOffset));
    }

    function addActor(actor, blockOffset) {
        return fpActors[actor](pos(blockOffset));
    }

    addThing('floor1',  [ 0, 0]);
    addThing('stairs',  [ 1, 0]);
    addThing('floor4',  [12, 0]);
    addThing('floor1',  [16, 0]);
    addThing('floor15', [17, 0]);
    addThing('floor1',  [32, 0]);
    addThing('floor15', [33, 0]);
    addThing('floor1',  [48, 0]);

    addThing('ball', [17, -5]);
    addThing('bed', [18, -5]);
    addThing('pillow', [18, -7]);
    addThing('table', [22, -3]);

    fpWorld.currentActor(addActor('MrFloppyPants', [14, -5]));
    fpView.position(pos([13, -5]));
}

module.exports = fpHomeSetup;
