var comic = document.getElementById('comic');
var next = document.getElementById('next');
var prev = document.getElementById('prev');
var restart = document.getElementById('restart');
var home = document.getElementById('home');

var CENTER_X = 3245;
var CENTER_Y = 1640;
var SCALE_FACTOR = window.innerWidth / 1400;
var TICK_DELAY = 10;

next.style.top = ((window.innerHeight - 100) / 2) + 'px';
prev.style.top = ((window.innerHeight - 100) / 2) + 'px';
restart.style.left = ((window.innerWidth - 100) / 2) + 'px';

function setCamera(zoom, offx, offy) {
    zoom = zoom * SCALE_FACTOR;
    var wcx = window.innerWidth / 2;
    var wcy = window.innerHeight / 2;
    comic.style.transform = 'translate(' + (-offx * zoom - CENTER_X) + 'px, ' + (-offy * zoom - CENTER_Y) + 'px)'
        + ' scale(' + zoom + ')'
        + ' translate(' + (CENTER_X + wcx / zoom) + 'px, ' + (CENTER_Y + wcy / zoom) + 'px)';
}

var zoom = 0.2;
var ox = CENTER_X;
var oy = CENTER_Y;

setCamera(zoom, ox, oy);

function audioPath(index) {
    var name = String(index + 1);
    if (name.length < 2)
        name = '0' + name;
    return './audio/' + name + '.ogg';
}

function makeAudio(image) {
    return new Howl({
        src: audioPath(image),
    });
}

var AUDIO = {};

function imagePath(index) {
    var name = String(index + 1);
    if (name.length < 2)
        name = '0' + name;
    return './cards/' + name + '.jpg';
}

function makeCard(image) {
    var elem = document.createElement('img');
    elem.className = 'card';
    elem.src = imagePath(image);
    return elem;
}

function makePage(begin, end, klass, visible) {
    var elem = document.createElement('div');
    elem.className = 'page';
    if (klass) {
        elem.className = 'page ' + klass;
    }
    if (visible === false) {
        elem.style.visibility = 'hidden';
    }
    for (var i = begin; i < end; i ++) {
        elem.appendChild(makeCard(i));
    }
    comic.appendChild(elem);
    return elem;
}

var animating = false;
var HALF_PAGE_WIDTH = 1620;

function turnPageRightForward(page, then) {
    animating = true;
    var angle = 0;
    function tick() {
        angle += 1;
        page.style.transform = 'translate(-' + HALF_PAGE_WIDTH + 'px) rotateY(-' + angle + 'deg) translate(' + HALF_PAGE_WIDTH + 'px)';
        if (angle >= 90) {
            clearInterval(timer);
            page.style.visibility = 'hidden';
            animating = false;
            if (then) then();
        }
    }
    tick();
    var timer = setInterval(tick, TICK_DELAY);
}

function turnPageLeftForward(page, then) {
    animating = true;
    var angle = 90;
    function tick() {
        angle -= 1;
        page.style.transform = 'translate(' + HALF_PAGE_WIDTH + 'px) rotateY(' + angle + 'deg) translate(-' + HALF_PAGE_WIDTH + 'px)';
        page.style.visibility = 'visible';
        if (angle <= 0) {
            clearInterval(timer);
            animating = false;
            if (then) then();
        }
    }
    tick();
    var timer = setInterval(tick, TICK_DELAY);
}

function turnPageRightBackward(page, then) {
    animating = true;
    var angle = 90;
    function tick() {
        angle -= 1;
        page.style.transform = 'translate(-' + HALF_PAGE_WIDTH + 'px) rotateY(-' + angle + 'deg) translate(' + HALF_PAGE_WIDTH + 'px)';
        page.style.visibility = 'visible';
        if (angle <= 0) {
            clearInterval(timer);
            animating = false;
            if (then) then();
        }
    }
    tick();
    var timer = setInterval(tick, TICK_DELAY);
}

function turnPageLeftBackward(page, then) {
    animating = true;
    var angle = 0;
    function tick() {
        angle += 1;
        page.style.transform = 'translate(' + HALF_PAGE_WIDTH + 'px) rotateY(' + angle + 'deg) translate(-' + HALF_PAGE_WIDTH + 'px)';
        if (angle >= 90) {
            page.style.visibility = 'hidden';
            clearInterval(timer);
            animating = false;
            if (then) then();
        }
    }
    tick();
    var timer = setInterval(tick, TICK_DELAY);
}

var TITLE_CARDS = 2;
var CARDS = 24;
var CARDS_PER_PAGE = 6;

function firstCardIndex(p) {
    if (p == 0) return 0;
    return TITLE_CARDS + (p - 1) * CARDS_PER_PAGE;
}

var PAGE_COUNT = 1 + Math.floor((CARDS - TITLE_CARDS + CARDS_PER_PAGE - 1) / CARDS_PER_PAGE);

var LEFT_PAGES = [];
for (var p = 1; p < PAGE_COUNT; p += 2) {
    var i = firstCardIndex(p);
    LEFT_PAGES.push(makePage(i, Math.min(i + CARDS_PER_PAGE, CARDS), 'left', false));
}

var RIGHT_PAGES = [];
for (var p = PAGE_COUNT - 1 - ((PAGE_COUNT + 1) % 2); p > 0; p -= 2) {
    var i = firstCardIndex(p);
    RIGHT_PAGES.push(makePage(i, Math.min(i + CARDS_PER_PAGE, CARDS), 'right'));
}
RIGHT_PAGES.push(makePage(0, TITLE_CARDS, 'title right'));

