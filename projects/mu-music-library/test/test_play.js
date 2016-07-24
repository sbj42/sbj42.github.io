var basicSine = mu.BasicSineVoice();
var basicHarm;
basicSine.ready(function() {
    basicSine.startPitch(mu.C_3);
    basicSine.startPitch(mu.C_4);
    setTimeout(function() {
        basicSine.startPitch(mu.E_4);
    }, 250);
    setTimeout(function() {
        basicSine.startPitch(mu.G_4);
    }, 500);
    setTimeout(function() {
        basicSine.silence();
    }, 750);
    basicHarm = mu.BasicHarmonicVoice();
    basicHarm.ready(function() {
        setTimeout(function() {
            basicHarm.startPitch(mu.C_3);
            basicHarm.startPitch(mu.C_4);
        }, 750);
        setTimeout(function() {
            basicHarm.startPitch(mu.E_FLAT_4);
        }, 1000);
        setTimeout(function() {
            basicHarm.startPitch(mu.G_4);
        }, 1250);
        setTimeout(function() {
            basicHarm.stopPitch(mu.C_3);
            basicHarm.stopPitch(mu.C_4);
            basicHarm.stopPitch(mu.E_FLAT_4);
            basicHarm.stopPitch(mu.G_4);
        }, 1500);
    });
});

document.write('tests passed');
