var fpWorld = require('../../fpWorld');
var fpCaveThings = require('./fpCaveThings');
var mazeGen = require('../../maze-gen/fpMazeGenerator');

var WIDTH = 22;
var HEIGHT = 4;

var LEFT_SHIFT = 7;
var START_DEPTH = 1;

var ENTRANCES = [[2 + LEFT_SHIFT, 0]];

function fpCaveSetup(position) {

    function pos(offset, suboffset) {
        var ret = [position[0] - 25 + offset[0] * 600, position[1]  + offset[1] * 600];
        if (suboffset) {
            ret[0] += suboffset[0];
            ret[1] += suboffset[1];
        }
        return ret;
    }

    fpCaveThings.cave(pos([0, 0]), [1, 1, 0, 0]);
    fpCaveThings.cave(pos([1, 0]), [0, 1, 0, 1]);
    fpCaveThings.cave(pos([2, 0]), [0, 0, 1, 1]);

    var previsited = [];
    for (var x = 1; x < WIDTH; x += 2)
        previsited.push([x, 1 + Math.floor(Math.random() * (HEIGHT-1))]);
    var maze = mazeGen(WIDTH, HEIGHT, previsited, true, 0);

    // testing cavepool:
    // maze[0][2 + LEFT_SHIFT] = {
    //     north: true
    // };
    // fpCaveThings.rock1(pos([1, 0], [300, 460]));

    for (var x = 0; x < WIDTH; x ++)
        for (var y = 0; y < HEIGHT; y ++) {
            var place = maze[y][x];
            ENTRANCES.forEach(function(e) {
                if (x == e[0] && y == e[1])
                    place.north = true;
            });
            if (!(place.north || place.east || place.south || place.west))
                continue;
            fpCaveThings.cave(pos([x - LEFT_SHIFT, y + START_DEPTH]),
                [place.north, place.east, place.south, place.west]);
            if (!place.south && place.east && place.west && Math.random() < 0.2) {
                fpCaveThings.rock1(pos([x - LEFT_SHIFT, y + START_DEPTH], [300, 460]));
            }
            if (place.north && !place.south && !place.west && !place.east) {
                fpCaveThings.cavepool(pos([x - LEFT_SHIFT, y + START_DEPTH]));
            }
        }

    var places = {
        'cave-entrance': pos([0, 0], [250, 308])
    };
    for (var x in places) {
        fpWorld.places[x] = places[x];
    }
}

module.exports = fpCaveSetup;
