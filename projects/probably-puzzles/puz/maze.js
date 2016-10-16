function Maze() {
    if (!(this instanceof Maze))
        return new Maze();
    this._id = 'maze'+(FourColor._instance ++)+'_';
    this._defsize = 40;
}
Maze.ID = 'maze';
Maze.NAME = 'Maze';
Maze.INFO = 'A randomly generated maze, using the "recursive-backtracker" algorithm.  Use the arrow keys and find your way to the green circle.';
Maze._instance = 1;

Maze._cellsize = 20;
Maze._windowmax = 21;

Maze.prototype.generate = function(size) {
    this._size = size;
    this._maze = makeMaze(size, size);
};

Maze.prototype._updateCanvas = function() {
    var canvas = Html('#'+this._id+'canvas').node();
    var context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    var ws = Math.min(this._size, Maze._windowmax);
    var wx = Math.max(0, Math.min(this._x - (Maze._windowmax-1)/2, this._size - ws));
    var wy = Math.max(0, Math.min(this._y - (Maze._windowmax-1)/2, this._size - ws));
    var y, cy;
    for (y = 0; y < ws; y ++) {
        cy = y * Maze._cellsize;
        var x, cx;
        for (x = 0; x < ws; x ++) {
            cx = x * Maze._cellsize;
            context.fillRect(cx, cy, 1, 1);
            if (!this._maze.getPassage(wx + x, wy + y, makeMaze.dirs.NORTH))
                context.fillRect(cx, cy, Maze._cellsize, 1);
            if (!this._maze.getPassage(wx + x, wy + y, makeMaze.dirs.WEST))
                context.fillRect(cx, cy, 1, Maze._cellsize);
            if ((wx + x) == this._size - 1 && (wy + y) == this._size - 1) {
                context.fillStyle = '#4f4';
                context.beginPath();
                context.arc(cx + 0.5 + Maze._cellsize/2, cy + 0.5 + Maze._cellsize/2, Maze._cellsize/2 - 2, 0, 2 * Math.PI);
                context.fill();
                context.fillStyle = 'black';
            }
            if ((wx + x) == this._x && (wy + y) == this._y) {
                context.fillStyle = '#008';
                context.beginPath();
                context.arc(cx + 0.5 + Maze._cellsize/2, cy + 0.5 + Maze._cellsize/2, Maze._cellsize/2 - 2, 0, 2 * Math.PI);
                context.fill();
                context.fillStyle = 'black';
            }
        }
        cx = (this._size - wx) * Maze._cellsize;
        context.fillRect(cx, cy, 1, Maze._cellsize);
    }
    cy = (this._size - wy) * Maze._cellsize;
    context.fillRect(0, cy, Maze._cellsize * ws + 1, 1);
    if (this._x == this._size - 1 && this._y == this._size - 1)
        this._victory();
};

Maze.prototype._render = function(html) {
    html.clear().append('div')
        .attr('class', 'maze-grid')
        .append('canvas')
        .attr('id', this._id + 'canvas')
        .attr('width', Math.min(this._size, Maze._windowmax) * Maze._cellsize + 1)
        .attr('height', Math.min(this._size, Maze._windowmax) * Maze._cellsize + 1);
    this._updateCanvas();
    var ui = html.append('div')
        .attr('id', this._id+'ui')
        .classed('maze-ui', true);
    ui.append('div')
        .classed('maze-instruction', true)
        .text('Use arrow keys to move.');
    ui.append('div')
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Quit')
        .on('click', this._finish);
};

Maze.prototype._move = function(dir) {
    if (!this._maze.getPassage(this._x, this._y, dir))
        return;
    var npos = makeMaze.dirs.move(this._x, this._y, dir);
    this._x = npos[0];
    this._y = npos[1];
    this._updateCanvas();
};

Maze.prototype._onKeydown = function(event) {
    if (event.keyCode == 37) {
        this._move(makeMaze.dirs.WEST);
    } else if (event.keyCode == 38) {
        this._move(makeMaze.dirs.NORTH);
    } else if (event.keyCode == 39) {
        this._move(makeMaze.dirs.EAST);
    } else if (event.keyCode == 40) {
        this._move(makeMaze.dirs.SOUTH);
    }
};

Maze.prototype.start = function(html, finish) {
    this._done = false;
    this._finish = finish;
    this._x = 0;
    this._y = 0;
    this._wx = 0;
    this._wy = 0;
    this._render(html);
    this._onKeydownListener = this._onKeydown.bind(this);
    document.addEventListener('keydown', this._onKeydownListener);
};

Maze.prototype._victory = function() {
    this._done = true;
    var ui = Html('#'+this._id+'ui').clear();
    ui.append('div')
        .classed('maze-victory', true)
        .text('Solved!');
    ui.append('div')
        .classed('maze-back', true)
        .append('a')
        .attr('href', 'javascript: void 0')
        .text('Back')
        .on('click', this._finish);
};

Maze.prototype.menu = function(menu, finish) {
    var self = this;
    var sizeDiv = menu.append('div');
    sizeDiv.append('span')
        .text('Size: ');
    var size = sizeDiv.append('select');
    for (var i = 10; i <= 50; i += 5) {
        var opt = size.append('option')
            .attr('value', String(i))
            .text(String(i));
        if (i == this._defsize)
            opt.attr('selected', 'selected');
    }

    function go() {
        var s = self._defsize = +size.node().value;
        self.generate(s);
        self.start(Html('#main'), function() {
            document.removeEventListener('keydown', self._onKeydownListener);
            finish();
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
