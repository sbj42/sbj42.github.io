var fpWorld = require('../fpWorld');
var fpBody = require('../fpBody');
var p2 = require('p2');

var fpThingSetup = {
};

fpThingSetup.thingFunc = function(param) {
    return function(position, flip, angle) {
        var nparam = {
        };
        for (var x in param)
            nparam[x] = param[x];
        nparam.offset = param.offset || [0, 0];
        nparam.position = position;
        nparam.flip = flip;
        nparam.angle = angle;
        var body = new fpBody(nparam);
        fpWorld.addBody(body);
        if (body.body())
            body.body().sleep();
        return body;
    };
};

fpThingSetup.lock = function(body1, body2) {
    var constraint = new p2.LockConstraint(body1.body(), body2.body());
    fpWorld.world().addConstraint(constraint);
    return constraint;
};

module.exports = fpThingSetup;
