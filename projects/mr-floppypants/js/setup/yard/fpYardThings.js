var fpWorld = require('../../fpWorld');
var fpThingSetup = require('../fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpYardThings = {
};

var imagedir = 'yard/';

fpYardThings.tire = function(pos, flip, angle) {
    var t1 = thingFunc({
        mass: 15,
        polygon: [[22,1],[36,1],[45,7],[45,35],[11,35],[11,10]],
        images: [imagedir + 'tire1', imagedir + 'tire2'],
        offset: [28, 3]
    })(pos, flip, angle);
    var t2 = thingFunc({
        mass: 15,
        polygon: [[21,173],[39,173],[45,170],[44,138],[12,138],[12,166]],
        offset: [28, 3]
    })(pos, flip, angle);
    fpThingSetup.lock(t1, t2);
    return [t1, t2];
};

fpYardThings.rope = thingFunc({
    mass: 1,
    polygon: [[1, 1], [9, 1], [9, 209], [1, 209]],
    image: imagedir + 'rope',
    offset: [5, 5],
    collisionGroup: fpWorld.GROUP_BACKGROUND
});

module.exports = fpYardThings;
