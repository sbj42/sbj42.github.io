function FourColor() {
    if (!(this instanceof FourColor))
        return new FourColor();
    this._id = 'fourcolor'+(FourColor._instance ++)+'_';
    this._defdifficulty = 5;
}
FourColor.ID = 'fourcolor';
FourColor.NAME = 'Four Color Problem';
FourColor.INFO = 'Based on the <a target="_blank" href="https://en.wikipedia.org/wiki/Four_color_theorem">four color theorem</a>, this is a logic puzzle where you must color each region, so no two adjacent regions have the same color.';
FourColor._instance = 1;

FourColor._remove = function(arr, num) {
    for (var j = 0; j < arr.length; j ++)
        if (arr[j] == num) {
            arr.splice(j, 1);
            return;
        }
};

FourColor._replace = function(arr, from, to) {
    FourColor._remove(arr, from);
    FourColor._add(arr, to);
};

FourColor._contains = function(arr, num) {
    for (var j = 0; j < arr.length; j ++)
        if (arr[j] == num)
            return true;
    return false;
};

FourColor._add = function(arr, num) {
    if (!FourColor._contains(arr, num))
        arr.push(num);
};

FourColor.prototype.generate = function(size) {
    this._size = size;
    do {
        this._grid = Array(this._size * this._size);
        this._regions = []
        this._cells = {};
        var rn = 0;
        for (var y = 0; y < this._size; y ++) {
            for (var x = 0; x < this._size; x ++) {
                rn ++;
                this._grid[y * this._size + x] = rn;
                this._cells[rn] = [[x, y]];
                this._regions.push(rn);
            }
        }
        var self = this;
        this._neighbors = {};
        for (var i = 0; i < this._regions.length; i ++) {
            var rn = this._regions[i];
            var cells = this._cells[rn];
            var n = [];
            for (var c = 0; c < cells.length; c ++) {
                var x = cells[c][0];
                var y = cells[c][1];
                function check(dx, dy) {
                    if (x + dx < 0 || x + dx >= self._size || y + dy < 0 || y + dy >= self._size)
                        return;
                    var o = self._grid[(y + dy) * self._size + x + dx];
                    if (self._grid[y * self._size + x] != o)
                        FourColor._add(n, o);
                }
                check(0, -1);
                check(0, 1);
                check(-1, 0);
                check(1, 0);
            }
            this._neighbors[rn] = n;
        }
        console.info('generated ' + this._regions.length + ' regions');
        var removecount = this._regions.length * 2 / 3;
        for (var i = 0; i < removecount; i ++) {
            var ri = Math.floor(Math.random()*this._regions.length);
            var rn = this._regions[ri];
            var n = this._neighbors[rn];
            var ni = Math.floor(Math.random()*n.length);
            var nn = n[ni];
            var n2 = this._neighbors[nn];
            //console.info('join ' + rn + ' with ' + nn);
            for (var j = 0; j < n.length; j ++) {
                if (n[j] == nn)
                    continue;
                FourColor._replace(this._neighbors[n[j]], rn, nn);
                FourColor._add(n2, n[j]);
            }
            FourColor._remove(n2, rn);
            this._cells[nn] = this._cells[nn].concat(this._cells[rn]);
            this._regions.splice(ri, 1);
            delete this._cells[rn];
            delete this._neighbors[rn];
        }
        for (var i = 0; i < this._regions.length; i ++) {
            var rn = this._regions[i];
            var cells = this._cells[rn];
            for (var j = 0; j < cells.length; j ++) {
                var x = cells[j][0];
                var y = cells[j][1];
                this._grid[y * this._size + x] = rn;
            }
        }
        this._colors = {};
        this._colors[this._regions[0]] = 1;
        this.solve();
    } while (this._maxColor < 4);
    var colors = JSON.parse(JSON.stringify(this._solution));
    var rand = this._regions.slice();
    for (var i = 0; i < rand.length; i ++) {
        var j = Math.floor(Math.random()*(rand.length - i));
        var t = rand[j];
        rand[j] = rand[i];
        rand[i] = t;
    }
    while (true) {
        var change = false;
        for (var i = 0; i < rand.length; i ++) {
            this._colors = JSON.parse(JSON.stringify(colors));
            delete this._colors[rand[i]];
            this.solve();
            if (this._solutions == 1) {
                colors = this._colors;
                change = true;
                rand.splice(i, 1);
                i --;
            }
        }
        if (!change)
            break;
    }
    this._initColors = colors;
    delete this._colors;
};

