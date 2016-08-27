function Shikaku() {
    if (!(this instanceof Shikaku))
        return new Shikaku();
    this._id = 'shikaku'+(Shikaku._instance ++)+'_';
    this._defsize = 10;
    this._defdifficulty = 5;
}
Shikaku.ID = 'shikaku';
Shikaku.NAME = 'Shikaku-like';
Shikaku.INFO = 'Published by <a target="_blank" href="http://www.nikoli.co.jp/en/index.html">NIKOLI Co., Ltd.</a>, Shikaku is a logic puzzle where you divide a grid into rectangules and squares.  Each region must contain a number that is the area of the region.';
Shikaku._instance = 1;

Shikaku.prototype._printGrid = function(grid, size) {
    for (var y = 0; y < size; y ++) {
        var str = [];
        for (var x = 0; x < size; x ++) {
            var v = String(grid[y * size + x] || ' ');
            if (v.length < 2) v = ' ' + v;
            str.push(v);
        }
        var v = String(y);
        if (v.length < 2) v = ' ' + v;
        console.info(v+'    ' + str.join(' '));
    }
}

Shikaku.prototype._generateGrid = function() {
    this._grid = Array(this._size * this._size);
    var remain = [];
    for (var y = 0; y < this._size; y ++)
        for (var x = 0; x < this._size; x ++)
            remain.push([x, y]);
    var region = 1;
    this._regions = [];
    var oopses = 0;
    while (remain.length) {
        //console.info('' + remain.length + ' cells left');
        var p = remain[Math.floor(Math.random()*remain.length)];
        //console.info('  picked '+p[0]+','+p[1]);
        if (true/*Math.random() > 0.5*/) {
            var x1 = p[0], x2 = p[0];
            while (x1 > 0 && !this._get(x1-1, p[1]))
                x1 --;
            while (x2 < this._size - 1 && !this._get(x2+1, p[1]))
                x2 ++;
            var rw = Math.min(8, 1 + Math.floor(Math.random() * (x2 - x1 + 1)));
            var rx = x1 + Math.floor(Math.random() * (x2 - x1 + 1 - rw));
            //console.info('  x1='+x1+', x2='+x2+', rw='+rw+', rx='+rx);
            var y1 = p[1], y2 = p[1];
            while (y1 > 0) {
                var ok = true;
                for (var i = 0; i < rw; i ++) {
                    if (this._get(rx + i, y1 - 1))
                        ok = false;
                }
                if (!ok)
                    break;
                y1 --;
            }
            while (y2 < this._size - 1) {
                var ok = true;
                for (var i = 0; i < rw; i ++) {
                    if (this._get(rx + i, y2 + 1))
                        ok = false;
                }
                if (!ok)
                    break;
                y2 ++;
            }
            var notone = rw == 1 && y2 > y1;
            var rh = Math.min(8, Math.floor(16/rw), (notone?2:1) + Math.floor(Math.random() * (y2 - y1 + (notone?0:1))));
            var ry = y1 + Math.floor(Math.random() * (y2 - y1 + 1 - rh));
            //console.info('  y1='+y1+', y2='+y2+', rh='+rh+', ry='+ry);
        } else {
            var y1 = p[1], y2 = p[1];
            while (y1 > 0 && !this._get(p[0], y1-1))
                y1 --;
            while (y2 < this._size - 1 && !this._get(p[1], y2+1))
                y2 ++;
            var rh = Math.min(8, 1 + Math.floor(Math.random() * (y2 - y1 + 1)));
            var ry = y1 + Math.floor(Math.random() * (y2 - y1 + 1 - rh));
            //console.info('  y1='+y1+', y2='+y2+', rh='+rh+', ry='+ry);
            var x1 = p[1], x2 = p[1];
            while (x1 > 0) {
                var ok = true;
                for (var i = 0; i < rh; i ++) {
                    if (this._get(x1 - 1, ry + i))
                        ok = false;
                }
                if (!ok)
                    break;
                x1 --;
            }
            while (x2 < this._size - 1) {
                var ok = true;
                for (var i = 0; i < rh; i ++) {
                    if (this._get(x2 + 1, ry + i))
                        ok = false;
                }
                if (!ok)
                    break;
                x2 ++;
            }
            var notone = rh == 1 && x2 > x1;
            var rw = Math.min(8, Math.floor(16/rh), (notone?2:1) + Math.floor(Math.random() * (x2 - x1 + (notone?0:1))));
            var rx = x1 + Math.floor(Math.random() * (x2 - x1 + 1 - rw));
            //console.info('  x1='+x1+', x2='+x2+', rw='+rw+', rx='+rx);
        }
        if (rw == 1 && rh == 1) {
            if (oopses < 5 && remain.length > 1) {
                oopses ++;
                continue;
            }
            oopses = 0;
            //console.info('    doh');
            var neighbors = [];
            for (var i = 0; i < this._regions.length; i ++) {
                var r = this._regions[i];
                if ((r[1] == rx + 1 || r[1] + r[3] == rx)
                    && (r[2] <= ry && r[2] + r[4] > ry))
                    neighbors.push(i);
                else if ((r[1] <= rx && r[1] + r[3] > rx)
                    && (r[2] == ry + 1 || r[2] + r[4] == ry))
                    neighbors.push(i);
            }
            var i = neighbors[Math.floor(Math.random()*neighbors.length)];
            var r = this._regions.splice(i, 1)[0];
            var rx = r[1];
            var ry = r[2];
            var rw = r[3];
            var rh = r[4];
            //console.info('  dropping '+rx+','+ry+' '+rw+'x'+rh);
            for (var x = rx; x < rx + rw; x ++)
                for (var y = ry; y < ry + rh; y ++) {
                    this._set(x, y);
                    remain.push([x, y]);
                }
        } else {
            oopses = 0;
            for (var x = rx; x < rx + rw; x ++)
                for (var y = ry; y < ry + rh; y ++)
                    this._set(x, y, region);
            for (var i = 0; i < remain.length; i ++) {
                var x = remain[i][0];
                var y = remain[i][1];
                if (x >= rx && x < rx + rw && y >= ry && y < ry + rh) {
                    //console.info('  removing '+x+','+y);
                    remain.splice(i, 1);
                    i --;
                }
            }
            this._regions.push([region, rx, ry, rw, rh]);
            region ++;
        }
        // this._printGrid(this._grid, this._size);
    }
    //this._printGrid(this._grid, this._size);
    //console.info('done, '+this._regions.length+' regions');
//     this._regions.sort(function(a, b) {
//         return b[1] < a[1];
// //        return b[3]*b[4] - a[3]*a[4];
//     });
};

