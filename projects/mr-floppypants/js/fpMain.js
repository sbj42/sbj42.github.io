require('../css/main.css');

var fpWorld = require('./fpWorld');
var fpView = require('./fpView');
var fpContext = require('./fpContext');
var fpWorldRender = require('./fpWorldRender');
var fpUtil = require('./fpUtil');
var p2 = require('p2');


var dragBody = null;
var dragConstraint = null;

function tryHit(position) {
    fpWorld.actors().forEach(function(actor) {
        if (dragBody)
            return;
        dragBody = fpWorld.hitTest(position, actor.bodies());
        fpWorld.currentActor(actor);
    });
    if (dragBody) {
        fpWorld.currentActor().startDrag(dragBody);
        dragConstraint = new p2.RevoluteConstraint(fpWorld.NULL_BODY, dragBody.body(), {
            worldPivot: position
        });
        dragConstraint.setStiffness(10000);
        fpWorld.world().addConstraint(dragConstraint);
    }
}

fpUtil.addEventListener(fpView, 'mousedown', function(event) {
    if (event.button == 0) {
        tryHit(fpView.mousePosition());
    }
});

fpUtil.addEventListener(fpView, 'mousemove', function(event) {
    if (dragConstraint) {
        // setDragSpring(position);
        // p2.vec2.copy(dragBody.position, position);
        p2.vec2.copy(dragConstraint.pivotA, fpView.mousePosition());
        dragConstraint.bodyA.wakeUp();
        dragConstraint.bodyB.wakeUp();
    } else if (event.buttons == 1) {
        tryHit(fpView.mousePosition());
    }
});

fpUtil.addEventListener(fpView, 'mouseup', function(event) {
    if (dragConstraint) {
        fpWorld.world().removeConstraint(dragConstraint);
        dragConstraint = null;
        dragBody = null;
        fpWorld.currentActor().endDrag();
    }
});

// To animate the bodies, we must step the world forward in time, using a fixed time step size.
// The World will run substeps and interpolate automatically for us, to get smooth animation.
var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
var lastTime;

var context = fpView.context();

require('./setup/fpWorldSetup');

//fpView.position([900, -2600]);

function animate(time) {
    requestAnimationFrame(animate);

    if (time - lastTime > 500)
        lastTime = time - 500;
    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
    fpWorld.world().step(fixedTimeStep, deltaTime, maxSubSteps);

    if (!dragConstraint && fpWorld.currentActor()) {
        fpView.moveToward(fpWorld.currentActor().head().body().position.slice());
    }

    fpWorldRender();

    fpContext.setTransform(context);
    var mouse = fpView.screenMousePosition();
    if (mouse) {
        fpContext.image(context, 'cursor-' + (fpView.mouseIsDown() ? 'grabbing' : 'grab'), {
            position: mouse,
            offset: [8, 10]
        });
    }

    lastTime = time;
}

requestAnimationFrame(animate);