FourColor.prototype._solveStep = function(i) {
    if (i >= this._regions.length) {
        this._solutions ++;
        if (this._solutions == 1) {
            this._solution = JSON.parse(JSON.stringify(this._colors));
            this._solutionMC = this._maxColor;
        }
        return;
    }
    var rn = this._regions[i];
    if (this._colors[rn]) {
        this._maxColor = Math.max(this._maxColor, this._colors[rn]);
        this._solveStep(i+1);
        return;
    }
    var n = this._neighbors[rn];
    var maxColorSave = this._maxColor;
    for (var c = 1; c <= 4; c ++) {
        var fail = false;
        for (var j = 0; j < n.length; j ++) {
            if (this._colors[n[j]] == c) {
                fail = true;
                break;
            }
        }
        if (fail)
            continue;
        this._colors[rn] = c;
        this._maxColor = Math.max(this._maxColor, c);
        this._solveStep(i+1);
        if (this._solutions >= 2)
            break;
    }
    delete this._colors[rn];
};

FourColor.prototype.solve = function() {
    this._solutions = 0;
    this._maxColor = 0;
    this._solveStep(0);
    this._maxColor = this._solutionMC;
};

FourColor.prototype._updateCell = function(x, y) {
    if (x < 0 || x >= this._size || y < 0 || y >= this._size)
        return;
    var rn = this._grid[y * this._size + x];
    var c = this._colors[rn];
    var cdiv = Html('#'+this._id+'color_'+x+'_'+y)
    if (c)
        cdiv.attr('style', 'background: '+this._colorcss[c-1]);
    else
        cdiv.attr('style', 'background: white');
};

FourColor.prototype._render = function(html, cellsize) {
    var h = Math.floor(Math.random() * 360);
    this._colorcss = [];
    for (var i = 0; i < 4; i ++) {
        this._colorcss.push('hsl('+((h + 90*i) % 360)+', 70%, 70%)');
    }
    this._cellsize = cellsize || 36;
    var csize = this._cellsize;
    var tbody = html.clear().append('table')
        .classed('fourcolor-grid', true)
        .append('tbody');
    var self = this;
    function diff(dx, dy) {
        if (x + dx < 0 || x + dx >= self._size || y + dy < 0 || y + dy >= self._size)
            return true;
        return self._grid[y * self._size + x] != self._grid[(y + dy) * self._size + x + dx];
    };

    for (var y = 0; y < this._size; y ++) {
        var tr = tbody.append('tr');
        for (var x = 0; x < this._size; x ++) {
            var td = tr.append('td')
                .attr('id', this._id+'cell_'+x+'_'+y)
                .attr('style', 'width: '+csize+'px; height: '+csize+'px;');
            td.append('div')
                .attr('id', this._id+'color_'+x+'_'+y)
                .classed('fourcolor-cdiv', true);
            sty = '';
            if (!diff(0, -1))
                sty += 'border-top: none;';
            if (!diff(0, 1))
                sty += 'border-bottom: none;';
            if (!diff(-1, 0))
                sty += 'border-left: none;';
            if (!diff(1, 0))
                sty += 'border-right: none;';
            if (sty)
                td.attr('style', sty);
            
            this._updateCell(x, y);
        }
    }
    var ui = html.append('div')
        .attr('id', this._id+'ui')
        .classed('fourcolor-ui', true);
    ui.append('div')
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Quit')
        .on('click', this._finish);
};

FourColor.prototype.start = function(html, finish, cellsize) {
    this._done = false;
    this._finish = finish;
    this._colors = this._initColors;
    this._render(html, cellsize);
};

FourColor.prototype._victory = function() {
    this._done = true;
    var ui = Html('#'+this._id+'ui').clear();
    ui.append('div')
        .classed('fourcolor-victory', true)
        .text('Solved!');
    ui.append('div')
        .classed('fourcolor-back', true)
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Back')
        .on('click', this._finish);
};

FourColor.prototype.menu = function(menu, finish) {
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
    // var diffDiv = menu.append('div');
    // diffDiv.append('span')
    //     .text('Difficulty: ');
    // var diff = diffDiv.append('select');
    // for (var i = 1; i <= 10; i ++) {
    //     var opt = diff.append('option')
    //         .attr('value', String(i))
    //         .text(String(i));
    //     if (i == this._defdifficulty)
    //         opt.attr('selected', 'selected');
    // }

    function go() {
        var s = self._defsize = +size.node().value;
        //var d = self._defdifficulty = +diff.node().value;
        self.generate(s);
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