Shikaku.prototype._solveNext = function(i, grid) {
    var state = this._solveState;
    if (i == state.givens.length) {
        state.solutions ++;
        //state.solutionsg.push(grid);
        if (state.solutions > 1)
            state.solveTodo = [];
        return;
    }
    var g = state.givens[i];
    var poss = state.gposs[i];
    // if (i > 12) {
    //     console.info('step '+(i+1)+' around '+g[0]+','+g[1]);
    //     this._printGrid(grid, this._size);
    // }
    var c = 0;
    for (var j = 0; j < poss.length; j ++) {
        var rx = poss[j][0];
        var ry = poss[j][1];
        var rw = poss[j][2];
        var rh = poss[j][3];
        var ok = true;
        for (var x = rx; ok && x < rx + rw; x ++) {
            for (var y = ry; ok && y < ry + rh; y ++) {
                var num = grid[y * this._size + x];
                if (num && num != i+1)
                    ok = false;
            }
        }
        //console.info('      rx='+rx+' ry='+ry+' rw='+rw+' rh='+rh+' ok='+ok);
        if (!ok)
            continue;
        //console.info('      rx='+rx+' ry='+ry+' rw='+rw+' rh='+rh);
        var ngrid = grid.slice();
        for (var x = rx; x < rx + rw; x ++) {
            for (var y = ry; y < ry + rh; y ++) {
                ngrid[y * this._size + x] = i+1;
            }
        }
        state.solveTodo.push([i+1, ngrid]);
        c ++;
    }
    if (c > 1)
        state.choices ++;
    if (state.choices > state.maxChoices)
        state.solveTodo = [];
};

