var fpContext = {
};

var imageCache = {};

fpContext.transform = function(context, param) {
    if (!param)
        return;
    if (param.position)
        context.translate(param.position[0], param.position[1]);
    if (param.angle)
        context.rotate(param.angle * Math.PI / 180);
    if (param.scale)
        context.scale(param.scale, param.scale);
    if (param.flip)
        context.scale(-1, 1);
};

fpContext.setTransform = function(context, param) {
    context.setTransform(1,0,0,1,0,0);
    fpContext.transform(context, param);
};

fpContext.image = function(context, image, param) {
    var img = imageCache[image];
    if (!img) {
        img = imageCache[image] = new Image();
        img.src = require('../png/' + image + '.png');
    }
    context.save();
    fpContext.transform(context, param);
    var offset = param.offset || [0, 0];
    context.drawImage(img, -offset[0], -offset[1]);
    context.restore();
};

fpContext.polypolygon = function(context, polypolygon, param) {
    context.save();
    fpContext.transform(context, param);
    context.beginPath();
    polypolygon.forEach(function(polygon) {
        polygon.forEach(function(point, i) {
            if (i == 0)
                context.moveTo(point[0], point[1]);
            else
                context.lineTo(point[0], point[1]);
        });
        if (polygon.length)
            context.lineTo(polygon[0][0], polygon[0][1]);
    });
    context.restore();
};

module.exports = fpContext;
