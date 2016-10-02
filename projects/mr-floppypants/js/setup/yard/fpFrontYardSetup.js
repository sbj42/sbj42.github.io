var fpWorld = require('../../fpWorld');
var fpYardThings = require('./fpYardThings');
var fpCar = require('../car/fpCar');
var fpThings = require('../fpThings');
var p2 = require('p2');

function fpFrontYardSetup(position) {

    function pos(offset) {
        return [position[0] + offset[0], position[1]  + offset[1]];
    }

    function addThing(thing, offset, flip, angle) {
        return fpYardThings[thing](pos(offset), flip, angle);
    }

    function join(body1, body2, position, param) {
        var constraint = new p2.RevoluteConstraint(body1.body(), body2.body(), {
            worldPivot: pos(position)
        });
        if (param && param.limits)
            constraint.setLimits(param.limits[0] * Math.PI / 180, param.limits[1] * Math.PI / 180);
        fpWorld.world().addConstraint(constraint);
        return constraint;
    }

    // right yard

    fpThings.grass(pos([0, 0]));
    fpThings.grass(pos([500, 0]));
    fpThings.grass(pos([1000, 0]));
    fpThings.grass(pos([1500, 0]));
    fpThings.grass(pos([2000, 0]));
    fpThings.grass(pos([2500, 0]));
    fpThings.grass(pos([3000, 0]));

    var tree1 = fpThings.tree1(pos([650, 0]));
    var tire = addThing('tire', [850, -230]);
    var rope1 = addThing('rope', [850, -430]);
    join(tire[0], rope1, [850, -230], {
        limits: [-45, 45]
    });
    var rope2 = addThing('rope', [850, -630]);
    join(rope1, rope2, [850, -430], {
        limits: [-45, 45]
    });
    var rope3 = addThing('rope', [850, -830]);
    join(rope2, rope3, [850, -630], {
        limits: [-45, 45]
    });
    join(rope3, tree1[1], [850, -830]);

    fpCar(pos([1000, 0]));

}

module.exports = fpFrontYardSetup;
