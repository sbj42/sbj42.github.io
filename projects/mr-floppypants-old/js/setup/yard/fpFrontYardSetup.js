var fpWorld = require('../../fpWorld');
var fpYardThings = require('./fpYardThings');
var fpCar = require('../car/fpCar');
var fpThings = require('../fpThings');
var p2 = require('p2');

function fpFrontYardSetup(position, groundBackdrop) {

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
    fpThings.grass(pos([3500, 0]), false, -11.5);
    fpThings.grass(pos([3990, -100]), false, -11.5);
    fpThings.grass(pos([4460, -200]), false, 11.5);
    fpThings.grass(pos([4960, -100]), false, -11.5);
    fpThings.grass(pos([5440, -200]), false, -23);
    fpThings.grass(pos([5900, -394]));
    fpThings.grass(pos([6395, -394]), false, 23);
    fpThings.grass(pos([6850, -200]), false, 23);

    groundBackdrop.addPolygon(
        [pos([3500, 0]), pos([4460, -200]), pos([4960, -100]), pos([5440, -200]), pos([5900, -390]), pos([6360, -390]), pos([7320, 0])]
    );

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
    [rope1, rope2, rope3].forEach(function(r) { r.body().allowSleep = false; });

    fpCar(pos([1500, 0]));

    fpThings.tree1(pos([2650, 0]));

    var places = {
        'frontyard-tree': pos([650, -200]),
        'frontyard-car': pos([1450, -200]),
        'frontyard-hill': pos([3450, -200])
    };
    for (var x in places) {
        fpWorld.places[x] = places[x];
    }
}

module.exports = fpFrontYardSetup;
