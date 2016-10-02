var p2 = require('p2');
var fpUtil = require('./fpUtil');

var fpWorld = {

    LEFT:   -5000,
    RIGHT:   5000,
    GROUND:     0,
    TOP:    -4000,
    BOTTOM:  3000,

    STANDARD_MATERIAL: new p2.Material(),
    BOUNCY_MATERIAL: new p2.Material(),

    GROUP_GROUND: 1,
    GROUP_OTHER: 2,
    GROUP_BACKGROUND: 4,

    NULL_BODY: new p2.Body()

};

var GROUP_MAX = 4;

var GRAVITY = 600;

var world = new p2.World({
    gravity: [0, GRAVITY]
});
world.solver.iterations = 60;

world.addBody(fpWorld.NULL_BODY);

var acm = function(m1, m2, f, r, rx) {
    world.addContactMaterial(new p2.ContactMaterial(m1, m2, {
        friction: f,
        restitution: r,
        relaxation: rx
    }));
};
acm(fpWorld.STANDARD_MATERIAL, fpWorld.STANDARD_MATERIAL,  5, 0.1 );
acm(fpWorld.BOUNCY_MATERIAL,   fpWorld.STANDARD_MATERIAL,  7, 0.65, 8);
acm(fpWorld.BOUNCY_MATERIAL,   fpWorld.BOUNCY_MATERIAL,    7, 0.75, 8);

world.on('beginContact', function(event) {
    if (fpUtil.hasEvent(event.bodyA, 'contact'))
        fpUtil.fireEvent(event.bodyA, 'contact', [event.bodyB, event.bodyA]);
    if (fpUtil.hasEvent(event.bodyB, 'contact'))
        fpUtil.fireEvent(event.bodyB, 'contact', [event.bodyA, event.bodyB]);
});

fpWorld.world = function() {
    return world;
};

fpWorld.hitTest = function(position, bodies) {
    var hits = world.hitTest(position, bodies.map(function(body) { return body.body();}), 5);
    if (hits.length) {
        var hit = hits[hits.length - 1];
        for (var i = 0; i < bodies.length; i ++) {
            if (bodies[i].body() === hit)
                return bodies[i];
        }
    }
    return null;
};

var backdrops = [];

fpWorld.addBackdrop = function(backdrop) {
    backdrops.push(backdrop);
    return this;
};

fpWorld.backdrops = function() {
    return backdrops;
};

var nextCollisionGroup = GROUP_MAX;

fpWorld.newCollisionGroup = function() {
    nextCollisionGroup *= 2;
    return nextCollisionGroup;
};

var bodies = [];

fpWorld.addBody = function(body) {
    if (body.body())
        this.world().addBody(body.body());
    bodies.push(body);
    return this;
};

fpWorld.bodies = function() {
    return bodies;
};

var actors = [];

fpWorld.addActor = function(actor) {
    actor.bodies().forEach(function(body) {
        this.world().addBody(body.body());
    }.bind(this));
    actors.push(actor);
    return this;
};

fpWorld.actors = function() {
    return actors;
};

var currentActor = null;

fpWorld.currentActor = function(actor) {
    if (actor)
        currentActor = actor;
    else
        return currentActor;
};

fpWorld.places = {};

module.exports = fpWorld;
