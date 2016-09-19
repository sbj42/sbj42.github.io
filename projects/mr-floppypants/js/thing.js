var p2 = require('p2');
var constants = require('./constants');

function Thing(body, image, offx, offy, flip) {
    this._body = body;
    if (image == null)
        this._image = this._image2 = null;
    else if (image.nodeType == 1)
        this._image = image;
    else {
        this._image = image[0];
        this._image2 = image[1];
    }
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

Thing.prototype.offx = function () {
    return this._offx;
};

Thing.prototype.offy = function () {
    return this._offy;
};

Thing.prototype.a = function () {
    return this._body.angle;
};

Thing.prototype.flip = function () {
    return this._flip;
};

Thing.prototype.image = function () {
    return this._image;
};

Thing.prototype.image2 = function () {
    return this._image2;
};

var standardMaterial = new p2.Material();
var bouncyMaterial = new p2.Material();

function setup(world) {
    world.addContactMaterial(new p2.ContactMaterial(standardMaterial, standardMaterial, {
        friction: 5,
        restitution: 0.1
    }));
    world.addContactMaterial(new p2.ContactMaterial(standardMaterial, bouncyMaterial, {
        friction: 10,
        restitution: 0.75
    }));
    world.addContactMaterial(new p2.ContactMaterial(bouncyMaterial, bouncyMaterial, {
        friction: 10,
        restitution: 0.85
    }));
}

function createThing(world, param) {
    param.mass = param.mass || 0;
    var bod = new p2.Body({
        mass: param.mass,
        position: param.position,
        angle: param.angle
    });
    if (param.polygon) {
        var polygon = param.polygon.map(function(coord) {
            if (param.flip)
                return [-coord[0], coord[1]];
            return coord;
        });
        bod.fromPolygon(polygon);
    } else if (param.circle) {
        bod.addShape(new p2.Circle({radius: param.circle[0]}));
    }
    if (param.mass == 0) {
        bod.shapes.forEach(function(s) {
            s.material = param.material || standardMaterial;
            s.collisionGroup = constants.GROUP_GROUND;
            s.collisionMask = constants.GROUP_OTHER | constants.GROUP_ME;
        });
    } else {
        bod.shapes.forEach(function(s) {
            s.material = param.material || standardMaterial;
            s.collisionGroup = constants.GROUP_OTHER;
            s.collisionMask = constants.GROUP_OTHER | constants.GROUP_ME | constants.GROUP_GROUND;
        });
    }
    world.addBody(bod);
    var img = new Image();
    if (!param.image)
        img = null;
    else if (typeof param.image == 'string')
        img.src = require('../png/' + param.image + '.png');
    else {
        img = [img, new Image()];
        if (param.image[0])
            img[0].src = require('../png/' + param.image[0] + '.png');
        else
            img[0] = null;
        img[1].src = require('../png/' + param.image[1] + '.png');
    }
    return new Thing(bod, img, param.offset[0], param.offset[1], param.flip);
}

function join(world, thingA, thingB, param) {
    var joi = new p2.RevoluteConstraint(thingA.body(), thingB.body(), {
        worldPivot: param.pivot
    });
    joi.setLimits(param.limits[0], param.limits[1]);
    world.addConstraint(joi);
    return joi;
}

module.exports = {
    Thing: Thing,
    setup: setup,
    standardMaterial: standardMaterial,
    bouncyMaterial: bouncyMaterial,
    createThing: createThing,
    join: join
};