Shikaku.prototype._solveBatch = function() {
    var state = this._solveState;
    if (state.solveAt >= state.solveTodo.length) {
        state.finish();
        return;
    }
    state.progress(state.choices / state.maxChoices);
    for (; state.solveAt < 20000 && state.solveAt < state.solveTodo.length; state.solveAt ++) {
        var next = state.solveTodo[state.solveAt];
        var i = next[0];
        var grid = next[1];
        this._solveNext(i, grid);
    }
    state.solveTodo.splice(0, state.solveAt);
    state.solveAt = 0;
    //console.info('.' +  state.choices);
    setTimeout(this._solveBatch.bind(this), 10);
};

Shikaku.prototype._solve = function(givens, maxChoices, progress, finish) {
    var self = this;
    var tmp = Array(this._size * this._size);
    for (var i = 0; i < givens.length; i ++) {
        var g = givens[i];
        tmp[g[1] * this._size + g[0]] = true;
    }
    // givens.sort(function(a, b) {
    //     function count(x, y) {
    //         if (x < 0 || y < 0 || x >= self._size || y >= self._size || tmp[y * self._size + x])
    //             return 1;
    //         return 0;
    //     }
    //     var ascore = count(a[0]-1, a[1]) + count(a[0]+1, a[1]) + count(a[0], a[1]-1) + count(a[0], a[1]+1);
    //     var bscore = count(b[0]-1, b[1]) + count(b[0]+1, b[1]) + count(b[0], b[1]-1) + count(b[0], b[1]+1);
    //     if (ascore != bscore)
    //         return bscore - ascore;
    //     return b[2] - a[2];
    // });
    var grid = Array(this._size * this._size);
    for (var i = 0; i < givens.length; i ++) {
        var g = givens[i];
        grid[g[1] * this._size + g[0]] = i+1;
    } 
    var gposs = [];
    for (var i = 0; i < givens.length; i ++) {
        var g = givens[i];
        var poss = [];
        for (var rw = 1; rw <= 8; rw ++) {
            for (var rh = 1; rh <= 8; rh ++) {
                if (rw * rh != g[2])
                    continue;
                var c = 0;
                for (var dx = 0; dx < rw; dx ++) {
                    for (var dy = 0; dy < rh; dy ++) {
                        var rx = g[0] - dx;
                        var ry = g[1] - dy;
                        if (rx < 0 || ry < 0 || rx + rw > this._size || ry + rh > this._size)
                            continue;
                        var ok = true;
                        for (var x = rx; ok && x < rx + rw; x ++) {
                            for (var y = ry; ok && y < ry + rh; y ++) {
                                var num = grid[y * this._size + x];
                                if (num && num != i+1)
                                    ok = false;
                            }
                        }
                        if (!ok)
                            continue;
                        poss.push([rx, ry, rw, rh]);
                    }
                }
            }
        }
        gposs.push(poss);
    }
    var indexes = [];
    for (var i = 0; i < givens.length; i ++)
        indexes.push(i);
    indexes.sort(function(a, b) {
        var i = gposs[a].length - gposs[b].length;
        if (i)
            return i;
        return givens[b][2] - givens[a][2];
    });
    givens = indexes.map(function(i) {
        return givens[i];
    });
    gposs = indexes.map(function(i) {
        return gposs[i];
    });
    grid = Array(this._size * this._size);
    for (var i = 0; i < givens.length; i ++) {
        var g = givens[i];
        grid[g[1] * this._size + g[0]] = i+1;
    } 
    //console.info(JSON.stringify(givens));
    //console.info(gposs.map(function(p) { return p.length; }));
    //console.info(JSON.stringify(gposs));
    //this._printGrid(grid, this._size);
    var state = this._solveState = {
        solveAt: 0,
        solveTodo: [[0, grid]],
        givens: givens,
        gposs: gposs,
        choices: 0,
        maxChoices: maxChoices,
        progress: progress,
        //solutionsg: [],
        solutions: 0
    };
    state.finish = function() {
        if (state.solutions == 0 && state.choices <= state.maxChoices) throw new Error('bug');
        var ret = {
            choices: state.choices,
            //solutionsg: state.solugionsg
            solutions: state.solutions
        };
        delete self._solveState;
        finish(ret);
    };
    this._solveBatch();
};

