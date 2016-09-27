// Mr. Floppypants Things

var fpWorld = require('../fpWorld');
var fpBody = require('../fpBody');
var p2 = require('p2');

var fpThings = {
};

function addBody(param) {
    return function(position, flip, angle) {
        var nparam = {
        };
        for (var x in param)
            nparam[x] = param[x];
        nparam.offset = param.offset || [0, 0];
        nparam.position = position;
        nparam.flip = flip;
        nparam.angle = angle;
        if (param.more) {
            nparam.more = function(thing, position) {
                param.more(thing, position);
            };
        }
        var body = new fpBody(nparam);
        fpWorld.addBody(body);
        body.body().sleep();
        return body;
    };
}

fpThings.floor1 = addBody({
    polygon: [[0, 0], [0, 50], [50, 50], [50, 0]],
    image: 'floor1'
});
fpThings.floor4 = addBody({
    polygon: [[0, 0], [200, 0], [200, 50], [0, 50]],
    image: 'floor4'
});
fpThings.floor9 = addBody({
    polygon: [[0, 0], [450, 0], [450, 50], [0, 50]],
    image: 'floor9'
});
fpThings.floor15 = addBody({
    polygon: [[0, 0], [750, 0], [750, 50], [0, 50]],
    image: 'floor15'
});
fpThings.wall3 = addBody({
    polygon: [[1, 2], [28, 2], [28, 146], [1, 146]],
    image: 'wall3',
    position: [10, 0]
});
fpThings.wall5 = addBody({
    polygon: [[1, 2], [28, 2], [28, 242], [1, 242]],
    image: 'wall5',
    position: [10, 0]
});
fpThings.stairs = addBody({
    polygon: [
        [1, 1], [51, 1],
        [51, 51], [101, 51],
        [101, 101], [151, 101],
        [151, 151], [201, 151],
        [201, 201], [251, 201],
        [251, 251], [301, 251],
        [301, 301], [351, 301],
        [351, 351], [401, 351],
        [401, 401], [451, 401],
        [451, 451], [501, 451],
        [501, 501], [551, 501],
        [551, 550], [501, 550], [1, 55]
    ],
    image: 'stairs',
    offset: [0, 0],
    position: [-1, -501]
});
fpThings.ball = addBody({
    circle: [25, -25, 24],
    image: 'ball',
    offset: [0, 50],
    mass: 0.3,
    material: fpWorld.BOUNCY_MATERIAL
});
fpThings.bed = addBody({
    polygon: [
        [0, 0], [0, -105], [13, -105], [13, -76], [283, -76], [283, -79],
        [292, -79], [292, 0], [283, 0], [283, -31], [9, -31], [9, 0]
    ],
    image: 'bed',
    offset: [0, 104],
    mass: 120
});
fpThings.pillow = addBody({
    polygon: [[2, -6], [25, -2], [48, -6], [48, -14], [25, -18], [2, -14]],
    image: 'pillow',
    offset: [0, 20],
    mass: 0.1
});
fpThings.table = addBody({
    polygon: [
        [3, -97], [197, -97], [197, -90], [153, -90], [153, -1], [144, -1], [144, -76],
        [55, -76], [55, -1], [46, -1], [46, -90], [3, -90]
    ],
    image: 'table',
    offset: [0, 100],
    mass: 100
});
fpThings.glass = addBody({
    polygon: [[2, -22], [11, -22], [11, -1], [2, -1]],
    image: 'glass',
    offset: [0, 24],
    mass: 1
});
fpThings.plate = addBody({
    polygon: [[3, -10], [44, -10], [29, -1], [17, -1]],
    image: 'plate',
    offset: [0, 13],
    mass: 1
});
fpThings.chair = addBody({
    polygon: [[1, -1], [1, -137], [8, -137], [8, -61], [52, -61], [52, -1], [45, -1], [45, -27], [8, -27], [8, -1]],
    image: 'chair',
    offset: [1, 138],
    mass: 30
});
fpThings.bathtub = addBody({
    polygon: [
        [5, -97], [20, -98], [45, -30], [199, -30], [237, -91], [250, -91],
        [205, -2], [182, -2], [182, -14], [61, -14], [61, -2], [41, -2], [0, -84]
    ],
    images: ['bathtub1', 'bathtub2'],
    offset: [1, 102],
    mass: 300
});
fpThings.sink = addBody({
    polygon: [
        [2, -111], [10, -139], [26, -137], [17, -112], [20, -84], [59, -84], [83, -111], [91, -109],
        [77, -81], [50, -72], [79, -2], [0, -2]
    ],
    images: ['sink1', 'sink2'],
    offset: [1, 142],
    mass: 250
});
fpThings.hatch = addBody({
    polygon: [
        [-8, -10], [190, -10], [195, -16], [213, -16], [218, -10], [234, -10],
        [234, 10], [218, 10], [213, 16], [195, 16], [190, 10], [-8, 10]
    ],
    image: 'hatch',
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
fpThings.roof = addBody({
    polygon: [[0, 21], [99, -30], [115, -17], [17, 33]],
    image: 'roof',
    offset: [0, 30]
});
fpThings.chimney = addBody({
    polygon: [
        [4, -159], [24, -159], [24, 27], [4, 39],
    ],
    images: [null, 'chimney'],
    offset: [0, 164]
});
fpThings.chimney2 = addBody({
    polygon: [
        [97, -159], [117, -159], [117, -17], [97, -12]
    ],
    image: null,
    offset: [0, 164]
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
//         image: 'redblock',
//         offset: [25, 25]
//     })];
// }

module.exports = fpThings;
