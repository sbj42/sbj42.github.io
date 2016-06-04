// ideas:
//   a food you don't have to kill, that restores 1 hp, so free move but only once
//   a space you can't shock from
//   a space that costs extra hp to pass through
//   a food that moves away from you
//   shock could cost more
//   tunnels
//   starfish, that count as bonus points

var svgNS = 'http://www.w3.org/2000/svg';

var TR = 42; // tile center-to-corner

var GLG = 4; // gridline gap
var GLWA = 0.4; // gridline wiggle amplitude
var GLWI = 0.2; // gridline wiggle inset

var MR = 6; // map center-to-corner

var FOODHP = 4;
var MOVEHP = 1;
var SHOCKHP = 3;

var STARTTIME = new Date().getTime();

function time() {
    return ((new Date()).getTime() - STARTTIME)/1000;
}

var perlin1 = (function() { // 1d perlin noise
    var N = 0x1000;
    var BM = 0xff;
    var B = 0x100;

    var p = [];
    var g1 = [];

    function init() {
        var i, j, k;
        for (i = 0; i < B; i ++) {
            p.push(i);
            g1.push(Math.random() * 2 - 1);
        }
        while (i--) {
            k = p[i];
            j = Math.floor(Math.random() * B);
            p[i] = p[j];
            p[j] = k;
        }
        for (i = 0; i < B + 2; i ++) {
            p.push(p[i]);
            g1.push(g1[i]);
        }
    }

    function s_curve(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    function lerp(t, a, b) {
        return a + t * (b - a);
    }

    function noise1(x) {
        var t = x + N;
        var b0 = Math.floor(t) & BM;
        var b1 = (b0 + 1) & BM;
        var r0 = t - Math.floor(t);
        var r1 = r0 - 1.0;
        var sx = s_curve(r0);
        var u = r0 * g1[ p[ b0 ] ];
        var v = r1 * g1[ p[ b1 ] ];
        return lerp(sx, u, v);
    }

    init();
    return noise1;
})();

function preloadsvg(images, callback) {
    var loaded = 0;
    function onload() {
        if (++loaded == images.length)
            callback();
    }
    $.each(images, function(i, image) {
        var img = new Image();
        img.onload = onload;
        img.onerror = onload;
        img.onabort = onload;
        img.src = 'svg/' + image + '.svg';
    });
}

var LEVELS = [
    {
        map: [
            '*************',
            '*******  ****',
            '******    ***',
            '*****      **',
            '****        *',
            '***         *',
            '**         **',
            '*         ***',
            '*        ****',
            '**      *****',
            '***    ******',
            '****  *******',
            '*************'
        ],
        eel: [
            0,0,
            0,1
        ],
        hp: 18
    },
    {
        "map": [
            "*************",
            "*************",
            "*************",
            "*******  p***",
            "*****p    ***",
            "****p  1  ***",
            "****     ****",
            "***     p****",
            "***    p*****",
            "***p  *******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-1,1,-1,2,0,2],
        "hp": 7
        // wsw*s (7)
    },
    {
        "map": [
            "*************",
            "*************",
            "*******p ****",
            "*******  ****",
            "******  p  **",
            "******    p**",
            "****     ****",
            "**p  2 ******",
            "**  p  ******",
            "****  *******",
            "**** p*******",
            "*************",
            "*************"
        ],
        "eel": [1,-1,1,-2,0,-2],
        "hp": 12
        // qaqqa*s (9)
    },
    {
        "map": [
            "*************",
            "*************",
            "*************",
            "******   ****",
            "*****  p  ***",
            "*****     ***",
            "***  p p  ***",
            "***  2  *****",
            "***  p  *****",
            "****   ******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,0,0,-1,-1,-1],
        "hp": 12
        // as*aqw*q (12)
    },
    {
        "map": [
            "*************",
            "*************",
            "*************",
            "********* ***",
            "*****p    ***",
            "*****   1 ***",
            "***      p***",
            "*** p11 *****",
            "***     *****",
            "*** *********",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-3,0,-3,1,-3,2],
        "hp": 8
        // sss*aqwssw*s (8)
    },
    {
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "****p     ***",
            "**** 414 p***",
            "***  1 1  ***",
            "***  414 ****",
            "***     p****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-3,0,-3,1,-3,2,-2,2],
        "hp": 15
        // saass*ww*ss*a*qqqqwssww*q*aasws (15)
    },
    {
	"map": [
	    "*************",
	    "*******p*****",
	    "*************",
	    "*************",
	    "****p   p****",
	    "****  3  **p*",
	    "**** 2p4 ****",
	    "*p**  1  ****",
	    "****p   p****",
	    "*****p ******",
	    "****   ******",
	    "****  *******",
	    "*************"
	],
	"eel": [0,3,0,4,-1,4,-1,5,-2,5,-2,4],
	"hp": 20
	//wqw*ssswwqw*q*aqqa*sassw (20)
	//wswswwqw*q*aqqa*sa*ssw (20)
    },
    {
	"map": [
	    "*************",
	    "*******  ****",
	    "******    ***",
	    "*****  2 3 **",
	    "****        *",
	    "***  *** 2  *",
	    "**   ***   **",
	    "*  2 ***  ***",
	    "*        ****",
	    "** 3 2  *****",
	    "***    ******",
	    "****  *******",
	    "*************"
	],
	"eel": [-5,2,-5,1,-4,1,-4,0,-3,0,-3,-1,-2,-1,-2,-2,-1,-2,-1,-3,0,-3,0,-4,1,-4,1,-5,2,-5],
	"hp": 18
    }
];
//        map: [
//            '*************',
//            '*******  ****',
//            '******    ***',
//            '*****      **',
//            '****        *',
//            '***         *',
//            '**         **',
//            '*         ***',
//            '*        ****',
//            '**      *****',
//            '***    ******',
//            '****  *******',
//            '*************'
//        ],
var curlevel = 0;

var ROCKMAP = {
    '0011.*': ['a', 0],
    '1001.*': ['a', 1],
    '1100.*': ['a', 2],
    '0110.*': ['a', 3],
    '11110111': ['b', 0],
    '11111011': ['b', 1],
    '11111101': ['b', 2],
    '11111110': ['b', 3],
    '0111.11.': ['c', 0],
    '1011..11': ['c', 1],
    '11011..1': ['c', 2],
    '111011..': ['c', 3],
    '11111111': ['d', -1],
    '11110110': ['e', 0],
    '11110011': ['e', 1],
    '11111001': ['e', 2],
    '11111100': ['e', 3],
    '0010.*': ['f', 0],
    '0001.*': ['f', 1],
    '1000.*': ['f', 2],
    '0100.*': ['f', 3]
};

var FOODMAP = {
    '1': {type: 'guppy1', hp: 1},
    '2': {type: 'catfish1', hp: 2},
    '3': {type: 'piranha1', hp: 3},
    '4': {type: 'stingray1', hp: 4}
};

var game = null;
var busy = false;
var hackk = 0;
var hack = false;

function start() {
    var level = LEVELS[curlevel];
    var game = {
        map: level.map.slice(),
        eel: level.eel.slice(),
        hp: level.hp,
        charge: true,
        over: false,
        food: []
    };
    for (var x = -MR; x <= MR; x ++) {
        for (var y = -MR; y <= MR; y ++) {
            var p = level.map[MR+y][MR+x];
            var f = FOODMAP[p];
            if (f) {
                var flip = Math.random() > 0.5;
                game.food.push({
                    x: x,
                    y: y,
                    type: f.type,
                    flip: flip,
                    hp: f.hp,
                });
            }
        }
    }
    return game;
}

function game_canmove(game, dx, dy) {
    if (game.over)
        return false;
    var eel = game.eel;
    var nx = eel[0] + dx;
    var ny = eel[1] + dy;
    for (var i = 0; i < eel.length; i += 2) {
        if (eel[i] == nx && eel[i+1] == ny)
            return false;
    }
    var what = game.map[MR+ny][MR+nx];
    if (what == '*' || what == 'p')
        return false;
    for (var i = 0; i < game.food.length; i ++) {
        var food = game.food[i];
        if (food.x == nx && food.y == ny) {
            if (food.hp > 0)
                return false;
        }
    }
    return true;
}

function game_canshock(game) {
    return !game.over && game.charge && game.hp > SHOCKHP;
}

function game_move(game, dx, dy, oneat) {
    var eel = game.eel;
    var nx = eel[0] + dx;
    var ny = eel[1] + dy;
    for (var i = 0; i < game.food.length; i ++) {
        var food = game.food[i];
        if (food.x == nx && food.y == ny) {
            if (oneat) oneat(food);
            game.food.splice(i, 1);
            game.hp = Math.min(20, game.hp + FOODHP);
        }
    }
    eel.splice(eel.length - 2, 2);
    eel.splice(0, 0, nx, ny);
    game.charge = true;
    game.hp = Math.max(0, game.hp - MOVEHP);
}

function game_shock1(game, i, onshock, onharm) {
    var eel = game.eel;
    var x = eel[i];
    var y = eel[i+1];
    
    function addshock(rot, sx, sy) {
        if (onshock) onshock(rot, x, y);
        $.each(game.food, function(i, food) {
            if (food.x == sx && food.y == sy && food.hp > 0) {
                food.hp --;
                if (onharm) onharm(food);
            }
        });
    }

    var px = i > 0 && (eel[i-2] - x);
    var py = i > 0 && (eel[i-1] - y);
    var nx = i < eel.length - 2 && (eel[i+2] - x);
    var ny = i < eel.length - 2 && (eel[i+3] - y);
    var nw = px == -1 || nx == -1;
    var ne = py == -1 || ny == -1;
    var se = px == 1 || nx == 1;
    var sw = py == 1 || ny == 1;
    if (i == 0 || i == eel.length - 2) {
        if (!nw && !se) {
            addshock(-1, x - 1, y);
            addshock(1, x + 1, y);
        } else {
            addshock(0, x, y - 1);
            addshock(2, x, y + 1);
        }
    } else {
        if (!nw)
            addshock(-1, x - 1, y);
        if (!ne)
            addshock(0, x, y - 1);
        if (!se)
            addshock(1, x + 1, y);
        if (!sw)
            addshock(2, x, y + 1);
    }
}

function game_shock(game) {
    if (!game.charge || game.hp <= SHOCKHP)
        return false;
    var harm = false;
    var eel = game.eel;
    game.charge = false;
    game.hp = Math.max(0, game.hp - SHOCKHP);
    for (var i = 0; i < eel.length; i += 2) {
        game_shock1(game, i, null, function() { harm = true; });
    }
    return harm;
}

function solver(game) {
    var progress = time() + 5;
    var solutions = [];
    function step(sofar, game) {
        if (time() > progress) {
            console.info('thinking: ' + sofar);
            progress = time() + 5;
        }
        if (game_canmove(game, -1, 0)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, -1, 0);
            if (game2.food.length == 0)
                solutions.push(sofar + 'q');
            else if (game2.hp > 0)
                step(sofar + 'q', game2);
        }
        if (game_canmove(game, 0, -1)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, 0, -1);
            if (game2.food.length == 0)
                solutions.push(sofar + 'w');
            else if (game2.hp > 0)
            step(sofar + 'w', game2);
        }
        if (game_canmove(game, 1, 0)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, 1, 0);
            if (game2.food.length == 0)
                solutions.push(sofar + 's');
            else if (game2.hp > 0)
            step(sofar + 's', game2);
        }
        if (game_canmove(game, 0, 1)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, 0, 1);
            if (game2.food.length == 0)
                solutions.push(sofar + 'a');
            else if (game2.hp > 0)
            step(sofar + 'a', game2);
        }
        if (game_canshock(game)) {
            var game2 = $.extend(true, {}, game);
            if (game_shock(game2)) {
		if (game2.food.length == 0)
                    solutions.push(sofar + '*');
		else if (game2.hp > 0)
		    step(sofar + '*', game2);
	    }
        }
    }
    game = $.extend(true, {}, game);
    for (var hp = 1; hp <= 20; hp ++) {
        console.info('trying hp ' + hp);
        game.hp = hp;
        step('', game);
        if (solutions.length > 0) {
            console.info('done (min hp needed is ' + hp + ':');
	    var shortest = null;
	    var length = 0;
            $.each(solutions, function(i, sol) {
                console.info('  '+ sol);
		if (shortest == null || sol.length < length) {
		    length = sol.length;
		    shortest = sol;
		}
            });
            return {sol: shortest, hp: hp};
        }
    }
    console.info('no solution');
    return null;
}

