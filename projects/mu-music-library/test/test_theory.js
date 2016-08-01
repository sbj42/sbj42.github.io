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
    console.info('testing mu.Accidental');
    var a = mu.Accidental(1);
    assertEquals(a.semitones(), 1);
    assertEquals(a.toString(), '&#x266f;');
    var f = mu.FLAT;
    assertEquals(f.semitones(), -1);
    assertEquals(f.toString(), '&#x266d;');
    assertThrow(function() { mu.Accidental(100); });
    assertThrow(function() { mu.Accidental(1/0); });
    assertThrow(function() { mu.Accidental('x'); });
    assertThrow(function() { mu.Accidental('1'); });
})();

(function() {
    console.info('testing mu.PitchClass');
    var a = mu.A.pitchClass();
    assertEquals(a.index(), 9);
    assertEquals(a.toString(), 'A');
    assertEquals(a.transpose(1).toString(), 'A\u266F/B\u266D');
    assertEquals(a.transpose(-1).toString(), 'G\u266F/A\u266D');
    assertEquals(a.transpose(3).toString(), 'C');
    assertEquals(a.transpose(-5).toString(), 'E');
    var c = mu.PitchClass(0);
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
    var a4 = mu.A_4.pitch();
    assertEquals(a4.octave(), 4);
    assertEquals(a4.pitchClass().index(), 9);
    assertEquals(a4.frequency().hertz(), 440);
    assertEquals(a4.toString(), 'A4');
    assertEquals(a4.transpose(1).toString(), 'A\u266F4/B\u266D4');
    assertEquals(a4.transpose(-1).toString(), 'G\u266F4/A\u266D4');
    assertEquals(a4.transpose(3).toString(), 'C5');
    assertEquals(a4.transpose(-5).toString(), 'E4');
    assert(mu.Pitch.fromNum(a4.toNum()).equals(a4));
    var c2 = mu.Pitch(mu.C.pitchClass(), 2);
    assertEquals(c2.octave(), 2);
    assertEquals(c2.pitchClass().index(), 0);
    assertEquals(a4.subtract(c2), 33);
    assert(!c2.equals(a4));
    assert(c2.equals(c2));
    assertClose(c2.frequency().hertz(), 65.406, 0.001);
    assertEquals(c2.toString(), 'C2');
    assert(mu.Pitch.fromFrequency(mu.Frequency(440)).equals(mu.A_4.pitch()));
    assert(mu.Pitch.fromFrequency(mu.Frequency(330)).equals(mu.E_4.pitch()));
    assert(mu.Pitch.fromFrequency(mu.Frequency(340)).equals(mu.F_4.pitch()));
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
    assertEquals(i1.name(), 'minor second');
    var i5 = mu.Interval(mu.C_4.pitch(), mu.F_4.pitch());
    assertEquals(i5.semitones(), 5);
    assertEquals(i5.toString(), '5 semitones');
    assertEquals(i5.name(), 'perfect fourth');
    assertEquals(mu.C_4.pitch().interval(mu.D_4.pitch()).semitones(), 2);
    assertEquals(mu.B_2.pitch().interval(mu.C_2.pitch()).semitones(), 11);
    assertEquals(mu.B_2.pitch().sharper(mu.Interval(3)).toString(), 'D3');
    assertEquals(mu.B_2.pitch().flatter(mu.Interval(4)).toString(), 'G2');
    assertThrow(function() { mu.Interval(1.5); });
    assertThrow(function() { mu.Interval(-2); });
    assertThrow(function() { mu.Interval(10000); });
    assertThrow(function() { mu.Interval('1'); });
})();

(function() {
    console.info('testing mu.analyzeChord');
    var cM = mu.analyzeChord([mu.C_4.pitch(), mu.E_4.pitch(), mu.G_4.pitch()]);
    assertEquals(cM.length, 1);
    assertEquals(cM[0].name(), 'C major');
    assertEquals(cM[0].abbr(), 'CM');
    var cm = mu.analyzeChord([mu.C_4.pitch(), mu.G_4.pitch(), mu.D_SHARP_4.pitch()]);
    assertEquals(cm.length, 1);
    assertEquals(cm[0].name(), 'C minor');
    assertEquals(cm[0].abbr(), 'Cm');
    var bd = mu.analyzeChord([mu.B_3.pitch(), mu.F_4.pitch(), mu.B_4.pitch(), mu.D_5.pitch()]);
    assertEquals(bd.length, 1);
    assertEquals(bd[0].name(), 'B diminished');
    assertEquals(bd[0].abbr(), 'Bdim');
    var r5 = mu.analyzeChord([mu.C_4.pitch(), mu.G_4.pitch()]);
    assertEquals(r5.length, 1);
    assertEquals(r5[0].name(), 'C fifth');
    var z = mu.analyzeChord([]);
    assertEquals(z.length, 0);
})();

document.write('tests passed');
