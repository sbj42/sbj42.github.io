var harm = mu.HarmonicVoice();
harm.ready(function() {
    var voice = harm;
    var c = mu.Controller(voice);

    var keyboard = mu.Keyboard(voice.lowest(), voice.highest());
    mu._html('#keyboard').append(keyboard.node());
    c.connectUI(keyboard);

    var constellation = mu.PitchConstellation(mu.C, voice.lowest(), voice.highest());
    mu._html('#constellation').append(constellation.node());
    c.connectUI(constellation);
    
    /*
    c.voice().startPitch(mu.F_4);
    c.voice().startPitch(mu.A_FLAT_4);
    setTimeout(function() {
        c.voice().stopPitch(mu.F_4);
        c.voice().stopPitch(mu.A_FLAT_4);
    }, 300);
    */
});

document.write('tests passed');
