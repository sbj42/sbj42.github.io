var harm = mu.HarmonicVoice();
harm.ready(function() {
    var v = harm;
    var k = mu.Keyboard(v.lowest(), v.highest());
    mu._html('#keyboard').append(k.node());
    k.addEventListener('pitchpress', function(data) {
        var pitch = data.pitch;
        mu._html(document.body).append('div')
            .node().innerHTML = pitch.toString() + ' ' + pitch.frequency().toString();
        if (v.canPlayPitch(pitch)) {
            v.startPitch(pitch);
            k.pitchStarted(pitch);
        }
    });
    k.addEventListener('pitchrelease', function(data) {
        var pitch = data.pitch;
        if (v.canPlayPitch(pitch)) {
            v.stopPitch(pitch);
            k.pitchStopped(pitch);
        }
    });
    v.startPitch(mu.F_4);
    v.startPitch(mu.A_FLAT_4);
    k.pitchStarted(mu.F_4);
    k.pitchStarted(mu.A_FLAT_4);
    setTimeout(function() {
        v.stopPitch(mu.F_4);
        v.stopPitch(mu.A_FLAT_4);
        k.pitchStopped(mu.F_4);
        k.pitchStopped(mu.A_FLAT_4);
    }, 300);
});

document.write('tests passed');
