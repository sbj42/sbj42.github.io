var fpWorld = require('../../fpWorld');
var p2 = require('p2');
var fpThingSetup = require('../fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpCaveThings = {
};

var imagedir = 'cave/';

var N_EDGE = [
    [0, 50], [0, 0], [600, 0], [600, 50],
    [579, 56], [523, 52], [504, 42], [370, 54], [296, 46], [216, 55], [179, 46], [140, 58], [47, 42]
];
var S_EDGE = [
    [600, 550], [600, 600], [0, 600], [0, 550],
    [41, 547], [78, 554], [169, 539], [260, 554], [306, 549], [402, 560], [503, 544], [550, 554]
];
var WS_TURN = [
    [0, 0], [600, 0], [600, 600], [550, 600],
    [556, 539], [546, 494], [549, 432], [556, 409], [559, 331], [516, 284], [467, 180], [433, 158],
    [402, 97], [338, 71], [277, 67], [215, 45], [188, 51], [133, 51], [91, 58]
];
var NW_CORNER = [
    [50, 0], [54, 24], [0, 50], [0, 0]
];
var NE_CORNER = [
    [550, 0], [600, 0], [600, 50], [566, 56], [544, 20]
];
var SW_CORNER = [
    [0, 550], [34, 545], [54, 579], [50, 600], [0, 600]
];
var SE_CORNER = [
    [550, 600], [545, 575], [600, 550], [600, 600]
];
var NES_END = [
    [42, 44], [69, 60], [121, 57], [142, 38], [335, 62], [366, 86], [500, 124], [538, 247],
    [542, 342], [516, 418], [445, 520], [392, 556], [344, 543], [292, 554], [147, 552], [78, 542], [44, 553],
    [0, 550], [0, 600], [600, 600], [600, 0], [0, 0], [0, 50]
];

fpCaveThings.caveWS = function(pos, flip, angle) {
    pos = [pos[0] + 300, pos[1] + 300];
    var offset = [300, 300];
    thingFunc({
        polygon: WS_TURN,
        image: imagedir + 'cave-ws',
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: SW_CORNER,
        offset: offset
    })(pos, flip, angle);
};
fpCaveThings.caveWE = function(pos, flip, angle) {
    pos = [pos[0] + 300, pos[1] + 300];
    var offset = [300, 300];
    thingFunc({
        polygon: N_EDGE,
        image: imagedir + 'cave-we',
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: S_EDGE,
        offset: offset
    })(pos, flip, angle);
};
fpCaveThings.caveWSE = function(pos, flip, angle) {
    pos = [pos[0] + 300, pos[1] + 300];
    var offset = [300, 300];
    thingFunc({
        polygon: N_EDGE,
        image: imagedir + 'cave-wse',
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: SW_CORNER,
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: SE_CORNER,
        offset: offset
    })(pos, flip, angle);
};
fpCaveThings.caveWSEN = function(pos, flip, angle) {
    pos = [pos[0] + 300, pos[1] + 300];
    var offset = [300, 300];
    thingFunc({
        polygon: NW_CORNER,
        image: imagedir + 'cave-wsen',
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: NE_CORNER,
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: SW_CORNER,
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: SE_CORNER,
        offset: offset
    })(pos, flip, angle);
};
fpCaveThings.caveW = function(pos, flip, angle) {
    pos = [pos[0] + 300, pos[1] + 300];
    var offset = [300, 300];
    thingFunc({
        polygon: NES_END,
        image: imagedir + 'cave-w',
        offset: offset
    })(pos, flip, angle);
};

var PLANS = {
    '0000': null,
    '0001': ['W'],
    '0010': ['W', 270],
    '0100': ['W', 180],
    '1000': ['W', 90],
    '0011': ['WS'],
    '0110': ['WS', 270],
    '1100': ['WS', 180],
    '1001': ['WS', 90],
    '0101': ['WE'],
    '1010': ['WE', 90],
    '0111': ['WSE'],
    '1110': ['WSE', 270],
    '1101': ['WSE', 180],
    '1011': ['WSE', 90],
    '1111': ['WSEN']
};

