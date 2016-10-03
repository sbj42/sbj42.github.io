var fpWorld = require('../../fpWorld');
var fpCaveThings = require('./fpCaveThings');

function fpCaveSetup(position) {

    function pos(offset) {
        return [position[0] + offset[0], position[1]  + offset[1]];
    }

    fpCaveThings.caveWS(pos([0, 0]), true, 270);

    var places = {
        'cave-entrance': pos([250, -200])
    };
    for (var x in places) {
        fpWorld.places[x] = places[x];
    }
}

module.exports = fpCaveSetup;
