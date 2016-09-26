require('../css/main.css');
var p2 = require('p2');
var view = require('./view');
var constants = require('./constants');
var me = require('./me');
var world = require('./world');

var fpWorld = require('./fpWorld');

var dragBody = null;
var dragReleasing = false;
var dragConstraint = null;
var grabConstraint = null;

function onGrab(other) {
    if (dragConstraint && !grabConstraint && other && other.type != p2.Body.STATIC) {
        grabConstraint = new p2.LockConstraint(event.bodyA, event.bodyB);
        fpWorld.theWorld.addConstraint(grabConstraint);
    }
}

fpWorld.addCotactListener()
theWorld.on('beginContact', function(event) {
    if (!grabConstraint) {
        var other = null;
        myThings.hands.forEach(function(t) {
            if (event.bodyA == dragBody && event.bodyA == t.body())
                other = event.bodyB;
            else if (event.bodyB == dragBody && event.bodyB == t.body())
                other = event.bodyA;
        });
        if (!grabConstraint && other && other.type != p2.Body.STATIC) {
            grabConstraint = new p2.LockConstraint(event.bodyA, event.bodyB);
            theWorld.addConstraint(grabConstraint);
        }
    }
});

var myBodies;

function tryHit(position) {
    dragBody = fpWorld.theWorld.simpleHitTest(position, myBodies);
    if (dragBody) {
        myThings.hands.forEach(function(t) {
            if (t.body() == dragBody && grabConstraint)
                dragReleasing = true;
        });
        dragConstraint = new p2.RevoluteConstraint(fpWorld.nullBody, dragBody, {
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
        if (dragReleasing) {
            theWorld.removeConstraint(grabConstraint);
            grabConstraint = null;
            dragReleasing = false;
        }
        theWorld.removeConstraint(dragConstraint);
        dragConstraint = null;
        dragBody = null;
    }
}

var theView = new view.View({
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp
});

var things = [];
var houseWindows = [];
// var houseRect = {x1: -1275, y1: -450, x2: 1125, y2: 1200};
// function housePath() {
//     var ctx = theView.context();
//     ctx.beginPath();
//     ctx.moveTo(theView.vxToCx(houseRect.x1), theView.vyToCy(houseRect.y1));
//     ctx.lineTo(theView.vxToCx(houseRect.x2), theView.vyToCy(houseRect.y1));
//     ctx.lineTo(theView.vxToCx(houseRect.x2), theView.vyToCy(houseRect.y2));
//     ctx.lineTo(theView.vxToCx(houseRect.x1), theView.vyToCy(houseRect.y2));
//     ctx.lineTo(theView.vxToCx(houseRect.x1), theView.vyToCy(houseRect.y1));
//     houseWindows.forEach(function(w) {
//         ctx.moveTo(theView.vxToCx(w.x1), theView.vyToCy(w.y1));
//         ctx.lineTo(theView.vxToCx(w.x2), theView.vyToCy(w.y1));
//         ctx.lineTo(theView.vxToCx(w.x2), theView.vyToCy(w.y2));
//         ctx.lineTo(theView.vxToCx(w.x1), theView.vyToCy(w.y2));
//         ctx.lineTo(theView.vxToCx(w.x1), theView.vyToCy(w.y1));
//     });
// }
// function atticPath() {
//     var ctx = theView.context();
//     ctx.beginPath();
//     var dx = (200 + houseRect.x2 - houseRect.x1)/2;
//     ctx.moveTo(theView.vxToCx(houseRect.x1 - 100), theView.vyToCy(houseRect.y1));
//     ctx.lineTo(theView.vxToCx(houseRect.x1 - 100 + dx), theView.vyToCy(houseRect.y1 - dx/2));
//     ctx.lineTo(theView.vxToCx(houseRect.x2 + 100), theView.vyToCy(houseRect.y1));
//     ctx.lineTo(theView.vxToCx(houseRect.x1), theView.vyToCy(houseRect.y1));
// }

for (var i = 0; i < 13; i ++) {
    things = things.concat(world.createRoof(theWorld, -1375 + i * 100, -450 - i * 50));
    if (i != 6)
        things = things.concat(world.createRoof(theWorld, 1225 - i * 100, -450 - i * 50, true));
    else
        things = things.concat(world.createChimney(theWorld, 1225 - i * 100, -450 - i * 50, true));
}

things = things.concat(world.createFloor1(theWorld, -1300, -475));
things = things.concat(world.createWall5(theWorld, -1300, -425));
things = things.concat(world.createFloor4(theWorld, -1250, -475));
things = things.concat(world.createFloor1(theWorld, -1050, -475));
var hatch = world.createHatch(theWorld, -989, -450);
hatch[0].body().gravityScale = 0;
var joi = new p2.RevoluteConstraint(nullBody, hatch[0].body(), {
    worldPivot: [-989, -450]
});
joi.setLimits(0, Math.PI / 4);
theWorld.addConstraint(joi);
things = things.concat(hatch);
things = things.concat(world.createFloor1(theWorld, -750, -475));
things = things.concat(world.createFloor4(theWorld, -700, -475));
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
things = things.concat(world.createFloor9(theWorld, -950, 625));
things = things.concat(world.createFloor1(theWorld, -500, 625));
things = things.concat(world.createWall5(theWorld, -500, 675));
things = things.concat(world.createFloor15(theWorld, -450, 625));
things = things.concat(world.createFloor1(theWorld, 300, 625));
things = things.concat(world.createWall5(theWorld, 300, 675));
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

// things = things.concat(world.createWall5(theWorld, -1300, 675));
// things = things.concat(world.createWall3(theWorld, -1300, 925));
// things = things.concat(world.createFloor1(theWorld, -1300, 1175));
// things = things.concat(world.createStairs(theWorld, -698, 1175, true));
// things = things.concat(world.createFloor4(theWorld, -700, 1175));
// things = things.concat(world.createFloor1(theWorld, -500, 1175));
// things = things.concat(world.createFloor15(theWorld, -450, 1175));
// things = things.concat(world.createFloor1(theWorld, 300, 1175));
// things = things.concat(world.createFloor15(theWorld, 350, 1175));
// things = things.concat(world.createFloor1(theWorld, 1100, 1175));
things = things.concat(world.createFloor1(theWorld, 1100, 625));
things = things.concat(world.createWall5(theWorld, 1100, 675));
houseWindows.push({x1: -350, y1: 800, x2: -250, y2: 1000});
houseWindows.push({x1: 150, y1: 800, x2: 250, y2: 1000});
houseWindows.push({x1: 550, y1: 800, x2: 650, y2: 1000});

things = things.concat(world.createGrass(theWorld, -3300, 1200));
things = things.concat(world.createGrass(theWorld, -2800, 1200));
things = things.concat(world.createGrass(theWorld, -2300, 1200));
things = things.concat(world.createGrass(theWorld, -1800, 1200));

things = things.concat(world.createGrass(theWorld, 1150, 1200));
things = things.concat(world.createGrass(theWorld, 1650, 1200));
things = things.concat(world.createGrass(theWorld, 2150, 1200));
things = things.concat(world.createGrass(theWorld, 2650, 1200));

things = things.concat(world.createStairs(theWorld, -698, 1675, true));


var myThings = me.createMe(theWorld, 0, 0);
//theView.cy(1000);
//theView.cx(3000);
myBodies = myThings.map(function(thing) { return thing.body(); });
things = things.concat(myThings);

// // To animate the bodies, we must step the world forward in time, using a fixed time step size.
// // The World will run substeps and interpolate automatically for us, to get smooth animation.
// var fixedTimeStep = 1 / 60; // seconds
// var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
// var lastTime;

// var skyBg = theView.context().createLinearGradient(0, 0, 0, theView.height());
// skyBg.addColorStop(0, '#abd1f9');
// skyBg.addColorStop(1, '#71ace8');
// var atticBg = theView.context().createLinearGradient(theView.width() / 3, 0, theView.width() * 2 / 3, theView.height());
// atticBg.addColorStop(0, '#835323');
// atticBg.addColorStop(1, '#5c3611');
// var houseBg = theView.context().createLinearGradient(theView.width() / 3, 0, theView.width() * 2 / 3, theView.height());
// houseBg.addColorStop(0, '#e0f4ca');
// houseBg.addColorStop(1, '#a9cb84');
// var sunImage = new Image();
// sunImage.src = require('../png/sun.png');
// var windowImage = new Image();
// windowImage.src = require('../png/window.png');
//
// // Animation loop
// function animate(time){
//     requestAnimationFrame(animate);
//
//     // Compute elapsed time since last render frame
//     var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
//
//     // Move bodies forward in time
//     theWorld.step(fixedTimeStep, deltaTime, maxSubSteps);
//
//     if (!dragConstraint) {
//         var position = myThings[0].body().position;
//         theView.cx((theView.cx() * (constants.CATCH_UP - 1) + position[0]) / constants.CATCH_UP);
//         theView.cy((theView.cy() * (constants.CATCH_UP - 1) + position[1]) / constants.CATCH_UP);
//     }
//     // Render the circle at the current interpolated position
//     //console.info(circleBody.position[0], circleBody.position[1]);
//     var ctx = theView.context();
//     theView.clear(skyBg);
//     ctx.drawImage(sunImage, theView.width() / 5, theView.height() / 5);
//     ctx.fillStyle = atticBg;
//     atticPath(ctx);
//     ctx.fill('evenodd');
//     ctx.fillStyle = houseBg;
//     housePath(ctx);
//     ctx.fill('evenodd');
//     houseWindows.forEach(function(w) {
//         theView.renderImage(windowImage, w.x1 - 10, w.y1 - 10);
//     });
//     var groundBg = theView.context().createLinearGradient(0, theView.vyToCy(1200), 0, theView.vyToCy(6200));
//     groundBg.addColorStop(0, '#8a4425');
//     groundBg.addColorStop(1, '#421a09');
//     ctx.fillStyle = groundBg;
//     ctx.fillRect(0, theView.vyToCy(1200), theView.width(), theView.vyToCy(11200));
    // things.forEach(function(t) { theView.render(t); });
    // things.forEach(function(t) { theView.render2(t); });
//
//     lastTime = time;
// }
//
// // Start the animation loop
// requestAnimationFrame(animate);
