var fpThingSetup = require('../fpThingSetup');
var fpWorld = require('../../fpWorld');

var thingFunc = fpThingSetup.thingFunc;

var fpGolfThings = {
};

var imagedir = 'golf/';

var ballGroup = fpWorld.newCollisionGroup();
var clubGroup = fpWorld.newCollisionGroup();

fpGolfThings.golfCourse = thingFunc({
    polygon: [[0, 350], [86, 255], [123, 255], [170, 309],
        [354, 308], [354, 336], [379, 337], [379, 308], [447, 310],
        [497, 280], [595, 278], [697, 342], [697, 400], [698, 342], [798, 342], [848, 321],
        [948, 319], [998, 344], [1152, 342], [1198, 355], [1298, 355],
        [1298, 348], [1400, 348], [1400, 450], [0, 450]],
    image: imagedir + 'golfcourse',
    offset: [0, 355]
});

fpGolfThings.golfBall = thingFunc({
    circle: [10, -10, 9],
    image: imagedir + 'golfball',
    offset: [0, 20],
    mass: 0.2,
    density: 1.5,
    collisionGroup: ballGroup,
    collisionMask: clubGroup | fpWorld.GROUP_GROUND
});

fpGolfThings.golfClub = thingFunc({
    polygon: [[21, 3], [30, 3], [30, 88], [5, 95], [3, 89], [21, 81]],
    image: imagedir + 'golfclub',
    offset: [0, 90],
    mass: 0.3,
    density: 1.5,
    collisionGroup: clubGroup
});

module.exports = fpGolfThings;