fpCaveThings.cave = function(pos, nesw) {
    var plan = PLANS[nesw.map(function(f) { return f ? '1' : '0'; }).join('')];
    if (plan)
        fpCaveThings['cave'+plan[0]](pos, plan[2] || false, plan[1] || 0);
};

fpCaveThings.rock1 = function(pos, flip, angle) {
    pos = [pos[0] + 50, pos[1] + 50];
    return thingFunc({
        mass: 50,
        density: 3,
        polygon: [
            [19, 12], [37, 6], [62, 11], [78, 25], [93, 29], [87, 67], [91, 85],
            [85, 95], [38, 85], [18, 94], [7, 84], [10, 62], [6, 43], [16, 30]
        ],
        image: imagedir + 'rock1',
        offset: [50, 50]
    })(pos, flip, angle);
};

fpCaveThings.cavepool = function(pos) {
    pos = [pos[0] + 300, pos[1] + 300];
    var offset = [300, 300];
    thingFunc({
        images: [null, null, null, imagedir + 'cavepool'],
        offset: offset
    })(pos);

    var waterAABB = new p2.AABB({
        lowerBound: [pos[0] - 300, pos[1] - 300 + 80],
        upperBound: [pos[0] + 300, pos[1] + 300]
    });

    var shapePosition = [0,0];
    var centerOfBouyancy = [0,0];
    var viscousForce = [0,0];
    var shapeAngle = 0;
    var c = 0.8; // viscosity
    var v = [0,0];
    var aabb = new p2.AABB();

    fpWorld.world().on('postStep', function() {
        fpWorld.world().bodies.forEach(function(body) {
            if (body.type == p2.Body.STATIC)
                return;
            if (body.sleepState == p2.Body.SLEEPING)
                return;
            body.shapes.forEach(function(shape) {
                // Get shape world transform
                body.vectorToWorldFrame(shapePosition, shape.position);
                p2.vec2.add(shapePosition, shapePosition, body.position);
                shapeAngle = shape.angle + body.angle;

                // Get shape AABB
                shape.computeAABB(aabb, shapePosition, shapeAngle);
                if (!aabb.overlaps(waterAABB))
                    return;

                // var areaUnderWater;
                if(aabb.lowerBound[1] > waterAABB.lowerBound[1]){
                    // Fully submerged
                    p2.vec2.copy(centerOfBouyancy,shapePosition);
                    // areaUnderWater = shape.area;
                } else if(aabb.upperBound[1] > waterAABB.lowerBound[1]){
                    // Partially submerged
                    var width = aabb.upperBound[0] - aabb.lowerBound[0];
                    var height = waterAABB.lowerBound[1] - aabb.upperBound[1];
                    // areaUnderWater = width * height;
                    p2.vec2.set(centerOfBouyancy, aabb.lowerBound[0] + width / 2, aabb.lowerBound[1] + height / 2);
                } else {
                    return;
                }

                // // Compute lift force
                // p2.vec2.subtract(liftForce, waterAABB.lowerBound, centerOfBouyancy);
                // p2.vec2.scale(liftForce, liftForce, areaUnderWater * k);
                // liftForce[0] = 0;
                var liftForce = [0, -fpWorld.GRAVITY * 1.15 * body.mass / body.shapes.length / (body.fpDensity || 1)];

                // Make center of bouycancy relative to the body
                p2.vec2.subtract(centerOfBouyancy, centerOfBouyancy, body.position);

                // Viscous force
                body.getVelocityAtPoint(v, centerOfBouyancy);
                p2.vec2.scale(viscousForce, v, -c * body.mass / body.shapes.length);

                // // Apply forces
                body.applyForce(viscousForce, centerOfBouyancy);
                body.applyForce(liftForce, centerOfBouyancy);
            });
        });
    });
};

module.exports = fpCaveThings;
