function Hidato() {
    if (!(this instanceof Hidato))
        return new Hidato();
    this._id = 'hidato'+(Hidato._instance ++)+'_';
    this._defsize = 9;
    this._defdifficulty = 5;
}
Hidato.ID = 'hidato';
Hidato.NAME = 'Hidato-like';
Hidato.INFO = 'Invented by Dr. Gyora M. Benedek, Hidato is a logic puzzle where you construct a Hamiltonian path of consecutive numbers.  It is like Numbrix except that you can move diagonally.  This variation uses a plain square grid, though it can come in other forms.  For instance, the <a target="_blank" href="">Hidato website</a> has some playable hexagonal ("beehive") variations.';
Hidato._instance = 1;

Hidato.prototype._generateStep = function() {
    var self = this;
    var state = this._generateState;
    if (state.i >= state.count) {
        state.finish();
        return;
    }
    //console.info('removing, i = ' + state.i + ' of ' + state.remain.length);
    var p = Math.pow(Math.max(0, (state.difficulty / state.targetDifficulty) || 0), 2);
    p = (p + Math.pow(state.i/state.count, 2))/2;
    state.progress(p);
    var idx = Math.floor(Math.random() * state.remain.length);
    var at = state.remain[idx];
    //console.info('  try ' + at);
    stretch = 0;
    var remainafter = state.remain.slice();
    remainafter.splice(idx, 1);
    var stest = [1].concat(remainafter).concat(this._last);
    for (var k = 1; k < stest.length; k ++)
        stretch = Math.max(stretch, stest[k] - stest[k-1] - 1);
    if (stretch > state.maxStretch) {
        //console.info('    no, too much stretch');
    } else {
        var loc = this._find(at);
        if (loc) {
            this._set(loc.x, loc.y);
            this._solve(state.maxChoices, remainafter, function(solve) {
                var thisDifficulty = Math.floor(Math.log(solve.choices) / Math.log(2) - 4);
                
                if (solve.multipleSolutions) {
                    //console.info('    no, multiple solutions');
                    self._set(loc.x, loc.y, at);
                } else if (!solve.solution || thisDifficulty > state.targetDifficulty) {
                    //console.info('    no, too difficult');
                    self._set(loc.x, loc.y, at);
                } else {
                    //console.info('    ok, stretch = ' + stretch + ', choices = ' + solve.choices + ', difficulty = ' + thisDifficulty);
                    //self._render(Html('#main'));
                    state.remain = remainafter;
                    state.difficulty = thisDifficulty;
                    state.solution = solve.solution;
                    state.choices = solve.choices;
                    state.stretch = stretch;
                    state.lastProgress = state.i;
                }
                state.i ++;
                setTimeout(self._generateStep.bind(self), 10);
            });
            return;
        } else
            ;//console.info('    no, not present');
    }
    state.i ++;
    if (state.i - state.lastProgress > 5)
        state.finish();
    else
        setTimeout(this._generateStep.bind(this), 10);
};

Hidato.prototype.generate = function(size, difficulty, progress, finish) {
    var self = this;
    this._size = size;
    this._last = size * size;
    var path = hampath2(size, true);
    this._grid = Array(this._last);
    var remain = [];
    for (var i = 0; i < path.length; i ++) {
        this._set(path[i][0], path[i][1], i+1);
        if (i > 0 && i < this._last-1) remain.push(i+1);
    }
    var state = this._generateState = {
        progress: progress,
        maxStretch: Math.floor(2 + 7 * difficulty / 10),
        maxChoices: Math.pow(2, 5 + difficulty),
        difficulty: NaN,
        targetDifficulty: difficulty,
        i: 0,
        count: remain.length,
        remain: remain
    };
    state.finish = function() {
        self._solution = state.solution;
        self._choices = state.choices;
        self._difficulty = state.difficulty;
        self._stretch = state.stretch;
        self._given = [1].concat(state.remain).concat(self._last);
        self._startGiven = self._given.slice();
        self._startGrid = self._grid.slice();
        delete self._generateState;
        console.info('done, stretch = ' + self._stretch + ', choices = ' + self._choices + ', difficulty = ' + self._difficulty);
        finish();
    };
    this._generateStep();
};

Hidato._get = function(grid, size, x, y) {
    if (x < 0 || y < 0 || x > size || y > size)
        return -1;
    return grid[y * size + x];
};

