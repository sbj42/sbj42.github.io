// Mr. Floppypants Things

var fpWorld = require('../fpWorld');
var fpBody = require('../fpBody');

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
        if (param.position)
            nparam.position = [position[0] + param.position[0], position[1] + param.position[1]];
        var body = new fpBody(nparam);
        fpWorld.addBody(body);
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
        [5, -97], [20, -98], [45, -24], [199, -24], [237, -91], [250, -91],
        [205, -2], [182, -2], [182, -14], [61, -14], [61, -2], [41, -2], [0, -84]
    ],
    images: ['bathtub1', 'bathtub2'],
    offset: [1, 102],
    mass: 300
});
// createSink: function(world, offx, offy, flip) {
//     return [createThing(world, {
//         mass: 350,
//         position: [offx, offy],
//         polygon: [[0, 0], [2, -109], [12, -109], [26, -85], [62, -85], [82, -109], [90, -106], [76, -78],
//             [48, -71], [79, 0]],
//         image: ['sink1', 'sink2'],
//         offset: [40, 93],
//         flip: flip
//     })];
// },
// createHatch: function(world, offx, offy, flip) {
//     return [createThing(world, {
//         mass: 100,
//         position: [offx, offy],
//         polygon: [[-10, -8], [189, -8], [193, -15], [213, -15], [218, -8], [234, -8],
//             [234, 10], [218, 10], [213, 19], [193, 19], [189, 10], [-10, 10]],
//         image: 'hatch',
//         offset: [130, 20],
//         flip: flip
//     })];
// },
// createRoof: function(world, offx, offy, flip) {
//     return [createThing(world, {
//         position: [offx, offy],
//         polygon: [[-10, -6], [89, -55], [110, -39], [13, 11]],
//         image: 'roof',
//         offset: [58, 30],
//         flip: flip
//     })];
// },
// createChimney: function(world, offx, offy, flip) {
//     return [createThing(world, {
//         position: [offx, offy],
//         polygon: [[-3, 9], [14, -1], [14, -185], [-3, -185]],
//         image: [null, 'chimney'],
//         offset: [15, 94],
//         flip: flip
//     }), createThing(world, {
//         position: [offx, offy],
//         polygon: [[96, -42], [110, -51], [110, -185], [96, -185]],
//         image: null,
//         offset: [0, 0],
//         flip: flip
//     })];
// },
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
