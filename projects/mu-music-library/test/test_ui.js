var harm = mu.HarmonicVoice();
harm.ready(function() {
    var v = harm;
    var k = mu.Keyboard(v.lowest(), v.highest());
    mu._html('#keyboard').append(k.node());
    k.on('keydown', function(pitch) {
        mu._html(document.body).append('div')
            .node().innerHTML = pitch.toString() + ' ' + pitch.frequency().toString();
        if (v.canPlayPitch(pitch))
            v.startPitch(pitch);
    });
    k.on('keyup', function(pitch) {
        if (v.canPlayPitch(pitch))
            v.stopPitch(pitch);
    });
});

document.write('tests passed');
