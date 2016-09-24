var fpUtil = require('./fpUtil');

function fpActor(param) {
    this._bodies = param.bodies;
    this._head = param.head;
    this._hands = param.hands;

    var self = this;
    param.painPoints.forEach(function(body) {
        fpUtil.addEventListener(body.body(), 'contact', function(otherBody) {
            var rx = Math.abs(body.body().velocity[0] - otherBody.velocity[0]);
            var ry = Math.abs(body.body().velocity[1] - otherBody.velocity[1]);
            fpUtil.fireEvent(self, 'pain', [rx*rx + ry*ry]);
        });
    });
}

fpActor.prototype.bodies = function () {
    return this._bodies;
};

fpActor.prototype.head = function () {
    return this._head;
};

fpActor.prototype.hands = function () {
    return this._hands;
};

module.exports = fpActor;
