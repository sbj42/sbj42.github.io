require('../css/main.css');

var fpWorld = require('./fpWorld');
var fpView = require('./fpView');
var fpContext = require('./fpContext');
var fpWorldRender = require('./fpWorldRender');
var fpUtil = require('./fpUtil');
var fpConfig = require('./fpConfig');
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
    if (title) {
        title--;
        return;
    }
    if (event.button == 0) {
        tryHit(fpView.mousePosition());
    }
});

fpUtil.addEventListener(fpView, 'mousemove', function(event) {
    if (title)
        return;
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
    if (title)
        return;
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
var maxSubSteps = 20; // Max sub steps to catch up with the wall clock
var lastTime;

var context = fpView.context();

require('./setup/world/fpWorldSetup');

// //testing transforms:
// {
//     var fpThingSetup = require('./setup/fpThingSetup');
//     var thingFunc = fpThingSetup.thingFunc;
//     thingFunc({
//         polygon: [[175, 0], [175, 100], [125, 100]],
//         image: 'test',
//         offset: [175, 125]
//     })([0, 0], false, 0);
//     thingFunc({
//         polygon: [[175, 0], [175, 100], [125, 100]],
//         image: 'test',
//         offset: [175, 125]
//     })([0, 0], true, 15);
// }

//fpView.position([900, -2600]);

var title = fpConfig.skipTitle ? 0 : 100;

var title1 = new Image();
title1.src = require('../png/title/title1.png');
var title2 = new Image();
title2.src = require('../png/title/title2.png');
var title3 = new Image();
title3.src = require('../png/title/title.png');
function animate(time) {
    requestAnimationFrame(animate);

    if (title > 0) {
        fpView.zoom(Math.pow(2, title / 100));
        fpConfig.slowDown = Math.pow(4, title / 100);
    }

    if (time - lastTime > 500)
        lastTime = time - 500;
    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
    deltaTime = deltaTime / (fpConfig.slowDown || 1);
    fpWorld.world().step(fixedTimeStep, deltaTime, maxSubSteps);

    if (!dragConstraint && fpWorld.currentActor()) {
        fpView.moveToward(fpWorld.currentActor().head().body().position.slice());
    }

    fpWorldRender(time);

    fpContext.setTransform(context);

    if (title > 0) {
        context.fillStyle = 'rgba(255,255,255,' + (title * 0.3 / 100) + ')';
        context.fillRect(0, 0, fpView.screenWidth(), fpView.screenHeight());
        context.globalAlpha = title / 100;
        var titleX = (fpView.screenWidth() - 572) / 2;
        var titleY = title * 3 - 150;
        context.drawImage(title1, titleX, titleY);
        context.save();
        context.translate(titleX + 180, titleY + 50);
        context.rotate(Math.PI / 180 * 25 * Math.min(1, Math.pow(Math.max(0, time - 1000) / 2000, 6)));
        context.translate(-(titleX + 180), -(titleY + 50));
        context.drawImage(title2, titleX, titleY);
        context.restore();
        context.globalAlpha = 1;
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.font = '35px Verdana';
        context.fillText('Click to begin', fpView.screenWidth() / 2, fpView.screenHeight() - title * 2 + 100 - 15);
        var border = title;
        context.fillStyle = '#abd1f9';
        context.fillRect(0, 0, fpView.screenWidth(), border);
        context.fillRect(0, fpView.screenHeight() - border, fpView.screenWidth(), border);
        context.strokeStyle  = 'black';
        context.lineWidth = 6;
        context.lineJoin = 'round';
        context.strokeRect(-10, border, fpView.screenWidth() + 20, fpView.screenHeight() - 2 * border);
        if (title < 100)
            title --;
        if (title <= 0) {
            fpView.zoom(1 / (fpConfig.zoom || 1));
            fpConfig.slowDown = 1;
        }
    } else {
        context.drawImage(title3, 0, 0);
    }

    var mouse = fpView.screenMousePosition();
    if (mouse) {
        fpContext.image(context, 'cursor-' + (title ? 'point' : fpView.mouseIsDown() ? 'grabbing' : 'grab'), {
            position: mouse,
            offset: [8, 10]
        });
    }

    lastTime = time;
}

requestAnimationFrame(animate);
