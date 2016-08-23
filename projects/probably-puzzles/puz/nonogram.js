function Nonogram() {
    if (!(this instanceof Nonogram))
        return new Nonogram();
    this._id = 'nonogram'+(Nonogram._instance ++)+'_';
    this._defsize = 10;
    this._defdifficulty = 5;
}
Nonogram.ID = 'nonogram';
Nonogram.NAME = 'Nonogram';
Nonogram.INFO = 'Invented independently by Non Ishida and Tetsuya Nishio, Nonogram is a logic puzzle where you color the cells of a grid to reveal a hidden picture.  It is also called Paint by Numbers or Griddler, and many other names.  Some variations use different colors.';
Nonogram._instance = 1;

Nonogram.prototype._getNumbers = function() {
    var ret = {};
    ret.maxacross = 0;
    ret.across = Array(this._size);
    for (var y = 0; y < this._size; y ++) {
        var numbers = [];
        var on = false;
        var next;
        var number = 0;
        for (var x = 0; x < this._size; x ++) {
            next = this._get(x, y) == true;
            if (on) {
                number ++;
                if (!next) {
                    numbers.push(number);
                    number = 0;
                }
            }
            on = next;
        }
        if (on)
            numbers.push(number+1);
        ret.maxacross = Math.max(ret.maxacross, numbers.length);
        ret.across[y] = numbers;
    }
    ret.maxdown = 0;
    ret.down = Array(this._size);
    for (var x = 0; x < this._size; x ++) {
        var numbers = [];
        var on = false;
        var next;
        var number = 0;
        for (var y = 0; y < this._size; y ++) {
            next = this._get(x, y) == true;
            if (on) {
                number ++;
                if (!next) {
                    numbers.push(number);
                    number = 0;
                }
            }
            on = next;
        }
        if (on)
            numbers.push(number+1);
        ret.maxdown = Math.max(ret.maxdown, numbers.length);
        ret.down[x] = numbers;
    }
    return ret;
};

Nonogram.prototype.generate = function(size, difficulty) {
    this._size = size;
    this._difficulty = difficulty;
    this._grid = Array(size * size);
    if (difficulty == 10) {
        for (var y = 0; y < size; y ++)
            for (var x = 0; x < size; x ++)
                this._set(x, y, Math.random() > 0.5);
    } else {
        var xoff = Math.random()*100000;
        var yoff = Math.random()*100000;
        var scale = (difficulty * 8 / 10) / size;
        for (var y = 0; y < size; y ++)
            for (var x = 0; x < size; x ++)
                this._set(x, y, noise.simplex2(xoff+x*scale, yoff+y*scale) > 0);
    }
    var numbers = this._getNumbers(this._grid, size);
    this._maxacross = numbers.maxacross;
    this._across = numbers.across;
    this._maxdown = numbers.maxdown;
    this._down = numbers.down;
    this._solution = this._grid;
};

Nonogram._get = function(grid, size, x, y) {
    if (x < 0 || y < 0 || x > size || y > size)
        return -1;
    return grid[y * size + x];
};

Nonogram.prototype._get = function(x, y) {
    return Nonogram._get(this._grid, this._size, x, y);
};

Nonogram.prototype._set = function(x, y, v) {
    this._grid[y * this._size + x] = v;
};

Nonogram.prototype._updateCell = function(x, y) {
    if (x < 0 || x >= this._size || y < 0 || y >= this._size)
        return;
    var csize = this._cellsize;
    var td = Html('#'+this._id+'cell_'+x+'_'+y);
    var svg = Html('#'+this._id+'svg_'+x+'_'+y);
    var val = this._get(x, y);
    svg.clear();
    if (val == '_') {
        svg.append('circle')
            .classed('nonogram-dot', true)
            .attr('cx', csize/2)
            .attr('cy', csize/2)
            .attr('r', Math.max(2, csize/6));
    }
    td.classed('nonogram-hover', this._hover && this._hover.x == x && this._hover.y == y);
    td.classed('nonogram-filled', val == true);
};

Nonogram.prototype._updateGivens = function(x, y, over) {
    for (var i = 0; i < this._maxdown; i ++) {
        Html('#'+this._id+'down_'+x+'_'+i)
            .classed('nonogram-given-hover', over);
    }
    for (var i = 0; i < this._maxacross; i ++) {
        Html('#'+this._id+'across_'+y+'_'+i)
            .classed('nonogram-given-hover', over);
    }
};

Nonogram.prototype._cellEnter = function(x, y, event) {
    if (this._done)
        return;
    if (event.buttons == 1)
        this._set(x, y, this._paint);
    this._hover = {x: x, y: y};
    this._updateGivens(x, y, true);
    this._updateCell(x, y);
    this._checkVictory();
};

