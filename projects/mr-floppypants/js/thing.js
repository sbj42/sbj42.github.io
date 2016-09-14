var p2 = require('p2');
var constants = require('./constants');

function Thing(body, image, offx, offy, flip) {
    this._body = body;
    this._image = image;
    this._offx = offx;
    this._offy = offy;
    this._flip = flip;
}

Thing.prototype.body = function () {
    return this._body;
};

Thing.prototype.x = function () {
    return this._body.position[0];
};

Thing.prototype.y = function () {
    return this._body.position[1];
};

Thing.prototype.a = function () {
    return this._body.angle;
};

Thing.prototype._render = function(ctx) {
    if (this._flip) ctx.scale(-1, 1);
    ctx.drawImage(this._image, -this._offx, -this._offy);
};

function createThing(world, param) {
    param.mass = param.mass || 0;
    var bod = new p2.Body({
        mass: param.mass,
        position: param.position
    });
    var polygon = param.polygon.map(function(coord) {
        if (param.flip)
            return [-coord[0], coord[1]];
        return coord;
    });
    bod.fromPolygon(polygon);
    if (param.mass == 0) {
        bod.shapes.forEach(function(s) {
            s.collisionGroup = constants.GROUP_GROUND;
            s.collisionMask = constants.GROUP_OTHER | constants.GROUP_ME;
        });
    } else {
        bod.shapes.forEach(function(s) {
            s.collisionGroup = constants.GROUP_OTHER;
            s.collisionMask = constants.GROUP_OTHER | constants.GROUP_ME | constants.GROUP_GROUND;
        });
    }
    world.addBody(bod);
    var img = new Image();
    img.src = require('../png/' + param.image + '.png');
    return new Thing(bod, img, param.offset[0], param.offset[1], param.flip);
}

function join(world, thingA, thingB, param) {
    var joi = new p2.RevoluteConstraint(thingA.body(), thingB.body(), {
        worldPivot: param.pivot
    });
    joi.setLimits(param.limits[0], param.limits[1]);
    world.addConstraint(joi);
}

module.exports = {
    Thing: Thing,
    createThing: createThing,
    join: join
};
