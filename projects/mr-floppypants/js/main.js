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
var houseWindows = [];
var houseRect = {x1: -1275, y1: -450, x2: 1125, y2: 1200};
function housePath() {
    var ctx = theView.context();
    ctx.beginPath();
    ctx.moveTo(theView.vxToCx(houseRect.x1), theView.vyToCy(houseRect.y1));
    ctx.lineTo(theView.vxToCx(houseRect.x2), theView.vyToCy(houseRect.y1));
    ctx.lineTo(theView.vxToCx(houseRect.x2), theView.vyToCy(houseRect.y2));
    ctx.lineTo(theView.vxToCx(houseRect.x1), theView.vyToCy(houseRect.y2));
    ctx.lineTo(theView.vxToCx(houseRect.x1), theView.vyToCy(houseRect.y1));
    houseWindows.forEach(function(w) {
        ctx.moveTo(theView.vxToCx(w.x1), theView.vyToCy(w.y1));
        ctx.lineTo(theView.vxToCx(w.x2), theView.vyToCy(w.y1));
        ctx.lineTo(theView.vxToCx(w.x2), theView.vyToCy(w.y2));
        ctx.lineTo(theView.vxToCx(w.x1), theView.vyToCy(w.y2));
        ctx.lineTo(theView.vxToCx(w.x1), theView.vyToCy(w.y1));
    });
}

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
things = things.concat(world.createWall5(theWorld, 1100, 375));
things = things.concat(world.createWall3(theWorld, 1100, -75));
things = things.concat(world.createBed(theWorld, -150, 75));
things = things.concat(world.createPillow(theWorld, -135, 1));
things = things.concat(world.createBall(theWorld, -200, 50));
things = things.concat(world.createBathtub(theWorld, -1000, 75));
things = things.concat(world.createSink(theWorld, -1250, 75));
houseWindows.push({x1: -750, y1: -300, x2: -650, y2: -100});
houseWindows.push({x1: -350, y1: -300, x2: -250, y2: -100});
houseWindows.push({x1: 550, y1: -300, x2: 650, y2: -100});

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
houseWindows.push({x1: -750, y1: 250, x2: -650, y2: 450});
houseWindows.push({x1: -350, y1: 250, x2: -250, y2: 450});
houseWindows.push({x1: 150, y1: 250, x2: 250, y2: 450});

things = things.concat(world.createWall5(theWorld, -1300, 675));
things = things.concat(world.createWall3(theWorld, -1300, 925));
things = things.concat(world.createFloor1(theWorld, -1300, 1175));
things = things.concat(world.createStairs(theWorld, -698, 1175, true));
things = things.concat(world.createFloor4(theWorld, -700, 1175));
things = things.concat(world.createFloor1(theWorld, -500, 1175));
things = things.concat(world.createFloor15(theWorld, -450, 1175));
things = things.concat(world.createFloor1(theWorld, 300, 1175));
things = things.concat(world.createFloor15(theWorld, 350, 1175));
things = things.concat(world.createFloor1(theWorld, 1100, 1175));
things = things.concat(world.createFloor1(theWorld, 1100, 625));
things = things.concat(world.createWall5(theWorld, 1100, 675));

things = things.concat(world.createGrass(theWorld, -3300, 1200));
things = things.concat(world.createGrass(theWorld, -2800, 1200));
things = things.concat(world.createGrass(theWorld, -2300, 1200));
things = things.concat(world.createGrass(theWorld, -1800, 1200));

things = things.concat(world.createGrass(theWorld, 1150, 1200));
things = things.concat(world.createGrass(theWorld, 1650, 1200));
things = things.concat(world.createGrass(theWorld, 2150, 1200));
things = things.concat(world.createGrass(theWorld, 2650, 1200));

things = things.concat(world.createStairs(theWorld, -698, 1675, true));


var myThings = me.createMe(theWorld, -1400, 1000);
theView.cy(1000);
theView.cx(-1400);
myBodies = myThings.map(function(thing) { return thing.body(); });
things = things.concat(myThings);

// To animate the bodies, we must step the world forward in time, using a fixed time step size.
// The World will run substeps and interpolate automatically for us, to get smooth animation.
var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
var lastTime;

var skyBg = theView.context().createLinearGradient(0, 0, 0, theView.height());
skyBg.addColorStop(0, '#abd1f9');
skyBg.addColorStop(1, '#71ace8');
var houseBg = theView.context().createLinearGradient(theView.width() / 3, 0, theView.width() * 2 / 3, theView.height());
houseBg.addColorStop(0, '#e0f4ca');
houseBg.addColorStop(1, '#a9cb84');
var sunImage = new Image();
sunImage.src = require('../png/sun.png');
var windowImage = new Image();
windowImage.src = require('../png/window.png');

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
    var ctx = theView.context();
    theView.clear(skyBg);
    ctx.drawImage(sunImage, theView.width() / 5, theView.height() / 5);
    ctx.fillStyle = houseBg;
    housePath(ctx);
    ctx.fill("evenodd");
    houseWindows.forEach(function(w) {
        theView.renderImage(windowImage, w.x1 - 10, w.y1 - 10);
    });
    var groundBg = theView.context().createLinearGradient(0, theView.vyToCy(1200), 0, theView.vyToCy(6200));
    groundBg.addColorStop(0, '#8a4425');
    groundBg.addColorStop(1, '#421a09');
    ctx.fillStyle = groundBg;
    ctx.fillRect(0, theView.vyToCy(1200), theView.width(), theView.vyToCy(11200));
    things.forEach(function(t) { theView.render(t); });
    things.forEach(function(t) { theView.render2(t); });

    lastTime = time;
}

// Start the animation loop
requestAnimationFrame(animate);
