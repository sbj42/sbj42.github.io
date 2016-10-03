var fpThingSetup = require('../fpThingSetup');

var thingFunc = fpThingSetup.thingFunc;

var fpCaveThings = {
};

var imagedir = 'cave/';

fpCaveThings.caveWS = function(pos, flip, angle) {
    pos = [pos[0] + 300, pos[1] + 300];
    var offset = [300, 300];
    thingFunc({
        polygon: [
            [0, 0], [600, 0], [600, 600], [550, 600],
            [556, 539], [546, 494], [549, 432], [556, 409], [559, 331], [516, 284], [467, 180], [433, 158],
            [402, 97], [338, 71], [277, 67], [215, 45], [188, 51], [133, 51], [91, 58]
        ],
        image: imagedir + 'cave-ws',
        offset: offset
    })(pos, flip, angle);
    thingFunc({
        polygon: [
            [0, 550], [34, 545], [54, 579], [50, 600], [0, 600]
        ],
        offset: offset
    })(pos, flip, angle);
};

module.exports = fpCaveThings;
