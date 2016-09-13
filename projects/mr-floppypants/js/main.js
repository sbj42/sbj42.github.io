require('../css/main.css');
var p2 = require('p2');
var view = require('./view');
var thing = require('./thing');

var theView = new view.View();

var world = new p2.World({
    gravity:[0, 200]
});

var ME = 1;
var OTHER = 2;
var GROUND = 4;

var things = [];
var redblockImage = new Image();
redblockImage.src = require('../png/redblock.png');
for (var x = -250; x <= 250; x += 50) {
    var redblockBody = new p2.Body({
        mass: 0,
        position: [x, 100]
    });
    redblockBody.fromPolygon([[-25, -25], [25, -25], [25, 25], [-25, 25]]);
    redblockBody.shapes.forEach(function(s) {
        s.collisionGroup = GROUND;
        s.collisionMask = ME|OTHER;
    });
    world.addBody(redblockBody);
    things.push(new thing.Thing(redblockBody, redblockImage, 25, 25));
}

var myHeadBody = new p2.Body({
    mass: 5,
    position: [0, -200]
});
myHeadBody.fromPolygon([[0, -28], [18, -22], [21, 0], [8, 28], [-7, 28], [-20, 0], [-13, -22]], {skipSimpleCheck: true});
myHeadBody.shapes.forEach(function(s) {
    s.collisionGroup = ME;
    s.collisionMask = OTHER|GROUND;
});
world.addBody(myHeadBody);
var headImage = new Image();
headImage.src = require('../png/head.png');
var myHead = new thing.Thing(myHeadBody, headImage, 24, 32);

var myShirtMidBody = new p2.Body({
    mass: 15,
    position: [0, -141]
});
myShirtMidBody.fromPolygon([[-22, -29], [23, -29], [23, 23], [-22, 23]], {skipSimpleCheck: true});
myShirtMidBody.shapes.forEach(function(s) {
    s.collisionGroup = ME;
    s.collisionMask = OTHER|GROUND;
});
world.addBody(myShirtMidBody);
var shirtMidImage = new Image();
shirtMidImage.src = require('../png/shirt-middle.png');
var myShirtMid = new thing.Thing(myShirtMidBody, shirtMidImage, 30, 31);

var neckJoint = new p2.RevoluteConstraint(myHeadBody, myShirtMidBody, {
    worldPivot: [0, -172]
});
neckJoint.setLimits(-Math.PI / 8, Math.PI / 8);
world.addConstraint(neckJoint);

var myArmLeftUpperBody = new p2.Body({
    mass: 5,
    position: [-22, -145]
});
myArmLeftUpperBody.fromPolygon([[6, -11], [11, -7], [12, 0], [-10, 14], [-16, 5]], {skipSimpleCheck: true});
myArmLeftUpperBody.shapes.forEach(function(s) {
    s.collisionGroup = ME;
    s.collisionMask = OTHER|GROUND;
});
world.addBody(myArmLeftUpperBody);
var armLeftUpperImage = new Image();
armLeftUpperImage.src = require('../png/arm-left-upper.png');
var myArmLeftUpper = new thing.Thing(myArmLeftUpperBody, armLeftUpperImage, 30, 31);

var shoulderLeftJoin = new p2.RevoluteConstraint(myShirtMidBody, myArmLeftUpperBody, {
    worldPivot: [-22, -165]
});
shoulderLeftJoin.setLimits(-Math.PI / 3, Math.PI / 3);
world.addConstraint(shoulderLeftJoin);

var myPantsTopBody = new p2.Body({
    mass: 5,
    position: [0, -104]
});
myPantsTopBody.fromPolygon([[-21, -14], [21, -14], [21, 14], [-21, 14]], {skipSimpleCheck: true});
myPantsTopBody.shapes.forEach(function(s) {
    s.collisionGroup = ME;
    s.collisionMask = OTHER|GROUND;
});
world.addBody(myPantsTopBody);
var PantsTopImage = new Image();
PantsTopImage.src = require('../png/pants-top.png');
var myPantsTop = new thing.Thing(myPantsTopBody, PantsTopImage, 26, 18);

var spineJoint = new p2.RevoluteConstraint(myShirtMidBody, myPantsTopBody, {
    worldPivot: [0, -110]
});
spineJoint.setLimits(-Math.PI / 6, Math.PI / 6);
world.addConstraint(spineJoint);

things.push(myPantsTop);
things.push(myShirtMid);
things.push(myArmLeftUpper);
things.push(myHead);

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
    world.step(fixedTimeStep, deltaTime, maxSubSteps);

    // Render the circle at the current interpolated position
    //console.info(circleBody.position[0], circleBody.position[1]);
    theView.clear('#eee');
    things.forEach(function(t) { theView.render(t); });

    lastTime = time;
}

// Start the animation loop
requestAnimationFrame(animate);
