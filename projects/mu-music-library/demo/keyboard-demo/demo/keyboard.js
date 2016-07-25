mu._html('#jsok').node().style.display = 'block';
var harm = mu.HarmonicVoice();
harm.ready(function() {
    var v = harm;
    var k = mu.Keyboard(v.lowest(), v.highest());
    mu._html('#keyboard').append(k.node());
    k.on('keydown', v.startPitch.bind(v));
    k.on('keyup', v.stopPitch.bind(v));
});
