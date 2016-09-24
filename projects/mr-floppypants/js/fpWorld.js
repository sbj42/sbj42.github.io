// Mr. Floppypants World

var p2 = require('p2');
var fpUtil = require('./fpUtil');

var fpWorld = {

    LEFT:   -5000,
    RIGHT:   5000,
    GROUND:     0,
    TOP:    -4000,
    BOTTOM:  5000,

    STANDARD_MATERIAL: new p2.Material(),
    BOUNCY_MATERIAL: new p2.Material(),

    GROUP_GROUND: 1,
    GROUP_OTHER: 2,

    NULL_BODY: new p2.Body()

};

var GROUP_MAX = 2;

var GRAVITY = 600;
// GRAVITY =  3; // for testing in slow-mo

var world = new p2.World({
    gravity: [0, GRAVITY]
});

world.addBody(fpWorld.NULL_BODY);

var acm = function(m1, m2, f, r) {
    world.addContactMaterial(new p2.ContactMaterial(m1, m2, {
        friction: f,
        restitution: r
    }));
};
acm(fpWorld.STANDARD_MATERIAL, fpWorld.STANDARD_MATERIAL,  5, 0.1 );
acm(fpWorld.BOUNCY_MATERIAL,   fpWorld.STANDARD_MATERIAL, 10, 0.75);
acm(fpWorld.BOUNCY_MATERIAL,   fpWorld.BOUNCY_MATERIAL,   10, 0.85);

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

// var dragBody = null;
// var dragReleasing = false;
// var dragConstraint = null;
// var grabConstraint = null;
//
// var myBodies;
//
// function tryHit(position) {
//     dragBody = fpWorld.simpleHitTest(position, myBodies);
//     if (dragBody) {
//         dragConstraint = new p2.RevoluteConstraint(fpWorld.NULL_BODY, dragBody, {
//             worldPivot: position
//         });
//         dragConstraint.setStiffness(1000);
//         fpWorld.world().addConstraint(dragConstraint);
//     }
// }
//
// function onMouseDown(event, position) {
//     if (event.button == 0) {
//         tryHit(position);
//     }
// }
//
// function onMouseMove(event, position) {
//     if (dragConstraint) {
//         // setDragSpring(position);
//         // p2.vec2.copy(dragBody.position, position);
//         p2.vec2.copy(dragConstraint.pivotA, position);
//         dragConstraint.bodyA.wakeUp();
//         dragConstraint.bodyB.wakeUp();
//     } else if (event.buttons == 1) {
//         tryHit(position);
//     }
// }
//
// function onMouseUp(event) {
//     if (dragConstraint) {
//         if (dragReleasing) {
//             theWorld.removeConstraint(grabConstraint);
//             grabConstraint = null;
//             dragReleasing = false;
//         }
//         theWorld.removeConstraint(dragConstraint);
//         dragConstraint = null;
//         dragBody = null;
//     }
// }

module.exports = fpWorld;
