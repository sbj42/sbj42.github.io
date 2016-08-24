function header() {
    var main = Html('#main').clear()
        .append('div')
        .attr('id', 'top');
    main.append('div')
        .attr('id', 'top_title')
        .text('Probably Puzzles')
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
        .attr('src', 'puz/' + puz.ID + '.png');
    var name = menu.append('div')
        .attr('id', 'puzzle_menu_name');
    name.text(puz.NAME);
    var inner = menu.append('div')
        .attr('id', 'puzzle_menu_inner');
    var name = menu.append('div')
        .attr('id', 'puzzle_menu_info');
    name.html(puz.INFO);
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
                var puzzleObject = puz();
                puzzle_go(puz, puzzleObject);
            });
        item.append('img')
            .classed('top_menu_img', true)
            .attr('src', 'puz/' + puz.ID + '.png');
        item.append('div')
            .classed('top_menu_text', true)
            .text(puz.NAME);
    }

    menu_item(Numbrix);
    menu_item(Hidato);
    menu_item(Nonogram);
    menu_item(Shikaku);
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
