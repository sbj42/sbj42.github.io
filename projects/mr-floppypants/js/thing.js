function Thing(body, image, offx, offy, flip) {
    this._body = body;
    this._image = image;
    this._offx = offx;
    this._offy = offy;
    this._flip = flip;
}

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

module.exports = {
    Thing: Thing
};
