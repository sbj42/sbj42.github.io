var basicHarm = mu.BasicHarmonicVoice();
basicHarm.ready(function() {
    var v = basicHarm;
    var k = mu.Keyboard(v.lowest(), v.highest());
    mu._html('#keyboard').append(k.node());
    k.on('keymousedown', function(pitch) {
        mu._html(document.body).append('div')
            .node().innerHTML = pitch.toString() + ' ' + pitch.frequency().toString();
        if (pitch.subtract(v.lowest()) >= 0 && pitch.subtract(v.highest()) <= 0)
            v.startPitch(pitch);
    });
    k.on('keymouseup', function(pitch) {
        if (pitch.subtract(v.lowest()) >= 0 && pitch.subtract(v.highest()) <= 0)
            v.stopPitch(pitch);
    });
});

document.write('tests passed');
