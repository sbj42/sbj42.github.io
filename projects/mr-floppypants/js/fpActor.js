var fpUtil = require('./fpUtil');
var fpWorld = require('./fpWorld');
var p2 = require('p2');

function fpActor(param) {
    this._bodies = param.bodies;
    this._head = param.head;
    this._hands = param.hands;
    this._holding = this._hands.map(function() { return null; });

    param.painPoints.forEach(function(body) {
        fpUtil.addEventListener(body.body(), 'contact', function(otherBody) {
            var rx = Math.abs(body.body().velocity[0] - otherBody.velocity[0]);
            var ry = Math.abs(body.body().velocity[1] - otherBody.velocity[1]);
            fpUtil.fireEvent(this, 'pain', [rx*rx + ry*ry]);
        }.bind(this));
    }.bind(this));
    this._hands.forEach(function(body, handIndex) {
        fpUtil.addEventListener(body.body(), 'contact', function(otherBody) {
            if (!this._dragBody || body !== this._dragBody)
                return;
            if (this._holding[handIndex] != null)
                return;
            if (otherBody.type == p2.Body.STATIC)
                return;
            var constraint = new p2.LockConstraint(body.body(), otherBody);
            constraint.setRelaxation(1);
            this._holding[handIndex] = {
                constraint: constraint
            };
            fpWorld.world().addConstraint(constraint);
            fpUtil.fireEvent(otherBody, 'grab', [body.body()]);
        }.bind(this));
    }.bind(this));
}

fpActor.prototype.bodies = function () {
    return this._bodies;
};

fpActor.prototype.head = function () {
    return this._head;
};

fpActor.prototype.startDrag = function (dragBody) {
    this._dragBody = dragBody;
    this._hands.forEach(function(body, handIndex) {
        if (body === dragBody && this._holding[handIndex]) {
            this._releasing = handIndex;
        }
    }.bind(this));
};

fpActor.prototype.endDrag = function () {
    if (this._releasing != null) {
        var constraint = this._holding[this._releasing].constraint;
        fpUtil.fireEvent(constraint.bodyB, 'release', [constraint.bodyA]);
        fpWorld.world().removeConstraint(constraint);
        this._holding[this._releasing] = null;
        this._releasing = null;
    }
    this._dragBody = null;
};

module.exports = fpActor;
