var harm = mu.HarmonicVoice();
harm.ready(function() {
    var v = harm;
    var c = mu.Controller(v);
    var k = mu.Keyboard(v.lowest(), v.highest());
    mu._html('#keyboard').append(k.node());
    c.connectUI(k);
    c.voice().startPitch(mu.F_4);
    c.voice().startPitch(mu.A_FLAT_4);
    setTimeout(function() {
        c.voice().stopPitch(mu.F_4);
        c.voice().stopPitch(mu.A_FLAT_4);
    }, 300);
});

document.write('tests passed');
