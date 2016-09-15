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
    this._elem.addEventListener('mousedown', this._onMouseDown.bind(this));
    this._elem.addEventListener('mousemove', this._onMouseMove.bind(this));
    this._elem.addEventListener('mouseup', this._onMouseUp.bind(this));
    this._elem.addEventListener('mouseout', this._onMouseOut.bind(this));
    this._param = param;
}

View.prototype.width = function () {
    return this._elem.width;
};

View.prototype.height = function () {
    return this._elem.height;
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

View.prototype._onResize = function () {
    this._elem.width = document.body.clientWidth;
    this._elem.height = document.body.clientHeight;
};

View.prototype.clear = function(color) {
    var ctx = this._ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.width(), this.height());
};

View.prototype.render = function(thing) {
    var ctx = this._ctx;
    ctx.save();
    ctx.translate(this.width() / 2 - this._cx + thing.x(), this.height() * 2 / 3 - this._cy + thing.y());
    ctx.rotate(thing.a());
    thing._render(ctx);
    ctx.restore();
};

View.prototype.mousePosition = function () {
    if (this._mx == null)
        return null;
    var x = this._mx + this._cx - this.width() / 2;
    var y = this._my + this._cy - this.height() * 2 / 3;
    return [x, y];
};

View.prototype._onMouseDown = function (event) {
    this._mx = event.clientX;
    this._my = event.clientY;
    this._param.onMouseDown(this.mousePosition());
};

View.prototype._onMouseMove = function (event) {
    this._mx = event.clientX;
    this._my = event.clientY;
    this._param.onMouseMove(this.mousePosition());
};

View.prototype._onMouseUp = function (event) {
    this._param.onMouseUp();
};

View.prototype._onMouseOut = function (event) {
    this._mx = this._my = null;
};

module.exports = {
    View: View
};
