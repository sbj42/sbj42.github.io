mu.SINE.play(mu.C_3, 0.5);
mu.SINE.play(mu.C_4, 0.5);
mu.SINE.play(mu.E_4, 0.5);
mu.SINE.play(mu.G_4, 0.5);
setTimeout(function() {
    mu.HARM.play(mu.C_3, 0.5);
    mu.HARM.play(mu.C_4, 0.5);
    mu.HARM.play(mu.E_4, 0.5);
    mu.HARM.play(mu.G_4, 0.5);
}, 500);

document.write('tests passed');
