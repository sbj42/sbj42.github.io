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

    var atticPeak = [position[0] + 1200, position[1] - 1650 - 1300/2];
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

    function addThing(thing, blockOffset, flip, angle) {
        return fpThings[thing](pos(blockOffset), flip, angle);
    }

    function addActor(actor, blockOffset) {
        return fpActors[actor](pos(blockOffset));
    }

    // underneath

    addThing('stairs',  [ 1, 11]);

    // first floor

    addThing('floor1',  [ 0, 0]);
    addThing('stairs',  [ 1, 0]);
    addThing('floor4',  [12, 0]);
    addThing('floor1',  [16, 0]);
    addThing('floor15', [17, 0]);
    addThing('floor1',  [32, 0]);
    addThing('floor15', [33, 0]);
    addThing('floor1',  [48, 0]);

    addThing('wall3',  [ 0, -5]);
    addThing('wall5',  [ 0, -10]);
    addThing('wall5',  [16, -10]);
    addThing('wall5',  [32, -10]);
    addThing('wall5',  [48, -10]);

    // second floor

    addThing('floor1',  [ 0, -11]);
    addThing('floor4',  [12, -11]);
    addThing('floor1',  [16, -11]);
    addThing('floor15', [17, -11]);
    addThing('floor1',  [32, -11]);
    addThing('floor4',  [33, -11]);
    addThing('stairs',  [48, -11], true);
    addThing('floor1',  [48, -11]);

    addThing('wall3',  [ 0, -14]);
    addThing('wall5',  [ 0, -21]);
    addThing('wall5',  [16, -21]);
    addThing('wall5',  [32, -21]);
    addThing('wall5',  [48, -21]);
    addThing('wall5',  [48, -16]);

    addThing('table',  [23, -11]);
    addThing('plate',  [23, -12.95]);
    addThing('glass',  [24, -12.95]);
    addThing('glass',  [25.7, -12.95]);
    addThing('plate',  [26, -12.95]);
    addThing('chair',  [22.5, -11]);
    addThing('chair',  [27.5, -11], true);

    // third floor

    addThing('floor1',  [ 0, -22]);
    addThing('floor15', [ 1, -22]);
    addThing('floor1',  [16, -22]);
    addThing('floor15', [17, -22]);
    addThing('floor1',  [32, -22]);
    addThing('floor4',  [33, -22]);
    addThing('floor1',  [48, -22]);

    addThing('wall3',  [ 0, -25]);
    addThing('wall5',  [ 0, -32]);
    addThing('wall5',  [16, -32]);
    addThing('wall5',  [32, -32]);
    addThing('wall5',  [48, -32]);
    addThing('wall3',  [48, -25]);

    addThing('sink', [0.9, -22]);
    addThing('bathtub', [6, -22]);

    addThing('ball', [21, -22]);
    addThing('bed', [22, -22]);
    addThing('pillow', [22.25, -23.5]);

    // attic

    addThing('floor1',  [ 0, -33]);
    addThing('floor4',  [ 1, -33]);
    addThing('floor1',  [ 5, -33]);
    addThing('floor1',  [11, -33]);
    addThing('floor4',  [12, -33]);
    addThing('floor1',  [16, -33]);
    addThing('floor15', [17, -33]);
    addThing('floor1',  [32, -33]);
    addThing('floor15', [33, -33]);
    addThing('floor1',  [48, -33]);

    addThing('hatch', [6.25, -32.5]);

    // roof

    for (var i = 0; i < 13; i ++) {
        addThing('roof', [-1.5 + i * 2, -33 - i]);
        if (i != 6)
            addThing('roof', [50.5 - i * 2, -33 - i], true);
        else {
            addThing('chimney', [50.5 - i * 2, -33 - i], true);
            addThing('chimney2', [50.5 - i * 2, -33 - i], true);
        }
    }

    fpWorld.currentActor(addActor('MrFloppyPants', [30, -37]));
}

module.exports = fpHomeSetup;
