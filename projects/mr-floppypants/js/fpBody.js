var p2 = require('p2');
var fpWorld = require('./fpWorld');

function fpBody(param) {
    var mass = param.mass || 0;
    var offset = param.offset ? param.offset.slice() : [0, 0];
    var angle = param.angle || 0;
    var flip = param.flip || false;
    if (param.polygon || param.circle) {
        this._body = new p2.Body({
            mass: mass,
            position: param.position.slice()
        });
        if (param.polygon) {
            var polygon = param.polygon.map(function(coord) {
                return [coord[0] - offset[0], coord[1] - offset[1]];
            });
            if (flip)
                polygon = polygon.map(function(coord) {
                    return [-coord[0], coord[1]];
                });
            this._body.fromPolygon(polygon.slice());
            if (flip) {
                offset[0] -= this._body.position[0] - param.position[0];
            } else {
                offset[0] += this._body.position[0] - param.position[0];
            }
            offset[1] += this._body.position[1] - param.position[1];
        } else if (param.circle) {
            this._body.position[0] += param.circle[0];
            this._body.position[1] += param.circle[1];
            offset[0] += param.circle[0];
            offset[1] += param.circle[1];
            this._body.addShape(new p2.Circle({radius: param.circle[2]}));
        }
        this._body.angle = angle * Math.PI / 180;
        var diff = [this._body.position[0] - param.position[0], this._body.position[1] - param.position[1]];
        p2.vec2.rotate(diff, diff, angle * Math.PI / 180);
        this._body.position = [param.position[0] + diff[0], param.position[1] + diff[1]];
        var collisionGroup = param.collisionGroup || (mass == 0 ? fpWorld.GROUP_GROUND : fpWorld.GROUP_OTHER);
        var collisionMask;
        if (collisionGroup == fpWorld.GROUP_OTHER)
            collisionMask = ~fpWorld.GROUP_BACKGROUND;
        else if (collisionGroup == fpWorld.GROUP_BACKGROUND)
            collisionMask = 0;
        else
            collisionMask = ~(collisionGroup | fpWorld.GROUP_BACKGROUND);
        this._body.shapes.forEach(function(s) {
            s.material = param.material || fpWorld.STANDARD_MATERIAL;
            s.collisionGroup = collisionGroup;
            s.collisionMask = collisionMask;
        });
        this._body.fpDensity = param.density;
    } else {
        this._position = param.position;
        this._angle = param.angle;
    }
    this._images = [null, null, null];
    if (param.image)
        this._images[mass == 0 ? 0 : 1] = param.image;
    else if (param.images && param.images.length == 2) {
        this._images[1] = param.images[0];
        this._images[2] = param.images[1];
    } else if (param.images) {
        this._images = param.images;
    }
    this._offset = offset;
    this._flip = flip;
    if (param.more)
        param.more(this, param.position);
}

fpBody.prototype.body = function () {
    return this._body;
};

fpBody.prototype.position = function () {
    if (this._body)
        return this._body.interpolatedPosition.slice();
    else
        return this._position;
};

fpBody.prototype.angle = function () {
    if (this._body)
        return this._body.interpolatedAngle;
    else
        return this._angle;
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
