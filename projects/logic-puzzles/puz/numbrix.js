function Numbrix() {
    if (!(this instanceof Numbrix))
        return new Numbrix();
}

Numbrix.prototype.generate = function(size, difficulty, progress) {
    this._size = size;
    this._last = size * size;
    var path = hampath.generate({width: size, height: size});
    this._grid = Array(this._last);
    var remain = [];
    for (var i = 0; i < path.data.length; i ++) {
        this._set(path.data[i][0], path.data[i][1], i+1);
        if (i > 0 && i < this._last-1) remain.push(i+1);
    }

    var maxStretch = Math.floor(2 + 7 * difficulty / 10);
    var maxChoices = Math.pow(2, 5 + difficulty);
    var maxiter = remain.length;
    var repeat = 4;
    var done = false;
    var lastDifficulty = NaN;
    for (var i = 0; !done && i < maxiter; i ++) {
        //console.info('removing, i = ' + i + ' of ' + maxiter);
        for (var j = 0; j < repeat; j ++) {
            var prog1 = Math.max(0, (lastDifficulty + 5) / (difficulty + 5) || 0);
            var p = prog1 + (1-prog1)* ((i*repeat + j)/(maxiter * repeat));
            p *= p;
            progress(p);
            var idx = Math.floor(Math.random() * remain.length);
            var at = remain[idx];
            //console.info('  try ' + at);
            this._stretch = 0;
            var remainafter = remain.slice();
            remainafter.splice(idx, 1);
            var stest = [1].concat(remainafter).concat(this._last);
            for (var k = 1; k < stest.length; k ++)
                this._stretch = Math.max(this._stretch, stest[k] - stest[k-1] - 1);
            if (this._stretch > maxStretch) {
                //console.info('    no, too much stretch');
                continue;
            }
            var loc = this._find(at);
            if (loc) {
                this._set(loc.x, loc.y);
                this._solve(maxChoices, remainafter, function(pct) {
                    var p = prog1 + (1-prog1) * ((i*repeat + j + pct)/(maxiter * repeat));
                    p *= p;
                    progress(p);
                });
                this._difficulty = Math.floor(Math.log(this._choices) / Math.log(2) - 4);
                
                if (this._multipleSolutions) {
                    //console.info('    no, multiple solutions');
                } else if (!this._solution || this._difficulty > difficulty) {
                    //console.info('    no, too difficult');
                    done = true;
                } else {
                    //console.info('    ok, stretch = ' + this._stretch + ', choices = ' + this._choices + ', difficulty = ' + this._difficulty);
                    remain = remainafter;
                    lastDifficulty = this._difficulty;
                    done = this._difficulty == difficulty;
                    break;
                }
                this._set(loc.x, loc.y, at);
            } else
                ;//console.info('    no, not present');
        }
    }
    console.info('done, stretch = ' + this._stretch + ', choices = ' + this._choices + ', difficulty = ' + this._difficulty);
}

Numbrix._get = function(grid, size, x, y) {
    if (x < 0 || y < 0 || x > size || y > size)
        return -1;
    return grid[y * size + x];
};

Numbrix.prototype._get = function(x, y) {
    return Numbrix._get(this._grid, this._size, x, y);
};

Numbrix.prototype._set = function(x, y, v) {
    this._grid[y * this._size + x] = v;
};

Numbrix.prototype._find = function(num) {
    for (var i = 0; i < this._grid.length; i ++) {
        if (this._grid[i] == num) {
            var y = Math.floor(i / this._size);
            var x = i - y * this._size;
            return {x: x, y: y};
        }
    }
    return null;
};

