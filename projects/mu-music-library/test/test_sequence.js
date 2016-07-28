(function() {
    console.info('testing mu.SimpleChordProgression');
    var s = mu.SimpleChordProgression(mu.Tempo(180));
    assertEquals(s.tempo().bpm(), 180);
    assertEquals(s.duration(), 0);
    s.addChord(mu.Chord(mu.C_4, mu.E_4, mu.G_4), 1);
    s.addRest(1);
    s.addChord(mu.Chord(mu.B_3, mu.F_4, mu.G_4), 1);
    s.addRest(1);
    s.addChord(mu.Chord(mu.C_4, mu.E_4, mu.G_4), 2);
    assertEquals(s.duration(), 6);
    assertEquals(s.nextChange().time, 0);
    assertEquals(s.nextChange().chord.pitches()[0].equals(mu.C_4), true);
    assertEquals(s.nextChange(0).time, 0);
    assertEquals(s.nextChange(0).chord.pitches()[0].equals(mu.C_4), true);
    assertEquals(s.nextChange(0.5).time, 1);
    assertEquals(s.nextChange(0.5).chord, null);
    assertEquals(s.nextChange(1).time, 1);
    assertEquals(s.nextChange(1).chord, null);
    assertEquals(s.nextChange(1.5).time, 2);
    assertEquals(s.nextChange(1.5).chord.pitches()[0].equals(mu.B_3), true);
    assertEquals(s.nextChange(5).time, 6);
    assertEquals(s.nextChange(5).chord, null);
    assertEquals(s.nextChange(6), null);
    assertThrow(function() { mu.addChord(2); });
    assertThrow(function() { mu.addRest(mu.Chord(mu.C_4, mu.E_4, mu.G_4), 2); });
    
    var v = mu.HarmonicVoice();
    v.ready(function() {
        var r = mu.Cursor(s, function(change) {
            v.silence();
            if (change && change.chord) {
                console.info(change.chord.toString());
                change.chord.pitches().forEach(function(pitch) {
                    v.startPitch(pitch);
                });
            }
        }).play();
        assertEquals(r, true);
    });
})();

document.write('tests passed');
