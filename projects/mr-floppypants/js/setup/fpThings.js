var fpThingSetup = require('./fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpThings = {
};

fpThings.tree1 = function(position, flip, angle) {
    var t1 = thingFunc({
        polygon: [
            [-175, -1172], [-147, -1235], [-91, -1240], [-77, -1287], [0, -1287],
            [0, -1208], [-105, -1204], [-140, -1153]
        ],
        images: ['tree1-1', null, 'tree1-2'],
        offset: [500, 1500]
    })(position, flip, angle);
    var t2 = thingFunc({
        polygon: [
            [-127, -968], [-28, -958], [0, -1009], [81, -986], [149, -1015], [194, -963], [182, -907], [266, -877],
            [266, -832], [216, -835], [149, -798], [102, -858], [11, -830], [-36, -889], [-127, -879]
        ],
        offset: [500, 1500]
    })(position, flip, angle);
    return [t1, t2];
};
fpThings.grass = thingFunc({
    polygon: [[0, 0], [0, 100], [500, 100], [500, 0]],
    images: ['grass1', 'grass2'],
    offset: [0, 25]
});

module.exports = fpThings;