for (var index = 0; index < CARDS; index ++) {
    AUDIO[index] = makeAudio(index);
}

var pos = 0;

function turnPageForward(then) {
    if (pos == LEFT_PAGES.length) {
        if (then) then();
        return;
    }
    turnPageRightForward(RIGHT_PAGES[RIGHT_PAGES.length - 1 - pos], function() {
        turnPageLeftForward(LEFT_PAGES[pos], function() {
            pos ++;
            if (then) then();
        });
    });
}

function turnPageBackward(then) {
    if (pos == 0) {
        if (then) then();
        return;
    }
    pos --;
    turnPageLeftBackward(LEFT_PAGES[pos], function() {
        turnPageRightBackward(RIGHT_PAGES[RIGHT_PAGES.length - 1 - pos], function() {
            if (then) then();
        });
    });
}

function pageNum(index) {
    return Math.floor((index - 2 + CARDS_PER_PAGE) / CARDS_PER_PAGE);
}

function getPageForCard(index) {
    var p = pageNum(index);
    var page;
    if (p % 2) {
        page = LEFT_PAGES[Math.floor((p + 1)/2) - 1];
    } else {
        page = RIGHT_PAGES[RIGHT_PAGES.length - 1 - Math.floor(p / 2)];
    }
    return page;
}

function getCard(index) {
    var p = pageNum(index);
    return getPageForCard(index).children[index - firstCardIndex(p)];
}

function zoomTo(tz, tx, ty, then) {
    animating = true;
    var at = 0;
    function tick() {
        at += 1;
        var z = (zoom * (100 - at) + tz * at) / 100;
        var x = (ox * (100 - at) + tx * at) / 100;
        var y = (oy * (100 - at) + ty * at) / 100;
        setCamera(z, x, y);
        if (at >= 100) {
            zoom = tz;
            ox = tx;
            oy = ty;
            clearInterval(timer);
            animating = false;
            if (then) then();
        }
    }
    tick();
    var timer = setInterval(tick, TICK_DELAY);
}

function zoomOut(then) {
    if (zoom == 0.2) {
        if (then) then();
        return;
    }
    zoomTo(0.2, CENTER_X, CENTER_Y, then);
}

function zoomToCard(index, then) {
    var page = getPageForCard(index);
    var card = getCard(index);
    var tx = page.offsetLeft + card.offsetLeft + card.offsetWidth / 2;
    var ty = page.offsetTop + card.offsetTop + card.offsetHeight / 2;
    var tz = 0.6;
    zoomTo(tz, tx, ty, then);
}

function playCardAudio(index) {
    if (AUDIO[index]) {
        AUDIO[index].play();
    }
}

function stopAudio() {
    for (var index = 0; index < CARDS; index ++) {
        if (AUDIO[index]) {
            AUDIO[index].stop();
        }
    }
}

// turnPageForward(function() {
//     zoomToCard(2, function() {
//         zoomToCard(3, function() {
//             zoomToCard(4, function() {
//                 zoomToCard(5, function() {
//                     zoomOut();
//                 });
//             });
//         });
//     });
//     // turnPageForward(function() {
//     //     turnPageBackward(function() {
//     //         turnPageBackward(function() {
//     //         });
//     //     });
//     // });
// });

var index = -1;

function doNext() {
    if (animating) return;
    stopAudio();
    if (index >= CARDS - 1) {
        zoomOut(function() {
            prev.style.visibility = 'visible';
            next.style.visibility = 'hidden';
            restart.style.visibility = 'visible';
        });
        index = CARDS;
    } else if (Math.floor((pageNum(index + 1) + 1) / 2) > pos) {
        zoomOut(function() {
            turnPageForward(function() {
                prev.style.visibility = 'visible';
            });
        });
    } else {
        index ++;
        zoomToCard(index, function() {
            prev.style.visibility = 'visible';
            playCardAudio(index);
        });
    }
}

function doPrev() {
    if (animating) return;
    stopAudio();
    if (index <= 0) {
        zoomOut(function() {
            next.style.visibility = 'visible';
            prev.style.visibility = 'hidden';
        });
        index = -1;
    } else if (Math.floor((pageNum(index - 1) + 1) / 2) < pos) {
        zoomOut(function() {
            turnPageBackward(function() {
                next.style.visibility = 'visible';
            });
        });
    } else {
        index --;
        zoomToCard(index, function() {
            next.style.visibility = 'visible';
            playCardAudio(index);
        });
    }
}

function doRestart() {
    if (animating) return;
    stopAudio();
    function backPage() {
        if (pos) {
            turnPageBackward(backPage);
        } else {
            next.style.visibility = 'visible';
            prev.style.visibility = 'hidden';
            restart.style.visibility = 'hidden';
            index = -1;
        }
    }
    zoomOut(backPage);
}

window.onkeydown = function(event) {
    if (animating) return;
    if (event.code === 'Enter') {
        doNext();
    } else if (event.code === 'Backspace') {
        doPrev();
    } else console.info(event);
};

next.onclick = doNext;
prev.onclick = doPrev;
restart.onclick = doRestart;
home.onclick = function() {
    window.location.href = '/projects/kendall-stories-2/';
};
prev.style.visibility = 'hidden';
restart.style.visibility = 'hidden';