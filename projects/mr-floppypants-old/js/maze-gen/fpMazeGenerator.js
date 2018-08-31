function fpMazeGenerator(width, height, previsit, horizontalBias, loopFactor) {

    var directions = [
        [ 0, -1, 'north', 'south'],
        [ 1,  0, 'east',  'west' ],
        [ 0,  1, 'south', 'north'],
        [-1,  0, 'west',  'east' ],
    ];

    function isVisited(pos) {
        if (pos[0] < 0 || pos[0] >= width || pos[1] < 0 || pos[1] >= height)
            return true;
        return visited[pos[1]][pos[0]];
    }

    function markVisited(pos) {
        visited[pos[1]][pos[0]] = true;
    }

    function getNeighbors(pos) {
        var ret = [];
        directions.forEach(function(dir) {
            if (!isVisited([pos[0] + dir[0], pos[1] + dir[1]])) {
                ret.push(dir);
                if (horizontalBias) {
                    ret.push(dir);
                    if (dir[0])
                        ret.push(dir);
                }
            }
        });
        return ret;
    }

    function get(pos) {
        return grid[pos[1]][pos[0]];
    }

    function hasPath(pos) {
        var cell = grid[pos[1]][pos[0]];
        return cell.north || cell.east || cell.south || cell.west;
    }

    function connect(pos, dir) {
        get(pos)[dir[2]] = true;
        var npos = [pos[0] + dir[0], pos[1] + dir[1]];
        get(npos)[dir[3]] = true;
        return npos;
    }

    var visited = [];

    var grid = [];
    for (var y = 0; y < height; y ++) {
        var gridRow = [];
        var visitedRow = [];
        grid.push(gridRow);
        visited.push(visitedRow);
        for (var x = 0; x < width; x ++) {
            gridRow.push({});
            visitedRow.push(false);
        }
    }
    previsit.forEach(markVisited);

    var cur = [0, 0];
    var stack = [];
    markVisited(cur);

    for (;;) {
        var neighbors = getNeighbors(cur);
        if (neighbors.length) {
            var dir = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(cur);
            cur = connect(cur, dir);
            markVisited(cur);
        } else if (stack.length) {
            cur = stack.pop();
        } else {
            break;
        }
    }

    for (var y = 0; y < height-1; y ++) {
        for (var x = 0; x < width-1; x ++) {
            if (Math.random() < loopFactor) {
                var dir = directions[Math.random() < (horizontalBias ? 0.75 : 0.5) ? 1 : 2];
                var npos = [x + dir[0], y + dir[1]];
                if (hasPath([x, y]) && hasPath(npos))
                    connect([x, y], dir);
            }
        }
    }

    return grid;
}

module.exports = fpMazeGenerator;
