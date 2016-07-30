var speed = 250;
function do_sine() {
    var sine = mu.audio.SineVoice();
    sine.ready(function() {
        assert(sine.canPlayPitch(mu.C_4));
        assertEquals(sine.playing().length, 0);
        setTimeout(function() {
            sine.startPitch(mu.C_4);
            setTimeout(function() {
                sine.silence();
                sine.startPitch(mu.E_4);
                setTimeout(function() {
                    sine.stopPitch(mu.C_4);
                    sine.stopPitch(mu.E_4);
                    sine.startPitch(mu.G_4);
                    setTimeout(function() {
                        assertEquals(sine.playing().length, 1);
                        sine.dispose();
                        sine.startPitch(mu.C_3);
                        do_harm();
                    }, speed);
                }, speed);
            }, speed);
        }, speed);
    });
}
function do_harm() {
    var harm = mu.audio.HarmonicVoice();
    harm.ready(function() {
        setTimeout(function() {
            harm.startPitch(mu.C_3);
            harm.startPitch(mu.C_4);
            assertEquals(harm.playing().length, 2);
            setTimeout(function() {
                harm.startPitch(mu.E_FLAT_4);
                setTimeout(function() {
                    harm.startPitch(mu.G_4);
                    setTimeout(function() {
                        assertEquals(harm.playing().length, 4);
                        harm.stopPitch(mu.C_3);
                        harm.stopPitch(mu.C_4);
                        harm.stopPitch(mu.E_FLAT_4);
                        harm.stopPitch(mu.G_4);
                        mu._html('#result').node().innerHTML = 'tests passed';
                    }, speed);
                }, speed);
            }, speed);
        }, speed);
    });
}
do_sine();
