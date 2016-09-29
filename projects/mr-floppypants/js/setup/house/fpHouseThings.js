var fpWorld = require('../../fpWorld');
var fpThingSetup = require('../fpThingSetup');
var p2 = require('p2');

var thingFunc = fpThingSetup.thingFunc;

var fpHouseThings = {
};

var imagedir = 'house/';

fpHouseThings.floor1 = thingFunc({
    polygon: [[0, 0], [0, 50], [50, 50], [50, 0]],
    image: imagedir + 'floor1'
});
fpHouseThings.floor4 = thingFunc({
    polygon: [[0, 0], [200, 0], [200, 50], [0, 50]],
    image: imagedir + 'floor4'
});
fpHouseThings.floor9 = thingFunc({
    polygon: [[0, 0], [450, 0], [450, 50], [0, 50]],
    image: imagedir + 'floor9'
});
fpHouseThings.floor15 = thingFunc({
    polygon: [[0, 0], [750, 0], [750, 50], [0, 50]],
    image: imagedir + 'floor15'
});
fpHouseThings.wall3 = thingFunc({
    polygon: [[11, 2], [38, 2], [38, 146], [11, 146]],
    image: imagedir + 'wall3',
    offset: [-10, 0]
});
fpHouseThings.wall5 = thingFunc({
    polygon: [[11, 2], [38, 2], [38, 242], [11, 242]],
    image: imagedir + 'wall5',
    offset: [-10, 0]
});
fpHouseThings.stairs = thingFunc({
    polygon: [
        [0, -500], [50, -500],
        [50, -450], [100, -450],
        [100, -400], [150, -400],
        [150, -350], [200, -350],
        [200, -300], [250, -300],
        [250, -250], [300, -250],
        [300, -200], [350, -200],
        [350, -150], [400, -150],
        [400, -100], [450, -100],
        [450, -50], [500, -50],
        [500, 0], [550, 0],
        [550, 49], [500, 49], [0, -449]
    ],
    image: imagedir + 'stairs',
    offset: [0, 500]
});
fpHouseThings.ball = thingFunc({
    circle: [25, -25, 24],
    image: 'ball',
    offset: [0, 50],
    mass: 0.3,
    material: fpWorld.BOUNCY_MATERIAL
});
fpHouseThings.bed = thingFunc({
    polygon: [
        [0, 0], [0, -105], [13, -105], [13, -76], [283, -76], [283, -79],
        [292, -79], [292, 0], [283, 0], [283, -31], [9, -31], [9, 0]
    ],
    image: imagedir + 'bed',
    offset: [0, 104],
    mass: 120
});
fpHouseThings.pillow = thingFunc({
    polygon: [[2, -6], [25, -2], [48, -6], [48, -14], [25, -18], [2, -14]],
    image: imagedir + 'pillow',
    offset: [0, 20],
    mass: 0.1
});
fpHouseThings.table = thingFunc({
    polygon: [
        [3, -97], [197, -97], [197, -90], [153, -90], [153, -1], [144, -1], [144, -76],
        [55, -76], [55, -1], [46, -1], [46, -90], [3, -90]
    ],
    image: imagedir + 'table',
    offset: [0, 100],
    mass: 100
});
fpHouseThings.glass = thingFunc({
    polygon: [[2, -22], [11, -22], [11, -1], [2, -1]],
    image: imagedir + 'glass',
    offset: [0, 24],
    mass: 1
});
fpHouseThings.plate = thingFunc({
    polygon: [[3, -10], [44, -10], [29, -1], [17, -1]],
    image: imagedir + 'plate',
    offset: [0, 13],
    mass: 1
});
fpHouseThings.chair = thingFunc({
    polygon: [[1, -1], [1, -137], [8, -137], [8, -61], [52, -61], [52, -1], [45, -1], [45, -27], [8, -27], [8, -1]],
    image: imagedir + 'chair',
    offset: [1, 138],
    mass: 30
});
fpHouseThings.bathtub = thingFunc({
    polygon: [
        [5, -97], [20, -98], [45, -30], [199, -30], [237, -91], [250, -91],
        [205, -2], [182, -2], [182, -14], [61, -14], [61, -2], [41, -2], [0, -84]
    ],
    images: [imagedir + 'bathtub1', imagedir + 'bathtub2'],
    offset: [1, 102],
    mass: 300
});
fpHouseThings.sink = thingFunc({
    polygon: [
        [2, -111], [10, -139], [26, -137], [17, -112], [20, -84], [59, -84], [83, -111], [91, -109],
        [77, -81], [50, -72], [79, -2], [0, -2]
    ],
    images: [imagedir + 'sink1', imagedir + 'sink2'],
    offset: [1, 142],
    mass: 250
});
fpHouseThings.hatch = thingFunc({
    polygon: [
        [-8, -10], [190, -10], [195, -16], [213, -16], [218, -10], [234, -10],
        [234, 10], [218, 10], [213, 16], [195, 16], [190, 10], [-8, 10]
    ],
    image: imagedir + 'hatch',
    offset: [12, 20],
    mass: 50,
    more: function(hatch, position) {
        hatch.body().gravityScale = 0;
        var joi = new p2.RevoluteConstraint(fpWorld.NULL_BODY, hatch.body(), {
            worldPivot: position
        });
        joi.setLimits(0, 0);
        fpWorld.world().addConstraint(joi);
    }
});
fpHouseThings.roof = thingFunc({
    polygon: [[0, 21], [99, -30], [115, -17], [17, 33]],
    image: imagedir + 'roof',
    offset: [0, 30]
});
fpHouseThings.chimney = thingFunc({
    polygon: [[4, -159], [24, -159], [24, 27], [4, 39]],
    images: [null, imagedir + 'chimney'],
    offset: [0, 164]
});
fpHouseThings.chimney2 = thingFunc({
    polygon: [[97, -159], [117, -159], [117, -17], [97, -12]],
    image: null,
    offset: [0, 164]
});
fpHouseThings.window = thingFunc({
    image: imagedir + 'window',
    offset: [10, 207]
});
fpHouseThings.grass = thingFunc({
    polygon: [[0, 0], [0, 75], [500, 75], [500, 0]],
    images: ['grass1', 'grass2'],
    offset: [0, 25]
});
// createGrass: function(world, offx, offy, angle) {
//     return [createThing(world, {
//         position: [offx, offy],
//         polygon: [[0, 75], [0, 0], [500, 0], [500, 75]],
//         image: ['grass1', 'grass2'],
//         offset: [250, 65],
//         angle: angle
//     })];
// },
// createRedBlock: function(world, offx, offy) {
//     return [createThing(world, {
//         position: [offx + 25, offy + 25],
//         polygon: [[-25, -25], [25, -25], [25, 25], [-25, 25]],
//         image: imagedir + 'redblock',
//         offset: [25, 25]
//     })];
// }

module.exports = fpHouseThings;
