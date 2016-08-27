function hampath2(size, diagonal) {
    var visited = {};
    var current = [Math.floor(Math.random()*size),
                   Math.floor(Math.random()*size)];
    visited[current[0] + '-' + current[1]] = current;
    var path = [current];
    while (path.length < size * size) {
        if (path[path.length - 1] !== current)
            throw new Error('bug');
        //console.info('at '+current[0]+','+current[1]+' '+path.length);
        var visited_neighbors = [];
        var unvisited_neighbors = [];
        function check_neighbor(dx, dy) {
            var x = current[0] + dx;
            var y = current[1] + dy;
            if (x >= 0 && x < size && y >= 0 && y < size) {
                var v = visited[x + '-' + y];
                if (!v)
                    unvisited_neighbors.push([x, y]);
                else if (path.length > 1 && v != path[path.length-2])
                    visited_neighbors.push(v);
            }
        }
        check_neighbor(0, -1);
        check_neighbor(-1, 0);
        check_neighbor(0, 1);
        check_neighbor(1, 0);
        if (diagonal) {
            check_neighbor(-1, -1);
            check_neighbor(-1, 1);
            check_neighbor(1, 1);
            check_neighbor(1, -1);
        }
        if (unvisited_neighbors.length) {
            var i = Math.floor(Math.random() * unvisited_neighbors.length);
            current = unvisited_neighbors[i];
            //console.info('  on to '+current[0]+','+current[1]);
            path.push(current);
            visited[current[0] + '-' + current[1]] = current;
        } else {
            var i = Math.floor(Math.random() * visited_neighbors.length);
            var neighbor = visited_neighbors[i];
            var index = path.indexOf(neighbor);
            if (index < 0)
                throw new Error('bug');
            //console.info('  connect from '+neighbor[0]+','+neighbor[1]);
            path = path.slice(0, index+1).concat(path.slice(index+1).reverse());
            if (index == 0)
                path.reverse();
            current = path[path.length - 1];
        }
    }
    return path;
}
