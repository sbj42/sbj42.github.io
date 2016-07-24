var sine = mu.SineVoice();
var harm;
sine.ready(function() {
    sine.startPitch(mu.C_3);
    sine.startPitch(mu.C_4);
    setTimeout(function() {
        sine.startPitch(mu.E_4);
    }, 250);
    setTimeout(function() {
        sine.startPitch(mu.G_4);
    }, 500);
    setTimeout(function() {
        sine.silence();
    }, 750);
    harm = mu.HarmonicVoice();
    harm.ready(function() {
        setTimeout(function() {
            harm.startPitch(mu.C_3);
            harm.startPitch(mu.C_4);
        }, 750);
        setTimeout(function() {
            harm.startPitch(mu.E_FLAT_4);
        }, 1000);
        setTimeout(function() {
            harm.startPitch(mu.G_4);
        }, 1250);
        setTimeout(function() {
            harm.stopPitch(mu.C_3);
            harm.stopPitch(mu.C_4);
            harm.stopPitch(mu.E_FLAT_4);
            harm.stopPitch(mu.G_4);
        }, 1500);
    });
});

document.write('tests passed');
