var fpWorld = require('../fpWorld');
var fpBody = require('../fpBody');

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

module.exports = fpThingSetup;
