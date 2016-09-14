var p2 = require('p2');
var thing = require('./thing');
var constants = require('./constants');

function createThing(world, param) {
    var bod = new p2.Body({
        mass: param.mass,
        position: param.position
    });
    bod.fromPolygon(param.polygon, {skipSimpleCheck: true});
    bod.shapes.forEach(function(s) {
        s.collisionGroup = constants.GROUP_ME;
        s.collisionMask = constants.GROUP_OTHER | constants.GROUP_GROUND;
    });
    world.addBody(bod);
    var img = new Image();
    img.src = require('../png/' + param.image + '.png');
    return new thing.Thing(bod, img, param.offset[0], param.offset[1], param.flip);
}

function join(world, bodyA, bodyB, param) {
    var joi = new p2.RevoluteConstraint(bodyA, bodyB, {
        worldPivot: param.pivot
    });
    joi.setLimits(param.limits[0], param.limits[1]);
    world.addConstraint(joi);
}

module.exports = {
    createMe: function(world, offx, offy) {
        var myHead = createThing(world, {
            mass: 5,
            position: [offx + 0, offy + -200],
            polygon: [[0, -28], [18, -22], [21, 0], [8, 28], [-7, 28], [-20, 0], [-13, -22]],
            image: 'head',
            offset: [24, 32]
        });

        var myShirtMid = createThing(world, {
            mass: 15,
            position: [offx + 0, offy + -141],
            polygon: [[-22, -29], [23, -29], [23, 23], [-22, 23]],
            image: 'shirt-middle',
            offset: [30, 31]
        });

        join(world, myHead.body(), myShirtMid.body(), {
            pivot: [offx + 0, offy + -172],
            limits: [-Math.PI / 6, Math.PI / 6]
        });

        var myArmLeftUpper = createThing(world, {
            mass: 4,
            position: [offx + -37, offy + -156],
            polygon: [[9, -12], [15, -3], [-9, 12], [-15, 3]],
            image: 'arm-left-upper',
            offset: [16, 18]
        });

        join(world, myShirtMid.body(), myArmLeftUpper.body(), {
            pivot: [offx + -22, offy + -165],
            limits: [-Math.PI / 4, Math.PI / 2.5]
        });

        var myArmRightUpper = createThing(world, {
            mass: 4,
            position: [offx + 37, offy + -156],
            polygon: [[-9, -12], [-15, -3], [9, 12], [15, 3]],
            image: 'arm-left-upper',
            offset: [16, 18],
            flip: true
        });

        join(world, myShirtMid.body(), myArmRightUpper.body(), {
            pivot: [offx + 22, offy + -165],
            limits: [-Math.PI / 2.5, Math.PI / 4]
        });

        var myArmLeftLower = createThing(world, {
            mass: 3,
            position: [offx + -59, offy + -140],
            polygon: [[8, -13], [13, -5], [-8, 13], [-13, 5]],
            image: 'arm-left-lower',
            offset: [16, 16]
        });

        join(world, myArmLeftUpper.body(), myArmLeftLower.body(), {
            pivot: [offx + -48, offy + -148],
            limits: [-Math.PI / 16, Math.PI / 8]
        });

        var myArmRightLower = createThing(world, {
            mass: 3,
            position: [offx + 59, offy + -140],
            polygon: [[-8, -13], [-13, -5], [8, 13], [13, 5]],
            image: 'arm-left-lower',
            offset: [16, 16],
            flip: true
        });

        join(world, myArmRightUpper.body(), myArmRightLower.body(), {
            pivot: [offx + 48, offy + -148],
            limits: [-Math.PI / 8, Math.PI / 16]
        });

        var myHandLeft = createThing(world, {
            mass: 1,
            position: [offx + -77, offy + -128],
            polygon: [[-1, -8], [8, 2], [1, 9], [-8, 0]],
            image: 'hand-left',
            offset: [13, 12]
        });

        join(world, myArmLeftLower.body(), myHandLeft.body(), {
            pivot: [offx + -71, offy + -131],
            limits: [-Math.PI / 6, Math.PI / 6]
        });

        var myHandRight = createThing(world, {
            mass: 1,
            position: [offx + 77, offy + -128],
            polygon: [[1, -8], [-8, 2], [-1, 9], [8, 0]],
            image: 'hand-left',
            offset: [13, 12],
            flip: true
        });

        join(world, myArmRightLower.body(), myHandRight.body(), {
            pivot: [offx + 71, offy + -131],
            limits: [-Math.PI / 6, Math.PI / 6]
        });

        var myPantsTop = createThing(world, {
            mass: 10,
            position: [offx + 0, offy + -104],
            polygon: [[-21, -14], [21, -14], [21, 14], [-21, 14]],
            image: 'pants-top',
            offset: [26, 18]
        });

        join(world, myShirtMid.body(), myPantsTop.body(), {
            pivot: [offx + 0, offy + -110],
            limits: [-Math.PI / 8, Math.PI / 8]
        });

        var myPantsLeftUpper = createThing(world, {
            mass: 4,
            position: [offx + -18, offy + -75],
            polygon: [[-6, -18], [10, -15], [5, 20], [-9, 17]],
            image: 'pants-left-upper',
            offset: [11, 21]
        });

        join(world, myPantsTop.body(), myPantsLeftUpper.body(), {
            pivot: [offx + -15, offy + -92],
            limits: [-Math.PI / 8, Math.PI / 6]
        });

        var myPantsRightUpper = createThing(world, {
            mass: 4,
            position: [offx + 18, offy + -75],
            polygon: [[6, -18], [-10, -15], [-5, 20], [9, 17]],
            image: 'pants-left-upper',
            offset: [11, 21],
            flip: true
        });

        join(world, myPantsTop.body(), myPantsRightUpper.body(), {
            pivot: [offx + 15, offy + -92],
            limits: [-Math.PI / 6, Math.PI / 8]
        });

        var myPantsLeftLower = createThing(world, {
            mass: 3,
            position: [offx + -21, offy + -35],
            polygon: [[-6, -22], [8, -20], [8, 19], [-9, 18]],
            image: 'pants-left-lower',
            offset: [16, 24]
        });

        join(world, myPantsLeftUpper.body(), myPantsLeftLower.body(), {
            pivot: [offx + -20, offy + -56],
            limits: [-Math.PI / 8, Math.PI / 8]
        });

        var myPantsRightLower = createThing(world, {
            mass: 3,
            position: [offx + 21, offy + -35],
            polygon: [[6, -22], [-8, -20], [-8, 19], [9, 18]],
            image: 'pants-left-lower',
            offset: [16, 24],
            flip: true
        });

        join(world, myPantsRightUpper.body(), myPantsRightLower.body(), {
            pivot: [offx + 20, offy + -56],
            limits: [-Math.PI / 8, Math.PI / 8]
        });

        var myShoeLeft = createThing(world, {
            mass: 1,
            position: [offx + -31, offy + -12],
            polygon: [[0, -7], [15, -6], [15, 6], [-18, 6], [-14, 0]],
            image: 'shoe-left',
            offset: [21, 10]
        });

        join(world, myPantsLeftLower.body(), myShoeLeft.body(), {
            pivot: [offx + -23, offy + -18],
            limits: [-Math.PI / 8, Math.PI / 8]
        });

        var myShoeRight = createThing(world, {
            mass: 1,
            position: [offx + 31, offy + -12],
            polygon: [[0, -7], [-15, -6], [-15, 6], [18, 6], [14, 0]],
            image: 'shoe-left',
            offset: [21, 10],
            flip: true
        });

        join(world, myPantsRightLower.body(), myShoeRight.body(), {
            pivot: [offx + 23, offy + -18],
            limits: [-Math.PI / 8, Math.PI / 8]
        });

        return [
            myPantsTop,
            myShoeLeft,
            myShoeRight,
            myPantsLeftUpper,
            myPantsRightUpper,
            myPantsLeftLower,
            myPantsRightLower,
            myShirtMid,
            myHandLeft,
            myHandRight,
            myArmLeftUpper,
            myArmRightUpper,
            myArmLeftLower,
            myArmRightLower,
            myHead
        ];
    }
};
