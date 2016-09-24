var fpWorld = require('./fpWorld');
var fpView = require('./fpView');
var fpContext = require('./fpContext');

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

    for (var layer = 0; layer < 2; layer ++) {
        fpWorld.bodies().forEach(function(body) {
            renderBody(body, layer);
        });
        fpWorld.actors().forEach(function(actor) {
            actor.bodies().forEach(function(body) {
                renderBody(body, layer);
            });
        });
    }
}

module.exports = fpWorldRender;
