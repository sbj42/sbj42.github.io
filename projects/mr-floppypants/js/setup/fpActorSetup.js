var fpWorld = require('../fpWorld');
var fpBody = require('../fpBody');
var p2 = require('p2');

var fpActorSetup = {
};

fpActorSetup.getBodyFunc = function(position0, collisionGroup) {
    return function(param) {
        var nparam = {};
        for (var x in param)
            nparam[x] = param[x];
        nparam.offset = param.offset || [0, 0];
        nparam.position[0] += position0[0];
        nparam.position[1] += position0[1];
        nparam.collisionGroup = collisionGroup;
        return new fpBody(nparam);
    };
};

fpActorSetup.joinFunc = function(position0) {
    return function(body1, body2, position, param) {
        var constraint = new p2.RevoluteConstraint(body1.body(), body2.body(), {
            worldPivot: [position0[0] + position[0], position0[1] + position[1]]
        });
        if (param.limits)
            constraint.setLimits(param.limits[0] * Math.PI / 180, param.limits[1] * Math.PI / 180);
        fpWorld.world().addConstraint(constraint);
        return constraint;
    };
};

module.exports = fpActorSetup;
