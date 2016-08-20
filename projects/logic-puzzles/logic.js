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
        .attr('style', 'width: ' + Math.floor(pct * 400) + 'px');
}
function progress_clear() {
    Html('#progress')
        .attr('style', 'display: none');
}

function fin() {
    progress_clear();
    p.start(Html('#main'));
}

var p = Numbrix();
progress_start();
p.generate(10, 5, progress_update, fin);
