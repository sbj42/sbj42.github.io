require('../css/main.css');
var p2 = require('p2');
var view = require('./view');
var thing = require('./thing');
var constants = require('./constants');
var me = require('./me');

var theView = new view.View();

var world = new p2.World({
    gravity:[0, 200]
});

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
        s.collisionGroup = constants.GROUP_GROUND;
        s.collisionMask = constants.GROUP_OTHER | constants.GROUP_ME;
    });
    world.addBody(redblockBody);
    things.push(new thing.Thing(redblockBody, redblockImage, 25, 25));
}

things = things.concat(me.createMe(world, 0, 0));

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
