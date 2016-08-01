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
     * An accidental, such as {@link mu.NATURAL}, {@link mu.SHARP}, or
     * {@link mu.FLAT}.
     *
     * @example
     * // returns an accidental equivalent to mu.SHARP
     * mu.Accidental(1)
     *
     * @class
     * @param {number} semitones The number of semitones by which the
     * accidental transposes a note; 1 is for mu.SHARP, -1 is for mu.FLAT
     * @memberof mu
     */
    mu.Accidental = function(semitones) {
        if (!(this instanceof mu.Accidental))
            return new mu.Accidental(semitones);
        mu._assert(mu._isFinite(semitones) && semitones >= -2 && semitones <= 2,
                'invalid accidental ' + semitones + ' semitones');
        this._semitones = semitones;
    };
    mu.DOUBLE_FLAT = mu.Accidental(-2);
    mu.FLAT = mu.Accidental(-1);
    mu.NATURAL = mu.Accidental(0);
    mu.SHARP = mu.Accidental(1);
    mu.DOUBLE_SHARP = mu.Accidental(2);
    /**
     * Returns the number of semitones by which this accidental transposes
     * a note.
     *
     * @example
     * // returns -1
     * mu.FLAT.semitones()
     *
     * @return {number} The number of semitones by which this accidental
     * transposes a note
     * @memberof mu.Accidental
     */
    mu.Accidental.prototype.semitones = function() {
        return this._semitones;
    };
    /**
     * Returns true if this accidental is equivalent to the `other`.
     *
     * @param {mu.Accidental} other The accidental to compare against
     * @return {boolean} True If the accidentals are equivalent
     * @memberof mu.Accidental
     */
    mu.Accidental.prototype.equals = function(other) {
        mu._assert(other instanceof mu.Accidental,
                   'invalid accidental ' + other);
        return this._semitones == other._semitones;
    };
    /**
     * Describes this {@link mu.Accidental} object.
     *
     * @example
     * // returns "\u266F"
     * mu.SHARP.toString()
     *
     * @return {string} A description of this {@link mu.Accidental} object
     * @memberof mu.Accidental
     */
    mu.Accidental.prototype.toString = function() {
        if (this._semitones < 0)
            return Array(-this._semitones+1).join(mu.FLAT_CHAR);
        if (this._semitones > 0)
            return Array(this._semitones+1).join(mu.SHARP_CHAR);
        return mu.NATURAL_CHAR;
    };

    /**
     * A musical pitch class, such as B/C&#x266d; or G&#x266f;/A&#x266d;.
     *
     * Usually you should not need to call this constructor.  There are lots
     * of other ways to make a pitch class.
     *
     * @example
     * // these all return a pitch class representing the note B&#x266f;/C.
     * mu.PitchClass(0)
     * mu.C.pitchClass()
     * mu.B_SHARP.pitchClass()
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
        mu._assert(mu._isInteger(index) && index >= 0 && index <= 11,
                   'invalid pitch index ' + index);
        this._index = index;
    };
    mu.PitchClass._SHARP_NAMES   = 'BC_D_EF_G_A_';
    mu.PitchClass._NATURAL_NAMES = 'C_D_EF_G_A_B';
    mu.PitchClass._FLAT_NAMES    = '_D_EF_G_A_BC';
    /**
     * Returns the index of this pitch class within an octave, index 0
     * corresponds with C.
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
     * // returns a pitch class representing F&#x266f;/G&#x266d;.
     * mu.D.pitchClass().transpose(4)
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
     * // returns a pitch class representing F&#x266f;/G&#x266d;.
     * mu.D.pitchClass().sharper(mu.Interval(4))
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
     * // returns a pitch class representing A&#x266f;/B&#x266d;
     * mu.D.pitchClass().flatter(mu.Interval(4))
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
     * Returns the interval between this pitch class and the `other`.
     *
     * @example
     * // returns an interval equivalent to mu.Interval(4)
     * mu.D.pitchClass().interval(mu.B_FLAT.pitchClass())
     * @example
     * // also returns an interval equivalent to mu.Interval(4)
     * mu.B_FLAT.pitchClass().interval(mu.D.pitchClass())
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
     * mu.C_SHARP.pitchClass().toStrings()
     *
     * @return {Array.<string>} One or two descriptions of this pitch class.
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.toStrings = function() {
        var s = mu.PitchClass._SHARP_NAMES[this._index];
        var n = mu.PitchClass._NATURAL_NAMES[this._index];
        var f = mu.PitchClass._FLAT_NAMES[this._index];
        var ret = [];
        if (s != '_')
            ret.push(s + mu.SHARP_CHAR);
        if (n != '_')
            ret.push(n);
        if (f != '_')
            ret.push(f + mu.FLAT_CHAR);
        mu._assert(ret.length >= 1 && ret.length <= 2);
        return ret;
    };
    /**
     * Returns a description of this pitch class.
     *
     * @example
     * // returns "C&#x266f;/D&#x266d;"
     * mu.C_SHARP.pitchClass().toString()
     *
     * @return {string} A description of this pitch class
     * @memberof mu.PitchClass
     */
    mu.PitchClass.prototype.toString = function() {
        return this.toStrings().join('/');
    };

    /**
     * A musical pitch, such as B2/C&#x266d3; or G&#x266f;4/A&#x266d;4.
     *
     * Usually you should not need to call this constructor.  There are lots
     * of other ways to make a pitch.
     *
     * @example
     * // these all return a pitch representing middle C
     * mu.Pitch(0, 4)
     * mu.Pitch(mu.C.pitchClass(), 4)
     * mu.Pitch(mu.C, 4)
     * mu.C_4.pitch()
     *
     * @class
     * @param {number|mu.PitchClass} pitchClass The pitch class, either as
     * a {@link mu.PitchClass} or as an index of the pitch within that octave.
     * @param {number} [octave] The octave number of the pitch as described
     * by scientific pitch notation; an integer from 0 to 10 inclusive.
     * Middle C is in octave 4, and it is the fourth C on a standard
     * 88-key piano keyboard.
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
                   'unsupported octave ' + octave);
        this._pitchClass = pitchClass;
        this._octave = octave;
    };
    mu.Pitch._MIN = mu.Pitch(mu.PitchClass(0), 0);
    mu.Pitch._MAX = mu.Pitch(mu.PitchClass(11), 10);
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
        mu._assert(mu._isInteger(num),
                   'invalid pitch number ' + num);
        var octave = Math.floor(num / 12);
        mu._assert(octave >= 0 && octave <= 10,
                   'unsupported octave ' + octave);
        var pitchClass = mu.PitchClass(num - octave * 12);
        return mu.Pitch(pitchClass, octave);
    };
    /**
     * Converts a frequency to the nearest pitch.
     *
     * @param {mu.Frequency} frequency The frequency to approximate
     * @return {mu.Pitch} The nearest pitch to that frequency
     * @memberof mu.Pitch
     */
    mu.Pitch.fromFrequency = function(frequency) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        if (frequency.hertz() <= mu.Pitch._MIN.frequency().hertz())
            return mu.Pitch._MIN;
        if (frequency.hertz() >= mu.Pitch._MAX.frequency().hertz())
            return mu.Pitch._MAX;
        var o = mu._log2(frequency.hertz()) - mu._log2(mu.Pitch._MIN.frequency().hertz());
        return mu.Pitch.fromNum(Math.round(o * 12));
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
     * Returns the octave number of this pitch.  The fourth octave is the
     * one that includes middle C, and is also the fourth octave on an 88-key
     * piano.
     *
     * @example
     * // returns 4
     * mu.C_4.pitch().octave()
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
     * // returns a pitch class representing A.
     * mu.A_4.pitch().pitchClass()
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
     * // returns a pitch representing F&#x266f;3/G&#x266d;3
     * mu.D_3.pitch().transpose(4)
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
     * // returns a pitch representing F&#x266f;3/G&#x266d;3
     * mu.D_3.pitch().sharper(mu.Interval(4))
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
     * // returns a pitch representing A&#x266f;2/B&#x266d;2
     * mu.D_3.pitch().flatter(mu.Interval(4))
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
     * A4 is 440 hertz), as a {@link mu.Frequency} object
     *
     * @example
     * // returns a frequency equivalent to mu.Frequency(440)
     * mu.A_4.pitch().frequency()
     *
     * @return {mu.Frequency} The frequency of this pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.frequency = function() {
        return mu.Pitch._A_4_FREQUENCY.multiply(Math.pow(mu.Pitch._12TH_ROOT_OF_2, this.toNum() - mu.A_4.pitch().toNum()));
    };
    /**
     * Returns the number of semitones between this pitch and the `other`.
     * This will be negative if `other` is a lower pitch.
     *
     * @example
     * // returns 4
     * mu.D_3.pitch().subtract(mu.B_FLAT_2.pitch())
     *
     * @return {number} The number of semitones between this pitch and
     * the `other`; an integer
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
     * mu.D_3.pitch().interval(mu.B_FLAT_2.pitch())
     * @example
     * // also returns an interval equivalent to mu.Interval(4)
     * mu.B_FLAT_2.pitch().interval(mu.D_3.pitch())
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
     * mu.C_SHARP_3.pitch().toStrings()
     *
     * @return {string} A description of this pitch
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.toStrings = function() {
        var pc = this._pitchClass;
        var pcstr = pc.toStrings();
        if (pc.index() == 0) {
            mu._assert(pcstr.length == 2);
            return [pcstr[0] + (this._octave - 1), pcstr[1] + this._octave];
        } else if (pc.index() == 11) {
            mu._assert(pcstr.length == 2);
            return [pcstr[0] + this._octave, pcstr[1] + (this._octave + 1)];
        } else {
            return pcstr.map(function(str) {
                return str + this._octave;
            }, this);
        }
    };
    /**
     * Describes this pitch.
     *
     * @example
     * // returns "C&#x266f;3/D&#x266d;3"
     * mu.C_SHARP_3.pitch().toString()
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
     * // these both return an interval of 5 semitones
     * // (sometimes called a "perfect fourth")
     * mu.Interval(5)
     * mu.Interval(mu.C_4.pitch(), mu.F_4.pitch())
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
                   'unsupported semitone count ' + semitones);
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
     * mu.Interval(mu.C_4.pitch(), mu.F_4.pitch()).semitones()
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
     * mu.Interval(mu.C_4.pitch(), mu.F_4.pitch()).toString()
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
     * mu.Interval(mu.C_4.pitch(), mu.F_4.pitch()).
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
     * A note class (aka "note name"), such as B, C&#x266d; or G&#x266e;.
     *
     * Usually you should not need to call this constructor.  There are
     * other ways to make a note class.
     *
     * @example
     * // these all return a note name representing B&#x266f;.
     * mu.NoteClass(7, mu.SHARP) 
     * mu.B_SHARP
     *
     * @class
     * @param {number} index The index of the base note, as a degree in
     * the C major scale; an integer from 0 to 7 inclusive
     * @param {mu.Accidental} [accidental] An accidental to apply
     * @memberof mu
     */
    mu.NoteClass = function(index, accidental) {
        if (!(this instanceof mu.NoteClass))
            return new mu.NoteClass(index, accidental);
        mu._assert(mu._isInteger(index) && index >= 0 && index <= 7,
                   'invalid base note index ' + index);
        mu._assert(accidental == null || accidental instanceof mu.Accidental,
                   'invalid accidental ' + accidental);
        this._index = index;
        this._accidental = accidental;
    };
    mu.NoteClass._BASE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    mu.NoteClass._PITCH_INDEXES = [0, 2, 4, 5, 7, 9, 11];
    (function() {
        mu.NoteClass._BASE_LETTERS.forEach(function(letter, index) {
            mu[letter] = mu.NoteClass(index);
            mu[letter + '_NATURAL'] = mu.NoteClass(index, mu.NATURAL);
            mu[letter + '_FLAT'] = mu.NoteClass(index, mu.FLAT);
            mu[letter + '_SHARP'] = mu.NoteClass(index, mu.SHARP);
        });
    })();
    /**
     * Returns the pitch class corresponding to this note class.
     *
     * @example
     * // These both return a pitch class for A&#x266f;/B&#x266d;:
     * mu.A_SHARP.pitchClass()
     * mu.B_FLAT.pitchClass()
     *
     * @return {mu.PitchClass} The pitch class corresponding to this note class
     * @memberof mu.NoteClass
     */
    mu.NoteClass.prototype.pitchClass = function() {
        var ret = mu.PitchClass(mu.NoteClass._PITCH_INDEXES[this._index]);
        if (this._accidental)
            ret = ret.transpose(this._accidental.semitones());
        return ret;
    };
    /**
     * Returns true if this note class is equivalent to the `other`.
     * This means they have the same name and accidental, so B&#x266f is not
     * considered equal to C.  For that, try comparing the pitches.
     *
     * @param {mu.NoteClass} other The note class to compare against
     * @return {boolean} True If the note classes are equivalent
     * @memberof mu.NoteClass
     */
    mu.NoteClass.prototype.equals = function(other) {
        mu._assert(other instanceof mu.NoteClass,
                   'invalid pitch class ' + other);
        return this._index == other._index &&
            ((this._accidental == null && other._accidental == null)
             || (this._accidental != null && other._accidental != null && this._accidental.equals(other._accidental)));
    };
    /**
     * Returns a description of this note class.
     *
     * @example
     * // returns "C&#x266f;"
     * mu.C_SHARP.toString()
     *
     * @return {string} A description of this note class
     * @memberof mu.NoteClass
     */
    mu.NoteClass.prototype.toString = function() {
        var ret = mu.NoteClass._BASE_LETTERS[this._index];
        if (this._accidental)
            ret += this._accidental.toString();
        return ret;
    };

    /**
     * A note, such as B2, C&#x266d3; or G&#x266e4;.
     *
     * Usually you should not need to call this constructor.  There are
     * other ways to make a note.
     *
     * @example
     * // these all return a note representing middle C
     * mu.Note(mu.C, 4)
     * mu.C_4
     *
     * @class
     * @param {mu.NoteClass} noteClass The note class for this note
     * @param {number} [octave] The octave number of the note as described
     * by scientific note notation; an integer from 0 to 10 inclusive.
     * Middle C is in octave 4, and it is the fourth C on a standard
     * 88-key piano keyboard.
     * @memberof mu
     */
    mu.Note = function(noteClass, octave) {
        if (!(this instanceof mu.Note))
            return new mu.Note(noteClass, octave);
        mu._assert(noteClass instanceof mu.NoteClass,
                   'invalid note class ' + noteClass);
        if (octave == null)
            octave = 4;
        mu._assert(mu._isInteger(octave),
                   'invalid octave ' + octave);
        mu._assert(octave >= 0 && octave <= 10,
                   'unsupported octave ' + octave);
        mu._assert((octave != 0 || !noteClass.equals(mu.C_FLAT))
                   && (octave != 10 || !noteClass.equals(mu.B_SHARP)),
                   'unsupported note ' + noteClass.toString() + ' in octave ' + octave);

        this._noteClass = noteClass;
        this._octave = octave;
    };
    (function() {
        // these constants are documented in notes.js,
        // which is generated by the docgen.py script
        for (var octave = 0; octave <= 10; octave ++) {
            mu.NoteClass._BASE_LETTERS.forEach(function(letter, index) {
                mu[letter + '_' + octave] = mu.Note(mu.NoteClass(index), octave);
                mu[letter + '_NATURAL' + '_' + octave] = mu.Note(mu.NoteClass(index, mu.NATURAL), octave);
                if (letter != 'C' || octave != 0)
                    mu[letter + '_FLAT' + '_' + octave] = mu.Note(mu.NoteClass(index, mu.FLAT), octave);
                if (letter != 'B' || octave != 10)
                    mu[letter + '_SHARP' + '_' + octave] = mu.Note(mu.NoteClass(index, mu.SHARP), octave);
            });
        }
    })();
    /**
     * Returns the octave number of this note.  The fourth octave is the
     * one that includes middle C, and is also the fourth octave on an 88-key
     * piano.
     *
     * @example
     * // returns 4
     * mu.C_4.octave()
     *
     * @return {number} The octave number; an integer from 0 to 10 inclusive
     * @memberof mu.Note
     */
    mu.Note.prototype.octave = function() {
        return this._octave;
    };
    /**
     * Returns the note class of this note.
     *
     * @example
     * // returns a note class equivalent to mu.A
     * mu.A_4.noteClass()
     *
     * @return {mu.NoteClass} The note class of this note
     * @memberof mu.Note
     */
    mu.Note.prototype.noteClass = function() {
        return this._noteClass;
    };
    /**
     * Returns true if this note is equivalent to the `other`.
     * This means they have the same octave and note class, so A&#x266f4 is not
     * considered equal to B4.  For that, try comparing the pitches.
     *
     * @param {mu.Note} The note to compare against
     * @return {boolean} True if the two notes are equivalent
     * @memberof mu.Note
     */
    mu.Note.prototype.equals = function(other) {
        mu._assert(other instanceof mu.Note,
                   'invalid note ' + other);
        return this._octave == other._octave && this._noteClass.equals(other._noteClass);
    };
    /**
     * Return the pitch corresponding to this note.
     *
     * @return {mu.Pitch} The pitch corresponding to this note
     * @memberof mu.Note
     */
    mu.Note.prototype.pitch = function() {
        var nc = this._noteClass;
        var pc = nc.pitchClass();
        var octave = this._octave;
        if (nc.equals(mu.C_FLAT))
            octave --;
        else if (nc.equals(mu.B_SHARP))
            octave ++;
        return mu.Pitch(pc, octave);
    };
    /**
     * Returns a description of this note.
     *
     * @example
     * // returns "C&#x266f;3"
     * mu.C_SHARP_3.toString()
     *
     * @return {string} A description of this note
     * @memberof mu.Note
     */
    mu.Note.prototype.toString = function() {
        var nc = this._noteClass;
        var octave = this._octave;
        if (nc.equals(mu.C_FLAT))
            octave --;
        else if (nc.equals(mu.B_SHARP))
            octave ++;
        return nc.toString() + octave;
    };

    /**
     * A musical mode, which describes the intervals between the degrees of a
     * diatonic scale.  There are seven modes.
     *
     * Don't call this constructor, instead use the constant instances of
     * this class (e.g. mu.MAJOR or mu.DORIAN).
     *
     * @class
     * @param {number} offset The offset of the tonic relative to the
     * major scale (i.e. the shift in the interval sequence relative to
     * the Ionian mode)
     * @memberof mu
     */
    mu.Mode = function(offset) {
        if (!(this instanceof mu.Mode))
            return new mu.Mode(offset);
        mu._assert(mu._isInteger(offset) && offset >= 0 && offset <= 6,
                   'invalid offset ' + offset);
        this._offset = offset;
        this._name = mu.Mode._NAMES[offset];
        this._intervals = [];
        var at = 0;
        for (var i = 0; i < 8; i ++) {
            this._intervals.push(mu.Interval(at));
            at += mu.Mode._SEQUENCE[offset + i];
        }
    };
    mu.Mode._NAMES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
    mu.Mode._SEQUENCE = [2,2,1,2,2,2,1,2,2,1,2,2,2];
    /**
     * The Ionian mode (corresponding to the major scale).
     *
     * @type {mu.Mode}
     * @memberof mu
     */
    mu.MAJOR = mu.IONIAN = mu.Mode(0);
    /**
     * The Dorian mode.
     *
     * @type {mu.Mode}
     * @memberof mu
     */
    mu.DORIAN = mu.Mode(1);
    /**
     * The Phrygian mode.
     *
     * @type {mu.Mode}
     * @memberof mu
     */
    mu.PHRYGIAN = mu.Mode(2);
    /**
     * The Lydian mode.
     *
     * @type {mu.Mode}
     * @memberof mu
     */
    mu.LYDIAN = mu.Mode(3);
    /**
     * The Mixolydian mode (corresponding to the dominant scale).
     *
     * @type {mu.Mode}
     * @memberof mu
     */
    mu.DOMINANT = mu.MIXOLYDIAN = mu.Mode(4);
    /**
     * The Aeolian mode (corresponding to the natural minor scale).
     *
     * @type {mu.Mode}
     * @memberof mu
     */
    mu.NATURAL_MINOR = mu.AEOLIAN = mu.Mode(5);
    /**
     * The Locrian mode.
     *
     * @type {mu.Mode}
     * @memberof mu
     */
    mu.LOCRIAN = mu.Mode(6);
    /**
     * Returns the name of this mode.
     *
     * @return {string} The name of this mode
     * @memberof mu.Mode
     */
    mu.Mode.prototype.name = function() {
        return this._name;
    };
    /**
     * Returns the interval from the tonic to the given `degree` of the scale.
     *
     * @return {mu.Interval} The interval from the tonic to the given degree
     * @memberof mu.Mode
     */
    mu.Mode.prototype.interval = function(degree) {
        mu._assert(mu._isInteger(degree) && degree >= 1 && degree <= 7,
                   'invalid degree ' + degree);
        return this._intervals[degree];
    };
    /**
     * Returns a description of this mode.
     *
     * @return {string} A description of this mode
     * @memberof mu.Mode
     */
    mu.Mode.prototype.toString = function() {
        return this._name + ' mode';
    };

    /**
     * A musical key which specifies a tonic note, a mode, and a
     * corresponding diatonic scale.  A key can determine the descriptions
     * of pitches (e.g. B-flat vs A-sharp), and is necessary for
     * relative chord descriptions (e.g. "V7" instead of "G7" in the key
     * of C).
     *
     * @class
     * @param {mu.NoteClass} tonic The key note, from which other notes in
     * the scale are derived
     * @param {mu.Mode} mode The mechanism by which the scale is derived
     * from the tonic
     * @memberof mu
     */
    mu.Key = function(tonic, mode) {
        mu._assert(tonic instanceof mu.NoteClass,
                   'invalid tonic ' + tonic);
        mu._assert(mode instanceof mu.Mode,
                   'invalid mode ' + mode);
        this._tonic = tonic;
        this._mode = mode;
    };
    (function() {
        var modes = ['IONIAN', 'MAJOR', 'DORIAN', 'PHRYGIAN', 'LYDIAN',
                     'MIXOLYDIAN', 'DOMINANT', 'AEOLIAN', 'NATURAL_MINOR',
                     'LOCRIAN'];
        // these constants are documented in keys.js,
        // which is generated by the docgen.py script
        modes.forEach(function(modeName) {
            var mode = mu[modeName];
            mu._assert(mode, 'missing mode ' + modeName);
            mu.NoteClass._BASE_LETTERS.forEach(function(letter, index) {
                mu[letter + '_' + modeName] = mu.Key(mu[letter], mode);
                mu[letter + '_NATURAL' + '_' + modeName] = mu.Key(mu[letter + '_NATURAL'], mode);
                mu[letter + '_FLAT' + '_' + modeName] = mu.Key(mu[letter + '_FLAT'], mode);
                mu[letter + '_SHARP' + '_' + modeName] = mu.Key(mu[letter + '_SHARP'], mode);
            });
        });
    })();
    /**
     * Returns a note class in this key, based on the scale degree and
     * any accidental that might apply.
     *
     * @param {number} degree The scale degree
     * @param {mu.Accidental} [accidental] An accidental to apply
     * @memberof mu.Key
     */
    mu.Key.prototype.noteClassByDegree = function(degree, accidental) {
        mu._assert(mu._isInteger(degree) && degree >= 1 && degree <= 7,
                   'invalid degree ' + degree);
        mu._assert(accidental instanceof mu.Accidental,
                   'invalid accidental ' + accidental);
        return this._tonic
            .transpose(this._mode.interval(degree))
            .transpose(accidental.semitones());
    };

    /**
     * A chord type.  This specifies the name for the type of chord
     * (e.g. "dominant seventh"), an abbreviation for the type (e.g. "7"),
     * and some of the interval types present in the chord (e.g. if the
     * third is present, and whether it is a major or minor third).
     *
     * Don't call this constructor directly.
     *
     * @class
     * @param {object} info Configuration data for this chord type
     * @memberof mu
     */
    mu.ChordType = function(info) {
        if (!(this instanceof mu.ChordType))
            return new mu.ChordType(info);
        mu._assert(mu._isObject(info)
                   && mu._isString(info.name)
                   && mu._isString(info.abbr)
                   && (info.third == null || ['minor', 'major'].indexOf(info.third) >= 0)
                   && (info.fifth == null || ['perfect', 'diminished', 'augmented'].indexOf(info.fifth) >= 0)
                   && (info.seventh == null || ['minor', 'major', 'double-flat'].indexOf(info.seventh) >= 0),
                   'invalid chord type data ' + info);
        this._name = info.name;
        this._abbr = info.abbr;
        this._third = info.third;
        this._fifth = info.fifth;
        this._seventh = info.seventh;
    };
    mu.ChordType._INFO = [
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
            req: [0, 4, 7, 9],
            opt: []
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
            req: [0, 5, 7],
            opt: []
        },
        {
            abbr: 'sus2',
            name: 'suspended second',
            fifth: 'perfect',
            req: [0, 2],
            opt: [7]
        },
        {
            abbr: '11',
            name: 'eleventh',
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
            req: [0, 3, 7, 9],
            opt: []
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
    mu.ChordType._INFO_MAP = {};
    mu.ChordType._INFO.forEach(function(info) {
        for (var c = 0; c < Math.pow(2, info.opt.length); c ++) {
            var arr = info.req.map(function(i) {
                return i % 12;
            });
            info.opt.forEach(function(i, o) {
                if ((c & (1 << o)) != 0)
                    arr.push(i);
            });
            arr.sort(function(a, b) { return a - b; });
            var pattern = arr.join('-');
            if (pattern in mu.ChordType._INFO_MAP)
                throw Error('duplicate chord pattern ' + pattern + ': ' + mu.ChordType._INFO_MAP[pattern].name + ' and ' + info.name);
            mu.ChordType._INFO_MAP[pattern] = info;
        }
    });
    /**
     * Returns the name of this chord type.
     *
     * @return {string} the name of this chord type
     * @memberof mu.ChordType
     */
    mu.ChordType.prototype.name = function() {
        return this._name;
    };
    /**
     * Returns the abbreviation of this chord type.
     *
     * @return {string} the abbreviation of this chord type
     * @memberof mu.ChordType
     */
    mu.ChordType.prototype.abbr = function() {
        return this._abbr;
    };
    /**
     * Returns the type of third in this chord type:
     * 'minor', 'major', or null
     *
     * @return {string|null} the type of third
     * @memberof mu.ChordType
     */
    mu.ChordType.prototype.third = function() {
        return this._third;
    };
    /**
     * Returns the type of fifth in this chord type:
     * 'perfect', 'diminished', 'augmented', or null
     *
     * @return {string|null} the type of fifth
     * @memberof mu.ChordType
     */
    mu.ChordType.prototype.fifth = function() {
        return this._fifth;
    };
    /**
     * Returns the type of seventh in this chord type:
     * 'minor', 'major', or null
     *
     * @return {string|null} the type of seventh
     * @memberof mu.ChordType
     */
    mu.ChordType.prototype.seventh = function() {
        return this._seventh;
    };
    /**
     * Returns a desription of this chord type.
     *
     * @return {string} A desription of this chord type
     * @memberof mu.ChordType
     */
    mu.ChordType.prototype.toString = function() {
        return this._name + ' chord';
    };

    /**
     * An analysis of a chord.  This specifies the root of the chord and
     * a chord type.
     *
     * @class
     * @param {mu.PitchClass} root the rood of the chord
     * @param {mu.ChordType} type the chord type
     * @memberof mu
     */
    mu.ChordAnalysis = function(root, type) {
        if (!(this instanceof mu.ChordAnalysis))
            return new mu.ChordAnalysis(root, type);
        mu._assert(root instanceof mu.PitchClass,
                   'invalid root ' + root);
        mu._assert(type instanceof mu.ChordType,
                   'invalid type ' + type);
        this._root = root;
        this._type = type;
    };
    /**
     * Returns the root of this chord analysis.
     *
     * @return {mu.PitchClass} The root of this chord analysis
     * @memberof mu.ChordAnalysis
     */
    mu.ChordAnalysis.prototype.root = function() {
        return this._root;
    };
    /**
     * Returns the chord type of this chord analysis.
     *
     * @return {mu.ChordType} The chord type
     * @memberof mu.ChordAnalysis
     */
    mu.ChordAnalysis.prototype.type = function() {
        return this._type;
    };
    /**
     * Returns a desription of this chord analysis.
     *
     * @return {string} A desription of this chord analysis
     * @memberof mu.ChordAnalysis
     */
    mu.ChordAnalysis.prototype.toString = function() {
        return this.abbr();
    };
    /**
     * Returns a name for this chord analysis (e.g. "F minor").
     *
     * @return {string} A name for this chord analysis
     * @memberof mu.ChordAnalysis
     */
    mu.ChordAnalysis.prototype.name = function() {
        return this._root.toString() + ' ' + this._type.name();
    };
    /**
     * Returns an abbreviation for this chord analysis (e.g. "Fmin").
     *
     * @return {string} An abbreviation for this chord analysis
     * @memberof mu.ChordAnalysis
     */
    mu.ChordAnalysis.prototype.abbr = function() {
        return this._root.toString() + this._type.abbr();
    };

    /**
     * Analyze a set of pitches as a chord.  This returns an array of zero
     * or more {@link mu.ChordAnalysis} objects, each of which is a possible
     * interpretation of the chord.
     *
     * @class
     * @param {Array.<mu.Pitch>} pitches The set of pitches to analyze
     * @result {Array.<mu.ChordAnalysis>}
     * @memberof mu
     */
    mu.analyzeChord = function(pitches) {
        mu._assert(Array.isArray(pitches),
                   'invalid pitch array ' + pitches);
        pitches.forEach(function(pitch) {
            mu._assert(pitch instanceof mu.Pitch,
                       'invalid pitch array ' + pitches);
        });
        var pitchClasses = [];
        pitches.forEach(function(pitch) {
            pitchClasses[pitch.pitchClass().index()] = true;
        });
        var results = [];
        pitchClasses.forEach(function(present, index) {
            if (!present)
                return;
            var intervals = [0];
            for (var i = 1; i < 12; i ++) {
                var other = (index + i) % 12;
                if (pitchClasses[other])
                    intervals.push(i);
            }
            var info = mu.ChordType._INFO_MAP[intervals.join('-')];
            if (info)
                results.push(mu.ChordAnalysis(mu.PitchClass(index),
                                              mu.ChordType(info)));
        });
        return results;
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
