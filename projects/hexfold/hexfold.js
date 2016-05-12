var svgNS = 'http://www.w3.org/2000/svg';

function sin(d) {
    return Math.sin(d * Math.PI / 180);
}
function cos(d) {
    return Math.cos(d * Math.PI / 180);
}

var hexr = 21;
var pad = hexr;
var hexd = hexr * 2.5;
var bsize = 7;

function dx(x, y) {
    return x * hexd * sin(60);
}

function dy(x, y) {
    return y * hexd + x * hexd * cos(60);
}

function hx(x, y) {
    return hexr + pad + dx(x + 6, y);
}

function hy(x, y) {
    return hexr * sin(60) + pad*2 + dy(x, y + 1 - (bsize - 1) / 4);
}

function f(n) {
    return n.toFixed(3);
}

function addhex(x, y, piecehome) {
    var d = [];
    var r = hexr;
    d.push('M', f(r * sin(-90)), f(r * -cos(-90))); 
    d.push('L'); 
    for (var a = -30; a < 270; a += 60)
        d.push(f(r * sin(a)), f(r * -cos(a)));
    d.push('z');
    var path = $(document.createElementNS(svgNS, 'path'))
        .attr('d', d.join(' '))
        .attr('transform', 'translate(' + f(hx(x, y)) + ' ' + f(hy(x, y)) + ')')
        .attr('class', 'hex' + (piecehome ? ' piecehome' : ''));
    $('#board').append(path);
    return path;
}

