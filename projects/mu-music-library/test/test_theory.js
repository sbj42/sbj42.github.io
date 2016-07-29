(function() {
    console.info('testing mu.Frequency');
    var a4 = mu.Frequency(440);
    assertEquals(a4.hertz(), 440);
    assertEquals(a4.toString(), '440.0 Hz');
    assertEquals(a4.multiply(2).hertz(), 880);
    assertEquals(a4.multiply(4).toString(), '1,760 Hz');
    var c2 = mu.Frequency(65.406);
    assertEquals(c2.hertz(), 65.406);
    assertEquals(c2.toString(), '65.41 Hz');
    assertThrow(function() { mu.Frequency(-1); });
    assertThrow(function() { mu.Frequency(0); });
    assertThrow(function() { mu.Frequency(1/0); });
    assertThrow(function() { mu.Frequency('x'); });
    assertThrow(function() { mu.Frequency('1'); });
})();

(function() {
    console.info('testing mu.Tempo');
    var t = mu.Tempo(120);
    assertEquals(t.bpm(), 120);
    assertEquals(t.toString(), '120 bpm');
    var t2 = mu.Tempo(56.59);
    assertClose(t2.bpm(), 56.59, 0.01);
    assertEquals(t2.toString(), '56.6 bpm');
    assertThrow(function() { mu.Tempo(-1); });
    assertThrow(function() { mu.Tempo(0); });
    assertThrow(function() { mu.Tempo(1/0); });
    assertThrow(function() { mu.Tempo('x'); });
    assertThrow(function() { mu.Tempo('1'); });
})();

(function() {
    console.info('testing mu.PitchClass');
    var a = mu.A;
    assertEquals(a.index(), 9);
    assertEquals(a.toString(), 'A');
    assertEquals(a.transpose(1).toString(), 'A\u266F/B\u266D');
    assertEquals(a.transpose(-1).toString(), 'G\u266F/A\u266D');
    assertEquals(a.transpose(3).toString(), 'C');
    assertEquals(a.transpose(-5).toString(), 'E');
    var c = mu.C;
    assertEquals(c.index(), 0);
    assertEquals(c.toString(), 'C');
    assert(!c.equals(a));
    assert(c.equals(c));
    assertThrow(function() { mu.C.transpose('1'); });
    assertThrow(function() { mu.PitchClass(-1); });
    assertThrow(function() { mu.PitchClass(12); });
    assertThrow(function() { mu.PitchClass('0'); });
    assertThrow(function() { mu.PitchClass(0.5); });
})();

(function() {
    console.info('testing mu.Pitch');
    var a4 = mu.A_4;
    assertEquals(a4.octave(), 4);
    assertEquals(a4.pitchClass().index(), 9);
    assertEquals(a4.frequency().hertz(), 440);
    assertEquals(a4.toString(), 'A4');
    assertEquals(a4.transpose(1).toString(), 'A\u266F4/B\u266D4');
    assertEquals(a4.transpose(-1).toString(), 'G\u266F4/A\u266D4');
    assertEquals(a4.transpose(3).toString(), 'C5');
    assertEquals(a4.transpose(-5).toString(), 'E4');
    assert(mu.Pitch.fromNum(a4.toNum()).equals(a4));
    var c2 = mu.Pitch(mu.C, 2);
    assertEquals(c2.octave(), 2);
    assertEquals(c2.pitchClass().index(), 0);
    assertEquals(a4.subtract(c2), 33);
    assert(!c2.equals(a4));
    assert(c2.equals(c2));
    assertClose(c2.frequency().hertz(), 65.406, 0.001);
    assertEquals(c2.toString(), 'C2');
    assertThrow(function() { mu.C_0.transpose(-1); });
    assertThrow(function() { mu.B_10.transpose(1); });
    assertThrow(function() { mu.C_0.transpose('1'); });
    assertThrow(function() { mu.Pitch(mu.C, -1); });
    assertThrow(function() { mu.Pitch(-1, 0); });
    assertThrow(function() { mu.Pitch(12, 0); });
    assertThrow(function() { mu.Pitch(mu.C, 11); });
    assertThrow(function() { mu.Pitch('0', 0); });
    assertThrow(function() { mu.Pitch(mu.C, '0'); });
    assertThrow(function() { mu.Pitch(0.5, 0); });
    assertThrow(function() { mu.Pitch(mu.C, 0.5); });
})();

(function() {
    console.info('testing mu.Interval');
    var i1 = mu.Interval(1);
    assertEquals(i1.semitones(), 1);
    assertEquals(i1.toString(), '1 semitone');
    var i5 = mu.Interval(5);
    assertEquals(i5.semitones(), 5);
    assertEquals(i5.toString(), '5 semitones');
    assertEquals(mu.C_4.interval(mu.D_4).semitones(), 2);
    assertEquals(mu.B_2.interval(mu.C_2).semitones(), 11);
    assertEquals(mu.B_2.sharper(mu.Interval(3)).toString(), 'D3');
    assertEquals(mu.B_2.flatter(mu.Interval(4)).toString(), 'G2');
    assertThrow(function() { mu.Interval(1.5); });
    assertThrow(function() { mu.Interval(-2); });
    assertThrow(function() { mu.Interval(10000); });
    assertThrow(function() { mu.Interval('1'); });
})();

(function() {
    console.info('testing mu.Chord');
    var cM = mu.Chord(mu.C_4, mu.E_4, mu.G_4);
    assertEquals(cM.size(), 3);
    assertEquals(cM.pitches()[0].toString(), 'C4');
    assertEquals(cM.pitches()[1].toString(), 'E4');
    assertEquals(cM.pitches()[2].toString(), 'G4');
    assertEquals(cM.toString(), 'C4 E4 G4');
    var cm = mu.Chord(mu.C_4, mu.G_4, mu.D_SHARP_4);
    assertEquals(cm.size(), 3);
    assertEquals(cm.pitches()[0].toString(), 'C4');
    assertEquals(cm.pitches()[1].toString(), 'D\u266F4/E\u266D4');
    assertEquals(cm.pitches()[2].toString(), 'G4');
    assertEquals(cm.toString(), 'C4 D\u266F4/E\u266D4 G4');
    var fM = cM.transpose(5);
    assertEquals(fM.size(), 3);
    assertEquals(fM.pitches()[0].toString(), 'F4');
    assertEquals(fM.pitches()[1].toString(), 'A4');
    assertEquals(fM.pitches()[2].toString(), 'C5');
    assertEquals(fM.toString(), 'F4 A4 C5');
    assertThrow(function() { mu.Chord(mu.C_4, mu.E_4); });
    assertThrow(function() { mu.Chord('C4 G4'); });
})();

document.write('tests passed');
