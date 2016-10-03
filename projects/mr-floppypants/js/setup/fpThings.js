var fpThingSetup = require('./fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpThings = {
};

fpThings.tree1 = function(position, flip, angle) {
    var t1 = thingFunc({
        polygon: [[325,328],[353,265],[409,260],[423,213],[500,213],[500,292],[395,296],[360,347]],
        images: ['tree1-1', null, 'tree1-2'],
        offset: [500, 1500]
    })(position, flip, angle);
    var t2 = thingFunc({
        polygon: [[373,532],[472,542],[500,491],[581,514],[649,485],[694,537],[682,593],[766,623],[766,668],[716,665],[649,702],[602,642],[511,670],[464,611],[373,621]],
        offset: [500, 1500]
    })(position, flip, angle);
    return [t1, t2];
};
fpThings.grass = thingFunc({
    polygon: [[0, 25], [0, 125], [500, 125], [500, 25]],
    images: ['grass1', 'grass2'],
    offset: [0, 25]
});

module.exports = fpThings;