function addtext(x, y, str) {
    var text = $(document.createElementNS(svgNS, 'text'))
        .attr('transform', 'translate(' + f(hx(x, y)) + ' ' + f(hy(x, y)) + ')')
        .attr('class', 'text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(str);
    $('#board').append(text);
    return text;
}

var blocks = [];
function addblock(x, y, a) {
    var r = hexd/2;
    var rr = (r - hexr) * 0.8;
    var d = [];
    var cx = 0;
    var cy = -r;
    d.push('M', f(cx-rr), f(cy-rr));
    d.push('L', f(cx+rr), f(cy+rr));
    d.push('M', f(cx+rr), f(cy-rr));
    d.push('L', f(cx-rr), f(cy+rr));
    var path = $(document.createElementNS(svgNS, 'path'));
    path.attr('d', d.join(' '));
    var bx = hx(x, y);
    var by = hy(x, y);
    path.attr('transform', 'translate(' + f(bx) + ' ' + f(by) + ') rotate(' + a + ')');
    path.attr('class', 'block');
    bx += r * sin(a);
    by -= r * cos(a);
    if (blockedorrequired(bx, by))
        return null;
    $('#board').append(path);
    blocks.push({x: bx, y: by});
    return path;
}

var requires = [];
function addrequire(x, y, a) {
    var r = hexd/2;
    var rr = hexr/2;
    var d = [];
    d.push('M', f(-rr), f(-r));
    d.push('L', f(+rr), f(-r));
    var path = $(document.createElementNS(svgNS, 'path'));
    path.attr('d', d.join(' '));
    var bx = hx(x, y);
    var by = hy(x, y);
    path.attr('transform', 'translate(' + f(bx) + ' ' + f(by) + ') rotate(' + a + ')');
    path.attr('class', 'require');
    bx += r * sin(a);
    by -= r * cos(a);
    if (blockedorrequired(bx, by))
        return null;
    $('#board').append(path);
    requires.push({x: bx, y: by});
    return path;
}

var pieces = [{

    steps: [false, false, true, true], //J
    off: {
        x: 0,
        y: 0,
        a: -120,
        r: true
    },
    home: {
        x: -5.25,
        y: 5
    }

}, {
    steps: [true, false, false, true], //U
    off: {
        x: -1,
        y: 0,
        a: 60,
        r: false
    },
    home: {
        x: -2.25,
        y: 3
    }

}, {
    steps: [true, true, false, true], //V
    off: {
        x: 0,
        y: -1,
        a: 60,
        r: false
    },
    home: {
        x: 8.25,
        y: -2
    }

}, {
    steps: [false, true, true, false], //E
    off: {
        x: 1,
        y: -1,
        a: 0,
        r: true
    },
    home: {
        x: 11.25,
        y: -3
    }

}, {
    steps: [false, true, false, true], //N
    off: {
        x: 0,
        y: -1,
        a: 60,
        r: false
    },
    home: {
        x: -5.25,
        y: 8
    }

}, {
    steps: [true, true, true, true], //I
    off: {
        x: 0,
        y: -1,
        a: 60,
        r: false
    },
    home: {
        x: -2.25,
        y: 6
    }

}, {
    steps: [true, true, true, false], //L
    off: {
        x: 0,
        y: -1,
        a: 60,
        r: false
    },
    home: {
        x: 8.25,
        y: 1
    }

}, {
    steps: [false, true, false, false], //S
    off: {
        x: 0,
        y: -1,
        a: 60,
        r: false
    },
    home: {
        x: 11.25,
        y: 0
    }

}, {
    steps: [true, false, false, false], //Q
    off: {
        x: 0,
        y: 1,
        a: 60,
        r: true
    },
    home: {
        x: -3.25,
        y: 9
    }
}];

function addpathd(d, piece) {
    var r = hexd / 2;
    var rr = r - hexr * cos(30);
    var cw = !piece.off.r;
    var a = piece.off.a + (cw ? 90 : -90);
    var i = 0;
    var gap = 2;
    var startx = dx(piece.off.x, piece.off.y);
    var starty = dy(piece.off.x, piece.off.y);
    startx += r * sin(piece.off.a);
    starty += r * -cos(piece.off.a);
    startx += gap * sin(a);
    starty += gap * -cos(a);
    d.push('M', f(startx), f(starty));
    function next(cw) {
        var dx1 = (hexr/2 - (i == 0 ? gap : 0)) * sin(a);
        var dy1 = (hexr/2 - (i == 0 ? gap : 0)) * -cos(a);
        d.push('l', f(dx1), f(dy1));
        var s = cw ? 1 : -1;
        var cx = rr * sin(a + s * 90);
        var cy = rr * -cos(a + s * 90);
        a += s * 60;
        var dx2 = cx + rr * sin(a - s * 90);
        var dy2 = cy + rr * -cos(a - s * 90);
        d.push('a', f(rr), f(rr), 0, 0, cw ? 1 : 0, f(dx2), f(dy2));
        var dx3 = (hexr/2 - (i == 4 ? gap : 0)) * sin(a);
        var dy3 = (hexr/2 - (i == 4 ? gap : 0)) * -cos(a);
        d.push('l', f(dx3), f(dy3));
        i += 1;
    }
    $.each(piece.steps, function(i, flip) {
        next(cw);
        if (flip)
            cw = !cw;
    });
    next(cw);
}

function makepiece(piece) {
    var d = [];
    addpathd(d, piece);
    var path = $(document.createElementNS(svgNS, 'path'));
    path.attr('d', d.join(' '));
    path.attr('stroke-width', f(hexr/3)+'px');
    path.attr('class', 'piece');
    return path;
}

function addpiece(piece) {
    var path = makepiece(piece);
    var r = hexd / 2;
    var phx = hx(piece.home.x, piece.home.y);
    var phy = hy(piece.home.x, piece.home.y);
    piece.cur = {
        x: phx,
        y: phy,
        a: 0,
        sx: 1,
        z: 1
    };
    piece.dst = $.extend({}, piece.cur);
    path.attr('transform', 'translate(' + piece.cur.x + ',' + piece.cur.y + ') rotate(' + piece.cur.a + ') scale(' + piece.cur.sx * piece.cur.z + ',' + piece.cur.z + ')');
    piece.path = path;
    $('#board').append(path);
}

var tickTimer = null;
function movepiece(piece, x, y, a, sx, z, duration) {
    if (!tickTimer) {
        tickTimer = setInterval(function() {
            var done = true;
            $.each(pieces, function(i, piece) {
                if (!tick(piece, 0.01))
                    done = false;
            });
            if (done) {
                clearInterval(tickTimer);
                tickTimer = null;
            }
        }, 10);
    }
    $('#board').append(piece.path);
    piece.done = new Date();
    piece.done.setTime(piece.done.getTime() + duration * 1000);
    piece.dst = {
        x: x == null ? piece.dst.x : x,
        y: y == null ? piece.dst.y : y,
        a: a == null ? piece.dst.a : a,
        sx: sx == null ? piece.dst.sx : sx,
        z: z == null ? piece.dst.z : z
    };
    if (duration <= 0)
        tick(piece, 0);
    var da = piece.dst.a - piece.cur.a;
    while (da > 180) da -= 360;
    while (da < -180) da += 180;
    piece.delta = {
        x: (piece.dst.x - piece.cur.x) / duration,
        y: (piece.dst.y - piece.cur.y) / duration,
        a: da / duration,
        sx: (piece.dst.sx - piece.cur.sx) / duration,
        z: (piece.dst.z - piece.cur.z) / duration
    };
}

function tick(piece, duration) {
    function tick_helper(cur, dst, delta) {
        return cur + delta * duration;
    }
    if (!piece.done)
        return true;
    if (new Date() >= piece.done) {
        piece.cur.x = piece.dst.x;
        piece.cur.y = piece.dst.y;
        piece.cur.a = piece.dst.a;
        piece.cur.sx = piece.dst.sx;
        piece.cur.z = piece.dst.z;
        delete piece.done;
    } else {
        piece.cur.x = tick_helper(piece.cur.x, piece.dst.x, piece.delta.x);
        piece.cur.y = tick_helper(piece.cur.y, piece.dst.y, piece.delta.y);
        piece.cur.a = tick_helper(piece.cur.a, piece.dst.a, piece.delta.a);
        piece.cur.sx = tick_helper(piece.cur.sx, piece.dst.sx, piece.delta.sx);
        piece.cur.z = tick_helper(piece.cur.z, piece.dst.z, piece.delta.z);
    }
    piece.path.attr('transform', 'translate(' + piece.cur.x + ',' + piece.cur.y + ') scale(' + piece.cur.sx * piece.cur.z + ',' + piece.cur.z + ') rotate(' + piece.cur.a + ')');
}

var pointsOccupied = [];
function updateOccupied() {
    pointsOccupied = [];
    $.each(pieces, function(i, piece) {
        if (dragging && i === selected)
            return;
        if (!piece.onboard)
            return;
        var path = piece.path[0];
        var l = path.getTotalLength();
        for (var s = 0; s <= 10; s ++) {
            var p1 = path.getPointAtLength(l * s / 10).matrixTransform(path.getCTM());
            pointsOccupied.push(p1);
        }
    });
}

function occupied(x, y) {
    var ret = false;
    $.each(pointsOccupied, function(i, p1) {
        var d = (p1.x-x)*(p1.x-x)+(p1.y-y)*(p1.y-y);
        if (d < (hexr/3)*(hexr/3)) {
            ret = true;
            return false;
        }
    });
    return ret;
}

function blocked(x, y) {
    var ret;
    $.each(blocks, function(i, block) {
        var d = (block.x-x)*(block.x-x)+(block.y-y)*(block.y-y);
        if (d < (hexr/3)*(hexr/3)) {
            ret = true;
            return false;
        }
    });
    return ret;
}

function blockedorrequired(x, y) {
    if (blocked(x,y))
        return true;
    var ret;
    $.each(requires, function(i, require) {
        var d = (require.x-x)*(require.x-x)+(require.y-y)*(require.y-y);
        if (d < (hexr/3)*(hexr/3)) {
            ret = true;
            return false;
        }
    });
    return ret;
}

function piecefits(piece, x, y) {
    var path = piece.path[0];
    var l = path.getTotalLength();
    for (var s = 0; s <= 10; s ++) {
        var p1 = path.getPointAtLength(l * s / 10).matrixTransform(path.getCTM());
        var px = p1.x - piece.cur.x + x;
        var py = p1.y - piece.cur.y + y;
        if ((s & 1) == 0) {
            if (px < hx(-0.6, 0) || px > hx(6.6, 0))
                return false;
            if ((px < hx(0, 0) || px > hx(6,0))
                && (py < hy(0,2.4) || py > hy(0,6.6)))
                return false;
            if ((px < hx(1, 0) || px > hx(5,0))
                && (py < hy(1,1.4) || py > hy(1,6.6)))
                return false;
            if ((px < hx(2, 0) || px > hx(4,0))
                && (py < hy(2,0.4) || py > hy(2,6.6)))
                return false;
            if (py < hy(3,-0.6) || py > hy(3,6.6))
                return false;
            if (blocked(px, py))
                return false;
        }
        if (s > 0 && s < 10) {
            if (occupied(px, py))
                return false;
        }
    }
    return true;
}

var selected = null;
function highlight() {
    $.each(pieces, function(i, piece) {
        if (i === selected)
            piece.path.addClass('selected');
        else
            piece.path.removeClass('selected');
    });
}

function rotate(dir) {
    if (winning)
        return;
    if (selected == null)
        return;
    var piece = pieces[selected];
    movepiece(piece, null, null, piece.dst.a + piece.dst.sx * dir * 60, null, null, 0.2);
    if (dragging) {
        var dx = dragging.dx;
        var dy = dragging.dy;
        dragging.dx = dx * cos(dir * 60) - dy * sin(dir * 60);
        dragging.dy = dy * cos(dir * 60) + dx * sin(dir * 60);
        updatedrag(0);
    }
}

function flip() {
    if (winning)
        return;
    if (selected == null)
        return;
    var piece = pieces[selected];
    movepiece(piece, null, null, null, -piece.dst.sx, null, 0.2);
    if (dragging) {
        dragging.dx = -dragging.dx;
        updatedrag(0);
    }
}

var dragging = null;

function nearesthex(mx, my) {
    var nhex = [null, null];
    var ndd = 999*999;
    var maxr = hexd;
    for (var y = -1; y < bsize + 1; y ++) {
        for (var x = -1; x < bsize + 1; x ++) {
            if ((x + y + 1) * 2 < (bsize - 1))
                continue;
            if ((x + y - 1) * 2 > (bsize - 1) * 3)
                continue;
            var xx = hx(x, y);
            var yy = hy(x, y);
            var dd = (xx - mx)*(xx - mx) + (yy - my)*(yy - my);
            if (dd < maxr * maxr && dd < ndd) {
                nhex = [x, y];
                ndd = dd;
            }
        }
    }
    if (nhex[0] == null)
        return null;
    return nhex;
}

var hint2set, hint4set;
function updatedrag(duration) {
    hint2set = hint4set = false;
    var piece = pieces[selected];
    var boardOffset = $('#board').offset();
    var nx = dragging.mx - boardOffset.left + dragging.dx;
    var ny = dragging.my - boardOffset.top + dragging.dy;
    var nhex = nearesthex(nx, ny);
    dragging.onboard = false;
    if (nhex) {
        var x = hx(nhex[0], nhex[1]);
        var y = hy(nhex[0], nhex[1]);
        if (piecefits(piece, x, y)) {
            dragging.onboard = true;
            var da = piece.dst.a;
            while (da >= 360) da -= 360;
            while (da < 0) da += 360;
            if (curlevel == 0 && piece === pieces[3] && nhex[0] == 5 && nhex[1] == 0 && da == 120 && piece.dst.sx == 1)
                hint2set = true;
            if (curlevel == 0 && piece === pieces[3] && nhex[0] == 5 && nhex[1] == 0 && da == 60 && piece.dst.sx == -1)
                hint2set = true;
            if (curlevel == 0 && piece === pieces[7] && nhex[0] == 6 && nhex[1] == 2 && da == 0 && piece.dst.sx == -1)
                hint4set = true;
            movepiece(piece, x, y, null, null, null, 0);
        } else
            movepiece(piece, nx, ny, null, null, null, duration);
    } else {
        movepiece(piece, nx, ny, null, null, null, duration);
    }
    highlight();
}

function onMouseMove(event) {
    if (winning)
        return;
    var boardOffset = $('#board').offset();
    if (curlevel === null) {
        var mx = event.pageX - boardOffset.left;
        var my = event.pageY - boardOffset.top;
        var r = hexr;
        $('.hex').removeClass('hover');
        for (var y = 0; y < bsize; y ++) {
            for (var x = 0; x < bsize; x ++) {
                if ((x + y) * 2 < (bsize - 1))
                    continue;
                if ((x + y) * 2 > (bsize - 1) * 3)
                    continue;
                var xx = hx(x,y);
                var yy = hy(x,y);
                if ((xx-mx)*(xx-mx) + (yy-my)*(yy-my) < r*r) {
                    var l = levelnum(x, y);
                    var str = String(l);
                    if (l < 10) str = '0' + str;
                    if (levelstate[l-1] == 'l')
                        $('#choice').html('');
                    else {
                        $('#choice').html(str+': '+levels[l-1].name)
                        $('#hex_'+l).addClass('hover');
                    }
                    return;
                }
            }
        }
        $('#choice').html('');
        return;
    }
    if (dragging) {
        dragging.mx = event.pageX;
        dragging.my = event.pageY;
        if (Math.abs(dragging.mx - dragging.ox) > 5 && Math.abs(dragging.my - dragging.oy) > 5)
            dragging.click = false;
        updatedrag(0);
        return;
    }
    selected = null;
    $.each(pieces, function(i, piece) {
        if (!piece.inplay || piece.fixed)
            return;
        var r = hexr*2/3;
        function dist2(x, y) {
            var dx = event.pageX - (x + boardOffset.left);
            var dy = event.pageY - (y + boardOffset.top);
            return dx*dx+dy*dy;
        }
        var path = piece.path[0];
        var l = path.getTotalLength();
        for (var s = 2; s <= 18; s ++) {
            var p = path.getPointAtLength(s * l / 20).matrixTransform(path.getCTM());
            if (dist2(p.x, p.y) < r*r) {
                selected = i;
                return false;
            }
        }
    });
    if (selected != null) {
        $('body').addClass('grab');
    } else {
        $('body').removeClass('grab');
    }
    highlight();
}

function connected(src) {
    var path = src.path[0];
    var l = path.getTotalLength();
    var s1 = path.getPointAtLength(0).matrixTransform(path.getCTM());
    var s2 = path.getPointAtLength(l).matrixTransform(path.getCTM());
    var ret = [];
    $.each(pieces, function(i, piece) {
        if (!piece.onboard || piece === src)
            return;
        var r = hexr*2/3;
        function dist2(x, y) {
            var dx = event.pageX - (x + boardOffset.left);
            var dy = event.pageY - (y + boardOffset.top);
            return dx*dx+dy*dy;
        }
        var path = piece.path[0];
        var l = path.getTotalLength();
        var p1 = path.getPointAtLength(0).matrixTransform(path.getCTM());
        var p2 = path.getPointAtLength(l).matrixTransform(path.getCTM());
        if ((p1.x-s1.x)*(p1.x-s1.x)+(p1.y-s1.y)*(p1.y-s1.y) < r*r
           || (p1.x-s2.x)*(p1.x-s2.x)+(p1.y-s2.y)*(p1.y-s2.y) < r*r
           || (p2.x-s1.x)*(p2.x-s1.x)+(p2.y-s1.y)*(p2.y-s1.y) < r*r
           || (p2.x-s2.x)*(p2.x-s2.x)+(p2.y-s2.y)*(p2.y-s2.y) < r*r)
            ret.push(i);
    });
    return ret;
}

function onMouseDown(event) {
    if (event.which != 1)
        return;
    if (winning)
        return;
    if (dragging) {
        dragging.click = false;
        onMouseUp(event);
        return;
    }
    var boardOffset = $('#board').offset();
    if (curlevel === null) {
        var mx = event.pageX - boardOffset.left;
        var my = event.pageY - boardOffset.top;
        var r = hexr;
        for (var y = 0; y < bsize; y ++) {
            for (var x = 0; x < bsize; x ++) {
                if ((x + y) * 2 < (bsize - 1))
                    continue;
                if ((x + y) * 2 > (bsize - 1) * 3)
                    continue;
                var xx = hx(x,y);
                var yy = hy(x,y);
                if ((xx-mx)*(xx-mx) + (yy-my)*(yy-my) < r*r) {
                    var l = levelnum(x, y) - 1;
                    if (levelstate[l] == 'l')
                        return;
                    curlevel = l;
                    reset();
                    return;
                }
            }
        }
        return;
    }
    if (selected == null)
        return;
    if (curlevel == 0 && selected == 3)
        $('#hint1l, #hint1t').hide();
    if (curlevel == 0 && selected == 7)
        $('#hint3l, #hint3t').hide();
    var piece = pieces[selected];
    dragging = {
        dx: piece.cur.x + boardOffset.left - event.pageX,
        dy: piece.cur.y + boardOffset.top - event.pageY,
        mx: event.pageX,
        my: event.pageY,
        ox: event.pageX,
        oy: event.pageY,
        click: true
    };
    updateOccupied();
    $('#board').append(piece.path);
}

function wintext() {
    var options = ['Adequate', 'Sufficient', 'Passable', 'Tolerable', 'Satisfactory', 'Acceptable', 'Competent', 'Mediocre', 'Requisite', 'So-so', 'Pedestrian', 'Good Enough', 'OK', 'Meh', 'Whatever', 'I\'ve Seen Worse', 'That Happened', 'Mm-Hmm', 'Oh Sure', 'Bearable'];
    if (levels[curlevel].last)
        options = ['Well Done', 'Fabulous', 'Awesome', 'Spectacular', 'Fantastic', 'Wonderful', 'Magnificent', 'Splendid', 'Stellar', 'Amazing'];
    return options[Math.floor(Math.random()*options.length)] + '!';
}

var piececount = 0;
function onMouseUp(event) {
    if (!dragging)
        return;
    if (dragging.click)
        return;
    var piece = pieces[selected];
    piece.onboard = dragging.onboard;
    dragging = null;
    if (!piece.onboard) {
        var x = hx(piece.home.x, piece.home.y);
        var y = hy(piece.home.x, piece.home.y);
        movepiece(piece, x, y, null, null, null, 0.2);
    }
    if (curlevel == 0 && hint2set) {
        $('#hint2l, #hint2t').hide();
        if (!pieces[7].onboard) {
            $('#hint3l, #hint3t, #hint4p, #hint4l, #hint4t').show();
        }
    }
    if (curlevel == 0 && hint4set) {
        $('#hint4l, #hint4t').hide();
    }
    updateOccupied();
    var queue = [selected];
    var total = [];
    var connections = 0;
    while (queue.length > 0) {
        var i = queue.shift();
        total.push(i);
        var p = pieces[i];
        $.each(connected(p), function(i, c) {
            connections ++;
            if ($.inArray(c, queue) >= 0)
                return;
            if ($.inArray(c, total) >= 0)
                return;
            queue.push(c);
        });
    }
    var unfulfilled = false;
    $.each(requires, function(i, require) {
        var fulfilled = false;
        $.each(pieces, function(j, piece) {
            var path = piece.path[0];
            var l = path.getTotalLength();
            for (var s = 0; s <= 10; s += 2) {
                var p1 = path.getPointAtLength(l * s / 10).matrixTransform(path.getCTM());
                var d = (require.x-p1.x)*(require.x-p1.x)+(require.y-p1.y)*(require.y-p1.y);
                if (d < (hexr/3)*(hexr/3)) {
                    fulfilled = true;
                    return false;
                }
            }
        });
        if (!fulfilled) {
            unfulfilled = true;
            return false;
        }
    });
    if (connections == piececount * 2 && !unfulfilled) {
        $('body').removeClass('grab');
        $('#buttons, .hinttext, .hintpiece, .hintline').hide();
        $('#win, #winbuttons').show();
        $('#win').text(wintext());
        levelstate[curlevel] = 'f';
        for (var i = curlevel + 1; i < 37 && i < curlevel + 3; i ++)
            if (levelstate[i] == 'l')
                levelstate[i] = 'o';
        $.cookie('levels', levelstate.join(''));
        if (levels[curlevel].last) {
            $('#next').hide();
            $('#again').show();
        } else {
            $('#next').show();
            $('#again').hide();
        }
        winning = true;
        selected = null;
        highlight();        
        $.each(pieces, function(i) {
            $('#H_'+i).hide();
        });
    }
}

// progression
// 01 - tutorial: placement
// 02 - tutorial: requires
// 03 - tutorial: blocks
// 04-06 - easy: many pieces given
// 07-10 - easy: many requires and blocks and pieces given
// 11-20 - normal: many requires and blocks
// 21-31 - hard: some requires and blocks
// 32-37 - expert: few requires or blocks

var curlevel = 0;
var winning = false;
var levels = [

    // L01
    {
        name: 'Fleeting Mall',
        // (1, 2, 4, True) U-V'-J'-N+L+S-E-I  S-E-I+U-V'-J'-N+L+
        blocks: [],
        requires: [],
        pieces: [
            0,2,6,60,-1,
            1,0,4,120,1,
            2,0,6,0,-1,
            4,3,4,180,1,
            5,2,2,60,1,
            6,5,2,120,1,
            8,-1,-1,-1,-1
        ]
    },

    // L02
    {
        name: 'Ashy Caveman',
        // (0, 3, 0, True) J-E+V+L-S+U-N+I  S+U-N+I+J-E+V+L-
        blocks: [],
        requires: [
            0,3,0,
            0,3,60,
            0,3,120,
            0,4,60,
            0,4,120,
            1,4,240,
            1,4,180,
            2,4,240,
            2,4,180,
            2,4,120,
            2,4,60,
            2,3,120,
            3,3,0,
            3,2,120,
            4,2,0,
            4,2,60,
            4,2,120,
            4,3,60,
            4,3,120,
            3,5,240,
            3,6,300,
            2,6,180,
            2,6,240,
            1,6,180,
            1,6,240,
            0,6,120,
            0,6,60,
            0,6,0
        ],
        pieces: [
            5,0,4,0,-1,
            7,4,4,240,1,
            8,-1,-1,-1,-1
        ]
    },

    // L03
    {
        name: 'Steepled Pastry',
        // (2, 2, 4, True) V+J'+U-N-L-E-I-S  S+V+J'+U-N-L-E-I-
        blocks: [
            6,1,300,
            5,1,300,
            4,1,300,
            6,0,300,
            5,0,300,
            4,0,300,
            3,0,240,
            2,1,240,
            1,2,240,
            3,1,180,
            3,2,240,
            3,3,300,
            3,3,180,
            0,6,60,
            1,5,60,
            1,5,120,
            2,5,120,
            3,5,120,
            4,5,60,
            5,4,60,
            3,4,120,
            4,4,60,
            5,3,60
        ],
        requires: [],
        pieces: [
            0,0,5,0,-1,
            1,1,4,120,1,
            3,7,1,0,-1,
            8,-1,-1,-1,-1
        ]
    },

    // L04
    {
        name: 'Unprepared Shrub',
        // (3, 6, 4, True) E-J+U-L-V'-S-I+N'  S-I+N'+E-J+U-L-V'-
        blocks: [
        ],
        requires: [
            3,3,180,
            3,3,240,
            4,2,120,
            4,2,60
        ],
        pieces: [
            2,4,0,240,1,
            3,2,6,0,1,
            4,4,5,120,-1,
            6,1,2,60,1,
            8,-1,-1,-1,-1
        ]
    },

    // L05
    {
        name: 'Blameless Baton',
        // (6, 0, 3, False) L-J'+U-V'+E-N'-S-I  S-I+L-J'+U-V'+E-N'-
        blocks: [
            4,5,0,
            4,5,60,
            4,5,120,
            4,5,180,
            4,5,240,
            4,5,300,
            5,3,0,
            5,3,60,
            5,3,120,
            5,3,180,
            5,3,240,
            5,3,300
        ],
        requires: [
            6,0,0,
            6,0,60,
            6,0,120,
            6,0,180,
            0,4,300,
            0,4,240,
            0,5,300,
            0,5,240
        ],
        pieces: [
            1,3,1,240,1,
            2,1,3,60,1,
            4,1,5,240,-1,
            8,-1,-1,-1,-1
        ]
    },

    // L06
    {
        name: 'Magnetic Carrot',
        // (2, 2, 0, True) N'+S'-J+I-L+E+U+V' S+N-V+U+E+L'-I+J'-
        blocks: [
            2,5,180,
            2,5,240
        ],
        requires: [
            1,5,0,
            1,5,60,
            1,5,120,
            3,3,180,
            2,4,120,
            2,5,60,
            2,5,120,
            5,0,0,
            5,0,60
        ],
        pieces: [
            2,1,3,180,1,
            4,2,1,300,-1,
            7,4,0,300,1,
            8,-1,-1,-1,-1
        ]
    },

    // L07
    {
        name: 'Lucid Sitar',
        // (1, 1, 4, False) L'-I-E+U+N-V+S'-J  S+V'-N'+U+E-I-L-J'-
        blocks: [
            4,4,0,
            4,4,60,
            4,4,120,
            4,4,180,
            4,4,240,
            4,4,300,
            4,2,0,
            4,2,60,
            4,2,120,
            4,2,180,
            4,2,240,
            4,2,300,
            1,3,0,
            1,3,60,
            1,3,120,
            1,3,180,
            1,3,240,
            1,3,300
        ],
        requires: [
            6,0,0,
            6,0,60,
            6,0,120,
            6,1,60,
            6,1,120,
            6,2,60,
            6,2,120,
            6,3,60,
            6,3,120,
            6,3,180,
            5,4,120,
            5,4,180,
            4,5,120,
            4,5,180,
            3,6,120,
            3,6,180,
            3,6,240,
            2,3,180,
            2,4,180,
            2,5,180,
            2,6,180
        ],
        pieces: [
            7,5,0,300,1,
            8,-1,-1,-1,-1
        ]
    },

    // L08
    {
        name: 'Winnable Flan',
        // (2, 3, 1, False) S'+V'+U-L-I+N+J-E  S+E-J'+N'+I-L'-U+V+
        blocks: [
            4,0,0,
            4,1,0,
            4,2,0,
            4,3,0,
            4,4,0,
            4,5,0,
            4,6,0,
        ],
        requires: [
            1,2,120,
            1,3,0,
            1,3,300,
            1,3,240,
            1,4,300,
            1,4,240,
            1,4,180,
            1,4,120,
            1,4,60,
            2,3,300,
            2,3,0,
            2,3,60,
            2,3,120,
            2,4,60,
            2,4,120,
            2,4,180,
            2,5,300,
            3,1,0
        ],
        pieces: [
            4,2,6,60,1,
            8,-1,-1,-1,-1
        ]
    },
    
    // L09
    {
        name: 'Unthawed Depth',
        // (2, 3, 0, True) U+J'-V-L+N+I+E-S  S+U+J'-V-L+N+I+E- 
        blocks: [
            2,1,0,
            2,2,0,
            2,3,0,
            2,4,0,
            2,5,0,
            2,6,0,
            2,7,0,
            6,0,0,
            6,0,60,
            6,0,120,
            6,0,180,
            6,0,240,
            6,0,300
        ],
        requires: [
            3,0,0,
            3,2,0,
            3,2,60,
            3,2,120,
            3,3,0,
            3,3,300,
            3,3,240,
            3,4,0,
            3,4,60,
            3,4,120,
            3,5,0,
            3,7,0
        ],
        pieces: [
            2,4,0,180,-1,
            4,6,3,0,1,
            8,-1,-1,-1,-1
        ]
    },
    
    // L10
    {
        name: 'Playable Omelet',
        // (2, 6, 2, False) N-E+S'-L'-J-V+I-U  S+E-N'+U-I+V'-J'-L-
        blocks: [
            5,3,0,
            5,3,60,
            5,3,120,
            5,3,180,
            5,3,240,
            5,3,300,
            3,6,0
        ],
        requires: [
            1,5,180,
            1,6,180,
            1,5,120,
            1,6,120,
            2,4,180,
            2,5,180,
            2,4,120,
            3,3,180,
            3,3,120
        ],
        pieces: [
            0,4,2,240,-1,
            5,5,4,60,1,
            8,-1,-1,-1,-1
        ]
    },
    
    // L11
    {
        name: 'Yawning Vaccine',
        // (2, 3, 2, False) L+E+U+S+N'-J+I+V'  S+N'-J+I+V'+L+E+U+
        blocks: [
            0,4,60,
            1,3,60,
            2,2,120,
            3,2,120,
            4,2,120,
            5,2,60,
            0,5,120,
            1,5,120,
            2,5,60,
            3,4,120,
            4,4,60,
            5,3,60
        ],
        requires: [
            4,1,300,
            4,1,0,
            4,1,60,
            3,3,300,
            3,3,240,
            3,3,180,
        ],
        pieces: [
            3,-1,4,0,1,
            8,-1,-1,-1,-1
        ]
    },

    // L12
    {
        name: 'Trivial Physics',
        // (1, 1, 4, False) U+L'-I-E+N'+S'-V-J' S+N+E-I-L+U-J-V'-
        blocks: [
        ],
        requires: [
            2,1,0,
            2,1,60,
            2,1,120,
            3,1,240,
            3,1,180,
            4,1,240,
            4,1,180,
            4,2,60,
            4,2,120,
            4,3,60,
            4,3,120,
            4,4,60,
            4,4,120,
            4,5,60,
            4,5,120,
            4,5,180,
            3,6,120,
            3,6,180,
            3,6,240,
            3,6,300,
            2,6,60,
            2,6,0,
            2,5,240,
            2,5,300,
            2,5,0,
            2,5,60,
            3,4,180,
            3,4,120,
            3,4,60,
            3,3,120,
            3,3,60,
            3,3,0,
            2,3,60,
            2,3,0,
            1,3,60,
            1,3,0,
            1,2,240,
            1,2,300,
            1,2,0,
            2,1,300
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L13
    {
        name: 'Wan Option',
        // (4, 0, 5, True) J-U-V-E-L'+N'+S'+I  S+N+L-E-V'-U-J'-I+
        blocks: [
            2,1,0,
            2,1,60,
            2,1,120,
            2,1,180,
            2,1,240,
            2,1,300,
            0,4,0,
            0,4,60,
            0,4,120,
            0,4,180,
            0,4,240,
            0,4,300,
            6,2,0,
            6,2,60,
            6,2,120,
            6,2,180,
            6,2,240,
            6,2,300
        ],
        requires: [
            2,3,300,
            2,3,0,
            2,3,60,
            2,3,120,
            3,3,240,
            3,3,180,
            3,3,120
        ],
        pieces: [
            3,4,5,240,1,
            1,6,0,240,1,
            8,-1,-1,-1,-1
        ]
    },

    // L14
    {
        name: 'Lenient Towboat',
        // (1, 3, 0, True) J'+V+L-U-E-S+N+I  S+N+I+J'+V+L-U-E-
        blocks: [
            4,1,0,
            4,1,60,
            4,1,120,
            4,1,180,
            4,1,240,
            4,1,300,
            5,4,180
        ],
        requires: [
            1,4,300,
            1,3,240,
            1,3,300,
            1,3,0,
            2,4,300,
            2,4,240,
            2,4,180,
            2,4,120,
            2,6,300,
            2,6,240,
            2,6,180,
            2,6,120,
            2,6,60,
        ],
        pieces: [
            1,5,2,180,1,
            8,-1,-1,-1,-1
        ]
    },

    // L15
    {
        name: 'Mental Audience',
        // (2, 3, 2, False) N+E-I-V'-J'-L-U-S'  S-U-L'-J-V-I-E+N'-
        blocks: [
            1,2,0,
            1,2,60,
            1,2,120,
            1,2,180,
            1,2,240,
            1,2,300,
            2,1,0,
            2,1,60,
            2,1,120,
            2,1,180,
            2,1,300,
            2,4,0,
            2,4,60,
            2,4,120,
            2,4,180,
            2,4,240,
            2,4,300,
            3,4,0,
            3,4,60,
            3,4,180,
            3,4,240,
            4,4,0,
            4,4,60,
            4,4,120,
            4,4,180,
            4,4,240,
            4,4,300,
            4,3,300,
            4,3,0,
            4,3,60,
            4,3,120
        ],
        requires: [
        ],
        pieces: [
            2,4,5,60,-1,
            4,1,3,240,-1,
            8,-1,-1,-1,-1
        ]
    },

    // L16
    {
        name: 'Scrappy Corridor',
        // (5, 3, 4, False) V'-J'+U+S'-N+E-L'-I  S+U+J-V-I-L-E+N'-
        blocks: [
            2,5,0,
            2,5,60,
            2,5,120,
            2,5,180,
            2,5,240,
            2,5,300
        ],
        requires: [
            2,4,300,
            2,4,0,
            3,3,240,
            3,3,180,
            3,3,120,
            3,3,60,
            4,2,300,
            4,2,0,
            4,2,60,
            5,1,180,
            5,1,120,
            5,1,60,
            6,0,300,
            6,0,0
        ],
        pieces: [
            6,1,7,300,1,
            8,-1,-1,-1,-1
        ]
    },

    // L17
    {
        name: 'Eldest Dowel',
        // (0, 3, 2, True) U+L+S'-J+I+V'+N-E  S+L'+U-E-N'+V+I+J'-
        blocks: [
            3,1,180,
            5,0,0
        ],
        requires: [
            5,4,300,
            4,4,60,
            4,4,0,
            4,4,300,
            3,4,180,
            3,4,240,
            3,4,300,
            3,3,240,
            3,3,300,
            2,3,60,
            2,3,0,
            2,3,300,
            1,3,180,
            1,3,240,
            1,3,300,
            0,3,60
        ],
        pieces: [
            5,6,2,0,1,
            8,-1,-1,-1,-1
        ]
    },

    // L18
    {
        name: 'Tenuous Chestnut',
        // (1, 3, 1, False) V'-E-S+I-U-L'-J'-N'  S+I-U-L'-J'-N'-V'-E-
        blocks: [
            1,6,60,
            2,2,120
        ],
        requires: [
            4,1,240,
            4,1,180,
            5,1,240,
            5,1,180,
            6,1,240,
            6,1,180,
            6,2,60,
            6,2,120,
            6,2,180,
            5,3,120,
            5,3,180,
            4,4,120,
            4,4,180,
            3,5,120
        ],
        pieces: [
            2,0,4,300,-1,
            8,-1,-1,-1,-1
        ]
    },

    // L19
    {
        name: 'Tidal Grocer',
        // (2, 2, 0, False) U+E-I-J'-S'-L+N'+V'  S-J-I-E+U-V+N+L'-
        blocks: [
        ],
        requires: [
            0,6,0,
            0,6,60,
            1,6,0,
            1,6,60,
            2,6,0,
            2,6,60,
            3,6,0,
            3,6,60,
            1,3,240,
            5,3,120
        ],
        pieces: [
            2,2,1,300,-1,
            4,4,0,300,1,
            8,-1,-1,-1,-1
        ]
    },

    // L20
    {
        name: 'Toxic Oboe',
        // (0, 3, 0, True) N+U+J+V-E+L'+S'+I  S+L+E-V'+J'+U+N'+I+
        blocks: [
            3,0,120,
            3,0,240,
            2,1,240,
            1,2,240,
            0,3,180,
            0,4,180,
            0,5,180,
            0,6,120,
            1,6,120,
            2,6,120,
            3,6,60,
            4,5,60,
            5,4,60,
            6,3,0,
            6,2,0,
            6,1,0
        ],
        requires: [
            2,2,180,
            5,2,300
        ],
        pieces: [
            6,3,4,180,1,
            8,-1,-1,-1,-1
        ]
    },

    // L21
    {
        name: 'Fizzy Prophet',
        // (1, 3, 3, False) S+E-V'-U-L'-J+I+N'  S+E-V'-U-L'-J+I+N'-
        blocks: [
            3,4,120
        ],
        requires: [
            3,1,120,
            3,1,180,
            3,1,240,
            2,1,180,
            0,3,180,
            1,3,300,
            1,3,0,
            1,3,60,
            1,3,120,
            4,0,180,
            4,0,120
        ],
        pieces: [
            3,0,2,60,1,
            8,-1,-1,-1,-1
        ]
    },

    // L22
    {
        name: 'Perky Sunburn',
        // (1, 3, 1, False) J'+N'+V+S-U-L-E-I  S-U-L-E-I-J'+N'+V+
        blocks: [
            0,4,60,
            1,3,60,
            2,2,120,
            3,2,60,
            4,1,120,
            5,1,120,
            2,4,180,
            5,3,180
        ],
        requires: [
            0,6,0,
            0,6,60,
            1,6,0,
            1,6,60,
            2,6,0,
            2,6,60,
            3,6,0,
            3,6,60
        ],
        pieces: [
            1,4,2,120,1,
            8,-1,-1,-1,-1
        ]
    },

    // L23
    {
        name: 'Advisory Typo',
        // (0, 2, 4, False) L'+V-S'-J+N-U+I-E  S-V'+L-E-I+U-N'+J'-
        blocks: [
            3,0,120,
            4,0,120,
            5,0,120,
            0,6,120,
            1,6,120,
            2,6,120,
            0,3,120,
            1,3,120,
            2,3,120,
            3,3,120,
            4,3,120,
            5,3,120
        ],
        requires: [
            4,2,120,
            5,2,120,
            2,1,120,
            0,4,300
        ],
        pieces: [
            1,3,5,0,1,
            8,-1,-1,-1,-1
        ]
    },

    // L24
    {
        name: 'Fluffy Envelope',
        // (2, 2, 0, False) N'+V-J+S'-U+E+I-L' S+J'-V'+N+L-I+E+U-
        blocks: [
            0,3,0,
            0,3,60,
            0,3,120,
            0,3,180,
            0,3,240,
            0,3,300,
            0,4,180,
            0,5,180,
            1,2,60,
            2,1,120,
            3,1,120,
            4,1,120,
            5,1,120
        ],
        requires: [
            1,6,60,
            1,6,120,
            2,6,240,
            2,6,180,
            2,6,120,
            3,5,180,
            3,5,120,
            3,5,60,
            3,4,180,
            3,4,240,
            3,4,300,
            3,4,0,
            4,3,300,
            4,3,0,
            4,3,60,
            4,3,120,
            5,3,240,
            5,3,180,
            5,3,120,
            6,2,180,
            6,2,120,
            6,2,60,
            6,2,0,
            6,1,240
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L25
    {
        name: 'Herbicidal Porkpie',
        // (3, 2, 0, False) U+L-E-N'-I+J'-S+V'  S+V'+U+L-E-N'-I+J'-
        blocks: [
            1,2,0,
            1,2,60,
            1,2,120,
            1,2,180,
            1,2,240,
            1,2,300,
            4,2,0,
            4,2,60,
            4,2,120,
            4,2,180,
            4,2,240,
            4,2,300,
            2,5,0,
            2,5,60,
            2,5,120,
            2,5,180,
            2,5,240,
            2,5,300,
            5,4,0,
            5,4,60,
            5,4,120,
            5,4,180,
            5,4,240,
            5,4,300,
        ],
        requires: [
            6,0,60
        ],
        pieces: [
            1,2,3,300,1,
            8,-1,-1,-1,-1
        ]
    },

    // L26
    {
        name: 'Luckiest Courtesy',
        // (2, 2, 0, True) I+S-U+J-N-L-E-V'  S-U+J-N-L-E-V'+I+
        blocks: [
            5,0,120,
            4,1,180,
            6,3,240
        ],
        requires: [
            4,3,120
        ],
        pieces: [
            2,1,3,120,-1,
            4,3,5,300,-1,
            8,-1,-1,-1,-1
        ]
    },

    // L27
    {
        name: 'Outmost Synergy',
        // (1, 3, 1, False) S-I+E-V'+U+J-L'-N'  S-I+E-V'+U+J-L'-N'-
        blocks: [
            3,4,180,
            3,0,240
        ],
        requires: [
            4,0,0,
            4,0,60,
            5,0,0,
            5,0,60,
            6,0,0,
            6,0,60,
            6,0,120,
            6,0,180,
            6,0,240,
            5,1,0,
            5,1,300,
            5,1,240,
            4,2,120,
            4,2,180,
            1,3,0,
            1,3,300,
            1,3,240,
            1,3,180,
            1,4,60,
            1,4,120,
            1,5,60,
            1,5,120,
            1,6,60,
            1,6,120
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L28
    {
        name: 'Nostalgic Geode',
        // (4, 4, 0, True) I-J+N'+S'+V'+E-U+L'  S+N+J'-I-L+U-E+V+
        blocks: [
            0,3,300,
            0,3,60,
            2,2,300,
            2,2,60,
            4,1,300,
            4,1,60,
            6,0,300,
            6,0,60,
            0,6,240,
            0,6,120,
            2,5,240,
            2,5,120,
            4,4,240,
            4,4,120,
            6,3,240,
            6,3,120
        ],
        requires: [
            2,3,240
        ],
        pieces: [
            5,5,3,300,-1,
            8,-1,-1,-1,-1
        ]
    },

    // L29
    {
        name: 'Neural Barnacle',
        // (0, 3, 2, True) I-J'-N+U+V+L'-S-E S-E-I-J'-N+U+V+L'-
        blocks: [
            0,3,300,
            3,0,0,
            6,0,60,
            6,3,120,
            3,6,180,
            0,6,240,
            3,1,120,
            4,1,120,
            5,1,180,
            5,2,180,
            5,3,240,
            4,4,240,
            3,5,300,
            2,5,300,
            1,5,0,
            1,4,0,
            1,3,60,
            2,2,60
        ],
        requires: [
            4,5,0,
            6,2,180,
            5,0,180,
            2,1,60,
            0,4,120,
            0,5,60,
            1,6,300
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L30
    {
        name: 'Vermillion Notion',
        // (1, 3, 0, True) V'-I+E-J'-N'+L-S+U  S+U-V'-I+E-J'-N'+L-
        blocks: [
            4,0,0,
            4,4,240,
            0,6,60
        ],
        requires: [
            0,4,300,
            0,4,0,
            1,3,300,
            1,3,0,
            2,2,300,
            2,2,0,
            5,1,240,
            5,2,0,
            5,2,60,
            5,2,120,
            5,2,180,
            5,3,300,
            2,6,60,
            2,6,120,
            2,6,180,
            2,6,240,
            1,6,180,
            1,6,240
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L31
    {
        name: 'Parasitic Clipboard',
        // (0, 3, 0, False) I-V+U+S+Q-N'-L'-J'  S+Q-N'-L'-J'+I-V+U+
        blocks: [
            3,3,0,
            3,3,60,
            3,3,120,
            3,3,180,
            3,3,240,
            3,3,300,
            3,6,0
        ],
        requires: [
            1,6,120,
            5,4,120
        ],
        pieces: [
            5,0,4,0,-1,
            3,-1,-1,-1,-1
        ]
    },

    // L32
    {
        name: 'Inimical Tenantry',
        // (5, 3, 5, True) V+L'+N'+J'-S-I-E-U S-I-E-U-V+L'+N'+J'-
        blocks: [
            2,1,300,
            3,1,300,
            4,1,300,
            5,1,300,
            6,1,300,
            6,1,120,
            0,5,300,
            1,5,300,
            2,5,300,
            3,5,300,
            4,5,300,
            4,5,120,
        ],
        requires: [
            6,2,60,
            6,2,120,
            6,3,60,
            6,3,120,
            6,3,180,
            5,4,120,
            5,4,180,
            0,3,180,
            1,2,300,
            3,3,300
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L33
    {
        name: 'Otalgic Nomism',
        // (2, 3, 1, True) I-L'+N-S'-U+E-J+V' S-N'+L-I-V+J'-E+U-
        blocks: [
            2,2,120,
            3,2,120,
            4,2,120,
            1,3,120,
            2,3,120,
            3,3,120,
            4,3,120,
            1,4,120,
            2,4,120,
            3,4,120,
            0,3,300,
            3,1,0,
            4,1,60,
            2,5,240,
            3,5,180,
            3,4,180,
            3,2,0,
            0,6,60,
            6,0,240,
            5,4,240,
            1,2,60
        ],
        requires: [
            0,3,120,
            6,3,120
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L34
    {
        name: 'Zincy Banyan',
        // (2, 3, 2, False) U-N+J'-I+V'+E+L'-S  S+U-N+J'-I+V'+E+L'-
        blocks: [
            5,2,120,
            6,2,180,
            6,3,240,
            5,4,300,
            4,4,0,
            4,3,60,
            2,6,0
        ],
        requires: [
            2,2,0,
            2,3,0,
            2,4,0,
            2,5,0,
            6,0,60,
            3,6,180
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L35
    {
        name: 'Piedmont Stemson',
        // (2, 2, 5, False) I+S+L-E+U+N+V'-J' S+L-E+U+N+V'-J'-I+
        blocks: [
            1,3,120,
            3,4,240,
            0,5,240,
            2,2,300,
            3,6,0,
            6,2,0,
            0,3,0,
            1,2,0,
            2,1,0,
            3,0,0,
            4,0,0,
            5,0,0,
            6,0,0
        ],
        requires: [
            4,2,120,
            4,2,180,
            5,3,300,
            5,3,0,
            3,2,60,
            2,5,240
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L36
    {
        name: 'Edacious Omasum',
        // (1, 3, 3, False) L'+J'-E+U+S'+V'-N'+I S+U+E-J+L-I+N-V+
        blocks: [
            3,1,300,
            4,2,240,
            2,3,180,
            4,4,120,
            1,4,240,
            4,0,120,
            2,6,120,
        ],
        requires: [
            2,2,300,
            3,1,180,
            4,3,60,
            5,4,0,
            3,5,0,
            3,3,240,
            2,5,300
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    },

    // L37
    {
        name: 'Ergodic Ligature',
        last: true,
        // random
        blocks: [
        ],
        requires: [
        ],
        pieces: [
            8,-1,-1,-1,-1
        ]
    }

];

function reset() {
    $('#level, #buttons').show();
    $('#select, .text, #win, #winbuttons, #choice, .hinttext, .hintline, .hintpiece').hide();
    $('.block').remove();
    blocks = [];
    $('.require').remove();
    requires = [];
    winning = false;
    selected = null;
    $('.hex').removeClass('hex_l')
        .removeClass('hex_o')
        .removeClass('hex_f')
        .removeClass('hover');
    $('.text').removeClass('text_l')
        .removeClass('text_o')
        .removeClass('text_f')

    var str = String(curlevel+1);
    if (curlevel < 9)
        str = '0' + str;
    $('#level').html(str + ': ' + levels[curlevel].name);
    var level = levels[curlevel];
    
    if (!level.last && levelstate[curlevel+1] != 'l')
        $('#skip').show();
    else
        $('#skip').hide();
    if (level.last) {
        $('#random').show();
        for (var e = 0; e < 3;) {
            var x = Math.floor(Math.random()*7);
            var y = Math.floor(Math.random()*7);
            if ((x + y) * 2 < (bsize - 1))
                continue;
            if ((x + y) * 2 > (bsize - 1) * 3)
                continue;
            var a = Math.floor(Math.random()*6)  * 60;
            if (addblock(x, y, a))
                e ++;
        }
        for (var e = 0; e < 2;) {
            var x = Math.floor(Math.random()*7);
            var y = Math.floor(Math.random()*7);
            if ((x + y) * 2 < (bsize - 1))
                continue;
            if ((x + y) * 2 > (bsize - 1) * 3)
                continue;
            var a = Math.floor(Math.random()*6)  * 60;
            if (addrequire(x, y, a))
                e++;
        }
    } else
        $('#random').hide();

    for (var i = 0; i < level.requires.length; i += 3)
        addrequire(level.requires[i], level.requires[i+1], level.requires[i+2])
    for (var i = 0; i < level.blocks.length; i += 3)
        addblock(level.blocks[i], level.blocks[i+1], level.blocks[i+2])
    $.each(pieces, function(i, piece) {
        var x = hx(piece.home.x, piece.home.y);
        var y = hy(piece.home.x, piece.home.y);
        movepiece(piece, x, y, 0, 1, 1, 0.1);
        piece.inplay = true;
        piece.onboard = false;
        piece.fixed = false;
        piece.path.removeClass('fixed');
        $('#P_'+i).show();
        $('#H_'+i).show();
    });
    piececount = pieces.length;
    for (var i = 0; i < level.pieces.length; i += 5) {
        var n = level.pieces[i];
        var piece = pieces[n];
        if (level.pieces[i+1] < 0 && level.pieces[i+2] < 0) {
            piece.inplay = false;
            $('#P_'+n).hide();
            $('#H_'+n).hide();
            piececount --;
            continue;
        }
        var x = hx(level.pieces[i+1], level.pieces[i+2]);
        var y = hy(level.pieces[i+1], level.pieces[i+2]);
        movepiece(piece, x, y, level.pieces[i+3], level.pieces[i+4], null, 0);
        piece.onboard = true;
        piece.fixed = true;
        piece.path.addClass('fixed');
    }
    updateOccupied();

    if (curlevel == 0)
        $('#hint1l, #hint1t, #hint2p, #hint2l, #hint2t').show();
    if (curlevel == 1)
        $('#hint5t, #hint5l, #hint7t, #hint7l').show();
    if (curlevel == 2)
        $('#hint6t, #hint6l').show();
}

function next() {
    curlevel ++;
    reset();
}

function skip() {
    if (curlevel < 36 && levelstate[curlevel+1] != 'l')
        next();
}

function levelselect() {
    curlevel = null;
    winning = false;
    selected = null;
    $('#level, #buttons, #win, #winbuttons, #random, #again, .hinttext, .hintline, .hintpiece').hide();
    $('#select, #choice, .text').show();
    $('.block').remove();
    blocks = [];
    $('.require').remove();
    requires = [];
    $.each(pieces, function(i, piece) {
        var x = hx(piece.home.x, piece.home.y);
        var y = hy(piece.home.x, piece.home.y);
        movepiece(piece, x, y, 0, 1, 1, 0);
        $('#P_'+i).hide();
        $('#H_'+i).hide();
    });
    $('.hex').removeClass('hex_l')
        .removeClass('hex_o')
        .removeClass('hex_f');
    $('.text').removeClass('text_l')
        .removeClass('text_o')
        .removeClass('text_f')
    for (var i = 1; i <= 37; i ++) {
        $('#hex_'+i).addClass('hex_' + levelstate[i-1]);
        $('#text_'+i).addClass('text_' + levelstate[i-1]);
    }
    $('#starthere, #startline').hide();
    if (levelstate.join('') == levelstateinit) {
        $('#starthere, #startline').show();
    }
}

function levelnum(x, y) {
    var row = y * 2 + x - 3;
    if (row == 0) return 1;
    if (row == 1) return x == 2 ? 2 : 3;
    if (row == 11) return x == 2 ? 35 : 36;
    if (row == 12) return 37;
    return 7 + Math.floor((row - 3) / 2) * 7 + ((row % 2) == 0 ? 4 : 0) + Math.floor(x / 2);
}

var levelstate;
var levelstateinit = 'ollllllllllllllllllllllllllllllllllll';

$(document).ready(function() {
    levelstate = ($.cookie('levels') || 'ollllllllllllllllllllllllllllllllllll').split('');
    var bw = (hexr + pad) * 2 + dx(bsize + 11, 0);
    var bh = (hexr * sin(60) + pad*2) * 2 + dy(0, bsize);
    $('#game, #board').css({
        width: bw,
        height: bh
    });
    var rect = $(document.createElementNS(svgNS, 'rect'))
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bw)
        .attr('height', bh)
        .attr('fill', '#000')
        .css('opacity', '1e-6');
    $('#board').append(rect);
    var startline = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'startline')
        .attr('class', 'hintline')
        .attr('d', 'M ' + f(hx(3,0)) + ' ' + f(hy(3,0)) + ' l ' + f(dx(1,-1)) + ' ' + f(dy(1,-1)) + ' l ' + f(dx(0.5,-0.25)) + ' ' + f(dy(0.5,-0.25)));
    $('#board').append(startline);
    $('#starthere')
        .attr('style', 'left: ' + f(3 + hx(3,0) + dx(1.5, -1.25)) + 'px; top: ' + f(-8 + hy(3,0) + dy(1.5, -1.25)) + 'px;');

    var hint1l = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint1l')
        .attr('class', 'hintline')
        .attr('d', 'M ' + f(hx(11.25,-3.5) + 15) + ' ' + f(hy(11.25,-3.5)) + ' l ' + f(dx(-0.75,-0.75)) + ' ' + f(dy(-0.75,-0.75)) + ' l ' + f(dx(-0.5,0.25)) + ' ' + f(dy(-0.5,0.25)));
    $('#board').append(hint1l);
    $('#hint1t')
        .attr('style', 'right: ' + f(bw - (-3 + hx(11.25,-3.5) + 15 + dx(-1.25, -0.5))) + 'px; top: ' + f(-8 + hy(11.25,-3.5) + dy(-1.25, -0.5)) + 'px;');

    var d = [];
    addpathd(d, pieces[3]);
    var hint2p = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint2p')
        .attr('d', d.join(' '))
        .attr('class', 'hintpiece')
        .attr('transform', 'translate(' + f(hx(5,0)) + ',' + f(hy(5,0)) + ') rotate(120)');
    $('#board').append(hint2p);
    var hint2l = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint2l')
        .attr('class', 'hintline')
        .attr('d', 'M ' + f(hx(4,0.5) + 15) + ' ' + f(hy(4,0.5)) + ' l ' + f(dx(0.5,-1)) + ' ' + f(dy(0.5,-1)) + ' l ' + f(dx(0.5,-0.25)) + ' ' + f(dy(0.5,-0.25)));
    $('#board').append(hint2l);
    $('#hint2t')
        .attr('style', 'left: ' + f(3 + hx(4,0.5) + 15 + dx(1, -1.25)) + 'px; top: ' + f(-8 + hy(4,0.5) + dy(1, -1.25)) + 'px;');

    var hint3l = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint3l')
        .attr('class', 'hintline')
        .attr('d', 'M ' + f(hx(11.25,-0.5) - 15) + ' ' + f(hy(11.25,-0.5)) + ' l ' + f(dx(-0.75,-0.75)) + ' ' + f(dy(-0.75,-0.75)) + ' l 0 -15');
    $('#board').append(hint3l);
    $('#hint3t')
        .attr('style', 'right: ' + f(-80 + bw - (-3 + hx(11.25,-0.5) - 15 + dx(-1.25, 0.5))) + 'px; bottom: ' + f(15 + bh - (hy(11.25,-0.5) + dy(-1.25, -0.5))) + 'px;');
    var d = [];
    addpathd(d, pieces[7]);
    var hint3p = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint3p')
        .attr('d', d.join(' '))
        .attr('class', 'hintpiece')
        .attr('transform', 'translate(' + f(hx(6,2)) + ',' + f(hy(6,2)) + ') scale(-1, 1)');
    $('#board').append(hint3p);

    var d = [];
    addpathd(d, pieces[7]);
    var hint4p = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint4p')
        .attr('d', d.join(' '))
        .attr('class', 'hintpiece')
        .attr('transform', 'translate(' + f(hx(6,2)) + ',' + f(hy(6,2)) + ') scale(-1,1)');
    $('#board').append(hint4p);
    var hint4l = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint4l')
        .attr('class', 'hintline')
        .attr('d', 'M ' + f(hx(6,1.5) + 15) + ' ' + f(hy(6,1.5)) + ' l ' + f(dx(0.25,-0.5)) + ' ' + f(dy(0.25,-0.5)) + ' l ' + f(dx(0.5,-0.25)) + ' ' + f(dy(0.5,-0.25)));
    $('#board').append(hint4l);
    $('#hint4t')
        .attr('style', 'left: ' + f(3 + hx(6,1.5) + 15 + dx(0.75, -0.75)) + 'px; top: ' + f(-8 + hy(6,1.5) + dy(0.75, -0.75)) + 'px;');

    var hint5l = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint5l')
        .attr('class', 'hintline')
        .attr('d', 'M ' + f(hx(0, 2.5)) + ' ' + f(hy(0, 2.5)) + ' l 0 -90');
    $('#board').append(hint5l);

    var hint6l = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint6l')
        .attr('class', 'hintline')
        .attr('d', 'M ' + f(hx(0, 2.5) + 18) + ' ' + f(hy(0, 2.5) + 3) + ' l -40 -90');
    $('#board').append(hint6l);

    var hint7l = $(document.createElementNS(svgNS, 'path'))
        .attr('id', 'hint7l')
        .attr('class', 'hintline')
        .attr('d', 'M ' + (bw - 202) + ' 46 l 50 0 l 0 -10');
    $('#board').append(hint7l);

    for (var y = 0; y < bsize; y ++) {
        for (var x = 0; x < bsize; x ++) {
            if ((x + y) * 2 < (bsize - 1))
                continue;
            if ((x + y) * 2 > (bsize - 1) * 3)
                continue;
            var l = levelnum(x, y);
            var hex = addhex(x, y);
            var str = String(l);
            hex.attr('id', 'hex_' + l);
            if (str < 10) str = '0' + str;
            var text = addtext(x,y,str);
            text.attr('id', 'text_' + l);
        }
    }
    $.each(pieces, function(i, piece) {
        addpiece(piece);
        pieces[i].path.attr('id', 'P_'+i);
        addhex(piece.home.x, piece.home.y, true).attr('id', 'H_'+i);
    });
    $(document).mousemove(onMouseMove);
    $(document).mousedown(onMouseDown);
    $('#board').mousedown(function(event) {
        event.preventDefault();
    });
    $(document).mouseup(onMouseUp);
    $(document).keydown(function(event) {
        if (event.which == 37 || event.which == 65) {
            rotate(-1);
        } else if (event.which == 39 || event.which == 68) {
            rotate(1);
        } else if (event.which == 32) {
            flip();
        }
    });
    levelselect();
});
