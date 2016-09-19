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
            mass: 300,
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
    createTable: function(world, offx, offy) {
        return [createThing(world, {
            mass: 300,
            position: [offx, offy+2],
            polygon: [[46, -1], [46, -90], [2, -90], [2, -98], [198, -98], [198, -90], [154, -90], [154, -1], [146, -1], [146, -80], [54, -80], [54, -1]],
            image: 'table',
            offset: [100, 26]
        })];
    },
    createGlass: function(world, offx, offy) {
        return [createThing(world, {
            mass: 2,
            position: [offx, offy-24],
            polygon: [[0, 0], [12, 0], [12, 24], [0, 24]],
            image: 'glass',
            offset: [7, 13]
        })];
    },
    createPlate: function(world, offx, offy) {
        return [createThing(world, {
            mass: 2,
            position: [offx, offy-10],
            polygon: [[0, 0], [46, 0], [31, 10], [15, 10]],
            image: 'plate',
            offset: [24, 6]
        })];
    },
    createChair: function(world, offx, offy, flip) {
        return [createThing(world, {
            mass: 100,
            position: [offx, offy+2],
            polygon: [[2, -2], [2, -63], [46, -63], [46, -138], [55, -138], [55, -2], [46, -2], [46, -28], [10, -28], [10, -2]],
            image: 'chair',
            offset: [33, 85],
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
    createBathtub: function(world, offx, offy, flip) {
        return [createThing(world, {
            mass: 400,
            position: [offx, offy],
            polygon: [[3, -92], [15, -92], [52, -32], [198, -32], [239, -92], [248, -92],
                [201, -3], [185, -3], [185, -16], [62, -16], [62, -3], [44, -3]],
            image: ['bathtub1', 'bathtub2'],
            offset: [125, 67],
            flip: flip
        })];
    },
    createSink: function(world, offx, offy, flip) {
        return [createThing(world, {
            mass: 350,
            position: [offx, offy],
            polygon: [[0, 0], [2, -109], [12, -109], [26, -85], [62, -85], [82, -109], [90, -106], [76, -78],
                [48, -71], [79, 0]],
            image: ['sink1', 'sink2'],
            offset: [40, 93],
            flip: flip
        })];
    },
    createHatch: function(world, offx, offy, flip) {
        return [createThing(world, {
            mass: 100,
            position: [offx, offy],
            polygon: [[-10, -8], [189, -8], [193, -15], [213, -15], [218, -8], [234, -8],
                [234, 10], [218, 10], [213, 19], [193, 19], [189, 10], [-10, 10]],
            image: 'hatch',
            offset: [130, 20],
            flip: flip
        })];
    },
    createRoof: function(world, offx, offy, flip) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[-10, -6], [89, -55], [110, -39], [13, 11]],
            image: 'roof',
            offset: [58, 30],
            flip: flip
        })];
    },
    createChimney: function(world, offx, offy, flip) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[-3, 9], [14, -1], [14, -185], [-3, -185]],
            image: [null, 'chimney'],
            offset: [15, 94],
            flip: flip
        }), createThing(world, {
            position: [offx, offy],
            polygon: [[96, -42], [110, -51], [110, -185], [96, -185]],
            image: null,
            offset: [0, 0],
            flip: flip
        })];
    },
    createGrass: function(world, offx, offy, angle) {
        return [createThing(world, {
            position: [offx, offy],
            polygon: [[0, 75], [0, 0], [500, 0], [500, 75]],
            image: ['grass1', 'grass2'],
            offset: [250, 65],
            angle: angle
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
