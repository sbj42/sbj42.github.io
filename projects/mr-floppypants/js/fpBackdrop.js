// Mr. Floppypants Backdrop

function fpBackdrop(param) {
    this._polypolygon = param.polypolygon || [param.polygon];
    this._fill = param.fill;
}

fpBackdrop.prototype.polypolygon = function() {
    return this._polypolygon;
};

fpBackdrop.prototype.fill = function() {
    return this._fill;
};

fpBackdrop.prototype.addPolygon = function(polygon) {
    this._polypolygon.push(polygon);
};

module.exports = fpBackdrop;