Hidato.prototype._get = function(x, y) {
    return Hidato._get(this._grid, this._size, x, y);
};

Hidato.prototype._set = function(x, y, v) {
    this._grid[y * this._size + x] = v;
};

Hidato.prototype._find = function(num) {
    for (var i = 0; i < this._grid.length; i ++) {
        if (this._grid[i] == num) {
            var y = Math.floor(i / this._size);
            var x = i - y * this._size;
            return {x: x, y: y};
        }
    }
    return null;
};

Hidato.prototype._solveNext = function(at, x, y, grid, nidx) {
    var state = this._solveState;
    //console.info('trying ' + (at-1) + ' at ' + x + ',' + y);
    if (at == this._last + 1) {
        if (state.solution) {
            state.multipleSolutions = true;
            state.solveTodo = [];
        } else
            state.solution = grid;
        return;
    }
    var self = this;
    function getandmaybeskip(x, y) {
        var v = Hidato._get(grid, self._size, x, y);
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
    var ne = getandmaybeskip(x+1, y-1);
    if (ne == -2) return;
    var se = getandmaybeskip(x+1, y+1);
    if (se == -2) return;
    var sw = getandmaybeskip(x-1, y+1);
    if (sw == -2) return;
    var nw = getandmaybeskip(x-1, y-1);
    if (nw == -2) return;

    if (nidx < state.numbers.length && at == state.numbers[nidx])
        return;

    var choice = !n + !e + !s + !w + !ne + !se + !sw + !nw > 1;
    if (choice)
        state.choices ++;
    if (state.choices > state.maxChoices) {
        state.solveTodo = [];
        return;
    }

    function tryset(d, x, y) {
        if (!d) {
            if (choice) {
                var ngrid = grid.slice();
                ngrid[y * self._size + x] = at;
                state.solveTodo.push([at+1, x, y, ngrid, nidx]);
            } else {
                grid[y * self._size + x] = at;
                self._solveNext(at+1, x, y, grid, nidx);
            }
            if (state.multipleSolutions)
                return true;
        }
        return false;
    }
    if (tryset(n, x, y-1)) return;
    if (tryset(e, x+1, y)) return;
    if (tryset(s, x, y+1)) return;
    if (tryset(w, x-1, y)) return;
    if (tryset(ne, x+1, y-1)) return;
    if (tryset(se, x+1, y+1)) return;
    if (tryset(sw, x-1, y+1)) return;
    if (tryset(nw, x-1, y-1)) return;
};

Hidato.prototype._solveBatch = function() {
    var state = this._solveState;
    if (state.solveAt >= state.solveTodo.length) {
        state.finish();
        return;
    }
    for (; state.solveAt < 20000 && state.solveAt < state.solveTodo.length; state.solveAt ++) {
        var next = state.solveTodo[state.solveAt];
        var at = next[0];
        var x = next[1];
        var y = next[2];
        var grid = next[3];
        var nidx = next[4];
        this._solveNext(at, x, y, grid, nidx);
    }
    state.solveTodo.splice(0, state.solveAt);
    state.solveAt = 0;
    //console.info('.');
    setTimeout(this._solveBatch.bind(this), 10);
};

Hidato.prototype._solve = function(maxChoices, numbers, finish) {
    var state = this._solveState = {
        maxChoices: maxChoices,
        numbers: numbers,
        choices: 0,
        solution: null,
        multipleSolutions: false
    };
    var loc = this._find(1);
    var nidx = state.numbers[0] == 2 ? 1 : 0;
    state.solveTodo = [[2, loc.x, loc.y, this._grid.slice(), nidx]];
    state.solveAt = 0;
    state.finish = function() {
        var ret = {
            choices: state.choices,
            solution: state.solution,
            multipleSolutions: state.multipleSolutions
        };
        delete this._solveState;
        finish(ret);
    };
    this._solveBatch();
};

Hidato.prototype._updateCell = function(x, y) {
    if (x < 0 || x >= this._size || y < 0 || y >= this._size)
        return;
    var csize = this._cellsize;
    var td = Html('#'+this._id+'cell_'+x+'_'+y);
    var svg = Html('#'+this._id+'svg_'+x+'_'+y);
    var num = this._get(x, y);
    var n = Math.abs(this._get(x, y - 1) - num) == 1;
    var e = Math.abs(this._get(x + 1, y) - num) == 1;
    var s = Math.abs(this._get(x, y + 1) - num) == 1;
    var w = Math.abs(this._get(x - 1, y) - num) == 1;
    var ne = Math.abs(this._get(x + 1, y - 1) - num) == 1;
    var se = Math.abs(this._get(x + 1, y + 1) - num) == 1;
    var sw = Math.abs(this._get(x - 1, y + 1) - num) == 1;
    var nw = Math.abs(this._get(x - 1, y - 1) - num) == 1;
    svg.clear();
    if (num == 1 || num == this._last) {
        svg.append('circle')
            .classed('hidato-start', true)
            .attr('cx', csize/2)
            .attr('cy', csize/2)
            .attr('r', csize/2);
    }
    if (n || e || s || w || ne || se || sw || nw) {
        svg.attr('width', csize)
            .attr('height', csize);
        function line(x2, y2) {
            svg.append('line')
                .classed('hidato-line', true)
                .attr('x1', csize/2)
                .attr('y1', csize/2)
                .attr('x2', x2)
                .attr('y2', y2);
        }
        if (n) line(csize/2, 0);
        if (e) line(csize, csize/2);
        if (s) line(csize/2, csize);
        if (w) line(0, csize/2);
        if (ne) line(csize, 0);
        if (se) line(csize, csize);
        if (sw) line(0, csize);
        if (nw) line(0, 0);
    }
    td.classed('hidato-pointer', !!num);
    Html('#'+this._id+'num_'+x+'_'+y)
        .text(String(num || ''));
};

Hidato.prototype._cellEnter = function(x, y) {
    if (this._done)
        return;
    this._hover = {x: x, y: y};
    this._updateCell(x, y);
};

Hidato.prototype._cellLeave = function(x, y) {
    if (this._done)
        return;
    this._hover = null;
    this._updateCell(x, y);
};

Hidato.prototype._mouseDown = function(event) {
    event.preventDefault();
};

Hidato.prototype._updateNext = function() {
    if (this._done)
        return;
    Html('#'+this._id+'num').text(String(this._number || ''));
    Html('#'+this._id+'next').attr('style', 'display: '+(this._number ? 'inline' : 'none'));
};

Hidato.prototype._cellClick = function(x, y, event) {
    if (this._done)
        return;
    var num = this._get(x, y);
    if (num) {
        var before = num > 1, after = num < this._last;
        for (var i = 0; i < this._given.length; i ++) {
            var n = this._given[i];
            if (n == num - 1)
                before = false;
            if (n == num + 1)
                after = false;
        }
        if (after && (this._number == null || Math.abs(this._number - num) != 1)) {
            this._number = num + 1;
            this._direction = 1;
        } else if (before && this._number != num - 1) {
            this._number = num - 1;
            this._direction = -1;
        } else {
            this._number = this._direction = null;
            if (num != 1 && num != this._last && this._startGiven.indexOf(num) < 0) {
                this._set(x, y);
                this._given.splice(this._given.indexOf(num), 1);
                this._number = num;
                if (this._given.indexOf(num+1) < 0 || this._given.indexOf(num-1) >= 0)
                    this.direction = 1;
                else 
                    this.direction = -1;
            }
        }
        this._lastLoc = {x: x, y: y};
        this._updateNext();
    } else {
        var num = this._number;
        var n = Math.abs(this._get(x, y - 1) - num) == 1;
        var e = Math.abs(this._get(x + 1, y) - num) == 1;
        var s = Math.abs(this._get(x, y + 1) - num) == 1;
        var w = Math.abs(this._get(x - 1, y) - num) == 1;
        var ne = Math.abs(this._get(x + 1, y - 1) - num) == 1;
        var se = Math.abs(this._get(x + 1, y + 1) - num) == 1;
        var sw = Math.abs(this._get(x - 1, y + 1) - num) == 1;
        var nw = Math.abs(this._get(x - 1, y - 1) - num) == 1;
        if (num && (n || e || s || w || ne || se || sw || nw)) {
            this._set(x, y, num);
            this._given.push(num);
            this._given.sort();
            this._lastLoc = {x: x, y: y};
            this._number += this._direction;
            while (this._number > 1 && this._number < this._last && this._given.indexOf(this._number) >= 0) {
                this._lastLoc = this._find(this._number);
                this._number += this._direction || 1;
            }
            if (this._number == 1 || this._number == this._last)
                this._number = this._direction = null;
            this._updateNext();
        }
    }
    this._updateCell(x, y);
    this._updateCell(x-1, y);
    this._updateCell(x, y-1);
    this._updateCell(x+1, y);
    this._updateCell(x, y+1);
    this._updateCell(x-1, y-1);
    this._updateCell(x+1, y-1);
    this._updateCell(x+1, y+1);
    this._updateCell(x-1, y+1);
    if (this._given.length == this._last) {
        var correct = true;
        for (var i = 0; i < this._grid.length; i ++) {
            if (this._grid[i] != this._solution[i])
                correct = false;
        }
        if (correct)
            this._victory();
    }
};

Hidato.prototype._render = function(html, cellsize) {
    this._cellsize = cellsize || 36;
    var csize = this._cellsize;
    var tbody = html.clear().append('table')
        .classed('grid', true)
        .append('tbody');
    for (var y = 0; y < this._size; y ++) {
        var tr = tbody.append('tr');
        for (var x = 0; x < this._size; x ++) {
            td = tr.append('td')
                .attr('id', this._id+'cell_'+x+'_'+y)
                .attr('style', 'width: '+csize+'px; height: '+csize+'px; font-size: '+(csize*19/36)+'px')
                .on('mouseenter', this._cellEnter.bind(this, x, y))
                .on('mouseleave', this._cellLeave.bind(this, x, y))
                .on('mousedown', this._mouseDown.bind(this))
                .on('click', this._cellClick.bind(this, x, y))
                .classed('hidato-cell', true);
            var num = this._startGrid[y * this._size + x];
            if (num > 1 && num < this._last)
                td.classed('hidato-given', true);
            td.append('svg')
                .attr('id', this._id+'svg_'+x+'_'+y)
                .classed('hidato-svg', true)
                .attr('width', csize)
                .attr('height', csize);
            td.append('div')
                .attr('id', this._id+'num_'+x+'_'+y)
                .classed('hidato-number', true);
            this._updateCell(x, y);
        }
    }
    var ui = html.append('div')
        .attr('id', this._id+'ui')
        .classed('hidato-ui', true);
    ui.append('div')
        .classed('hidato-quit', true)
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Quit')
        .on('click', this._finish);
    var next = ui.append('div')
        .attr('id', this._id+'next')
        .attr('style', 'display: none')
        .classed('hidato-next', true);
    next.append('span')
        .text('Next: ');
    next.append('span')
        .attr('id', this._id+'num');
};

Hidato.prototype.start = function(html, finish, cellsize) {
    this._given = this._startGiven.slice();
    this._grid = this._startGrid.slice();
    this._finish = finish;
    this._render(html, cellsize);
};

Hidato.prototype._victory = function() {
    this._done = true;
    var ui = Html('#'+this._id+'ui').clear();
    ui.append('div')
        .classed('hidato-victory', true)
        .text('Solved!');
    ui.append('div')
        .classed('hidato-back', true)
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Back')
        .on('click', this._finish);
};

Hidato.prototype.menu = function(menu, finish) {
    var self = this;
    var sizeDiv = menu.append('div');
    sizeDiv.append('span')
        .text('Size: ');
    var size = sizeDiv.append('select');
    for (var i = 4; i <= 16; i ++) {
        var opt = size.append('option')
            .attr('value', String(i))
            .text(String(i));
        if (i == this._defsize)
            opt.attr('selected', 'selected');
    }
    var diffDiv = menu.append('div');
    diffDiv.append('span')
        .text('Difficulty: ');
    var diff = diffDiv.append('select');
    for (var i = 1; i <= 10; i ++) {
        var opt = diff.append('option')
            .attr('value', String(i))
            .text(String(i));
        if (i == this._defdifficulty)
            opt.attr('selected', 'selected');
    }

    function go() {
        var s = self._defsize = +size.node().value;
        var d = self._defdifficulty = +diff.node().value;
        progress_start();
        self.generate(s, d, progress_update, function() {
            progress_finish();
            self.start(Html('#main'), finish);
        });
    }

    var okDiv = menu.append('div')
    okDiv.append('a')
        .attr('href', 'javascript: void 0')
        .text('Play')
        .on('click', go);
    okDiv.append('a')
        .attr('style', 'margin-left: 20px;')
        .attr('href', 'javascript: void 0')
        .text('Back')
        .on('click', top_go);
};
