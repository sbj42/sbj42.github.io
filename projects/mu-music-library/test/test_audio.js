var speed = 250;
var sine;
function do_sine() {
    sine = mu.audio.SineVoice();
    sine.ready(function() {
        assert(sine.canPlayPitch(mu.C_4));
        assertEquals(sine.pitchesPlaying().length, 0);
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
                        assertEquals(sine.pitchesPlaying().length, 1);
                        sine.dispose();
                        sine.startPitch(mu.C_3);
                        do_harm();
                    }, speed);
                }, speed);
            }, speed);
        }, speed);
    });
}
var harm;
function do_harm() {
    harm = mu.audio.HarmonicVoice();
    harm.ready(function() {
        setTimeout(function() {
            harm.startPitch(mu.C_3);
            harm.startPitch(mu.C_4);
            assertEquals(harm.pitchesPlaying().length, 2);
            setTimeout(function() {
                harm.startPitch(mu.E_FLAT_4);
                setTimeout(function() {
                    harm.startPitch(mu.G_4);
                    setTimeout(function() {
                        assertEquals(harm.pitchesPlaying().length, 4);
                        harm.stopPitch(mu.C_3);
                        harm.stopPitch(mu.C_4);
                        harm.stopPitch(mu.E_FLAT_4);
                        harm.stopPitch(mu.G_4);
                        do_freq();
                    }, speed);
                }, speed);
            }, speed);
        }, speed);
    });
}
function do_freq() {
    if (harm.canPlayFrequency()) {
        setTimeout(function() {
            harm.startFrequency(mu.Frequency(440));
            setTimeout(function() {
                harm.stopFrequency(mu.Frequency(440));
                harm.startFrequency(mu.Frequency(453));
                setTimeout(function() {
                    harm.silence();
                    done();
                }, speed);
            }, speed);
        }, speed);
    } else
        done();
}
function done() {
    mu._html('#result').node().innerHTML = 'tests passed';
}
do_sine();
