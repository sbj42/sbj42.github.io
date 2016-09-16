require('../css/main.css');
var p2 = require('p2');
var view = require('./view');
var constants = require('./constants');
var me = require('./me');
var world = require('./world');

var theWorld = new p2.World({
    gravity:[0, constants.GRAVITY]
    //gravity:[0, 3]
});
require('./thing').setup(theWorld);

var nullBody = new p2.Body();
var dragConstraint = null;

var myBodies;

function tryHit(position) {
    var result = theWorld.hitTest(position, myBodies, 5);
    var body = null;
    for (var i = 0; i < result.length; i ++) {
        if (result[i].type != p2.Body.STATIC)
            body = result[i];
    }
    if (body) {
        theWorld.addBody(nullBody);
        dragConstraint = new p2.RevoluteConstraint(nullBody, body, {
            worldPivot: position
        });
        dragConstraint.setStiffness(1000);
        theWorld.addConstraint(dragConstraint);
    }
}

function onMouseDown(event, position) {
    if (event.button == 0) {
        tryHit(position);
    }
}

function onMouseMove(event, position) {
    if (dragConstraint) {
        // setDragSpring(position);
        // p2.vec2.copy(dragBody.position, position);
        p2.vec2.copy(dragConstraint.pivotA, position);
        dragConstraint.bodyA.wakeUp();
        dragConstraint.bodyB.wakeUp();
    } else if (event.buttons == 1) {
        tryHit(position);
    }
}

function onMouseUp(event) {
    if (dragConstraint) {
        theWorld.removeConstraint(dragConstraint);
        dragConstraint = null;
        theWorld.removeBody(nullBody);
    }
}

var theView = new view.View({
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp
});

var things = [];

var houseRect = {x: -1275, y: -450, w: 1300+1100, h: 475+1175};
things = things.concat(world.createFloor1(theWorld, -1300, -475));
things = things.concat(world.createWall5(theWorld, -1300, -425));
things = things.concat(world.createFloor15(theWorld, -1250, -475));
things = things.concat(world.createFloor1(theWorld, -500, -475));
things = things.concat(world.createWall5(theWorld, -500, -425));
things = things.concat(world.createFloor15(theWorld, -450, -475));
things = things.concat(world.createFloor1(theWorld, 300, -475));
things = things.concat(world.createWall5(theWorld, 300, -425));
things = things.concat(world.createFloor15(theWorld, 350, -475));
things = things.concat(world.createFloor1(theWorld, 1100, -475));
things = things.concat(world.createWall5(theWorld, 1100, -425));

things = things.concat(world.createFloor1(theWorld, -1300, 75));
things = things.concat(world.createWall5(theWorld, -1300, 125));
things = things.concat(world.createWall3(theWorld, -1300, -75));
things = things.concat(world.createFloor15(theWorld, -1250, 75));
things = things.concat(world.createFloor1(theWorld, -500, 75));
things = things.concat(world.createWall5(theWorld, -500, 125));
things = things.concat(world.createFloor15(theWorld, -450, 75));
things = things.concat(world.createFloor1(theWorld, 300, 75));
things = things.concat(world.createWall5(theWorld, 300, 125));
things = things.concat(world.createFloor9(theWorld, 350, 75));
things = things.concat(world.createFloor1(theWorld, 1100, 75));
things = things.concat(world.createWall5(theWorld, 1100, 125));
things = things.concat(world.createWall3(theWorld, 1100, -75));
things = things.concat(world.createBed(theWorld, -150, 75));
things = things.concat(world.createPillow(theWorld, -135, 1));
things = things.concat(world.createBall(theWorld, -200, 50));
things = things.concat(world.createBathtub(theWorld, -1000, 75));

things = things.concat(world.createFloor1(theWorld, -1300, 625));
things = things.concat(world.createWall3(theWorld, -1300, 475));
things = things.concat(world.createFloor9(theWorld, -900, 625));
things = things.concat(world.createFloor15(theWorld, -450, 625));
things = things.concat(world.createFloor1(theWorld, 300, 625));
things = things.concat(world.createFloor4(theWorld, 350, 625));
things = things.concat(world.createStairs(theWorld, 550, 625));
things = things.concat(world.createTable(theWorld, -150, 617));
things = things.concat(world.createPlate(theWorld, -150, 520));
things = things.concat(world.createGlass(theWorld, -100, 520));
things = things.concat(world.createPlate(theWorld, 0, 520));
things = things.concat(world.createGlass(theWorld, -10, 520));
things = things.concat(world.createChair(theWorld, -140, 625, true));
things = things.concat(world.createChair(theWorld, 40, 625));

things = things.concat(world.createStairs(theWorld, -700, 1175, true));


var myThings = me.createMe(theWorld, 0, 0);
//theView.cy(500);
myBodies = myThings.map(function(thing) { return thing.body(); });
things = things.concat(myThings);

// To animate the bodies, we must step the world forward in time, using a fixed time step size.
// The World will run substeps and interpolate automatically for us, to get smooth animation.
var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
var lastTime;

var houseBg = theView.context().createLinearGradient(houseRect.x, houseRect.y, houseRect.x + houseRect.w, houseRect.y + houseRect.h);
houseBg.addColorStop(0, '#e0f4ca');
houseBg.addColorStop(1, '#cceaac');

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
    theView.clear(houseBg, houseRect);
    things.forEach(function(t) { theView.render(t); });
    things.forEach(function(t) { theView.render2(t); });

    lastTime = time;
}

// Start the animation loop
requestAnimationFrame(animate);
