/**
 * @file mu theory library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    if (!mu)
        throw Error('missing mu util library');

    /**
     * The unicode symbol `MUSIC FLAT SIGN`
     * @constant
     * @memberof mu
     * @default
     */
    mu.FLAT_CHAR = '\u266D';
    /**
     * The unicode symbol `MUSIC NATURAL SIGN`
     * @constant
     * @memberof mu
     * @default
     */
    mu.NATURAL_CHAR = '\u266E';
    /**
     * The unicode symbol `MUSIC SHARP SIGN`
     * @constant
     * @memberof mu
     * @default
     */
    mu.SHARP_CHAR = '\u266F';
    
    /**
     * The frequency of a musical note.
     *
     * @example
     * mu.Frequency(440)
     *
     * @class
     * @param {number} hertz The frequency in hertz; a positive number
     * @memberof mu
     */
    mu.Frequency = function(hertz) {
        if (!(this instanceof mu.Frequency))
            return new mu.Frequency(hertz);
        mu._assert(mu._isFinite(hertz) && hertz > 0,
                'invalid frequency ' + hertz + ' hertz');
        this._hertz = hertz;
    };
    /**
     * Returns the frequency in hertz of this {@link mu.Frequency} object.
     *
     * @example
     * // returns 440
     * mu.Frequency(440).hertz()
     *
     * @return {number} The frequency in hertz
     * @memberof mu.Frequency
     */
    mu.Frequency.prototype.hertz = function() {
        return this._hertz;
    };
    /**
     * Returns a {@link mu.Frequency} object representing this Frequency
     * multiplied by the given `factor`.
     *
     * @example
     * // returns mu.Frequency(880)
     * mu.Frequency(440).multiply(2)
     *
     * @param {number} factor The multiplication factor; a positive number
     * @return {mu.Frequency} A {@link mu.Frequency} object representing
     * this frequency multiplied by the given `factor`
     * @memberof mu.Frequency
     */
    mu.Frequency.prototype.multiply = function(factor) {
        mu._assert(mu._isFinite(factor) && factor > 0,
                'invalid factor ' + factor);
        return mu.Frequency(this._hertz * factor);
    };
    /**
     * Describes the {@link mu.Frequency} object.
     *
     * @example
     * // returns "440.0 Hz"
     * mu.Frequency(440).toString()
     *
     * @return {string} A description of this {@link mu.Frequency} object
     * @memberof mu.Frequency
     */
    mu.Frequency.prototype.toString = function() {
        var str;
        if (this._hertz < 100)
            str = this._hertz.toFixed(2);
        else if (this._hertz < 1000)
            str = this._hertz.toFixed(1);
        else str = parseInt(this._hertz).toLocaleString();
        return str + ' Hz';
    };

    /**
     * The tempo of a musical sequence.
     *
     * @example
     * mu.Tempo(120)
     *
     * @class
     * @param {number} bpm The tempo in beats per minute; a positive number
     * @memberof mu
     */
    mu.Tempo = function(bpm) {
        if (!(this instanceof mu.Tempo))
            return new mu.Tempo(bpm);
        mu._assert(mu._isFinite(bpm) && bpm > 0,
                'invalid tempo ' + bpm + ' bpm');
        this._bpm = bpm;
    };
    /**
     * Returns the tempo in beats per minute of this {@link mu.Tempo} object.
     *
     * @example
     * // returns 120
     * mu.Tempo(120).bpm()
     *
     * @return {number} The tempo in beats per minute
     * @memberof mu.Tempo
     */
    mu.Tempo.prototype.bpm = function() {
        return this._bpm;
    };
    /**
     * Returns the duration (in seconds) of a single beat in this
     * {@link mu.Tempo}.
     *
     * @example
     * // returns 0.5
     * mu.Tempo(120).beatDuration()
     *
     * @return {number} The duration of a single beat, in seconds
     * @memberof mu.Tempo
     */
    mu.Tempo.prototype.beatDuration = function() {
        return 60.0 / this._bpm;
    };
    /**
     * Describes the {@link mu.Tempo} object.
     *
     * @example
     * // returns "120 bpm"
     * mu.Tempo(120).toString()
     *
     * @return {string} A description of this {@link mu.Tempo} object
     * @memberof mu.Tempo
     */
    mu.Tempo.prototype.toString = function() {
        var str;
        if (this._bpm < 100) {
            str = this._bpm.toFixed(1);
        } else if (this._bpm < 1000)
            str = this._bpm.toFixed(0);
        else str = parseInt(this._bpm).toLocaleString();
        return str + ' bpm';
    };

    /**
     * A musical pitch class, limited to the twelve-note chromatic scale.
     *
     * @example
     * // returns mu.C
     * mu.PitchClass(0)
     *
     * @class
     * @param {number} index The index of the pitch class within an octave;
     * an integer from 0 to 11 inclusive.  The pitches within an octave
     * start at C (index 0) and end at B (index 11).
     * @memberof mu
     */
    mu.PitchClass = function(index) {
        if (!(this instanceof mu.PitchClass))
            return new mu.PitchClass(index);
        mu._assert(mu._isInteger(index) && index >= 0 && index < 12,
                   'invalid pitch index ' + index);
        this._index = index;
    };
    (function() {
        mu.C = mu.PitchClass(0);
        mu.C_SHARP =
            mu.D_FLAT = mu.PitchClass(1);
        mu.D = mu.PitchClass(2);
        mu.D_SHARP =
            mu.E_FLAT = mu.PitchClass(3);
        mu.E = mu.PitchClass(4);
        mu.F = mu.PitchClass(5);
        mu.F_SHARP =
            mu.G_FLAT = mu.PitchClass(6);
        mu.G = mu.PitchClass(7);
        mu.G_SHARP =
            mu.A_FLAT = mu.PitchClass(8);
        mu.A = mu.PitchClass(9);
        mu.A_SHARP =
            mu.B_FLAT = mu.PitchClass(10);
        mu.B = mu.PitchClass(11);
    })();
    mu.PitchClass._SHARP_NAMES = 'CCDDEFFGGAAB';
    mu.PitchClass._FLAT_NAMES = 'CDDEEFGGAABB';
    /**
     * Returns the index of this pitch within its octave.
     *
     * @example
     * // returns 9
     * mu.A.index()
     *
     * @return {number} The index of this pitch within its octave;
     * an integer from 0 to 11 inclusive
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.index = function() {
        return this._index;
    };
    /**
     * Returns true if this pitch class is equivalent to the `other`.
     *
     * @param {mu.PitchClass} other The pitch class to compare against
     * @return {boolean} True If the pitch classes are equivalent
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.equals = function(other) {
        mu._assert(other instanceof mu.PitchClass,
                   'invalid pitch class ' + other);
        return this._index == other._index;
    };
    /**
     * Return a {@link mu.PitchClass} representing the pitch class which is the
     * given number of `semitones` above this pitch class.
     *
     * @example
     * // returns a pitch equivalent to mu.F_SHARP
     * mu.D.transpose(4)
     *
     * @param {number} semitones The number of semitones by which to
     * raise the returned pitch class; an integer
     * @return {mu.PitchClass} The new pitch class
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.transpose = function(semitones) {
        mu._assert(mu._isInteger(semitones),
                   'invalid semitone count ' + semitones);
        var num = this.index() + semitones;
        num = num % 12;
        if (num < 0)
            num += 12;
        return mu.PitchClass(num);
    };
    /**
     * Return a {@link mu.PitchClass} representing the pitch class which is the
     * given `interval` above this pitch class.
     *
     * @example
     * // returns a pitch class equivalent to mu.F_SHARP
     * mu.D.sharper(mu.Interval(4))
     *
     * @param {mu.Interval} semitones The interval by which to raise
     * the returned pitch class
     * @return {mu.PitchClass} The new pitch class
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.sharper = function(interval) {
        mu._assert(interval instanceof mu.Interval,
                   'invalid interval ' + interval);
        return this.transpose(interval.semitones());
    };
    /**
     * Return a {@link mu.PitchClass} representing the pitch class which is the
     * given `interval` below this pitch class.
     *
     * @example
     * // returns a pitch class equivalent to mu.B_FLAT
     * mu.D.flatter(mu.Interval(4))
     *
     * @param {mu.Interval} interval The interval by which to lower
     * the returned pitch class
     * @return {mu.PitchClass} The new pitch class
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.flatter = function(interval) {
        mu._assert(interval instanceof mu.Interval,
                   'invalid interval ' + interval);
        return this.transpose(-interval.semitones());
    };
    /**
     * Returns the interval between this pitch class and the other.
     *
     * @example
     * // returns an interval equivalent to mu.Interval(4)
     * mu.D.interval(mu.B_FLAT)
     * @example
     * // also returns an interval equivalent to mu.Interval(4)
     * mu.B_FLAT.interval(mu.D)
     *
     * @return {mu.Interval} The interval between this pitch class and the other
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.interval = function(other) {
        return mu.Interval(Math.abs(this.index() - other.index()));
    };
    /**
     * Returns one or two descriptions of this pitch class.
     *
     * @example
     * // returns ["C&#x266f;", "D&#x266d;"]
     * mu.C_SHARP.toStrings()
     *
     * @return {Array.<string>} One or two descriptions of this pitch class.
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.toStrings = function() {
        var s = mu.PitchClass._SHARP_NAMES[this._index];
        var f = mu.PitchClass._FLAT_NAMES[this._index];
        if (s === f)
            return [s];
        return [s + mu.SHARP_CHAR, f + mu.FLAT_CHAR];
    };
    /**
     * Describes this pitch class.
     *
     * @example
     * // returns "C&#x266f;/D&#x266d;"
     * mu.C_SHARP.toString()
     *
     * @return {string} A description of this pitch class
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.toString = function() {
        return this.toStrings().join('/');
    };

    /**
     * A musical pitch, limited to the twelve-note chromatic scale.
     *
     * Usually you should not need to call this constructor.  All the
     * supported pitches have constants in the {@link mu} namespace.
     * For instance {@link mu.A_4} and {@link mu.F_SHARP_3}.
     *
     * @example
     * // returns mu.C_4 (representing middle C)
     * mu.Pitch(0, 4)
     * @example
     * // returns mu.A_4 (the A above middle C)
     * mu.Pitch(mu.A, 4)
     *
     * @class
     * @param {number|mu.PitchClass} pitchClass The pitch class, either as
     * a {@link mu.PitchClass} or as an index of the pitch within that octave.
     * @param {number} [octave] The octave number of the pitch as described
     * by scientific pitch notation; an integer from 0 to 10 inclusive.
     * {@link mu.C_4} (middle C) is in octave 4,
     * and it is the fourth C on a standard 88-key piano keyboard.
     * @memberof mu
     */
    mu.Pitch = function(pitchClass, octave) {
        if (!(this instanceof mu.Pitch))
            return new mu.Pitch(pitchClass, octave);
        mu._assert(pitchClass instanceof mu.PitchClass,
                   'invalid pitch class ' + pitchClass);
        if (octave == null)
            octave = 4;
        mu._assert(mu._isInteger(octave),
                   'invalid octave ' + octave);
        mu._assert(octave >= 0 && octave <= 10,
                   'inaudible octave ' + octave);
        this._pitchClass = pitchClass;
        this._octave = octave;
    };
    (function() {
        // these constants are documented in pitches.js,
        // which is generated by the docgen.py script
        for (var octave = 0; octave <= 10; octave ++) {
            mu['C_' + octave] = mu.Pitch(mu.C, octave);
            mu['C_SHARP_' + octave] = 
            mu['D_FLAT_' + octave] = mu.Pitch(mu.C_SHARP, octave);
            mu['D_' + octave] = mu.Pitch(mu.D, octave);
            mu['D_SHARP_' + octave] = 
            mu['E_FLAT_' + octave] = mu.Pitch(mu.D_SHARP, octave);
            mu['E_' + octave] = mu.Pitch(mu.E, octave);
            mu['F_' + octave] = mu.Pitch(mu.F, octave);
            mu['F_SHARP_' + octave] = 
            mu['G_FLAT_' + octave] = mu.Pitch(mu.F_SHARP, octave);
            mu['G_' + octave] = mu.Pitch(mu.G, octave);
            mu['G_SHARP_' + octave] = 
            mu['A_FLAT_' + octave] = mu.Pitch(mu.G_SHARP, octave);
            mu['A_' + octave] = mu.Pitch(mu.A, octave);
            mu['A_SHARP_' + octave] = 
            mu['B_FLAT_' + octave] = mu.Pitch(mu.A_SHARP, octave);
            mu['B_' + octave] = mu.Pitch(mu.B, octave);
        }
    })();
    mu.Pitch._MIN = mu.C_0;
    mu.Pitch._MAX = mu.B_10;
    /**
     * The frequency ratio between two pitches in a semitone interval;
     * The twelfth root of 2.
     * @private
     * @constant
     * @memberof mu.Pitch
     */
    mu.Pitch._12TH_ROOT_OF_2 = Math.pow(2, 1/12);
    /**
     * The frequency of A4 in "standard pitch": 440 Hz.
     * @private
     * @constant
     * @memberof mu.Pitch
     */
    mu.Pitch._A_4_FREQUENCY = mu.Frequency(440);
    /**
     * Converts a pitch number to a pitch. See {@link mu.Pitch#toNum}.
     *
     * @param {number} num The index of this pitch in the entire supported
     * pitch range
     * @return {mu.Pitch} The corresponding pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.fromNum = function(num) {
        var octave = Math.floor(num / 12);
        mu._assert(octave >= 0 && octave <= 10,
                'inaudible octave ' + octave);
        var pitchClass = mu.PitchClass(num - octave * 12);
        return mu.Pitch(pitchClass, octave);
    };
    /**
     * Returns a pitch number, an index within the entire supported pitch
     * range. Useful as a hash key and can be converted back into a pitch
     * with {@link mu.Pitch~fromNum}.
     *
     * @return {number} The index of this pitch in the entire supported
     * pitch range
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.toNum = function() {
        return this._octave * 12 + this._pitchClass.index();
    };
    /**
     * Returns the octave number of this pitch.
     *
     * @example
     * // returns 4
     * mu.C_4.octave()
     *
     * @return {number} The octave number; an integer from 0 to 10 inclusive
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.octave = function() {
        return this._octave;
    };
    /**
     * Returns the pitch class of this pitch.
     *
     * @example
     * // returns mu.A
     * mu.A_4.pitchClass()
     *
     * @return {mu.PitchClass} The pitch class of this pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.pitchClass = function() {
        return this._pitchClass;
    };
    /**
     * Returns true if this pitch is equivalent to the `other`.
     *
     * @param {mu.Pitch} The pitch to compare against
     * @return {boolean} True if the two pitches are equivalent
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.equals = function(other) {
        mu._assert(other instanceof mu.Pitch,
                   'invalid pitch ' + other);
        return this._octave == other._octave && this._pitchClass.equals(other._pitchClass);
    };
    /**
     * Return a {@link mu.Pitch} representing the pitch which is the
     * given number of `semitones` above this pitch.
     *
     * @example
     * // returns a pitch equivalent to mu.F_SHARP_3
     * mu.D_3.transpose(4)
     *
     * @param {number} semitones The number of semitones by which to
     * raise the returned pitch; an integer
     * @return {mu.Pitch} The new pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.transpose = function(semitones) {
        mu._assert(mu._isInteger(semitones),
                   'invalid semitone count ' + semitones);
        return mu.Pitch.fromNum(this.toNum() + semitones);
    };
    /**
     * Return a {@link mu.Pitch} representing the pitch which is the
     * given `interval` above this pitch.
     *
     * @example
     * // returns a pitch equivalent to mu.F_SHARP_3
     * mu.D_3.sharper(mu.Interval(4))
     *
     * @param {mu.Interval} semitones The interval by which to raise
     * the returned pitch
     * @return {mu.Pitch} The new pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.sharper = function(interval) {
        mu._assert(interval instanceof mu.Interval,
                   'invalid interval ' + interval);
        return this.transpose(interval.semitones());
    };
    /**
     * Return a {@link mu.Pitch} representing the pitch which is the
     * given `interval` below this pitch.
     *
     * @example
     * // returns a pitch equivalent to mu.B_FLAT_2
     * mu.D_3.flatter(mu.Interval(4))
     *
     * @param {mu.Interval} interval The interval by which to lower
     * the returned pitch
     * @return {mu.Pitch} The new pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.flatter = function(interval) {
        mu._assert(interval instanceof mu.Interval,
                   'invalid interval ' + interval);
        return this.transpose(-interval.semitones());
    };
    /**
     * Return the frequency of this pitch, in "standard pitch" (where
     * [A4]{@link mu.A_4} is 440 hertz), as a {@link mu.Frequency} object
     *
     * @example
     * // returns a frequency equivalent to mu.Frequency(440)
     * mu.A_4.frequency()
     *
     * @return {mu.Frequency} The frequency of this pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.frequency = function() {
        return mu.Pitch._A_4_FREQUENCY.multiply(Math.pow(mu.Pitch._12TH_ROOT_OF_2, this.toNum() - mu.A_4.toNum()));
    };
    /**
     * Returns the number of semitones between this pitch and the `other`.
     * This will be negative if `other` is a lower pitch.
     *
     * @example
     * // returns 4
     * mu.D_3.subtract(mu.B_FLAT_2)
     *
     * @return {number} The number of semitones between this pitch and the `other`; an integer
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.subtract = function(other) {
        mu._assert(other instanceof mu.Pitch,
                   'invalid pitch ' + other);
        return this.toNum() - other.toNum();
    };
    /**
     * Returns the interval between this pitch and the other.
     *
     * @example
     * // returns an interval equivalent to mu.Interval(4)
     * mu.D_3.interval(mu.B_FLAT_2)
     * @example
     * // also returns an interval equivalent to mu.Interval(4)
     * mu.B_FLAT_2.interval(mu.D_3)
     *
     * @return {mu.Interval} The interval between this pitch and the other
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.interval = function(other) {
        return mu.Interval(Math.abs(this.subtract(other)));
    };
    /**
     * Returns one or two descriptions of this pitch
     *
     * @example
     * // returns ["C&#x266f;3", "D&#x266d;3"]
     * mu.C_SHARP_3.toStrings()
     *
     * @return {string} A description of this pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.toStrings = function() {
        return this._pitchClass.toStrings().map(function(str) {
            return str + this._octave;
        }, this);
    };
    /**
     * Describes this pitch.
     *
     * @example
     * // returns "C&#x266f;3/D&#x266d;3"
     * mu.C_SHARP_3.toString()
     *
     * @return {string} A description of this pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.toString = function() {
        return this.toStrings().join('/');
    };

    /**
     * A musical interval; the difference between two pitches.
     *
     * This represents an absolute difference, there can be no negative
     * interval.
     *
     * @example
     * // returns an interval of 5 semitones (sometimes called a "perfect fourth")
     * mu.Interval(5)
     * @example
     * // returns an interval of 5 semitones (sometimes called a "perfect fourth")
     * mu.Interval(mu.C_4, mu.F_4)
     *
     * @class
     * @param {mu.Pitch|number} pitch1 A pitch (when two arguments or given), or the number of semitones in the interval (when only one argument is given)
     * @param {mu.Pitch} [pitch2] Another pitch
     * @memberof mu
     */
    mu.Interval = function(pitch1, pitch2) {
        if (!(this instanceof mu.Interval))
            return new mu.Interval(pitch1, pitch2);
        var semitones;
        if (pitch2 != null) {
            mu._assert(pitch1 instanceof mu.Pitch,
                       'invalid pitch ' + pitch1);
            mu._assert(pitch2 instanceof mu.Pitch,
                       'invalid pitch ' + pitch2);
            semitones = Math.abs(pitch1.subtract(pitch2));
        } else
            semitones = pitch1;
        mu._assert(mu._isInteger(semitones),
                   'invalid semitone count ' + semitones);
        mu._assert(semitones >= 0 && semitones <= mu.Interval._MAX,
                   'inaudible semitone count ' + semitones);
        this._semitones = semitones;
    }
    mu.Interval._MAX = mu.Pitch._MAX.toNum() - mu.Pitch._MIN.toNum();
    mu.Interval._INFO = {
        '0':  {name: 'unison',           abbr: 'P1'},
        '1':  {name: 'minor second',     abbr: 'm2'},
        '2':  {name: 'major second',     abbr: 'M2'},
        '3':  {name: 'minor third',      abbr: 'm3'},
        '4':  {name: 'major third',      abbr: 'M3'},
        '5':  {name: 'perfect fourth',   abbr: 'P4'},
        '6':  {name: 'tritone',          abbr: 'TT'},
        '7':  {name: 'perfect fifth',    abbr: 'P5'},
        '8':  {name: 'minor sixth',      abbr: 'm6'},
        '9':  {name: 'major sixth',      abbr: 'M6'},
        '10': {name: 'minor seventh',    abbr: 'm7'},
        '11': {name: 'major seventh',    abbr: 'M7'},
        '12': {name: 'octave',           abbr: 'P8'},
        '13': {name: 'minor ninth',      abbr: 'm9'},
        '14': {name: 'major ninth',      abbr: 'M9'},
        '15': {name: 'minor tenth',      abbr: 'm10'},
        '16': {name: 'major tenth',      abbr: 'M10'},
        '17': {name: 'perfect eleventh', abbr: 'P11'},
        // 18 (diminished twelfth/augmented eleventh
        '19': {name: 'perfect twelfth',  abbr: 'P12'},
        '20': {name: 'minor thirteenth', abbr: 'm13'},
        '21': {name: 'major thirteenth', abbr: 'M13'},
        '22': {name: 'minor fourteenth', abbr: 'm14'},
        '23': {name: 'major fourteenth', abbr: 'M14'},
        '24': {name: 'double octave',    abbr: 'P15'},
        '28': {name: 'major seventeenth',abbr: 'M17'}
    };
    /**
     * Returns the number of semitones in this interval
     *
     * @example
     * // returns 5
     * mu.Interval(mu.C_4, mu.F_4).semitones()
     *
     * @return {number} The number of semitones in this interval; a non-negative integer
     * @memberof mu.Interval
     */
    mu.Interval.prototype.semitones = function() {
        return this._semitones;
    };
    /**
     * Describes this interval, using semitone count.
     *
     * @example
     * // returns "5 semitones"
     * mu.Interval(mu.C_4, mu.F_4).toString()
     *
     * @return {string} A description of this interval
     * @memberof mu.Interval
     */
    mu.Interval.prototype.toString = function() {
        if (this._semitones == 1 || this._semitones == -1)
            return this._semitones.toLocaleString() + ' semitone';
        return this._semitones.toLocaleString() + ' semitones';
    };
    /**
     * Returns the name of this interval, or returns the semitone count
     * for certain rare intervals (e.g. 26 semitones) or intervals with
     * no canonical name (e.g. 18 semitones).  An interval can have multiple
     * names, and the correct name depends on the particular pitches and
     * the key, but this method attempts to return the most generic name.
     *
     * @example
     * // returns "perfect fourth"
     * mu.Interval(mu.C_4, mu.F_4).
     *
     * @class
     * @return {string} The name of this interval, or an alternate description
     * @memberof mu.Chord
     */
    mu.Interval.prototype.name = function() {
        var i = mu.Interval._INFO[String(this._semitones)];
        if (i)
            return i.name;
        return this.toString();
    };

    /**
     * @typedef {object} ChordInfo
     * @property {mu.Pitch} root
     * @property {string} className
     * @property {string} classAbbr
     * @property {string} third
     * @property {string} fifth
     * @property {string} seventh

    /**
     * A set of pitches that are heard together.  Usually
     * three or more, but this class any number.
     *
     * @example
     * // returns a chord composed of C4, E4, and G4
     * mu.Chord(mu.C_4, mu.E_4, mu.G_4)
     *
     * @class
     * @param {...mu.Pitch|Array.<mu.Pitch>} [pitch] A pitch (or an
     * array of pitches) in the chord
     * @memberof mu
     */
    mu.Chord = function(pitch) {
        if (!(this instanceof mu.Chord)) {
            function C(args) {
                return mu.Chord.apply(this, args);
            }
            C.prototype = mu.Chord.prototype;
            return new C(arguments);
        }
        mu._argsToArray(arguments).forEach(function(pitch) {
            mu._assert(pitch instanceof mu.Pitch,
                    'invalid pitch ' + pitch);
        });
        this._pitches = Array.prototype.slice.call(arguments);
        this._pitches.sort(function(a, b) {
            return a.subtract(b);
        });
    };
    mu.Chord._INFO = [
        {
            abbr: 'M',
            name: 'major',
            third: 'major',
            fifth: 'perfect',
            req: [0, 4],
            opt: [7]
        },
        {
            abbr: 'M7',
            name: 'major seventh',
            third: 'major',
            fifth: 'perfect',
            seventh: 'major',
            req: [0, 4, 11],
            opt: [7]
        },
        {
            abbr: 'maj9',
            name: 'major ninth',
            third: 'major',
            fifth: 'perfect',
            seventh: 'major',
            req: [0, 4, 11, 14],
            opt: [7]
        },
        {
            abbr: 'maj13',
            name: 'major thirteenth',
            third: 'major',
            fifth: 'perfect',
            seventh: 'major',
            req: [0, 4, 11, 21],
            opt: [7, 14, 17]
        },
        {
            abbr: '6',
            name: 'sixth',
            third: 'major',
            fifth: 'perfect',
            req: [0, 4, 9],
            opt: [7]
        },
        {
            abbr: '6/9',
            name: 'sixth/ninth',
            third: 'major',
            fifth: 'perfect',
            req: [0, 4, 9, 14],
            opt: [7]
        },

        {
            abbr: '7',
            name: 'dominant seventh',
            third: 'major',
            fifth: 'perfect',
            seventh: 'minor',
            req: [0, 4, 10],
            opt: [7]
        },
        {
            abbr: '9',
            name: 'dominant ninth',
            third: 'major',
            fifth: 'perfect',
            seventh: 'minor',
            req: [0, 4, 10, 14],
            opt: [7]
        },
        {
            abbr: '13',
            name: 'dominant thirteenth',
            third: 'major',
            fifth: 'perfect',
            seventh: 'minor',
            req: [0, 4, 10, 21],
            opt: [7, 14]
        },

        {
            abbr: 'sus4',
            name: 'suspended fourth',
            fifth: 'perfect',
            req: [0, 5],
            opt: [7]
        },
        {
            abbr: 'sus2',
            name: 'suspended second',
            third: 'suspended',
            fifth: 'perfect',
            req: [0, 2],
            opt: [7]
        },
        {
            abbr: '11',
            name: 'eleventh',
            third: 'suspended',
            fifth: 'perfect',
            seventh: 'minor',
            req: [0, 10, 17],
            opt: [7, 14]
        },

        {
            abbr: 'm',
            name: 'minor',
            third: 'minor',
            fifth: 'perfect',
            req: [0, 3],
            opt: [7]
        },
        {
            abbr: 'm7',
            name: 'minor seventh',
            third: 'minor',
            fifth: 'perfect',
            seventh: 'minor',
            req: [0, 3, 10],
            opt: [7]
        },
        {
            abbr: 'm/M7',
            name: 'minor/major seventh',
            third: 'minor',
            fifth: 'perfect',
            seventh: 'major',
            req: [0, 3, 11],
            opt: [7, 14]
        },
        {
            abbr: 'm6',
            name: 'minor sixth',
            third: 'minor',
            fifth: 'perfect',
            req: [0, 3, 9],
            opt: [7]
        },
        {
            abbr: 'm9',
            name: 'minor ninth',
            third: 'minor',
            fifth: 'perfect',
            req: [0, 3, 10, 14],
            opt: [7]
        },
        {
            abbr: 'm11',
            name: 'minor eleventh',
            third: 'minor',
            fifth: 'perfect',
            seventh: 'minor',
            req: [0, 3, 10, 17],
            opt: [7, 14]
        },
        {
            abbr: 'm13',
            name: 'minor thirteenth',
            third: 'minor',
            fifth: 'perfect',
            seventh: 'minor',
            req: [0, 3, 10, 21],
            opt: [7, 14]
        },

        {
            abbr: 'dim',
            name: 'diminished',
            third: 'minor',
            fifth: 'diminished',
            req: [0, 3, 6],
            opt: []
        },
        {
            abbr: 'dim7',
            name: 'diminished seventh',
            third: 'minor',
            fifth: 'diminished',
            seventh: 'double-flat',
            req: [0, 3, 6, 9],
            opt: []
        },
        {
            abbr: 'm7' + mu.FLAT_CHAR + '5',
            name: 'half-diminished seventh',
            third: 'minor',
            fifth: 'diminished',
            seventh: 'minor',
            req: [0, 3, 6, 10],
            opt: []
        },

        {
            abbr: '5',
            name: 'fifth',
            third: '',
            fifth: 'perfect',
            req: [0, 7],
            opt: []
        },
        {
            abbr: 'aug',
            name: 'augmented',
            third: 'major',
            fifth: 'augmented',
            req: [0, 4, 8],
            opt: []
        },
        {
            abbr: 'aug',
            name: 'augmented seventh',
            third: 'major',
            fifth: 'augmented',
            seventh: 'minor',
            req: [0, 4, 8, 10],
            opt: []
        }
    ];
    mu.Chord._INFO_MAP = {};
    mu.Chord._INFO.forEach(function(info) {
        for (var c = 0; c < Math.pow(2, info.opt.length); c ++) {
            var arr = info.req.map(function(i) {
                return i % 12;
            });
            info.opt.forEach(function(i, o) {
                if ((c & (1 << o)) != 0)
                    arr.push(i);
            });
            arr = arr.sort(function(a, b) { return a - b; });
            var pattern = arr.join('-');
            if (pattern in mu.Chord._INFO_MAP)
                throw Error('duplicate chord pattern ' + pattern + ': ' + mu.Chord._INFO_MAP[pattern].name + ' and ' + info.name);
            mu.Chord._INFO_MAP[pattern] = info;
        }
    });
    mu.Chord.prototype._infos = function() {
        var pitchClasses = [];
        this._pitches.forEach(function(pitch) {
            pitchClasses[pitch.pitchClass().index()] = true;
        });
        var results = [];
        pitchClasses.forEach(function(present, index) {
            if (!present)
                return;
            var start = mu.PitchClass(index);
            var intervals = [0];
            for (var i = 1; i < 12; i ++) {
                var other = start.transpose(i);
                if (pitchClasses[other.index()])
                    intervals.push(i);
            }
            var info = mu.Chord._INFO_MAP[intervals.join('-')];
            if (info)
                results.push({
                    root: start,
                    info: info
                });
        });
        return results;
    };
    /**
     * Returns the number of pitches in this chord.
     *
     * @return {number} The number of pitches in this chord
     * @memberof mu.Chord
     */
    mu.Chord.prototype.size = function() {
        return this._pitches.length;
    };
    /**
     * Returns the pitches in this chord.
     *
     * @return {Array.<mu.Pitch>} The pitches in this chord
     * @memberof mu.Chord
     */
    mu.Chord.prototype.pitches = function() {
        return this._pitches;
    };
    /**
     * Return a {@link mu.Chord} representing the transposition of this chord
     * by the given number of `semitones`.  A positive number raises the
     * pitches of the chord, a negative number lowers them.
     *
     * @example
     * // returns a chord equivalent to mu.Chord(mu.F_4, mu.A_4, mu.C_5)
     * mu.Chord(mu.C_4, mu.E_4, mu.G_4).transpose(5)
     *
     * @param {number} semitones The number of semitones by which to
     * raise the returned chord; an integer
     * @return {mu.Chord} The new chord
     * @memberof mu.Chord
     */
    mu.Chord.prototype.transpose = function(semitones) {
        return mu.Chord.apply(null, this._pitches.map(function(pitch) {
            return pitch.transpose(semitones);
        }));
    };
    /**
     * Describes this chord.
     *
     * @example
     * // returns "C4 E4 G4"
     * mu.Chord(mu.C_4, mu.E_4, mu.G_4).toString()
     *
     * @return {string} A description of this chord
     * @memberof mu.Chord
     */
    mu.Chord.prototype.toString = function() {
        var ret = [];
        this._pitches.forEach(function(pitch) {
            ret.push(pitch.toString());
        });
        return ret.join(' ');
    };
    /**
     * Guesses a name for this chord based on the pitches present.
     *
     * @example
     * // returns "F major"
     * mu.Chord(mu.C_4, mu.F_4, mu.A_4).name();
     *
     * @class
     * @return {string|null} The name of this chord, or null if it isn't known
     * @memberof mu.Chord
     */
    mu.Chord.prototype.name = function() {
        var infos = this._infos();
        if (infos.length == 0)
            return null;
        return infos[0].root.toString() + ' ' + infos[0].info.name;
    };
    /**
     * Guesses an abbreviated name for this chord based on the pitches present.
     *
     * @example
     * // returns "F major"
     * mu.Chord(mu.C_4, mu.F_4, mu.A_4).name();
     *
     * @class
     * @return {string|null} The abbreviated name of this chord, or null if it isn't known
     * @memberof mu.Chord
     */
    mu.Chord.prototype.abbr = function() {
        var infos = this._infos();
        if (infos.length == 0)
            return null;
        return infos[0].root.toString() + infos[0].info.abbr;
    };

/*
    mu.ScaleType = function(intervals) {
        
    };
    mu.MINOR

    mu.Key = function(tonic) {
        if (!(this instanceof mu.Key))
            return new mu.Key(tonic);
        mu._assert(tonic instanceof mu.Pitch,
                'invalid tonic pitch ' + tonic);
        this._tonic = tonic;
    };
    mu.Key.prototype.tonic = function() {
        return this._tonic;
    };

*/

})();
