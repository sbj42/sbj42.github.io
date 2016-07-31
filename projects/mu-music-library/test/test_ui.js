var harm = mu.audio.HarmonicVoice();
harm.ready(function() {
    var voice = harm;
    var c = mu.ui.Controller(voice);

    var keyboard = mu.ui.Keyboard(voice.lowest(), voice.highest());
    mu._html('#keyboard').append(keyboard.node());
    c.connectUI(keyboard);

    var waveform = mu.ui.Waveform(mu.C_2.frequency());
    mu._html('#waveform').append(waveform.node());
    c.connectUI(waveform);

    var constellation = mu.ui.PitchConstellation(mu.C, mu.C_4, mu.B_4);
    mu._html('#constellation').append(constellation.node());
    c.connectUI(constellation);

    function onChange() {
        var chord = mu.Chord(c.voice().playing());
        var text = chord.abbr();
        var status = mu._html('#status').clear();
        if (text) {
            var name = chord.name();
            status.text('Chord: ' + text + ' (' + name + ')');
        }
    }

    c.addEventListener('pitchstart', onChange);
    c.addEventListener('pitchstop', onChange);
    
    c.voice().startPitch(mu.F_4);
    c.voice().startPitch(mu.A_FLAT_4);
    setTimeout(function() {
        c.voice().stopPitch(mu.F_4);
        c.voice().stopPitch(mu.A_FLAT_4);
    }, 250);
});

document.write('tests passed');
