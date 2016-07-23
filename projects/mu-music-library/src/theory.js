/**
 * @file mu music theory library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    /** polyfill for Number.isFinite (from MDN) */
    var _isFinite = Number.isFinite || function(value) {
        return typeof value === 'number' && isFinite(value);
    };
    /** polyfill for Number.isInteger (from MDN) */
    var _isInteger = Number.isInteger || function(value) {
        return _isFinite(value) && Math.floor(value) === value;
    };
    /** polyfill for Math.log2 (from MDN) */
    var _log2 = Math.log2 || function(value) {
        return Math.log(value) / Math.LN2;
    };
    /** polyfill for Array.isArray (from MDN) */
    var _isArray = Array.isArray || function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    /** polyfill for Array.prototype.forEach (simplified) */
    var _arrayForEach = function(array, callback, thisArg) {
        if (array.forEach)
            return array.forEach(callback, thisArg);
        for (var i = 0; i < array.length; i ++)
            callback.call(thisArg, array[i], i, array);
    };
    /** polyfill for Array.prototype.map (simplified) */
    var _map = function(array, callback, thisArg) {
        if (array.map)
            return array.map(callback, thisArg);
        var ret;
        for (var i = 0; i < array.length; i ++)
            ret.push(callback.call(thisArg, array[i], i, array));
        return ret;
    };

    /** utility to check for interface violations and runtime invariants */
    function _assert(pred, message) {
        if (!pred)
            throw Error(message || 'assertion failed');
    }

    /** the global object */
    var global = Function('return this')();

    /**
     * The mu library namespace object
     * @namespace mu
     */
    var mu = global.mu = global.mu || {};

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
        _assert(_isFinite(hertz) && hertz > 0,
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
        _assert(_isFinite(factor) && factor > 0,
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
     * A musical pitch, limited to the twelve-note chromatic scale.
     *
     * Usually you should not need to call this constructor.  All the
     * supported pitches have constants in the {@link mu} namespace.
     * For instance {@link mu.A_4} and {@link mu.F_SHARP_3}.
     *
     * @example
     * // returns mu.C_4 (representing middle C)
     * mu.Pitch(4, 0)
     *
     * @class
     * @param {number} octave The octave number of the pitch as described
     * by scientific pitch notation; an integer from 0 to 10 inclusive.
     * {@link mu.C_4} (middle C) is in octave 4,
     * and it is the fourth C on a standard 88-key piano keyboard.
     * @param {number} index The index of the pitch within that octave;
     * an integer from 0 to 11 inclusive.  The pitches within an octave
     * start at C (index 0) and end at B (index 11).
     * @memberof mu
     */
    mu.Pitch = function(octave, index) {
        if (!(this instanceof mu.Pitch))
            return new mu.Pitch(octave, index);
        _assert(_isInteger(octave),
                'invalid octave ' + octave);
        _assert(octave >= 0 && octave <= 10,
                'inaudible octave ' + octave);
        _assert(_isInteger(index) && index >= 0 && index < 12,
                'invalid pitch index ' + index);
        this._octave = octave;
        this._index = index;
    };
    (function() {
        // these constants are documented in pitches.js,
        // which is generated by the docgen.py script
        for (var octave = 0; octave <= 10; octave ++) {
            mu['C_' + octave] = mu.Pitch(octave, 0);
            mu['C_SHARP_' + octave] = 
            mu['D_FLAT_' + octave] = mu.Pitch(octave, 1);
            mu['D_' + octave] = mu.Pitch(octave, 2);
            mu['D_SHARP_' + octave] = 
            mu['E_FLAT_' + octave] = mu.Pitch(octave, 3);
            mu['E_' + octave] = mu.Pitch(octave, 4);
            mu['F_' + octave] = mu.Pitch(octave, 5);
            mu['F_SHARP_' + octave] = 
            mu['G_FLAT_' + octave] = mu.Pitch(octave, 6);
            mu['G_' + octave] = mu.Pitch(octave, 7);
            mu['G_SHARP_' + octave] = 
            mu['A_FLAT_' + octave] = mu.Pitch(octave, 8);
            mu['A_' + octave] = mu.Pitch(octave, 9);
            mu['A_SHARP_' + octave] = 
            mu['B_FLAT_' + octave] = mu.Pitch(octave, 10);
            mu['B_' + octave] = mu.Pitch(octave, 11);
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
    mu.Pitch._SHARP_NAMES = 'CCDDEFFGGAAB';
    mu.Pitch._FLAT_NAMES = 'CDDEEFGGAABB';
    /**
     * @private
     * @return {number} The index of this pitch in the entire supported
     * pitch range
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype._num = function() {
        return this._octave * 12 + this._index;
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
     * Returns the index of this pitch within its octave.
     *
     * @example
     * // returns 9
     * mu.A_4.index()
     *
     * @return {number} The index of this pitch within its octave;
     * an integer from 0 to 11 inclusive
     * @memberof mu.Pitch
     */
    mu.Pitch.prototype.index = function() {
        return this._index;
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
        _assert(_isInteger(semitones),
                'invalid semitone count ' + semitones);
        var ii = this._num() + semitones;
        var octave = Math.floor(ii / 12);
        _assert(octave >= 0 && octave <= 10,
                'inaudible octave ' + octave);
        var index = ii - octave * 12;
        return mu.Pitch(octave, index);
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
        _assert(interval instanceof mu.Interval,
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
        _assert(interval instanceof mu.Interval,
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
        return mu.Pitch._A_4_FREQUENCY.multiply(Math.pow(mu.Pitch._12TH_ROOT_OF_2, this._num() - mu.A_4._num()));
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
        _assert(other instanceof mu.Pitch,
                'invalid pitch ' + other);
        return this._num() - other._num();
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
        var s = mu.Pitch._SHARP_NAMES[this._index];
        var f = mu.Pitch._FLAT_NAMES[this._index];
        if (s === f)
            return s + this._octave;
        return s + mu.SHARP_CHAR + this._octave + '/' + f + mu.FLAT_CHAR + this._octave;
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
     *
     * @class
     * @param {number} semitones The number of semitones in the interval; a non-negative integer
     * @memberof mu
     */
    mu.Interval = function(semitones) {
        if (!(this instanceof mu.Interval))
            return new mu.Interval(semitones);
        _assert(_isInteger(semitones),
                'invalid semitone count ' + semitones);
        _assert(semitones >= 0 && semitones <= mu.Interval._MAX,
                'inaudible semitone count ' + semitones);
        this._semitones = semitones;
    }
    mu.Interval._MAX = mu.Pitch._MAX._num() - mu.Pitch._MIN._num();
    /**
     * Returns the number of semitones in this interval
     *
     * @example
     * // returns 5
     * mu.Interval(5).semitones()
     *
     * @return {number} The number of semitones in this interval; a non-negative integer
     * @memberof mu.Interval
     */
    mu.Interval.prototype.semitones = function() {
        return this._semitones;
    };
    /**
     * Describes this interval.
     *
     * @example
     * // returns "5 semitones"
     * mu.Interval(5).toString()
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
     * A set of three or more pitches that are heard together.
     *
     * @example
     * // returns a chord composed of C4, E4, and G4
     * mu.Chord(mu.C_4, mu.E_4, mu.G_4)
     *
     * @class
     * @param {mu.Pitch} pitch1 A pitch in the chord
     * @param {mu.Pitch} pitch2 A pitch in the chord
     * @param {...mu.Pitch} pitch3 A pitch in the chord
     * @memberof mu
     */
    mu.Chord = function(pitch1, pitch2, pitch3) {
        if (!(this instanceof mu.Chord)) {
            function C(args) {
                return mu.Chord.apply(this, args);
            }
            C.prototype = mu.Chord.prototype;
            return new C(arguments);
        }
        _assert(arguments.length >= 3,
                'not enough pitches (' + arguments.length + '), must have at least 3');
        _arrayForEach(arguments, function(pitch) {
            _assert(pitch instanceof mu.Pitch,
                    'invalid pitch ' + pitch);
        });
        this._pitches = Array.prototype.slice.call(arguments);
        this._pitches.sort(function(a, b) {
            return a.subtract(b);
        });
    };
    /**
     * Returns the number of pitches in this chord.
     *
     * @return {number} The number of pitches in this chord; an integer greater than 2
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
        return mu.Chord.apply(null, _map(this._pitches, function(pitch) {
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
        _arrayForEach(this._pitches, function(pitch) {
            ret.push(pitch.toString());
        });
        return ret.join(' ');
    };
/*

    mu.ScaleType = function(intervals) {
        
    };
    mu.MINOR

    mu.Key = function(tonic) {
        if (!(this instanceof mu.Key))
            return new mu.Key(tonic);
        _assert(tonic instanceof mu.Pitch,
                'invalid tonic pitch ' + tonic);
        this._tonic = tonic;
    };
    mu.Key.prototype.tonic = function() {
        return this._tonic;
    };

*/

    return mu;
})();
