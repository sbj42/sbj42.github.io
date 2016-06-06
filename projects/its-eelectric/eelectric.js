// ideas:
//   a food you don't have to kill, that restores 1 hp, so free move but only once
//   a space you can't shock from
//   a space that costs extra hp to pass through
//   a food that moves away from you
//   shock could cost more
//   tunnels
//   starfish, that count as bonus points

// todo:
//   url fragments so back button works
//   tutorial help bubbles

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

$.cookie.json = true;

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
        if (++loaded == images.length && callback)
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
        "id": "T1",
        "name": "One Fish",
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
        "hp": 10
        // wsw*s (7)
    },
    {
        "id": "T2",
        "name": "Two Fish",
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
        "id": "T3",
        "name": "Conservation",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "*****  p*****",
            "****    p****",
            "****  3  ****",
            "****p    ****",
            "*****p  *****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,0,-2,-1,-1,-1,-1,-2,0,-2],
        "hp": 10
        // sassw*q (9)
    },
    {
        "id": "T4",
        "name": "Productivity'",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "*****1  p****",
            "****   2 ****",
            "***  2   ****",
            "**     1 ****",
            "*****p  *****",
            "*****  ******",
            "***** *******",
            "*************",
            "*************"
        ],
        "eel": [-2,0,-3,0,-3,1,-4,1],
        "hp": 9
        // wssas*wwqqaassa (9)
    },
    {
        "id": "T5",
        "name": "Reach for the Stars",
        "map": [
            "*************",
            "*************",
            "*************",
            "***** 0******",
            "*****  ******",
            "***     1****",
            "***     1****",
            "*****  ******",
            "***** 0******",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,0,-3,0,-3,-1,-2,-1],
        "hp": 19
        // ssaaqwwwwwsaasa*sw (19)
    },
    {
        "id": "G?",
        "map": [
            "*************",
            "*************",
            "*************",
            "******   ****",
            "*****0 p  ***",
            "*****     ***",
            "***  p p  ***",
            "***  2  *****",
            "***  p 0*****",
            "****   ******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,0,0,-1,-1,-1],
        "hp": 20
        // as*aqw*q (12*)
        // a*a*swqwwwqasaaq (20**)
    },
    {
        "id": "G?",
        "map": [
            "*************",
            "*************",
            "*************",
            "********* ***",
            "*****p  0 ***",
            "*****   1 ***",
            "***     0p***",
            "*** p11 *****",
            "***     *****",
            "*** *********",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-3,0,-3,1,-3,2],
        "hp": 11
        // sss*aqwssw*s (8)
        // sss*aqwwswss*a (10*)
        // ssssw*wsaaqqa*q (11**)
    },
    {
        "id": "G?",
        "map": [
            "*************",
            "*************",
            "****** 0 ****",
            "****** p2 ***",
            "**** 2 1 2 **",
            "****2p p p **",
            "**   2 2 2 **",
            "**1p2p p2****",
            "**   2 2 ****",
            "***0 p ******",
            "****   ******",
            "*************",
            "*************"
        ],
        "eel": [0,2,0,3,0,4,-1,4,-2,4,-2,3,-2,2],
        "hp": 18
        // wwww*ss*aaqqq*qqq*aassssssww*ssww*qwqaqqqq*aaa (15)
        // wwww*ss*aaqqq*qqq*aassssssww*ssww*qqwwqqaaqq*aaa (16*)
        // wwww*ss*aaqqq*qqq*aasaswssssww*ssww*qwqaqqqq*aaa (17*)
        // wwww*ss*aaqqq*qqq*aasaswssssww*ssww*qqwwqqaaqq*aaa (18**)
    },
    {
        "id": "G?",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "****p     ***",
            "****0414 p***",
            "***  1 1  ***",
            "***  414 ****",
            "***    0p****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-3,0,-3,1,-3,2,-2,2],
        "hp": 17
        // saass*ww*ss*a*qqqqwssww*q*aasws (15)
        // saass*ww*ss*a*qaqqwwsww*q*aqassws (17**)
    },
    {
        "id": "G?",
        "map": [
            "*************",
            "*******p*****",
            "*************",
            "*************",
            "****p   p****",
            "****  3  **p*",
            "**** 2p4 ****",
            "*p**0 1  ****",
            "****p0  p****",
            "*****p ******",
            "*****  ******",
            "****  *******",
            "*************"
        ],
        "eel": [0,2,0,3,0,4,-1,4,-1,5,-2,5],
        "hp": 20
        // swswwqw*q*aqqa*sa*ssw (19)
        // qwqw*swwssasaa*q*qqwwssa (20**)
    },
    {
        "id": "G?",
        "map": [
            "*************",
            "*************",
            "*******220***",
            "*****1    ***",
            "****    1 2**",
            "***1 p p  2**",
            "***1  0pp ***",
            "**2  ppp  ***",
            "**21 1   ****",
            "***1    *****",
            "****22*******",
            "*************",
            "*************"
        ],
        "eel": [2,2,1,2,1,3,0,3,-1,3,-2,3,-2,2,-2,1,-2,0],
        "hp": 17
        //*wswww*qqqqqaaqaaas*a*swswqqqqwswwswswssssa*s*aqqwqwws (15)
        //*wswww*qqqaaqqqaasssaq*a*qwqwqwswwsws*wssssa*s*aqqwqwws (16*)
        //*wswww*qqqqqa*qaaasssaq*a*qwqwqwswssswwqwsssaasswq*w*wqq (17**)
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
    '0': {type: 'starfish1', hp: 0, star: true},
    '1': {type: 'guppy1', hp: 1},
    '2': {type: 'catfish1', hp: 2},
    '3': {type: 'piranha1', hp: 3},
    '4': {type: 'stingray1', hp: 4}
};

function countstars(level) {
    var stars = 0;
    for (var x = -MR; x <= MR; x ++) {
        for (var y = -MR; y <= MR; y ++) {
            var p = level.map[MR+y][MR+x];
            var f = FOODMAP[p];
            if (f && f.star)
                stars ++;
        }
    }
    return stars;
}

function start() {
    var level = LEVELS[curlevel];
    var game = {
        map: level.map.slice(),
        eel: level.eel.slice(),
        leveldesc: level.id ? (level.id + (level.name ? (': "' + level.name + '"') : '')) : '',
        hp: level.hp,
        charge: true,
        over: false,
        hasstars: 0,
        stars: 0,
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
                    star: f.star
                });
                if (f.star)
                    game.hasstars ++;
            }
        }
    }
    return game;
}

