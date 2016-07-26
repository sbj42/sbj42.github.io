var harm = mu.HarmonicVoice();
harm.ready(function() {
    var v = harm;
    var k = mu.Keyboard(v.lowest(), v.highest());
    mu._html('#keyboard').append(k.node());
    k.addEventListener('pitchstart', function(data) {
        var pitch = data.pitch;
        mu._html(document.body).append('div')
            .node().innerHTML = pitch.toString() + ' ' + pitch.frequency().toString();
        if (v.canPlayPitch(pitch)) {
            v.startPitch(pitch);
            k.startPitch(pitch);
        }
    });
    k.addEventListener('pitchstop', function(data) {
        var pitch = data.pitch;
        if (v.canPlayPitch(pitch)) {
            v.stopPitch(pitch);
            k.stopPitch(pitch);
        }
    });
});

document.write('tests passed');
