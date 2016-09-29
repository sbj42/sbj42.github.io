var fpWorld = require('./fpWorld');
var fpView = require('./fpView');
var fpContext = require('./fpContext');
var fpConfig = require('./fpConfig');
var p2 = require('p2');

var SUN_POSITION = [0.25, 0.25];
var SUN_IMAGE_OFFSET = [98, 108];
var CLOUD1_SPEED = 300;
var CLOUD1_POSITION = 0.15;
var CLOUD2_SPEED = 500;
var CLOUD2_POSITION = 0.35;
var CLOUD_IMAGE_OFFSET = [250, 100];

var context = fpView.context();

var skyBg = context.createLinearGradient(0, 0, 0, fpView.screenHeight());
skyBg.addColorStop(0, '#abd1f9');
skyBg.addColorStop(1, '#71ace8');

function fpWorldRender(time) {
    fpContext.setTransform(context);
    context.fillStyle = skyBg;
    context.fillRect(0, 0, fpView.screenWidth(), fpView.screenHeight());

    fpContext.setTransform(context, fpView.getWorldTransform());
    fpContext.image(context, 'sun', {
        position: fpView.screenToWorld([SUN_POSITION[0] * fpView.screenWidth() + fpView.offset()[0], SUN_POSITION[1] * fpView.screenHeight() + fpView.offset()[1]]),
        offset: SUN_IMAGE_OFFSET
    });
    var cloud1at = 1.5 * ((1000 + time/1000) % CLOUD1_SPEED) / CLOUD1_SPEED - 0.25;
    fpContext.image(context, 'cloud1', {
        position: fpView.screenToWorld([cloud1at * fpView.screenWidth() + fpView.offset()[0], CLOUD1_POSITION * fpView.screenHeight() + fpView.offset()[1]]),
        offset: CLOUD_IMAGE_OFFSET
    });
    var cloud2at = 1.5 * ((1000 + time/1000) % CLOUD2_SPEED) / CLOUD2_SPEED - 0.25;
    fpContext.image(context, 'cloud2', {
        position: fpView.screenToWorld([cloud2at * fpView.screenWidth() + fpView.offset()[0], CLOUD2_POSITION * fpView.screenHeight() + fpView.offset()[1]]),
        offset: CLOUD_IMAGE_OFFSET
    });

    fpWorld.backdrops().forEach(function(backdrop) {
        fpContext.polypolygon(context, backdrop.polypolygon());
        context.fillStyle = backdrop.fill();
        context.fill('evenodd');
    });

    function renderBody(body, layer) {
        var image = body.images()[layer];
        if (!image)
            return;
        fpContext.image(context, image, {
            position: body.position(),
            angle: body.angle() * 180 / Math.PI,
            flip: body.flip(),
            offset: body.offset()
        });
    }

    for (var layer = 0; layer <= 2; layer ++) {
        fpWorld.bodies().forEach(function(body) {
            renderBody(body, layer);
        });
        fpWorld.actors().forEach(function(actor) {
            actor.bodies().forEach(function(body) {
                renderBody(body, layer);
            });
        });
    }

    function renderBodyFrame(body) {
        if (!body.body())
            return;
        context.beginPath();
        body.body().shapes.forEach(function(shape) {
            if (shape.vertices) {
                var start;
                shape.vertices.forEach(function(vertex, index) {
                    var bpos = [];
                    p2.vec2.toGlobalFrame(bpos, vertex, shape.position, shape.angle);
                    var wpos = [];
                    p2.vec2.toGlobalFrame(wpos, bpos, body.body().interpolatedPosition, body.body().interpolatedAngle);
                    if (index == 0) {
                        context.moveTo(wpos[0], wpos[1]);
                        start = wpos;
                    } else
                        context.lineTo(wpos[0], wpos[1]);
                });
                context.lineTo(start[0], start[1]);
            } else if (shape.radius) {
                var wpos = [];
                p2.vec2.toGlobalFrame(wpos, shape.position, body.body().interpolatedPosition, body.body().interpolatedAngle);
                context.moveTo(wpos[0], wpos[1]);
                context.arc(wpos[0], wpos[1], shape.radius, body.body().interpolatedAngle, body.body().interpolatedAngle + Math.PI * 2);
            }
        });
        context.stroke();
    }

    if (fpConfig.wireframe) {
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(fpWorld.LEFT, fpWorld.TOP);
        context.lineTo(fpWorld.RIGHT, fpWorld.TOP);
        context.lineTo(fpWorld.RIGHT, fpWorld.BOTTOM);
        context.lineTo(fpWorld.LEFT, fpWorld.BOTTOM);
        context.lineTo(fpWorld.LEFT, fpWorld.TOP);
        context.stroke();
        fpWorld.bodies().forEach(function(body) {
            renderBodyFrame(body);
        });
        fpWorld.actors().forEach(function(actor) {
            actor.bodies().forEach(function(body) {
                renderBodyFrame(body);
            });
        });
    }
}

module.exports = fpWorldRender;
