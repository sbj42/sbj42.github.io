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
p.generate(10, 3, progress_update, fin);
