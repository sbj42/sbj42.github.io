var fpWorld = require('../../fpWorld');
var fpActor = require('../../fpActor');
var fpUtil = require('../../fpUtil');
var fpActorSetup = require('../fpActorSetup');

var getBodyFunc = fpActorSetup.getBodyFunc;
var joinFunc = fpActorSetup.joinFunc;

var fpMrFloppypants = function(position) {
    position = [position[0] - 24, position[1] - 33];
    var collisionGroup = fpWorld.newCollisionGroup();
    var getBody = getBodyFunc(position, collisionGroup);
    var join = joinFunc(position);
    var mass = 0.5;
    var imagedir = 'mr-floppypants/';

    var head = getBody({
        position: [0, 0],
        polygon: [[2, 33], [10, 12], [24, 5], [40, 12], [46, 33], [34, 57], [15, 57]],
        image: imagedir + 'head',
        mass: 4 * mass
    });

    var chest = getBody({
        position: [-5, 59],
        polygon: [[8, 2], [53, 2], [53, 58], [8, 58]],
        image: imagedir + 'shirt-middle',
        mass: 15 * mass,
        density: 0.9
    });
    join(head, chest, [24, 55], {
        limits: [-30, 30]
    });

    var armL1 = getBody({
        position: [-31, 60],
        polygon: [[28, 3], [31, 13], [7, 28], [2, 21]],
        image: imagedir + 'arm-left-upper',
        mass: 4 * mass
    });
    join(chest, armL1, [2, 67], {
        limits: [-45, 75]
    });

    var armR1 = getBody({
        position: [80, 60],
        polygon: [[28, 3], [31, 13], [7, 28], [2, 21]],
        image: imagedir + 'arm-left-upper',
        flip: true,
        mass: 4 * mass
    });
    join(chest, armR1, [51, 67], {
        limits: [-75, 45]
    });

    var armL2 = getBody({
        position: [-55, 79],
        polygon: [[25, 3], [29, 10], [7, 27], [3, 22]],
        image: imagedir + 'arm-left-lower',
        mass: 3 * mass
    });
    join(armL1, armL2, [-24, 83], {
        limits: [-20, 45]
    });

    var armR2 = getBody({
        position: [104, 79],
        polygon: [[25, 3], [29, 10], [7, 27], [3, 22]],
        image: imagedir + 'arm-left-lower',
        flip: true,
        mass: 3 * mass
    });
    join(armR1, armR2, [77, 83], {
        limits: [-45, 20]
    });

    var handL = getBody({
        position: [-70, 96],
        polygon: [[11, 3], [21, 14], [10, 25], [1, 15]],
        image: imagedir + 'hand-left',
        mass: 3 * mass
    });
    join(armL2, handL, [-50, 105], {
        limits: [-30, 30]
    });

    var handR = getBody({
        position: [119, 96],
        polygon: [[11, 3], [21, 14], [10, 25], [1, 15]],
        image: imagedir + 'hand-left',
        flip: true,
        mass: 3 * mass
    });
    join(armR2, handR, [99, 105], {
        limits: [-30, 30]
    });

    var seat = getBody({
        position: [0, 115],
        polygon: [[9, 2], [42, 2], [50, 29], [3, 29]],
        image: imagedir + 'pants-top',
        mass: 10 * mass
    });
    join(chest, seat, [24, 114], {
        limits: [-25, 25]
    });

    var legL1 = getBody({
        position: [-3, 140],
        polygon: [[6, 2], [21, 5], [16, 40], [2, 37]],
        image: imagedir + 'pants-left-upper',
        mass: 4 * mass
    });
    join(seat, legL1, [9, 145], {
        limits: [-30, 30]
    });

    var legR1 = getBody({
        position: [56, 140],
        polygon: [[6, 2], [21, 5], [16, 40], [2, 37]],
        image: imagedir + 'pants-left-upper',
        flip: true,
        mass: 4 * mass
    });
    join(seat, legR1, [39, 145], {
        limits: [-30, 30]
    });

    var legL2 = getBody({
        position: [-11, 176],
        polygon: [[10, 2], [24, 4], [24, 41], [8, 40]],
        image: imagedir + 'pants-left-lower',
        mass: 4 * mass,
        density: 1.4
    });
    join(legL1, legL2, [5, 180], {
        limits: [-25, 25]
    });

    var legR2 = getBody({
        position: [64, 176],
        polygon: [[10, 2], [24, 4], [24, 41], [8, 40]],
        image: imagedir + 'pants-left-lower',
        flip: true,
        mass: 4 * mass,
        density: 1.4
    });
    join(legR1, legR2, [43, 180], {
        limits: [-25, 25]
    });

    var footL = getBody({
        position: [-20, 214],
        polygon: [[21, 3], [35, 4], [36, 15], [3, 15], [5, 10]],
        image: imagedir + 'shoe-left',
        mass: 1 * mass,
        density: 1.5
    });
    join(legL2, footL, [2, 218], {
        limits: [-25, 25]
    });

    var footR = getBody({
        position: [73, 214],
        polygon: [[21, 3], [35, 4], [36, 15], [3, 15], [5, 10]],
        image: imagedir + 'shoe-left',
        flip: true,
        mass: 1 * mass,
        density: 1.5
    });
    join(legR2, footR, [46, 218], {
        limits: [-25, 25]
    });

    var painTimer = null;

    var actor = new fpActor({
        bodies: [seat, legL1, legR1, footL, footR, legL2, legR2, chest, head, armL1, armR1, armL2, armR2, handL, handR],
        head: head,
        hands: [handL, handR],
        painPoints: [head, handL, handR, footL, footR]
    });
    fpUtil.addEventListener(actor, 'pain', function(pain) {
        if (pain > 900*900) {
            clearTimeout(painTimer);
            head.images()[1] = imagedir + 'head-ouch';
            painTimer = setTimeout(function() {
                head.images()[1] = imagedir + 'head';
            }, 1500);
        }
    });
    fpWorld.addActor(actor);
    return actor;
};

module.exports = fpMrFloppypants;
