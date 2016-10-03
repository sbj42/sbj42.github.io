var fpWorld = require('../../fpWorld');
var fpUtil = require('../../fpUtil');
var p2 = require('p2');
var fpThingSetup = require('../fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpCar = function(position) {
    var mass = 3;
    var imagedir = 'car/';

    var body = thingFunc({
        mass: mass * 40,
        polygon: [[7.5,75],[16.5,72],[19.5,42],[114,33],[126,12],[138,18],[133.5,37.5],[159,81],[318,81],[295.5,42]
            ,[306,21],[297,7.5],[312,6],[348,42],[466.5,70.5],[466.5,105],[7.5,105]],
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
    wheel1con.enableMotor();
    wheel1con.setMotorSpeed(0);

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
    wheel2con.enableMotor();
    wheel2con.setMotorSpeed(0);

    fpUtil.addEventListener(body.body(), 'grab', function(handBody) {
        var where = [];
        body.body().toLocalFrame(where, handBody.position);
        if (where[0] < 0) {
            wheel1con.setMotorSpeed(12);
            wheel2con.setMotorSpeed(12);
        } else {
            wheel1con.setMotorSpeed(-20);
            wheel2con.setMotorSpeed(-20);
        }
    });
    fpUtil.addEventListener(body.body(), 'release', function(handBody) {
        wheel1con.setMotorSpeed(0);
        wheel2con.setMotorSpeed(0);
    });

    return [body, wheel1, wheel2];
};

module.exports = fpCar;
