var thing = require('./thing');

function createThing(world, param) {
    return thing.createThing(world, param);
}

// function join(world, thingA, thingB, param) {
//     thing.join(world, thingA, thingB, param);
// }

module.exports = {
    createStairs: function(world, offx, offy, flip) {
        return [createThing(world, {
            position: [offx - 25, offy + -525],
            // polygon: [[0, 0], [550, 0], [550, 550], [0, 550]],
            polygon: [[0, 500], [50, 500], [50, 450], [100, 450], [100, 400], [150, 400], [150, 350], [200, 350], [200, 300], [250, 300], [250, 250], [300, 250],
                [300, 200], [350, 200], [350, 150], [400, 150], [400, 100], [450, 100], [450, 50], [500, 50], [500, 0], [550, 0],
                [550, 50], [50, 550], [0, 550]],
            image: 'stairs',
            offset: [280, 280],
            flip: flip
        })];
    },
    createRedBlock: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[-25, -25], [25, -25], [25, 25], [-25, 25]],
            image: 'redblock',
            offset: [25, 25]
        })];
    }
};