Shikaku.prototype._scatterNext = function() {
    var state = this._scatterState;
    if (state.scatterAt > state.scatterMax) {
        state.givens = null;
        state.finish();
        return;
    }
    givens = [];
    for (var i = 0; i < this._regions.length; i ++) {
        var r = this._regions[i];
        var x = r[1] + Math.floor(Math.random() * r[3]);
        var y = r[2] + Math.floor(Math.random() * r[4]);
        givens.push([x, y, r[3]*r[4]]);
    }
    for (var i = 0; i < givens.length; i ++) {
        for (var j = 0; j < givens.length; j ++) {
            if (i == j) continue;
            var gi = givens[i];
            var gj = givens[j];
            if (gi[2] != 2 || gj[2] != 2) continue;
            if (gi[0] + 1 != gj[0]) continue;
            var ri = this._regions[i];
            var rj = this._regions[j];
            if (gi[1] + 1 == gj[1]) {
                if (ri[1] == gi[0] && ri[2] == gi[1]
                    && rj[1] <= gj[0] && rj[2] <= gj[1]) {
                    gj[0] = rj[1];
                    gj[1] = rj[2];
                }
            } else if (gi[1] - 1 == gj[1]) {
                if (ri[1] == gi[0] && ri[2] <= gi[1]
                    && rj[1] <= gj[0] && rj[2] == gj[1]) {
                    gj[0] = rj[1];
                    gj[1] = rj[2] + rj[4] - 1;
                }
            }
        }
    }
    state.givens = givens;
    var self = this;
    this._solve(state.givens, state.maxChoices, state.progress, function(solve) {
        // if (solve.solutions > 1)
        //     console.info('  too many solutions');
        // else if (solve.choices > state.maxChoices)
        //     console.info('  too many choices');
        if (solve.solutions == 1 && solve.choices <= state.maxChoices) {
            state.choices = solve.choices;
            state.finish();
        } else {
            state.scatterAt++;
            self._scatterNext();
        }
    });
};

Shikaku.prototype._scatter = function(maxChoices, progress, finish) {
    var state = this._scatterState = {
        maxChoices: maxChoices,
        scatterAt: 0,
        scatterMax: 3
    };
    var self = this;
    state.progress = function(pct) {
        progress((state.scatterAt + pct) / (state.scatterMax + 1));
    };
    state.finish = function() {
        var ret = state.givens && {
            givens: state.givens,
            choices: state.choices
        };
        delete self._scatterState;
        finish(ret);
    };
    this._scatterNext();
};

Shikaku.prototype._generateNext = function() {
    var state = this._generateState;
    this._generateGrid();
    //console.info('.');
    var self = this;
    this._scatter(state.maxChoices, state.progress, function(scatter) {
        if (scatter) {
            self._givens = scatter.givens;
            self._choices = scatter.choices;
            //console.info('done, ' + self._regions.length + ' regions, ' + self._choices + ' choices');
            self._solution = self._regions;
            delete self._regions;
            state.finish();
        } else
            self._generateNext();
    });
};