Numbrix.prototype._solveNext = function(at, x, y, grid, nidx) {
    //console.info('trying ' + (at-1) + ' at ' + x + ',' + y);
    if (at == this._last + 1) {
        if (this._solution) {
            this._multipleSolutions = true;
            this._solveTodo = [];
        } else
            this._solution = grid;
        return;
    }
    var self = this;
    function getandmaybeskip(x, y) {
        var v = Numbrix._get(grid, self._size, x, y);
        if (v == at) {
            self._solveNext(at+1, x, y, grid, nidx+1);
            return -2;
        }
        return v;
    }
    var n = getandmaybeskip(x, y-1);
    if (n == -2) return;
    var e = getandmaybeskip(x+1, y);
    if (e == -2) return;
    var s = getandmaybeskip(x, y+1);
    if (s == -2) return;
    var w = getandmaybeskip(x-1, y);
    if (w == -2) return;

    if (nidx < this._numbers.length && at == this._numbers[nidx])
        return;

    var choice = !n + !e + !s + !w > 1;
    if (choice)
        this._choices ++;
    if (this._choices > this._maxChoices) {
        this._solveTodo = [];
        return;
    }

    function tryset(d, x, y) {
        if (!d) {
            if (choice) {
                var ngrid = grid.slice();
                ngrid[y * self._size + x] = at;
                self._solveTodo.push([at+1, x, y, ngrid, nidx]);
            } else {
                grid[y * self._size + x] = at;
                self._solveNext(at+1, x, y, grid, nidx);
            }
            if (self._multipleSolutions)
                return true;
        }
        return false;
    }
    if (tryset(n, x, y-1)) return;
    if (tryset(e, x+1, y)) return;
    if (tryset(s, x, y+1)) return;
    if (tryset(w, x-1, y)) return;
};

Numbrix.prototype._solve = function(maxChoices, numbers, progress) {
    this._maxChoices = maxChoices;
    this._numbers = numbers;
    this._choices = 0;
    this._solution = null;
    this._multipleSolutions = false;
    var loc = this._find(1);
    var nidx = numbers[0] == 2 ? 1 : 0;
    this._solveTodo = [[2, loc.x, loc.y, this._grid.slice(), nidx]];
    this._solveAt = 0;
    var count = 0;
    while (this._solveAt < this._solveTodo.length) {
        if ((count & 0xffff) == 0)
            progress(this._choices / maxChoices);
        count ++;
        var next = this._solveTodo[this._solveAt];
        this._solveAt++;
        if (this._solveAt > 100000) {
            this._solveTodo.splice(0, this._solveAt);
            this._solveAt = 0;
        }
        var at = next[0];
        var x = next[1];
        var y = next[2];
        var grid = next[3];
        var nidx = next[4];
        this._solveNext(at, x, y, grid, nidx);
    }
    delete this._maxChoices;
    delete this._numbers;
};

Numbrix.prototype.start = function(html) {
    var tbody = html.clear().append('table')
        .classed('grid', true)
        .append('tbody');
    var csize = 36;
    for (var y = 0; y < this._size; y ++) {
        var tr = tbody.append('tr');
        for (var x = 0; x < this._size; x ++) {
            var td = tr.append('td')
                .attr('style', 'width: '+csize+'px; height: '+csize+'px');
            var i = this._get(x, y);
            var n = Math.abs(this._get(x, y - 1) - i) == 1;
            var e = Math.abs(this._get(x + 1, y) - i) == 1;
            var s = Math.abs(this._get(x, y + 1) - i) == 1;
            var w = Math.abs(this._get(x - 1, y) - i) == 1;
            if (n || e || s || w) {
                var svg = td.append('svg')
                    .classed('numbrix-line', true)
                    .attr('width', csize)
                    .attr('height', csize);
                function line(x2, y2) {
                    svg.append('line')
                        .attr('x1', csize/2)
                        .attr('y1', csize/2)
                        .attr('x2', x2)
                        .attr('y2', y2);
                }
                if (n) line(csize/2, 0);
                if (e) line(csize, csize/2);
                if (s) line(csize/2, csize);
                if (w) line(0, csize/2);
            }
            if (i == 1 || i == this._last)
                td.append('div')
                    .classed('numbrix-start', true);
            else if (i)
                td.classed('numbrix-given', true);
            var num = td.append('div')
                .classed('numbrix-number', true);
            num.text(String(i || ''));
        }
    }
};
