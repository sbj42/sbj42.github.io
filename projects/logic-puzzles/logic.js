function header() {
    var main = Html('#main').clear()
        .append('div')
        .attr('id', 'top');
    main.append('div')
        .attr('id', 'top_title')
        .text('Logic Puzzles')
    var subtitle = main.append('div')
        .attr('id', 'top_subtitle');
    subtitle.append('span')
        .text('coded by ');
    subtitle.append('a')
        .attr('href', 'http://arbitraryclark.blogspot.com/')
        .text('James Clark');
    return main;
}

function puzzle_go(puz, puzzleObject) {
    var main = header();
    var menu = main.append('div')
        .attr('id', 'puzzle_menu');
    menu.append('div')
        .classed('puzzle_menu_img', true)
        .append('img')
        .attr('src', 'puz/' + puz.id + '.png');
    menu.append('div')
        .attr('id', 'puzzle_menu_name')
        .html(puz.title || puz.name);
    var inner = menu.append('div')
        .attr('id', 'puzzle_menu_inner');
    puzzleObject.menu(inner, function() {
        puzzle_go(puz, puzzleObject);
    });
}

function top_go() {
    var main = header();
    var menu = main.append('div')
        .attr('id', 'top_menu');
    menu.append('div')
        .text('Choose a puzzle:');

    function menu_item(puz) {
        var item = menu.append('div')
            .classed('top_menu_item', true)
            .on('click', function() {
                var puzzleObject = puz.func();
                puzzle_go(puz, puzzleObject);
            });
        item.append('img')
            .classed('top_menu_img', true)
            .attr('src', 'puz/' + puz.id + '.png');
        item.append('div')
            .classed('top_menu_text', true)
            .html(puz.name);
    }

    menu_item({
        id: 'numbrix',
        name: 'Numbrix-like (aka Number Snake)',
        title: '<a target="_blank" href="http://parade.com/tag/numbrix/">Numbrix</a>-like (aka Number Snake)',
        func: Numbrix
    });
}

function progress_start() {
    Html('#progress-fade')
        .attr('style', 'display: block');
    Html('#progress-outer').clear()
        .attr('style', 'width: ' + 400 + 'px')
        .append('div')
        .attr('id', 'progress-inner')
        .attr('style', 'width: ' + 0 + 'px');
    Html('#progress')
        .attr('style', 'display: block');
}
function progress_update(pct) {
    Html('#progress-inner')
        .attr('style', 'width: ' + Math.floor(pct * 400) + 'px');
}
function progress_finish() {
    Html('#progress-fade')
        .attr('style', 'display: none');
    Html('#progress')
        .attr('style', 'display: none');
}

top_go();
/*

var count = 1;
var i = 0;
function progress_start() {
    Html('#progress-outer').clear()
        .attr('style', 'width: ' + 400 + 'px')
        .append('div')
        .attr('id', 'progress-inner')
        .attr('style', 'width: ' + 0 + 'px');
    Html('#progress')
        .attr('style', 'display: block');
}
function progress_update(pct) {
    Html('#progress-inner')
        .attr('style', 'width: ' + Math.floor((i + pct)/(count) * 400) + 'px');
}
function progress_clear() {
    Html('#progress')
        .attr('style', 'display: none');
}

function fin() {
    var div = Html('#main')
        .append('div')
        .classed('griddiv', true);
    p.start(div);
    i++;
    if (i == count) {
        progress_clear();
        return;
    }
    p = Numbrix();
    p.generate(10, 3, progress_update, fin);
}

var p = Numbrix();
progress_start();
p.generate(4, 7, progress_update, fin);
*/