function game_over(game) {
    if (game.hp <= 0)
        return true;
    var nonstars = 0;
    $.each(game.food, function(i, f) { if (!f.star) nonstars ++; });
    return nonstars == 0;
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
            if (food.star) {
                game.stars ++;
            } else {
                game.hp = Math.min(20, game.hp + FOODHP);
            }
            if (oneat) oneat(food);
            game.food.splice(i, 1);
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

function solver(game, sethp) {
    var progress;
    var solutions = [];
    function over() {
    }
    function step(sofar, game) {
        if (time() > progress) {
            console.info('thinking: ' + sofar);
            progress = time() + 5;
        }
        if (game_canshock(game)) {
            var game2 = $.extend(true, {}, game);
            if (game_shock(game2)) {
                if (!game_over(game2))
                    step(sofar + '*', game2);
            }
        }
        if (game_canmove(game, -1, 0)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, -1, 0);
            if (game2.food.length == 0)
                solutions.push(sofar + 'q');
            else if (!game_over(game2))
                step(sofar + 'q', game2);
        }
        if (game_canmove(game, 0, -1)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, 0, -1);
            if (game2.food.length == 0)
                solutions.push(sofar + 'w');
            else if (!game_over(game2))
                step(sofar + 'w', game2);
        }
        if (game_canmove(game, 1, 0)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, 1, 0);
            if (game2.food.length == 0)
                solutions.push(sofar + 's');
            else if (!game_over(game2))
                step(sofar + 's', game2);
        }
        if (game_canmove(game, 0, 1)) {
            var game2 = $.extend(true, {}, game);
            game_move(game2, 0, 1);
            if (game2.food.length == 0)
                solutions.push(sofar + 'a');
            else if (!game_over(game2))
                step(sofar + 'a', game2);
        }
    }
    game = $.extend(true, {}, game);
    for (var hp = sethp || 1; hp <= 20; hp ++) {
        console.info('trying hp ' + hp);
        progress = time() + 5;
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

var game, save;
$(document).ready(function() {
    var page = 'intro';
    var busy = false;
    var hackk = 0;
    var hack = false;
    game = null;
    save = $.cookie('levels') || null;
    if (!save) {
        save = [];
        $.each(LEVELS, function() {
            save.push({
                locked: true,
                finished: false,
                stars: 0
            });
        });
        save[0].locked = false;
    }

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
    var bg = $(document.createElementNS(svgNS, 'rect'))
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bw)
        .attr('height', bh)
        .attr('id', 'bg');
    borderclipg.append(bg);

    var board = $(document.createElementNS(svgNS, 'g'));
    borderclipg.append(board);

    var border = $(document.createElementNS(svgNS, 'image'))
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bw)
        .attr('height', bh)
        .attr('href', 'svg/border1.svg');
    svg.append(border);

    var leveldesc = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'gametext')
        .attr('x', bw - TR - 520 + 6)
        .attr('y', bh + 23)
        .attr('text-anchor', 'start')
        .attr('font-size', 20)
        .text('...');
    svg.append(leveldesc);

    var hungert = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'gametext')
        .attr('x', bw - TR - 520)
        .attr('y', bh + 58)
        .attr('text-anchor', 'end')
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
        .attr('class', 'gametext')
        .attr('x', bw - TR - 520)
        .attr('y', bh + 93)
        .attr('text-anchor', 'end')
        .attr('font-size', 20)
        .text('Charge:');
    svg.append(charget);
    var charge1 = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'gametext')
        .attr('x', bw - TR - 520 + 6)
        .attr('y', bh + 93)
        .attr('text-anchor', 'start')
        .attr('font-size', 20)
        .text('Ready');
    svg.append(charge1);

    var star1 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 45)
        .attr('y', bh + 65)
        .attr('width', 50)
        .attr('height', 50)
        .attr('href', 'svg/starfish1b.svg');
    svg.append(star1);
    var star2 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 90)
        .attr('y', bh + 65)
        .attr('width', 50)
        .attr('height', 50)
        .attr('href', 'svg/starfish1b.svg');
    svg.append(star2);
    var star3 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 135)
        .attr('y', bh + 65)
        .attr('width', 50)
        .attr('height', 50)
        .attr('href', 'svg/starfish1b.svg');
    svg.append(star3);

    $.each(LEVELS, function(i, level) {
        var stars = countstars(level);
        var container = $('#menu' + 'TGCPS'.indexOf(level.id[0]) + 'levels');
        var button = $(document.createElement('span'))
            .attr('class', 'levelbutton')
            .html(level.id.substr(1) + '<br/>');
        var levelsave = save.length > i ? save[i] : {locked: true};
        button.addClass(levelsave.locked ? 'l' : levelsave.finished ? 'f' : 'o');
        if (!levelsave.locked) {
            button.click(function() {
                curlevel = i;
                $('#menu').addClass('left');
                $('#game').removeClass('left right');
                page = 'game';
                reset();
            });
        }
        if (stars == 0)
            button.html(button.html()+'&nbsp;');
        for (var j = 0; j < stars; j ++) {
            var star = $(document.createElement('div'))
                .attr('class', 'levelbuttonstar')
                .html('&nbsp;');
            if (j < levelsave.stars)
                star.addClass('got');
            button.append(star);
        }
        container.append(button);
    });

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
        star1.attr('href', 'svg/starfish1' + (game.stars > 0 ? 'a' : 'b') + '.svg')
            .toggle(game.hasstars > 0);
        star2.attr('href', 'svg/starfish1' + (game.stars > 1 ? 'a' : 'b') + '.svg')
            .toggle(game.hasstars > 1);
        star3.attr('href', 'svg/starfish1' + (game.stars > 2 ? 'a' : 'b') + '.svg')
            .toggle(game.hasstars > 2);
        
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

    var introfish = [];

    setInterval(function() {
        if (page == 'game') {
            $.each(gridlines, function(i, gl) {
                gridline_update(gl);
            });
        } else if (page == 'intro') {
            for (var i = 0; i < introfish.length; i ++) {
                var fish = introfish[i];
                fish.y += fish.dy * 100 / 1000.0;
                var o = 1;
                if (fish.y + TR > 668)
                    o = Math.max(0, (768 - (fish.y + TR)) / 100);
                if (fish.y < 100)
                    o = Math.max(0, fish.y / 100);
                fish.img.css({
                    top: fish.x,
                    left: fish.y,
                    opacity: o
                });
                if (fish.y + TR > 778 || fish.y < -10) {
                    fish.img.remove();
                    introfish.splice(i, 1);
                    i --;
                }
            }
            while (introfish.length < 3) {
                if (introfish.length > 0 && Math.random() < 0.95)
                    break;
                var type = ['guppy1', 'catfish1', 'piranha1', 'stingray1'][Math.floor(Math.random()*4)];
                var x = 100 + Math.random() * (300 - TR);
                $.each(introfish, function(i, fish) {
                    if (Math.abs(fish.x-x) < TR)
                        type = null;
                });
                if (type == null)
                    continue;
                var dy = 25 + Math.random() * 65;
                if (Math.random() > 0.5)
                    dy = -dy;
                var y = dy > 0 ? 0 : (768 - TR);
                var img = $(document.createElement('img'))
                    .attr('class', 'introfish')
                    .attr('src', 'svg/' + type + 'a.svg')
                    .css({
                        transform: dy > 0 ? '' : 'scaleX(-1)',
                        opacity: 0
                    });
                introfish.push({
                    x: x,
                    y: y,
                    dy: dy,
                    img: img
                });
                img.css({
                    top: x,
                    left: y
                });
                $('#intro .page').append(img);
            }
        }
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
        svg.css({
            left: 0,
            opacity: 1
        });
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
        leveldesc.text(game.leveldesc);
        board.empty();
        gridlines = [];
        for (var x = -MR; x <= MR; x ++) {
            for (var y = -MR; y <= MR; y ++) {
                function passable(p) { return p != '*' && p != 'p'; }
                var p = game.map[MR+y][MR+x];
                var p0 = passable(p);
                var pnw = x > -MR && passable(game.map[MR+y][MR+x-1]);
                var psw = y < MR && passable(game.map[MR+y+1][MR+x]);
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
            if (f.hp)
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
    $.each(['starfish1', 'guppy1', 'catfish1', 'piranha1', 'stingray1'], function(i, food) {
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
    preloadsvg(imgs, null);

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
            save[curlevel] = save[curlevel] || {
                locked: false,
                finished: true,
                stars: 0
            };
            save[curlevel].finished = true;
            save[curlevel].stars = Math.max(save[curlevel].stars, game.stars);
            if (curlevel + 1 < save.length) {
                save[curlevel+1] = save[curlevel+1] || {
                    locked: false,
                    finished: false,
                    stars: 0
                };
                save[curlevel+1].locked = false;
            }
            $.cookie('levels', save);
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
        var nonstars = 0;
        $.each(game.food, function(i, f) { if (!f.star) nonstars ++; });
        if (nonstars == 0)
            victory();
        if (game.food.length && game.hp == 0)
            defeat();
        puteel();
        updateconsole();
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
        moveeel(-1, 0);
    }
    function do_w(event) {
        moveeel(0, -1);
    }
    function do_s(event) {
        moveeel(1, 0);
    }
    function do_a(event) {
        moveeel(0, 1);
    }
    function do_sp(event) {
        shock();
    }

    function drawsol(sol) {
        var ex = game.eel[0];
        var ey = game.eel[1];
        var x = (bw/2 + TR * (ex - ey));
        var y = (bh/2 + TR * (ex + ey)) - 20;
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
            ny += 40/sol.length;
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
        if (page == 'game') {
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
                    } else if (event.keyCode == 48) {
                        settile('0');
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
        } else if (page == 'intro') {
            if (event.keyCode == 32 || event.keyCode == 13) {
                introplay();
            }
        } else if (page == 'menu') {
        }
    });
    svg.click(function(event) {
        if (page == 'game') {
            if (hack)
                return;
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
        }
    });
    $(document).keyup(function(event) {
        if (page == 'game') {
            if (busy)
                return;
            if (event.keyCode == 27)
                reset();
        } else if (page == 'menu') {
            if (event.keyCode == 27)
                menuback();
        }
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

    window.introplay = function() {
        if (page == 'intro') {
            $('#intro').addClass('left');
            $('#menu').removeClass('left right');
            page = 'menu';
        }
    };
    window.menuback = function() {
        if (page == 'menu') {
            $('#menu').addClass('right');
            $('#intro').removeClass('left right');
            page = 'intro';
        }
    };
});