Shikaku.prototype.generate = function(size, difficulty, progress, finish) {
    this._size = size;
    var state = this._generateState = {
        maxChoices: 100000,
        progress: progress,
        finish: finish
    };
    this._generateNext();
};

Shikaku.prototype._get = function(x, y) {
    return this._grid[y * this._size + x];
};

Shikaku.prototype._set = function(x, y, v) {
    this._grid[y * this._size + x] = v;
};

Shikaku.prototype._updateCell = function(x, y) {
    if (x < 0 || x >= this._size || y < 0 || y >= this._size)
        return;
    var csize = this._cellsize;
    var td = Html('#'+this._id+'cell_'+x+'_'+y)
        .classed('shikaku-hover', x == this._mouseX && y == this._mouseY);
    var svg = Html('#'+this._id+'svg_'+x+'_'+y)
        .clear();
    var x1 = Math.min(this._draggingX, this._mouseX);
    var x2 = Math.max(this._draggingX, this._mouseX);
    var y1 = Math.min(this._draggingY, this._mouseY);
    var y2 = Math.max(this._draggingY, this._mouseY);
    
    function makerect(className) {
        var dx1 = x == x1 ? 4 : 0;
        var dy1 = y == y1 ? 4 : 0;
        var dx2 = x == x2 ? 4 : 0;
        var dy2 = y == y2 ? 4 : 0;
        var rect = svg.append('rect')
            .classed(className, true)
            .attr('x', dx1)
            .attr('y', dy1)
            .attr('width', csize - dx2 - dx1)
            .attr('height', csize - dy2 - dy1);

        function makeline(x1, y1, x2, y2) {
            svg.append('line')
                .classed(className + '-border', true)
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2);
        }

        if (dx1)
            makeline(dx1, dy1, dx1, csize - dy2);
        if (dy1)
            makeline(dx1, dy1, csize - dx2, dy1);
        if (dx2)
            makeline(csize - dx2, dy1, csize - dx2, csize - dy2);
        if (dy2)
            makeline(dx1, csize - dy2, csize - dx2, csize - dy2);
    }

    if (this._draggingX != null
        && x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        makerect('shikaku-dragging');
    } else {
        for (var i = 0; i < this._regions.length; i ++) {
            var r = this._regions[i];
            var x1 = r[0];
            var y1 = r[1];
            var x2 = r[2];
            var y2 = r[3];
            if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                makerect('shikaku-rect');
                break;
            }
        }
    }
    var num = '';
    for (var i = 0; i < this._givens.length; i ++) {
        var g = this._givens[i];
        if (g[0] == x && g[1] == y)
            num = String(g[2]);
    }
    Html('#'+this._id+'num_'+x+'_'+y).text(String(num || ''));
};

Shikaku.prototype._updateGrid = function() {
    if (this._draggingX != null) {
        this._regions = this._regionsCopy.slice();
        var x1 = Math.min(this._draggingX, this._mouseX);
        var x2 = Math.max(this._draggingX, this._mouseX);
        var y1 = Math.min(this._draggingY, this._mouseY);
        var y2 = Math.max(this._draggingY, this._mouseY);
        for (var i = 0; i < this._regions.length; i ++) {
            var r = this._regions[i];
            if (r[0] <= x2 && r[2] >= x1 && r[1] <= y2 && r[3] >= y1) {
                this._regions.splice(i, 1);
                i --;
            }
        }
    }
    for (var xx = 0; xx < this._size; xx ++) {
        for (var yy = 0; yy < this._size; yy ++) {
            this._updateCell(xx, yy);
        }
    }
};

Shikaku.prototype._cellEnter = function(x, y, event) {
    if (this._done)
        return;
    this._mouseX = x;
    this._mouseY = y;
    this._updateGrid();
};

Shikaku.prototype._cellLeave = function(x, y, event) {
    delete this._mouseX;
    delete this._mouseY;
    this._updateGrid();
};

