(function() {
    var k = mu.Keyboard();
    mu._html('#keyboard').append(k.node());
    k.on('keymousedown', function(pitch) {
        mu._html(document.body).append('div')
            .node().innerHTML = pitch.toString() + ' ' + pitch.frequency().toString();
        mu.SINE.play(pitch, 0.5);
    });
})();

document.write('tests passed');
