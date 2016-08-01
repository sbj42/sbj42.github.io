var speed = 250;
var sine;
function do_sine() {
    sine = mu.audio.SineVoice();
    sine.ready(function() {
        assert(sine.canPlayPitch(mu.C_4.pitch()));
        assertEquals(sine.pitchesPlaying().length, 0);
        setTimeout(function() {
            sine.startPitch(mu.C_4.pitch());
            setTimeout(function() {
                sine.silence();
                sine.startPitch(mu.E_4.pitch());
                setTimeout(function() {
                    sine.stopPitch(mu.C_4.pitch());
                    sine.stopPitch(mu.E_4.pitch());
                    sine.startPitch(mu.G_4.pitch());
                    setTimeout(function() {
                        assertEquals(sine.pitchesPlaying().length, 1);
                        sine.dispose();
                        sine.startPitch(mu.C_3.pitch());
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
            harm.startPitch(mu.C_3.pitch());
            harm.startPitch(mu.C_4.pitch());
            assertEquals(harm.pitchesPlaying().length, 2);
            setTimeout(function() {
                harm.startPitch(mu.E_FLAT_4.pitch());
                setTimeout(function() {
                    harm.startPitch(mu.G_4.pitch());
                    setTimeout(function() {
                        assertEquals(harm.pitchesPlaying().length, 4);
                        harm.stopPitch(mu.C_3.pitch());
                        harm.stopPitch(mu.C_4.pitch());
                        harm.stopPitch(mu.E_FLAT_4.pitch());
                        harm.stopPitch(mu.G_4.pitch());
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
