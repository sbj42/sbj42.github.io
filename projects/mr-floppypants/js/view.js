function View(param) {
    this._elem = document.createElement('canvas');
    this._ctx = this._elem.getContext('2d', {alpha: false});
    this._elem.width = document.body.clientWidth;
    this._elem.height = document.body.clientHeight;
    document.body.appendChild(this._elem);
    window.addEventListener('load', this._onResize.bind(this));
    window.addEventListener('resize', this._onResize.bind(this));
    this._cx = 0;
    this._cy = 0;
    this._zoom = 1;
    this._elem.addEventListener('mousedown', this._onMouseDown.bind(this));
    document.addEventListener('mousemove', this._onMouseMove.bind(this), true);
    document.addEventListener('mouseup', this._onMouseUp.bind(this), true);
    this._elem.addEventListener('mouseout', this._onMouseOut.bind(this));
    this._param = param;
}

View.prototype.width = function () {
    return this._elem.width;
};

View.prototype.height = function () {
    return this._elem.height;
};

View.prototype.context = function () {
    return this._ctx;
};

View.prototype.cx = function (v) {
    if (v != null)
        this._cx = v;
    else
        return this._cx;
};

View.prototype.cy = function (v) {
    if (v != null)
        this._cy = v;
    else
        return this._cy;
};

View.prototype.zoom = function (v) {
    if (v != null)
        this._zoom = v;
    else
        return this._zoom;
};

View.prototype.vxToCx = function(x) {
    return this.width() / 2 + (x - this.cx()) * this.zoom();
};

View.prototype.vyToCy = function(y) {
    return this.height() * 2 / 3 + (y -this.cy()) * this.zoom();
};

View.prototype.cxToVx = function(x) {
    return (x - this.width() / 2) / this.zoom() + this.cx();
};

View.prototype.cyToVy = function(y) {
    return (y - this.height() * 2 / 3) / this.zoom() + this.cy();
};

View.prototype._onResize = function () {
    this._elem.width = document.body.clientWidth;
    this._elem.height = document.body.clientHeight;
};

View.prototype.clear = function(color, rect) {
    var ctx = this.context();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.width(), this.height());
};

View.prototype.renderImage = function(image, x, y, flip, a) {
    var ctx = this.context();
    ctx.save();
    ctx.translate(this.vxToCx(x), this.vyToCy(y));
    ctx.rotate(a);
    ctx.scale(this.zoom(), this.zoom());
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
};

View.prototype.render = function(thing) {
    if (!thing.image())
        return;
    var ctx = this.context();
    ctx.save();
    ctx.translate(this.vxToCx(thing.x()), this.vyToCy(thing.y()));
    ctx.rotate(thing.a());
    ctx.scale(this.zoom(), this.zoom());
    if (thing.flip()) ctx.scale(-1, 1);
    ctx.drawImage(thing.image(), -thing.offx(), -thing.offy());
    ctx.restore();
};

View.prototype.render2 = function(thing) {
    if (!thing.image2())
        return;
    var ctx = this.context();
    ctx.save();
    ctx.translate(this.vxToCx(thing.x()), this.vyToCy(thing.y()));
    ctx.rotate(thing.a());
    ctx.scale(this.zoom(), this.zoom());
    if (thing.flip()) ctx.scale(-1, 1);
    ctx.drawImage(thing.image2(), -thing.offx(), -thing.offy());
    ctx.restore();
};

View.prototype.mousePosition = function () {
    if (this._mx == null)
        return null;
    return [this.cxToVx(this._mx), this.cyToVy(this._my)];
};

View.prototype._onMouseDown = function (event) {
    this._mouseDown = true;
    this._mx = Math.max(0, Math.min(this.width(), event.clientX));
    this._my = Math.max(0, Math.min(this.height(), event.clientY));
    //event.target.setCapture();
    this._param.onMouseDown(event, this.mousePosition());
};

View.prototype._onMouseMove = function (event) {
    this._mx = Math.max(0, Math.min(this.width(), event.clientX));
    this._my = Math.max(0, Math.min(this.height(), event.clientY));
    this._param.onMouseMove(event, this.mousePosition());
};

View.prototype._onMouseUp = function (event) {
    if (this._mouseDown) {
        this._param.onMouseUp(event);
        this._mouseDown = false;
    }
};

View.prototype._onMouseOut = function (event) {
    //this._mx = this._my = null;
};

module.exports = {
    View: View
};
