var harm = mu.audio.HarmonicVoice();
harm.ready(function() {
    var voice = harm;
    var c = mu.ui.Controller(voice);

    var keyboard = mu.ui.Keyboard(voice.lowest(), voice.highest());
    mu._html('#keyboard').append(keyboard.node());
    c.connectUI(keyboard);

    var constellation = mu.ui.PitchConstellation(mu.C, mu.C_4, mu.B_4);
    mu._html('#constellation').append(constellation.node());
    c.connectUI(constellation);
    
    c.voice().startPitch(mu.F_4);
    c.voice().startPitch(mu.A_FLAT_4);
    setTimeout(function() {
        c.voice().stopPitch(mu.F_4);
        c.voice().stopPitch(mu.A_FLAT_4);
    }, 250);
});

document.write('tests passed');
