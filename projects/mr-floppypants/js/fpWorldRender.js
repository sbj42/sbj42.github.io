var fpWorld = require('./fpWorld');
var fpView = require('./fpView');
var fpContext = require('./fpContext');
var p2 = require('p2');

var SUN_POSITION = [1 / 4, 1 / 4];
var SUN_IMAGE_OFFSET = [98, 108];

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

    function renderBodyFrame(body) {
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
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.stroke();
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
    fpWorld.bodies().forEach(function(body) {
        renderBodyFrame(body);
    });
    fpWorld.actors().forEach(function(actor) {
        actor.bodies().forEach(function(body) {
            renderBodyFrame(body);
        });
    });
}

module.exports = fpWorldRender;
