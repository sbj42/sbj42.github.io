var fpWorld = require('../../fpWorld');
var fpGolfThings = require('./fpGolfThings');
var fpThings = require('../fpThings');

function fpFrontGolfSetup(position, groundBackdrop) {

    function pos(offset) {
        return [position[0] + offset[0], position[1]  + offset[1]];
    }

    function addThing(thing, offset, flip, angle) {
        return fpGolfThings[thing](pos(offset), flip, angle);
    }

    fpThings.grass(pos([-500, 0]));
    addThing('golfCourse', [-1900, 0]);
    addThing('golfBall', [-550, -7]);
    addThing('golfClub', [-530, -10]);
    fpThings.grass(pos([-2400, 0]));

    var places = {
        'golf-start': pos([-380, -200])
    };
    for (var x in places) {
        fpWorld.places[x] = places[x];
    }
}

module.exports = fpFrontGolfSetup;
