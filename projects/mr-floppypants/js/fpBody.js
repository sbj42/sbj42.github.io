var p2 = require('p2');
var fpWorld = require('./fpWorld');

function fpBody(param) {
    var mass = param.mass || 0;
    this._body = new p2.Body({
        mass: mass,
        position: param.position.slice(),
        angle: (param.flip ? -param.angle : param.angle) * Math.PI / 180
    });
    var offset = param.offset.slice() || [0, 0];
    if (param.polygon) {
        var polygon = param.polygon;
        if (param.flip)
            polygon = polygon.map(function(coord) {
                return [-coord[0], coord[1]];
            });
        this._body.fromPolygon(polygon.slice());
        offset[0] += this._body.position[0] - param.position[0];
        offset[1] += this._body.position[1] - param.position[1];
    } else if (param.circle) {
        this._body.position[0] += param.circle[0];
        this._body.position[1] += param.circle[1];
        offset[0] += param.circle[0];
        offset[1] += param.circle[1];
        this._body.addShape(new p2.Circle({radius: param.circle[2]}));
    }
    var collisionGroup = param.collisionGroup || (mass == 0 ? fpWorld.GROUP_GROUND : fpWorld.GROUP_OTHER);
    var collisionMask;
    if (collisionGroup == fpWorld.GROUP_OTHER)
        collisionMask = ~0;
    else
        collisionMask = ~collisionGroup;
    this._body.shapes.forEach(function(s) {
        s.material = param.material || fpWorld.STANDARD_MATERIAL;
        s.collisionGroup = collisionGroup;
        s.collisionMask = collisionMask;
    });
    this._images = [null, null, null];
    if (param.image)
        this._images[mass == 0 ? 0 : 1] = param.image;
    else if (param.images) {
        this._images[1] = param.images[0];
        this._images[2] = param.images[1];
    }
    this._offset = offset;
    this._flip = param.flip;
}

fpBody.prototype.body = function () {
    return this._body;
};

fpBody.prototype.position = function () {
    return this._body.interpolatedPosition.slice();
};

fpBody.prototype.angle = function () {
    return this._body.interpolatedAngle;
};

fpBody.prototype.flip = function () {
    return this._flip;
};

fpBody.prototype.images = function () {
    return this._images;
};

fpBody.prototype.offset = function () {
    return this._offset.slice();
};

module.exports = fpBody;
