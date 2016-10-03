var fpWorld = require('../../fpWorld');
var fpThingSetup = require('../fpThingSetup');
var p2 = require('p2');

var thingFunc = fpThingSetup.thingFunc;

var fpHouseThings = {
};

var imagedir = 'house/';

fpHouseThings.floor1 = thingFunc({
    polygon: [[0, 0], [0, 50], [50, 50], [50, 0]],
    image: imagedir + 'floor1'
});
fpHouseThings.floor4 = thingFunc({
    polygon: [[0, 0], [200, 0], [200, 50], [0, 50]],
    image: imagedir + 'floor4'
});
fpHouseThings.floor9 = thingFunc({
    polygon: [[0, 0], [450, 0], [450, 50], [0, 50]],
    image: imagedir + 'floor9'
});
fpHouseThings.floor15 = thingFunc({
    polygon: [[0, 0], [750, 0], [750, 50], [0, 50]],
    image: imagedir + 'floor15'
});
fpHouseThings.wall3 = thingFunc({
    polygon: [[1, 2], [28, 2], [28, 146], [1, 146]],
    image: imagedir + 'wall3',
    offset: [-10, 0]
});
fpHouseThings.wall5 = thingFunc({
    polygon: [[1, 2], [28, 2], [28, 242], [1, 242]],
    image: imagedir + 'wall5',
    offset: [-10, 0]
});
fpHouseThings.stairs = thingFunc({
    polygon: [[0,0],[50,0],[50,50],[100,50],[100,100],[150,100],[150,150],[200,150],[200,200],[250,200],[250,250]
        ,[300,250],[300,300],[350,300],[350,350],[400,350],[400,400],[450,400],[450,450],[500,450],[500,500],[550,500]
        ,[550,549],[500,549],[0,51]],
    image: imagedir + 'stairs',
    offset: [0, 500]
});
fpHouseThings.ball = thingFunc({
    circle: [25, -25, 24],
    image: 'ball',
    offset: [0, 50],
    mass: 0.3,
    material: fpWorld.BOUNCY_MATERIAL
});
fpHouseThings.bed = thingFunc({
    polygon: [[0,104],[0,-1],[13,-1],[13,28],[283,28],[283,25],[292,25],[292,104],[283,104],[283,73],[9,73],[9,104]],
    image: imagedir + 'bed',
    offset: [0, 104],
    mass: 120
});
fpHouseThings.pillow = thingFunc({
    polygon: [[2, 14], [25, 18], [48, 14], [48, 6], [25, 2], [2, 6]],
    image: imagedir + 'pillow',
    offset: [0, 20],
    mass: 0.1
});
fpHouseThings.table = thingFunc({
    polygon: [[3,3],[197,3],[197,10],[153,10],[153,99],[144,99],[144,24],[55,24],[55,99],[46,99],[46,10],[3,10]],
    image: imagedir + 'table',
    offset: [0, 100],
    mass: 100
});
fpHouseThings.glass = thingFunc({
    polygon: [[2, 2], [11, 2], [11, 23], [2, 23]],
    image: imagedir + 'glass',
    offset: [0, 24],
    mass: 1
});
fpHouseThings.plate = thingFunc({
    polygon: [[3, 3], [44, 3], [29, 12], [17, 12]],
    image: imagedir + 'plate',
    offset: [0, 13],
    mass: 1
});
fpHouseThings.chair = thingFunc({
    polygon: [[2,137],[2,1],[9,1],[9,77],[53,77],[53,137],[46,137],[46,111],[9,111],[9,137]],
    image: imagedir + 'chair',
    offset: [1, 138],
    mass: 30
});
fpHouseThings.bathtub = thingFunc({
    polygon: [[6,5],[21,4],[46,72],[200,72],[238,11],[251,11],[206,100],[183,100],[183,88],[62,88],[62,100],[42,100],[1,18]],
    images: [imagedir + 'bathtub1', imagedir + 'bathtub2'],
    offset: [1, 102],
    mass: 300
});
fpHouseThings.sink = thingFunc({
    polygon: [[3,31],[11,3],[27,5],[18,30],[21,58],[60,58],[84,31],[92,33],[78,61],[51,70],[80,140],[1,140]],
    images: [imagedir + 'sink1', imagedir + 'sink2'],
    offset: [1, 142],
    mass: 250
});
fpHouseThings.hatch = thingFunc({
    polygon: [[4,10],[202,10],[207,4],[225,4],[230,10],[246,10],[246,30],[230,30],[225,36],[207,36],[202,30],[4,30]],
    image: imagedir + 'hatch',
    offset: [12, 20],
    mass: 50,
    more: function(hatch, position) {
        hatch.body().gravityScale = 0;
        var joi = new p2.RevoluteConstraint(fpWorld.NULL_BODY, hatch.body(), {
            worldPivot: position
        });
        joi.setLimits(0, 0);
        fpWorld.world().addConstraint(joi);
    }
});
fpHouseThings.roof = thingFunc({
    polygon: [[0, 51], [99, 0], [115, 13], [17, 63]],
    image: imagedir + 'roof',
    offset: [0, 30]
});
fpHouseThings.chimney = thingFunc({
    polygon: [[4, 5], [24, 5], [24, 191], [4, 203]],
    images: [null, imagedir + 'chimney'],
    offset: [0, 164]
});
fpHouseThings.chimney2 = thingFunc({
    polygon: [[97, 5], [117, 5], [117, 147], [97, 152]],
    image: null,
    offset: [0, 164]
});
fpHouseThings.window = thingFunc({
    image: imagedir + 'window',
    offset: [10, 207]
});

module.exports = fpHouseThings;