Nonogram.prototype._cellLeave = function(x, y, event) {
    if (this._hover)
        this._updateGivens(this._hover.x, this._hover.y, false);
    this._hover = null;
    this._updateCell(x, y);
};

Nonogram.prototype._mouseDown = function(x, y, event) {
    if (this._done)
        return;
    if (event.button)
        return;
    event.preventDefault();
    var val = this._get(x, y);
    if (val == '_')
        this._paint = false;
    else if (val)
        this._paint = '_';
    else
        this._paint = true;
    this._set(x, y, this._paint);
    this._updateCell(x, y);
    this._checkVictory();
};

Nonogram.prototype._cellClick = function(x, y, event) {
    if (this._done)
        return;
};

Nonogram.prototype._render = function(html, cellsize) {
    this._cellsize = cellsize || Math.min(36, Math.floor((640 - (this._size + this._maxdown)) / (this._size + this._maxdown)));
    var csize = this._cellsize;
    var fsize = Math.ceil(csize * 26 / 36);
    var tbody = html.clear().append('table')
        .classed('grid', true)
        .classed('nonogram-grid', true)
        .append('tbody');
    for (var y = 0; y < this._maxdown; y ++) {
        var tr = tbody.append('tr');
        for (var x = 0; x < this._maxacross; x ++) {
            tr.append('td')
                .classed('nonogram-given', true)
                .attr('style', 'width: '+csize+'px; height: '+csize+'px')
        }
        for (var x = 0; x < this._size; x ++) {
            var num = tr.append('td')
                .attr('id', this._id+'down_'+x+'_'+y)
                .attr('style', 'width: '+csize+'px; height: '+csize+'px')
                .classed('nonogram-given', true)
                .append('div')
                .classed('nonogram-number', true)
                .attr('style', 'font-size: '+fsize+'px');
            var numbers = this._down[x];
            if (y >= this._maxdown - numbers.length)
                num.text(String(numbers[y - this._maxdown + numbers.length]));
        }
    }
    for (var y = 0; y < this._size; y ++) {
        var tr = tbody.append('tr');
        for (var x = 0; x < this._maxacross; x ++) {
            var num = tr.append('td')
                .attr('id', this._id+'across_'+y+'_'+x)
                .attr('style', 'width: '+csize+'px; height: '+csize+'px')
                .classed('nonogram-given', true)
                .append('div')
                .classed('nonogram-number', true)
                .attr('style', 'font-size: '+fsize+'px');
            var numbers = this._across[y];
            if (x >= this._maxacross - numbers.length)
                num.text(String(numbers[x - this._maxacross + numbers.length]));
        }
        for (var x = 0; x < this._size; x ++) {
            var td = tr.append('td')
                .attr('id', this._id+'cell_'+x+'_'+y)
                .attr('style', 'width: '+csize+'px; height: '+csize+'px')
                .on('mouseenter', this._cellEnter.bind(this, x, y))
                .on('mouseleave', this._cellLeave.bind(this, x, y))
                .on('mousedown', this._mouseDown.bind(this, x, y))
                .on('click', this._cellClick.bind(this, x, y))
                .classed('nonogram-cell', true)
                .classed('nonogram-right', x == this._size - 1)
                .classed('nonogram-bottom', y == this._size - 1);
            td.append('svg')
                .attr('id', this._id+'svg_'+x+'_'+y)
                .classed('nonogram-svg', true)
                .attr('width', csize)
                .attr('height', csize);
            this._updateCell(x, y);
        }
    }
    var ui = html.append('div')
        .attr('id', this._id+'ui')
        .classed('nonogram-ui', true);
    ui.append('div')
        .classed('nonogram-quit', true)
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Quit')
        .on('click', this._finish);
};

Nonogram.prototype.start = function(html, finish, cellsize) {
    this._done = false;
    this._grid = Array(this._size * this._size);
    this._finish = finish;
    this._render(html, cellsize);
};

Nonogram.prototype._checkVictory = function() {
    var n = this._getNumbers(this._grid, this._size);
    if (JSON.stringify(n.across) == JSON.stringify(this._across)
        && JSON.stringify(n.down) == JSON.stringify(this._down))
        this._victory();
};

Nonogram.prototype._victory = function() {
    this._done = true;
    var ui = Html('#'+this._id+'ui').clear();
    ui.append('div')
        .classed('nonogram-victory', true)
        .text('Solved!');
    ui.append('div')
        .classed('nonogram-back', true)
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Back')
        .on('click', this._finish);
};

Nonogram.prototype.menu = function(menu, finish) {
    var self = this;
    var sizeDiv = menu.append('div');
    sizeDiv.append('span')
        .text('Size: ');
    var size = sizeDiv.append('select');
    for (var i = 5; i <= 25; i ++) {
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
