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

Shikaku.prototype._generateGrid = function(size) {
    this._size = size;
    this._grid = Array(size * size);
    var remain = [];
    for (var y = 0; y < size; y ++)
        for (var x = 0; x < size; x ++)
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
            while (x2 < size - 1 && !this._get(x2+1, p[1]))
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
            while (y2 < size - 1) {
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
            while (y2 < size - 1 && !this._get(p[1], y2+1))
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
            while (x2 < size - 1) {
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
        // this._printGrid(this._grid, size);
    }
    this._printGrid(this._grid, size);
    console.info('done, '+this._regions.length+' regions');
    this._regions.sort(function(a, b) {
        return b[3]*b[4] - a[3]*a[4];
    });
};

Shikaku.prototype._generateStep = function(i, grid) {
    if (i == this._regions.length) {
        this._solutions ++;
        //this._solutionsg.push(grid);
        return;
    }
    var r = this._regions[i];
    var g = this._givens[i];
    //console.info('step '+i+' around '+g[0]+','+g[1]);
    // this._printGrid(grid, this._size);
    for (var rw = 1; rw <= 8; rw ++) {
        for (var rh = 1; rh <= 8; rh ++) {
            if (rw * rh != g[2])
                continue;
            //console.info('  rw='+rw+' rh='+rh);
            var c = 0;
            for (var dx = 0; dx < rw; dx ++) {
                for (var dy = 0; dy < rh; dy ++) {
                    var rx = g[0] - dx;
                    var ry = g[1] - dy;
                    //console.info('    rx='+rx+' ry='+ry);
                    if (rx < 0 || ry < 0 || rx + rw > this._size || ry + rh > this._size)
                        continue;
                    var ok = true;
                    for (var x = rx; ok && x < rx + rw; x ++) {
                        for (var y = ry; ok && y < ry + rh; y ++) {
                            var num = grid[y * this._size + x];
                            if (num && num != r[0])
                                ok = false;
                        }
                    }
                    //console.info('      rx='+rx+' ry='+ry+' ok='+ok);
                    if (!ok)
                        continue;
                    var ngrid = grid.slice();
                    for (var x = rx; x < rx + rw; x ++) {
                        for (var y = ry; y < ry + rh; y ++) {
                            ngrid[y * this._size + x] = r[0];
                        }
                    }
                    this._generateStep(i+1, ngrid);
                    c ++;
                    if (this._solutions > 1 || this._choices > this._maxChoices)
                        return;
                }
            }
            if (c > 0)
                this._choices ++;
        }
    }
};

Shikaku.prototype.generate = function(size, difficulty) {
    this._maxChoices = 400000;
    while (true) {
        this._generateGrid(size);
        this._solution = this._grid;
        delete this._grid;
        for (var j = 0; j < 3; j ++) {
            this._givens = [];
            var grid = Array(size * size);
            for (var i = 0; i < this._regions.length; i ++) {
                var r = this._regions[i];
                var x = r[1] + Math.floor(Math.random() * r[3]);
                var y = r[2] + Math.floor(Math.random() * r[4]);
                this._givens.push([x, y, r[3]*r[4]]);
                grid[y * size + x] = r[0];
            }
            this._solutions = 0;
            //this._solutionsg = [];
            this._choices = 0;
            // this._printGrid(grid, size);
            this._generateStep(0, grid);
            console.info('  ' + this._solutions + ' solutions, ' + this._choices + ' choices');
            // for (var i = 0; i < this._solutions; i ++) {
            //     console.info('---');
            //     this._printGrid(this._solutionsg[i], size);
            // }
            if (this._solutions == 1 && this._choices <= this._maxChoices)
                break;
        }
        if (this._solutions == 1 && this._choices <= this._maxChoices)
            break;
    }
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
    var td = Html('#'+this._id+'cell_'+x+'_'+y);
    var num = '';
    for (var i = 0; i < this._givens.length; i ++) {
        var g = this._givens[i];
        if (g[0] == x && g[1] == y)
            num = String(g[2]);
    }
    td.text(String(num || ''));
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
                .classed('shikaku-cell', true);
            
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
    this._render(html, cellsize);
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
        self.generate(s, d);
        self.start(Html('#main'), finish);
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
