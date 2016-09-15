var thing = require('./thing');

function createThing(world, param) {
    return thing.createThing(world, param);
}

// function join(world, thingA, thingB, param) {
//     thing.join(world, thingA, thingB, param);
// }

module.exports = {
    createFloor1: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[0, 0], [50, 0], [50, 50], [0, 50]],
            image: 'floor1',
            offset: [25, 25]
        })];
    },
    createFloor4: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[0, 0], [200, 0], [200, 50], [0, 50]],
            image: 'floor4',
            offset: [100, 25]
        })];
    },
    createFloor9: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[0, 0], [450, 0], [450, 50], [0, 50]],
            image: 'floor9',
            offset: [225, 25]
        })];
    },
    createFloor15: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[0, 0], [750, 0], [750, 50], [0, 50]],
            image: 'floor15',
            offset: [375, 25]
        })];
    },
    createWall5: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx + 10, offy - 1],
            polygon: [[0, 0], [26, 0], [26, 250], [0, 250]],
            image: 'wall5',
            offset: [13, 125]
        })];
    },
    createWall3: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx + 10, offy - 1],
            polygon: [[0, 0], [26, 0], [26, 150], [0, 150]],
            image: 'wall3',
            offset: [13, 75]
        })];
    },
    createStairs: function(world, offx, offy, flip) {
        return [createThing(world, {
            position: [offx, offy + -503],
            polygon: [[0, 500], [50, 500], [50, 450], [100, 450], [100, 400], [150, 400], [150, 350], [200, 350], [200, 300], [250, 300], [250, 250], [300, 250],
                [300, 200], [350, 200], [350, 150], [400, 150], [400, 100], [450, 100], [450, 50], [500, 50], [500, 0], [550, 0],
                [550, 50], [50, 550], [0, 550]],
            image: 'stairs',
            offset: [280, 280],
            flip: flip
        })];
    },
    createBed: function(world, offx, offy, flip) {
        return [createThing(world, {
            //mass: 100,
            position: [offx, offy],
            polygon: [[0, 0], [0, -105], [13, -105], [13, -76], [283, -76], [283, -79], [292, -79], [292, 0], [283, 0], [283, -31], [9, -31], [9, 0]],
            image: 'bed',
            offset: [145, 50],
            flip: flip
        })];
    },
    createPillow: function(world, offx, offy, flip) {
        return [createThing(world, {
            mass: 1,
            position: [offx, offy],
            polygon: [[3, -15], [46, -15], [47, -8], [46, -4], [3, -4], [2, -8]],
            image: 'pillow',
            offset: [25, 8],
            flip: flip
        })];
    },
    createBall: function(world, offx, offy, flip) {
        return [createThing(world, {
            mass: 1,
            material: thing.bouncyMaterial,
            position: [offx, offy],
            circle: [22],
            image: 'ball',
            offset: [25, 25],
            flip: flip
        })];
    },
    createRedBlock: function(world, offx, offy) {
        return [createThing(world, {
            position: [offx + 25, offy + 25],
            polygon: [[-25, -25], [25, -25], [25, 25], [-25, 25]],
            image: 'redblock',
            offset: [25, 25]
        })];
    }
};
