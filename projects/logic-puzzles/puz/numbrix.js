function Numbrix(size, difficulty) {
    if (!(this instanceof Numbrix))
        return new Numbrix(size, difficulty);
    this._size = size;
    this._last = size * size;
    var path = hampath.generate({width: size, height: size});
    this._grid = Array(this._last);
    var remain = [];
    for (var i = 0; i < path.data.length; i ++) {
        this._set(path.data[i][0], path.data[i][1], i+1);
        if (i > 0 && i < this._last-2) remain.push(i+1);
    }

    var maxStretch = Math.floor(3 + 7 * difficulty / 10);
    var maxiter = remain.length;
    var done = false;
    for (var i = 0; !done && i < maxiter; i ++) {
        console.info('removing, i = ' + i + ' of ' + maxiter);
        for (var j = 0; j < 5; j ++) {
            var idx = Math.floor(Math.random() * remain.length);
            var at = remain[idx];
            console.info('  try ' + at);
            this._stretch = 0;
            remain.splice(idx, 1);
            for (var k = 1; k < remain.length; k ++)
                this._stretch = Math.max(this._stretch, remain[k] - remain[k-1] - 1);
            remain.splice(idx, 0, [at]);
            if (this._stretch > maxStretch) {
                console.info('    no, too much stretch');
                continue;
            }
            var loc = this._find(at);
            if (loc) {
                this._set(loc.x, loc.y);
                this._solve();
                this._difficulty = Math.floor(Math.log(this._choices) / Math.log(2.4) - 10);
                
                if (this._multipleSolutions) {
                    console.info('    no, multiple solutions');
                    this._set(loc.x, loc.y, at);
                } else if (this._difficulty > difficulty) {
                    console.info('    no, too difficult');
                    this._set(loc.x, loc.y, at);
                    done = true;
                } else {
                    console.info('    ok, stretch = ' + this._stretch + ', choices = ' + this._choices + ', difficulty = ' + this._difficulty);
                    remain.splice(idx, 1);
                    done = this._difficulty == difficulty;
                    break;
                }
            } else
                console.info('    no, not present');
        }
    }
}

Numbrix.prototype._get = function(x, y) {
    if (x < 0 || y < 0 || x > this._size || y > this._size)
        return -1;
    return this._grid[y * this._size + x];
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

Numbrix.prototype._solveNext = function(at, x, y) {
    if (at == this._last + 1) {
        if (this._solution)
            this._multipleSolutions = true;
        else
            this._solution = this._grid.slice();
        return;
    }
    var self = this;
    function getandmaybeskip(x, y) {
        var v = self._get(x, y);
        if (v == at) {
            self._solveNext(at+1, x, y);
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

    function tryset(d, x, y) {
        if (!d) {
            self._set(x, y, at);
            self._solveNext(at+1, x, y);
            self._set(x, y);
            if (self._multipleSolutions)
                return true;
        }
        return false;
    }
    if (!n + !e + !s + !w > 1)
        this._choices ++;
    if (tryset(n, x, y-1)) return;
    if (tryset(e, x+1, y)) return;
    if (tryset(s, x, y+1)) return;
    if (tryset(w, x-1, y)) return;
};

Numbrix.prototype._solve = function(size, grid) {
    this._choices = 0;
    this._solution = null;
    this._multipleSolutions = false;
    var loc = this._find(1);
    this._solveNext(2, loc.x, loc.y);
};

Numbrix.prototype.render = function(html) {
    var tbody = html.clear().append('table')
        .classed('grid', true)
        .append('tbody');
    for (var y = 0; y < this._size; y ++) {
        var tr = tbody.append('tr');
        for (var x = 0; x < this._size; x ++) {
            var td = tr.append('td');
            var i = this._get(x, y);
            var inner = td;
            if (i == 1 || i == this._last) {
                inner.append('div')
                    .classed('numbrix-start', true);
                inner = inner.append('div');
            } else if (i)
                td.classed('numbrix-given', true);
            inner.classed('numbrix-number', true);
            inner.text(String(i || ''));
        }
    }
};
