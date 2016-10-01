var fpWorld = require('../../fpWorld');
var fpThingSetup = require('../fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpYardThings = {
};

var imagedir = 'yard/';

fpYardThings.tire = function(pos, flip, angle) {
    var t1 = thingFunc({
        mass: 15,
        polygon: [[-6, -2], [8, -2], [17, 4], [17, 32], [-17, 32], [-17, 7]],
        images: [imagedir + 'tire1', imagedir + 'tire2'],
        offset: [28, 3]
    })(pos, flip, angle);
    var t2 = thingFunc({
        mass: 15,
        polygon: [[-7, 170], [11, 170], [17, 167], [16, 135], [-16, 135], [-16, 163]],
        offset: [28, 3]
    })(pos, flip, angle);
    fpThingSetup.lock(t1, t2);
    return [t1, t2];
};

fpYardThings.rope = thingFunc({
    mass: 1,
    polygon: [[-4, -4], [4, -4], [4, 204], [-4, 204]],
    image: imagedir + 'rope',
    offset: [5, 5],
    collisionGroup: fpWorld.GROUP_BACKGROUND
});

module.exports = fpYardThings;