Shikaku.prototype._mouseDown = function(x, y, event) {
    if (this._done)
        return;
    if (event.button)
        return;
    this._regionsCopy = this._regions.slice();
    var td = Html('#'+this._id+'cell_'+x+'_'+y);
    event.preventDefault();
    this._draggingX = x;
    this._draggingY = y;
    this._draggingF = this._mouseUp.bind(this);
    document.addEventListener('mouseup', this._draggingF, true);
    this._updateGrid();
};

Shikaku.prototype._mouseUp = function(event) {
    document.removeEventListener('mouseup', this._draggingF, true);
    if (this._mouseX != null) {
        var x1 = Math.min(this._draggingX, this._mouseX);
        var x2 = Math.max(this._draggingX, this._mouseX);
        var y1 = Math.min(this._draggingY, this._mouseY);
        var y2 = Math.max(this._draggingY, this._mouseY);
        this._regions.push([x1, y1, x2, y2]);
    }
    delete this._draggingX;
    delete this._draggingY;
    delete this._draggingF;
    delete this._mouseX;
    delete this._mouseY;
    this._updateGrid();
    this._checkVictory();
};

Shikaku.prototype._render = function(html, cellsize) {
    this._cellsize = cellsize || 36;
    var csize = this._cellsize;
    var tbody = html.clear().append('table')
        .classed('grid', true)
        .classed('shikaku-grid', true)
        .append('tbody');
    for (var y = 0; y < this._size; y ++) {
        var tr = tbody.append('tr');
        for (var x = 0; x < this._size; x ++) {
            var td = tr.append('td')
                .attr('id', this._id+'cell_'+x+'_'+y)
                .attr('style', 'width: '+csize+'px; height: '+csize+'px; font-size: '+(csize*19/36)+'px')
                .on('mouseenter', this._cellEnter.bind(this, x, y))
                .on('mouseleave', this._cellLeave.bind(this, x, y))
                .on('mousedown', this._mouseDown.bind(this, x, y))
                .classed('shikaku-cell', true);
            td.append('svg')
                .attr('id', this._id+'svg_'+x+'_'+y)
                .classed('shikaku-svg', true)
                .attr('width', csize)
                .attr('height', csize);
            td.append('div')
                .attr('id', this._id+'num_'+x+'_'+y)
                .classed('shikaku-number', true);
            this._updateCell(x, y);
        }
    }
    var ui = html.append('div')
        .attr('id', this._id+'ui')
        .classed('shikaku-ui', true);
    ui.append('div')
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Quit')
        .on('click', this._finish);
};

Shikaku.prototype.start = function(html, finish, cellsize) {
    this._done = false;
    this._finish = finish;
    this._regions = [];
    this._render(html, cellsize);
};

Shikaku.prototype._checkVictory = function() {
    var area = 0;
    for (var i = 0; i < this._regions.length; i ++) {
        var r = this._regions[i];
        var x1 = r[0];
        var y1 = r[1];
        var x2 = r[2];
        var y2 = r[3];
        var count = 0;
        var bad = 0;
        for (var j = 0; j < this._givens.length; j ++) {
            var g = this._givens[j];
            var x = g[0];
            var y = g[1];
            if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                count ++;
                area += g[2];
                if (g[2] != (x2-x1+1)*(y2-y1+1))
                    bad ++;
            }
        }
        if (bad) return;
        if (count != 1) return;
    }
    if (area == this._size * this._size)
        this._victory();
};

Shikaku.prototype._victory = function() {
    this._done = true;
    var ui = Html('#'+this._id+'ui').clear();
    ui.append('div')
        .classed('shikaku-victory', true)
        .text('Solved!');
    ui.append('div')
        .classed('shikaku-back', true)
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Back')
        .on('click', this._finish);
};

Shikaku.prototype.menu = function(menu, finish) {
    var self = this;
    var sizeDiv = menu.append('div');
    sizeDiv.append('span')
        .text('Size: ');
    var size = sizeDiv.append('select');
    for (var i = 5; i <= 15; i ++) {
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
