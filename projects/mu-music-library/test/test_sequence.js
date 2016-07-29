(function() {
    console.info('testing mu.seq.SimpleChordProgression');
    var s = mu.seq.SimpleChordProgression(mu.Tempo(120));
    assertEquals(s.tempo().bpm(), 120);
    assertEquals(s.duration(), 0);
    s.addChord(mu.Chord(mu.C_4, mu.E_4, mu.G_4), 1);
    s.addRest(1);
    s.addChord(mu.Chord(mu.B_3, mu.F_4, mu.G_4), 1);
    s.addRest(1);
    s.addChord(mu.Chord(mu.C_4, mu.E_4, mu.G_4), 2);
    assertEquals(s.duration(), 6);
    assertEquals(s.nextChange().time, 0);
    assert(s.nextChange().chord.pitches()[0].equals(mu.C_4));
    assertEquals(s.nextChange(0).time, 0);
    assert(s.nextChange(0).chord.pitches()[0].equals(mu.C_4));
    assertEquals(s.nextChange(0.5).time, 1);
    assertEquals(s.nextChange(0.5).chord, null);
    assertEquals(s.nextChange(1).time, 1);
    assertEquals(s.nextChange(1).chord, null);
    assertEquals(s.nextChange(1.5).time, 2);
    assert(s.nextChange(1.5).chord.pitches()[0].equals(mu.B_3));
    assertEquals(s.nextChange(5).time, 6);
    assertEquals(s.nextChange(5).chord, null);
    assertEquals(s.nextChange(6), null);
    assertThrow(function() { mu.addChord(2); });
    assertThrow(function() { mu.addRest(mu.Chord(mu.C_4, mu.E_4, mu.G_4), 2); });

    var ui = mu.ui.ChordLine();
    mu._html('#chordline')
        .append(ui.node());
    ui.setChordProgression(s);

    var v = mu.audio.HarmonicVoice();
    v.ready(function() {
        var t = Date.now();
        var c = mu.seq.Cursor(s, function(change) {
            v.silence();
            //console.info((Date.now() - t) / 1000, change);
            if (change && change.chord) {
                console.info(change.chord.toString());
                change.chord.pitches().forEach(function(pitch) {
                    v.startPitch(pitch);
                });
            }
        });
        assertEquals(c.play(), true);
        setTimeout(function() {
            assert(c.time() > 0 && c.time() < 1, true);
            setTimeout(function() {
                c.pause();
                //console.info(c.time());
                setTimeout(function() {
                    c.play();
                }, 500);
            }, 100);
        }, 200);
        setInterval(function() {
            ui.setCursor(c.time());
        }, 20);
    });
})();

document.write('tests passed');
