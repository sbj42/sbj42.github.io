require('../css/main.css');
var p2 = require('p2');
var view = require('./view');
var constants = require('./constants');
var me = require('./me');
var world = require('./world');

var theWorld = new p2.World({
    gravity:[0, constants.GRAVITY]
});

var dragBody = new p2.Body();
var dragConstraint = null;
//var dragPan = null;

var theView = new view.View({
    onMouseDown: function(position) {
        var result = theWorld.hitTest(position, theWorld.bodies, 3);
        var body = null;
        for (var i = 0; i < result.length; i ++) {
            if (result[i].type != p2.Body.STATIC)
                body = result[i];
        }
        if (body) {
            body.wakeUp();
            theWorld.addBody(dragBody);
            dragConstraint = new p2.RevoluteConstraint(dragBody, body, {
                worldPivot: position
            });
            theWorld.addConstraint(dragConstraint);
        } else {
            //dragPan = {last: position};
        }
    },
    onMouseMove: function(position) {
        if (dragConstraint) {
            p2.vec2.copy(dragConstraint.pivotA, position);
            dragConstraint.bodyA.wakeUp();
            dragConstraint.bodyB.wakeUp();
        }
        // if (dragPan) {
        //     var dx = position[0] - dragPan.last[0];
        //     var dy = position[1] - dragPan.last[1];
        // }
    },
    onMouseUp: function(position) {
        theWorld.removeConstraint(dragConstraint);
        dragConstraint = null;
        theWorld.removeBody(dragBody);
    }
});

var things = [];
for (var x = -250; x <= 250; x += 50) {
    things = things.concat(world.createRedBlock(theWorld, x, 100));
}

var stThings = world.createStairs(theWorld, 300, 100);
things = things.concat(stThings);

var myThings = me.createMe(theWorld, 0, 0);
things = things.concat(myThings);

// To animate the bodies, we must step the world forward in time, using a fixed time step size.
// The World will run substeps and interpolate automatically for us, to get smooth animation.
var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
var lastTime;

// Animation loop
function animate(time){
    requestAnimationFrame(animate);

    // Compute elapsed time since last render frame
    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;

    // Move bodies forward in time
    theWorld.step(fixedTimeStep, deltaTime, maxSubSteps);

    if (!dragConstraint) {
        var position = myThings[0].body().position;
        theView.cx((theView.cx() * (constants.CATCH_UP - 1) + position[0]) / constants.CATCH_UP);
        theView.cy((theView.cy() * (constants.CATCH_UP - 1) + position[1]) / constants.CATCH_UP);
    }
    // Render the circle at the current interpolated position
    //console.info(circleBody.position[0], circleBody.position[1]);
    theView.clear('#eee');
    things.forEach(function(t) { theView.render(t); });

    lastTime = time;
}

// Start the animation loop
requestAnimationFrame(animate);
