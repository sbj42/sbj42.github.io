var fpWorld = require('../../fpWorld');
var fpUtil = require('../../fpUtil');
var p2 = require('p2');
var fpThingSetup = require('../fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpCar = function(position) {
    var mass = 10;
    var imagedir = 'car/';

    var body = thingFunc({
        mass: mass * 40,
        polygon: [[5, -50], [11, -52], [13, -72], [76, -78], [84, -92], [92, -88], [89, -75],
            [106, -36], [212, -36], [197, -72], [204, -86], [198, -95],
            [208, -96], [232, -72], [311, -53], [311, -20], [5, -20]].map(function(p) { return [p[0]*1.5, p[1]*1.5]; }),
        images: [imagedir + 'car1', imagedir + 'car2'],
        offset: [0, 150]
    })(position);

    var wheel1pos = [position[0] + 110, position[1] - 38];
    var wheel1 = thingFunc({
        mass: mass * 5,
        circle: [0, 0, 37],
        image: imagedir + 'wheel',
        offset: [38, 38]
    })(wheel1pos);
    var wheel1con = new p2.RevoluteConstraint(body.body(), wheel1.body(), {
        worldPivot: wheel1pos,
        collideConnected: false
    });
    fpWorld.world().addConstraint(wheel1con);
    var wheel1motor = new p2.RevoluteConstraint(body.body(), wheel1.body(), {
        worldPivot: wheel1pos,
        collideConnected: false,
        maxForce: 2
    });
    fpWorld.world().addConstraint(wheel1motor);
    wheel1motor.enableMotor();
    wheel1motor.setMotorSpeed(0);

    var wheel2pos = [position[0] + 392, position[1] - 38];
    var wheel2 = thingFunc({
        mass: mass * 5,
        circle: [0, 0, 37],
        image: imagedir + 'wheel',
        offset: [38, 38]
    })(wheel2pos);
    var wheel2con = new p2.RevoluteConstraint(body.body(), wheel2.body(), {
        worldPivot: wheel2pos,
        collideConnected: false,
    });
    fpWorld.world().addConstraint(wheel2con);
    var wheel2motor = new p2.RevoluteConstraint(body.body(), wheel2.body(), {
        worldPivot: wheel2pos,
        collideConnected: false,
        maxForce: 2
    });
    fpWorld.world().addConstraint(wheel2motor);
    wheel2motor.enableMotor();
    wheel2motor.setMotorSpeed(0);

    fpUtil.addEventListener(body.body(), 'grab', function(handBody) {
        var where = [];
        body.body().toLocalFrame(where, handBody.position);
        if (where[0] < 0) {
            wheel1motor.setMotorSpeed(7);
            wheel2motor.setMotorSpeed(7);
        } else {
            wheel1motor.setMotorSpeed(-14);
            wheel2motor.setMotorSpeed(-14);
        }
    });
    fpUtil.addEventListener(body.body(), 'release', function(handBody) {
        wheel1motor.setMotorSpeed(0);
        wheel2motor.setMotorSpeed(0);
    });

    return [body, wheel1, wheel2];
};

module.exports = fpCar;