$(document).ready(function() {
    var bw = TR * 18 + 12;
    var bh = TR * 12 + 12;
    var svg = $('#svg');
    svg.css({
        width: bw,
        height: bh + 110
    });

    var defs = $(document.createElementNS(svgNS, 'defs'));
    svg.append(defs);
    var borderclip = $(document.createElementNS(svgNS, 'clipPath'))
        .attr('id', 'borderclip');
    defs.append(borderclip);
    var bordercliprect = $(document.createElementNS(svgNS, 'rect'))
        .attr('x', (bw/2 - TR*9 - 1))
        .attr('y', (bh/2 - TR*6 - 1))
        .attr('width', TR * 18 + 2)
        .attr('height', TR * 12 + 2);
    borderclip.append(bordercliprect);
    var borderclipg = $(document.createElementNS(svgNS, 'g'))
        .attr('clip-path', 'url(#borderclip)');
    svg.append(borderclipg);

    var board = $(document.createElementNS(svgNS, 'g'));
    borderclipg.append(board);

    var border = $(document.createElementNS(svgNS, 'image'))
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bw)
        .attr('height', bh)
        .attr('href', 'svg/border1.svg');
    svg.append(border);

    var hungert = $(document.createElementNS(svgNS, 'text'))
        .attr('x', bw - TR - 520)
        .attr('y', bh + 60)
        .attr('text-anchor', 'end')
        .attr('font-family', 'Arial')
        .attr('font-size', 20)
        .text('Hunger:');
    svg.append(hungert);
    var hunger1 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 520)
        .attr('y', bh + 30)
        .attr('width', 530)
        .attr('height', 45)
        .attr('href', 'svg/hunger1.svg');
    svg.append(hunger1);
    var hungerbar = $(document.createElementNS(svgNS, 'rect'))
        .attr('x', bw - TR - 520 + 5)
        .attr('y', bh + 30 + 14)
        .attr('height', 17)
        .attr('class', 'hungerbar');
    svg.append(hungerbar);
    var hunger2 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 520)
        .attr('y', bh + 30)
        .attr('width', 530)
        .attr('height', 45)
        .attr('href', 'svg/hunger2.svg');
    svg.append(hunger2);

    var charget = $(document.createElementNS(svgNS, 'text'))
        .attr('x', bw - TR - 520)
        .attr('y', bh + 95)
        .attr('text-anchor', 'end')
        .attr('font-family', 'Arial')
        .attr('font-size', 20)
        .text('Charge:');
    svg.append(charget);
    var charge1 = $(document.createElementNS(svgNS, 'text'))
        .attr('x', bw - TR - 520 + 6)
        .attr('y', bh + 95)
        .attr('text-anchor', 'start')
        .attr('font-family', 'Arial')
        .attr('font-size', 20)
        .text('Ready');
    svg.append(charge1);

    function addkey(k, x, y, w, h) {
        var key = $(document.createElementNS(svgNS, 'image'))
            .attr('class', 'key')
            .attr('x', TR + x)
            .attr('y', bh + y)
            .attr('width', w)
            .attr('height', h)
            .attr('href', 'svg/console-' + k + '.svg');
        svg.append(key);
        return key;
    }

    var qkey = addkey('q1', 10,  0, 35, 35);
    var wkey = addkey('w1', 45,  0, 35, 35);
    var skey = addkey('s1', 45, 35, 35, 35);
    var akey = addkey('a1', 10, 35, 35, 35);
    var spkey = addkey('sp1', 0, 70, 90, 35);

    function updateconsole() {
        var eel = game.eel;
        var nomoves = true;
        function setkey(k, l, b) {
            k.attr('href', 'svg/console-' + l + (b ? '2' : '1') + '.svg');
            if (b)
                nomoves = false;
        }
        setkey(qkey, 'q', canmoveeel(-1, 0));
        setkey(wkey, 'w', canmoveeel(0, -1));
        setkey(skey, 's', canmoveeel(1, 0));
        setkey(akey, 'a', canmoveeel(0, 1));
        setkey(spkey, 'sp', canshock());
        charge1.text(game.charge ? (game.hp <= SHOCKHP ? 'Too hungry' : 'Ready') : 'Not ready');
        hungerbar.attr('width', Math.max(0, 25 * (20 - game.hp) - 1))
            .toggleClass('red', game.hp <= SHOCKHP)
            .toggleClass('yellow', game.hp > SHOCKHP && game.hp <= SHOCKHP + MOVEHP);
        
        if (!busy && !game.over && nomoves)
            defeat();
    }

    function gridline_create(x, y, nw) {
        var path = $(document.createElementNS(svgNS, 'path'))
            .attr('transform', 'translate(' + (bw/2 + TR*(x - y)) + ',' + (bh/2 + TR*(x + y)) + ')')
            .attr('class', 'gridline');
        path.gridline_nw = nw;
        path.gridline_seed = (x * 2 * MR + y) * 2 + (nw ? 1 : 0);
        board.append(path);
        return path;
    }

    function gridline_update(path) {
        var d = [];
        function curve(x1, y1, x2, y2, p1, p2) {
            d.push('M', x1, y1);
            d.push('C');
            d.push((1-GLWI)*x1 + GLWI*x2 + (y2 - y1) * p1, (1-GLWI)*y1 + GLWI*y2 - (x2 - x1) * p1);
            d.push((1-GLWI)*x2 + GLWI*x1 + (y2 - y1) * p2, (1-GLWI)*y2 + GLWI*y1 - (x2 - x1) * p2);
            d.push(x2, y2);
        }
        var z = 0;
        function roff() {
            z ++;
            return GLWA * perlin1(path.gridline_seed * 33.7 + z * 7.7 + time());
        }
        if (path.gridline_nw)
            curve(-TR + GLG, -GLG, -GLG, -TR + GLG, roff(), roff());
        else
            curve(-TR + GLG, GLG, -GLG, TR - GLG, roff(), roff());
        path.attr('d', d.join(' '));
        //.css('opacity', roff() * 2 + 0.5);
    }

    var gridlines = [];

    setInterval(function() {
        $.each(gridlines, function(i, gl) {
            gridline_update(gl);
        });
    }, 100);

    function putthing(x, y, thing, rot, flip) {
        rot = rot || 0;
        var flipscale = flip ? ' scale(-1,1)' : '';
        var thing = $(document.createElementNS(svgNS, 'image'))
            .attr('x', -TR)
            .attr('y', -TR)
            .attr('width', TR*2)
            .attr('height', TR*2)
            .attr('transform', 'translate(' + (bw/2 + TR * (x - y)) + ',' + (bh/2 + TR * (x + y)) + ')' + flipscale + ' rotate(' + (rot * 90) + ')')
            .attr('href', 'svg/' + thing + '.svg');
        board.append(thing);
        return thing;
    }

    function puteel() {
        var eel = game.eel;
        var state = game.eelstate;
        $('.eel').remove();
        var eeltype = 'eel1';
        for (var i = 0; i < eel.length; i += 2) {
            var x = eel[i];
            var y = eel[i+1];
            var px = i > 0 && (eel[i-2] - x);
            var py = i > 0 && (eel[i-1] - y);
            var nx = i < eel.length - 2 && (eel[i+2] - x);
            var ny = i < eel.length - 2 && (eel[i+3] - y);
            var nw = px == -1 || nx == -1;
            var ne = py == -1 || ny == -1;
            var se = px == 1 || nx == 1;
            var sw = py == 1 || ny == 1;
            var spec;
            if (i == 0) {
                if (nw)
                    spec = ['a', 1, false];
                else if (se)
                    spec = ['a', 0, true];
                else if (ne)
                    spec = ['a', 1, true];
                else
                    spec = ['a', 0, false];
            } else if (i == eel.length - 2) {
                if (nw)
                    spec = ['f', 0, false];
                else if (se)
                    spec = ['f', -1, true];
                else if (ne)
                    spec = ['f', 0, true];
                else
                    spec = ['f', -1, false];
            } else {
                if (nw && se)
                    spec = ['b', 0, true];
                else if (nw && ne)
                    spec = ['c', 0, false];
                else if (nw && sw)
                    spec = ['e', 0, true];
                else if (ne && se)
                    spec = ['e', 0, false];
                else if (ne && sw)
                    spec = ['b', 0, false];
                else if (se && sw)
                    spec = ['d', 0, false];
            }
            if (state == 'happy' && spec[0] == 'a')
                spec[0] = 'g';
            if (state == 'sad' && spec[0] == 'a')
                spec[0] = 'h';
            var thing = putthing(x, y, eeltype + spec[0], spec[1], spec[2]);
            thing.addClass('eel');
        }
    }        

    function reset() {
        if (game && game.over) {
            var x = game.eel[0];
            var y = game.eel[1];
            var x1 = bw / 2 + TR * (x - y);
            var y1 = bh / 2 + TR * (x + y);
            var t = time();
            function zoomout() {
                var f = 1-Math.min(1, (time() - t));
                var x2 = x1*(1-f) + (bw/2) * (f);
                var y2 = y1*(1-f) + (bh/2) * (f);
                board.attr('transform', 'translate(' + x2 + ',' + y2 +') scale(' + (1 + f*f*f*5) + ') translate(' + (-x1) + ',' + (-y1) + ')');
                if (f > 0)
                    setTimeout(zoomout, 50);
                else {
                    game.over = false;
                    updateconsole();
                }
            }
            zoomout();
        }
        game = start();
        board.empty();
        gridlines = [];
        for (var x = -MR; x <= MR; x ++) {
            for (var y = -MR; y <= MR; y ++) {
                var p = game.map[MR+y][MR+x];
                var p0 = p != '*';
                var pnw = x > -MR && game.map[MR+y][MR+x-1] != '*';
                var psw = y < MR && game.map[MR+y+1][MR+x] != '*';
                if (p0 || pnw)
                    gridlines.push(gridline_create(x, y, true));
                if (p0 || psw)
                    gridlines.push(gridline_create(x, y, false));
                if (p == 'p') {
                    putthing(x, y, 'plant' + (1 + Math.floor(Math.random()*1)), Math.floor(Math.random()*4), Math.random() < 0.5);
                }
            }
        }
        $.each(game.food, function(i, f) {
            f.creature = putthing(f.x, f.y, f.type + 'a', 0, f.flip);
            f.number = putthing(f.x, f.y, 'number' + f.hp);
        });
 
        var rocktype = 'rock1';
        for (var x = -MR-1; x <= MR+1; x ++) {
            for (var y = -MR-1; y <= MR+1; y ++) {
                if (x < -MR || x > MR || y < -MR || y > MR) {
                    putthing(x, y, rocktype + 'd', Math.floor(Math.random()*4));
                    continue;
                }
                var p = game.map[MR+y][MR+x];
                if (p == '*') {
                    var neighbors = [];
                    neighbors.push(
                        (x <= -MR || game.map[MR+y][MR+x-1] == '*') ? '1' : '0',
                        (y <= -MR || game.map[MR+y-1][MR+x] == '*') ? '1' : '0',
                        (x >= MR || game.map[MR+y][MR+x+1] == '*') ? '1' : '0',
                        (y >= MR || game.map[MR+y+1][MR+x] == '*') ? '1' : '0',
                        (x <= -MR || y <= -MR || game.map[MR+y-1][MR+x-1] == '*') ? '1' : '0',
                        (x >= MR || y <= -MR || game.map[MR+y-1][MR+x+1] == '*') ? '1' : '0',
                        (x >= MR || y >= MR || game.map[MR+y+1][MR+x+1] == '*') ? '1' : '0',
                        (x <= -MR || y >= MR || game.map[MR+y+1][MR+x-1] == '*') ? '1' : '0');
                    neighbors = neighbors.join('');
                    var nomatch = true;
                    $.each(ROCKMAP, function(pattern, rock) {
                        if ((new RegExp('^' + pattern + '$')).test(neighbors)) {
                            var ang = rock[1];
                            if (ang == -1)
                                ang = Math.floor(Math.random()*4);
                            putthing(x, y, rocktype + rock[0], ang);
                            nomatch = false;
                        }
                    });
                    if (nomatch)
                        putthing(x, y, 'nomatch');
                }
            }
        }

        puteel();
        updateconsole();
    }

    var imgs = [];
    imgs.push('border1', 'hunger1', 'hunger2', 'plant1', 'shock1');
    $.each(['guppy1', 'catfish1', 'piranha1', 'stingray1'], function(i, food) {
        imgs.push(food + 'a', food + 'b');
    });
    $.each(['q', 'w', 'a', 's', 'sp'], function(i, key) {
        imgs.push('console-' + key + '1', 'console-' + key + '2');
    });
    $.each(['eel1'], function(i, eel) {
        $.each(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], function(i, l) {
            imgs.push(eel + l);
        });
    });
    $.each(['rock1'], function(i, rock) {
        $.each(['a', 'b', 'c', 'd', 'e', 'f'], function(i, l) {
            imgs.push(rock + l);
        });
    });
    $.each(['1', '2', '3', '4'], function(i, n) {
        imgs.push('number' + n);
    });
    preloadsvg(imgs, reset);

    function victory() {
        var eel = game.eel;
        busy = true;
        game.over = true;
        var x = eel[0];
        var y = eel[1];
        var x1 = bw / 2 + TR * (x - y);
        var y1 = bh / 2 + TR * (x + y);
        var t = time();
        function happy() {
            game.eelstate = 'happy';
            puteel();
            busy = false;
        }
        function zoomin() {
            var f = Math.min(1, (time() - t));
            var x2 = x1*(1-f) + (bw/2) * (f);
            var y2 = y1*(1-f) + (bh/2) * (f);
            board.attr('transform', 'translate(' + x2 + ',' + y2 +') scale(' + (1 + f*f*f*5) + ') translate(' + (-x1) + ',' + (-y1) + ')');
            if (f < 1)
                setTimeout(zoomin, 50);
            else
                happy();
        }
        zoomin();
    }

    function defeat() {
        var eel = game.eel;
        busy = true;
        game.over = true;
        var x = eel[0];
        var y = eel[1];
        var x1 = bw / 2 + TR * (x - y);
        var y1 = bh / 2 + TR * (x + y);
        var t = time();
        function sad() {
            game.eelstate = 'sad';
            puteel();
            busy = false;
        }
        function zoomin() {
            var f = Math.min(1, (time() - t));
            var x2 = x1*(1-f) + (bw/2) * f;
            var y2 = y1*(1-f) + (bh/2) * f;
            board.attr('transform', 'translate(' + x2 + ',' + y2 +') scale(' + (1 + f*f*f*5) + ') translate(' + (-x1) + ',' + (-y1) + ')');
            if (f < 1)
                setTimeout(zoomin, 50);
            else
                sad();
        }
        zoomin();
    }

    function canmoveeel(dx, dy) {
        return !busy && game_canmove(game, dx, dy);
    }

    function canshock() {
        return !busy && game_canshock(game);
    }

    function moveeel(dx, dy) {
        if (!canmoveeel(dx, dy))
            return false;
        game_move(game, dx, dy, function(food) {
            food.creature.remove();
        });
        if (game.food.length == 0)
            victory();
        if (game.food.length && game.hp == 0)
            defeat();
        return true;
    }

    function shock() {
        if (!canshock())
            return;
        var eel = game.eel;
        busy = true;
        game.charge = false;
        game.hp = Math.max(0, game.hp - SHOCKHP);
        if (game.hp == 0)
            defeat();
        var i = 0;
        function next() {
            var shocks = [];
            game_shock1(game, i, function(rot, x, y) {
                var thing = $(document.createElementNS(svgNS, 'image'))
                    .attr('x', -TR*2)
                    .attr('y', -TR*2)
                    .attr('width', TR*4)
                    .attr('height', TR*4)
                    .attr('transform', 'translate(' + (bw/2 + TR * (x - y)) + ',' + (bh/2 + TR * (x + y)) + ') rotate(' + (rot * 90) + ')')
                    .attr('href', 'svg/shock1.svg');
                board.append(thing);
                shocks.push(thing);
            }, function(food) {
                food.number.remove();
                if (food.hp == 0) {
                    food.creature.remove();
                    food.creature = putthing(food.x, food.y, food.type + 'b', 0, food.flip);
                } else {
                    food.number = putthing(food.x, food.y, 'number' + food.hp);
                }
            });
            updateconsole();
            setTimeout(function() {
                $.each(shocks, function(i, thing) {
                    thing.remove();
                });
            }, 500);
            setTimeout(function() {
                i += 2;
                if (i >= eel.length) {
                    busy = false;
                    updateconsole();
                    return;
                }
                next();
            }, 400);
        }
        next();
    }

    function do_q(event) {
        if (!moveeel(-1, 0))
            return;
        puteel();
        updateconsole();
    }
    function do_w(event) {
        if (!moveeel(0, -1))
            return;
        puteel();
        updateconsole();
    }
    function do_s(event) {
        if (!moveeel(1, 0))
            return;
        puteel();
        updateconsole();
    }
    function do_a(event) {
        if (!moveeel(0, 1))
            return
        puteel();
        updateconsole();
    }
    function do_sp(event) {
        shock();
    }

    function drawsol(sol) {
        var ex = game.eel[0];
        var ey = game.eel[1];
        var x = (bw/2 + TR * (ex - ey));
        var y = (bh/2 + TR * (ex + ey)) - sol.length;
        for (var i = 0; i < sol.length; i ++) {
            var col = Math.floor(i * 255 / sol.length);
            col = 'rgb('+col+','+col+','+col+')';
            var nx = x, ny = y;
            if (sol[i] == 'q') {
                nx -= TR; ny -= TR;
            } else if (sol[i] == 'w') {
                nx += TR; ny -= TR;
            } else if (sol[i] == 's') {
                nx += TR; ny += TR;
            } else if (sol[i] == 'a') {
                nx -= TR; ny += TR;
            } else if (sol[i] == '*') {
                var c = $(document.createElementNS(svgNS, 'circle'))
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 15)
                    .attr('class', 'sol')
                    .css('stroke', col);
                board.append(c);
                continue;
            }
	    ny += 2;
            var l = $(document.createElementNS(svgNS, 'line'))
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', nx)
                .attr('y2', ny)
                .attr('class', 'sol')
                .css('stroke', col);
            board.append(l);
            x = nx;
            y = ny;
        }
    }

    var mouseX, mouseY;
    $(document).mousemove(function(event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    });
    $(document).keypress(function(event) {
        if (busy)
            return;
        var eel = game.eel;
        if ('[][]'[hackk].charCodeAt(0) == event.keyCode) {
            hackk ++
            if (hackk == 4) {
                hack = !hack;
                $('body').css('background', hack ? 'brown' : '');
                hackk = 0;
                if (!hack) {
                    console.info(JSON.stringify(LEVELS[curlevel], 0, 2));
                }
            }
        } else 
            hackk = 0;
        if (hack) {
            var boardOffset = svg.offset();
            var mx = (mouseX - boardOffset.left - bw/2) / TR;
            var my = (mouseY - boardOffset.top - bh/2) / TR;
            var x = Math.round(mx/2 + my/2);
            var y = Math.round(my/2 - mx/2);
            if (x >= -MR && x <= MR && y >= -MR && y <= MR) {
                var tile = LEVELS[curlevel].map[MR+y][MR+x];
                function settile(c) {
                    var s = LEVELS[curlevel].map[MR+y];
                    LEVELS[curlevel].map[MR+y] = s.substr(0, MR+x) + c + s.substr(MR+x+1);
                }
                if (event.keyCode == 32) {
                    settile(' ');
                } else if (event.keyCode == 49) {
                    settile('1');
                } else if (event.keyCode == 50) {
                    settile('2');
                } else if (event.keyCode == 51) {
                    settile('3');
                } else if (event.keyCode == 52) {
                    settile('4');
                } else if (event.keyCode == 112) {
                    settile('p');
                } else if (event.keyCode == 114) {
                    settile('*');
                } else if (event.keyCode == 101) {
                    LEVELS[curlevel].eel = [x, y];
                } else if (event.keyCode == 108) {
                    var lx = Math.abs(x - eel[eel.length-2]);
                    var ly = Math.abs(y - eel[eel.length-1]);
                    if (lx + ly == 1)
                        LEVELS[curlevel].eel.push(x, y);
                    else if (lx + ly == 0)
                        LEVELS[curlevel].eel.splice(eel.length-2, 2);
                } else if (event.keyCode == 42) {
		    var sol = solver(start());
		    if (sol == null)
			return;
		    LEVELS[curlevel].hp = sol.hp;
		    reset();
                    drawsol(sol.sol);
                    return;
                }
                reset();
            }
        } else {
            if (event.keyCode == 113 || event.keyCode == 81)
                do_q();
            else if (event.keyCode == 119 || event.keyCode == 87)
                do_w();
            else if (event.keyCode == 115 || event.keyCode == 83)
                do_s();
            else if (event.keyCode == 97 || event.keyCode == 65)
                do_a();
            else if (event.keyCode == 32)
                do_sp();
            else if (event.keyCode == 43) {
                curlevel ++; reset();
            } else if (event.keyCode == 45) {
                curlevel --; reset();
            } else if (event.keyCode == 42) {
		var sol = solver(game);
		if (sol != null)
                    drawsol(sol.sol);
            }
        }
        updateconsole();
    });
    svg.click(function(event) {
        var eel = game.eel;
        var boardOffset = svg.offset();
        var mx = (mouseX - boardOffset.left - bw/2) / TR;
        var my = (mouseY - boardOffset.top - bh/2) / TR;
        var x = Math.round(mx/2 + my/2);
        var y = Math.round(my/2 - mx/2);
        if (x >= -MR && x <= MR && y >= -MR && y <= MR) {
            var lx = x - eel[0];
            var ly = y - eel[1];
            if (Math.abs(lx) + Math.abs(ly) == 1) {
                if (lx == -1)
                    do_q();
                else if (ly == -1)
                    do_w();
                else if (lx == 1)
                    do_s();
                else if (ly == 1)
                    do_a();
            } else if (lx == 0 && ly == 0)
                do_sp();
        }
    });
    $(document).keyup(function(event) {
        if (busy)
            return;
        if (event.keyCode == 27)
            reset();
    });
    hunger2.click(function(event) {
        if (hack) {
            var offset = hunger2.offset();
            var x = Math.round((event.pageX - offset.left - 5) / 25);
            LEVELS[curlevel].hp = 20 - x;
            reset();
        }
    });
    qkey.click(do_q);
    wkey.click(do_w);
    skey.click(do_s);
    akey.click(do_a);
    spkey.click(do_sp);

    window.reset = reset;
});
