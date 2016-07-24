/**
 * @file mu player library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    if (!mu)
        throw Error('missing mu util library');
    if (!mu.Pitch)
        throw Error('missing mu theory library');

    /**
     * Silences all voices.
     *
     * @memberof mu
     */
    mu.silence = function() {
        _mapForEach(mu.Voice._activeVoices, function(voice) {
            voice.silence();
        });
    };

    /**
     * An interface for voices for notes played via {@link mu.play}.
     *
     * @interface
     * @memberof mu
     */
    mu.Voice = function() {
        if (!(this instanceof mu.Voice))
            return new mu.Voice();
        mu.Voice._activateVoice(this);
    };
    mu.Voice._activeVoices = [];
    /**
     * Activates a voice as active, so it can be silenced using
     * {@link mu.silence}.
     *
     * @protected
     * @param {mu.Voice} voice The voice
     * @memberof mu.Voice
     */
    mu.Voice._activateVoice = function(voice) {
        mu._assert(voice instanceof mu.Voice,
                'invalid voice ' + voice);
        mu.Voice._activeVoices.push(voice);
    };
    /**
     * Deactivates a voice.
     *
     * @protected
     * @param {mu.Voice} voice The voice
     * @memberof mu.Voice
     */
    mu.Voice._deactivateVoice = function(voice) {
        mu._assert(voice instanceof mu.Voice,
                'invalid voice ' + key);
        var av = mu.Voice._activeVoices;
        for (var i = 0; i < av.length; i ++) {
            if (av[i] === voice) {
                av.splice(i, 1);
                return;
            }
        }
    };
    /**
     * Returns a string description of the voice.
     *
     * @return {string} A string description of the voice
     * @memberof mu.Voice
     */
    mu.Voice.prototype.toString = function() {
        return 'unknown voice';
    };
    /**
     * Removes the voice and closes any resources used by it.
     *
     * @memberof mu.Voice
     */
    mu.Voice.prototype.dispose = function(pitch) {
        mu.Voice._deactivateVoice(this);
    };
    /**
     * Calls the given `callback` when the voice has finished loaded any
     * resources it needs.
     *
     * @abstract
     * @param {Function} callback The function to call when the voice is ready
     * @memberof mu.Voice
     */
    mu.Voice.prototype.ready = function(callback) {
        throw Error('unimplemented');
    };
    /**
     * Returns the lowest pitch this voice can play, or null if it can play
     * any valid pitch.
     *
     * @return {mu.Pitch|null} The lowest pitch this voice can play, or null
     * if it can play any valid pitch
     * @memberof mu.Voice
     */
    mu.Voice.prototype.lowest = function() {
        return null;
    };
    /**
     * Returns the highest pitch this voice can play, or null if it can play
     * any valid pitch.
     *
     * @return {mu.Pitch|null} The highest pitch this voice can play, or null
     * if it can play any valid pitch
     * @memberof mu.Voice
     */
    mu.Voice.prototype.highest = function() {
        return null;
    };
    /**
     * Silences this voice.
     *
     * @abstract
     * @memberof mu.Voice
     */
    mu.Voice.prototype.silence = function(pitch) {
        throw Error('unimplemented');
    };
    /**
     * Starts playing a given {@link mu.Pitch}.
     *
     * @abtract
     * @param {mu.Pitch} pitch the pitch to play
     * @memberof mu.Voice
     */
    mu.Voice.prototype.startPitch = function(pitch) {
        throw Error('unimplemented');
    };
    /**
     * Stops playing a given {@link mu.Pitch}.
     *
     * @abtract
     * @param {mu.Pitch} pitch the pitch to play
     * @memberof mu.Voice
     */
    mu.Voice.prototype.stopPitch = function(pitch) {
        throw Error('unimplemented');
    };

    /**
     * A simple voice where each pitch is loaded as a one-second audio file
     * from a particular URL.  The sound is looped until the pitch is stopped.
     * This is for browsers that don't support html5 web audio.
     *
     * @class
     * @extends {mu.Voice}
     * @param baseUrl {string} The base URL for the audio files
     * @memberof mu
     */
    mu.BasicSoundFileVoice = function(baseUrl, lowest, highest) {
        if (!(this instanceof mu.BasicSoundFileVoice))
            return new mu.BasicSoundFileVoice(baseUrl, lowest, highest);
        mu._assert(mu._isString(baseUrl),
                'invalid base URL ' + baseUrl);
        mu._assert(lowest instanceof mu.Pitch,
                'invalid pitch ' + lowest);
        mu._assert(highest instanceof mu.Pitch,
                'invalid pitch ' + highest);
        mu.Voice.call(this);
        this._baseUrl = baseUrl;
        this._lowest = lowest;
        this._highest = highest;
        this._pitchElems = [];
        this._readyCallbacks = [];
        this._elem = mu._html(document.body).append('div')
            .attr('class', 'mu_html5_audio_voice');
        var count = this._highest.subtract(this._lowest) + 1;
        var toload = count;
        var self = this;
        function onload() {
            if (--toload == 0) {
                self._ready = true;
                self._readyCallbacks.forEach(function(callback) {
                    callback();
                });
            }
        }
        for (var i = 0; i < count; i ++) {
            var node = this._get(this._lowest.transpose(i)).node();
            node.oncanplaythrough = onload;
            node.onerror = onload;
        }
        this._ready = toload == 0;
    };
    mu.BasicSoundFileVoice.prototype = Object.create(mu.Voice.prototype);
    mu.BasicSoundFileVoice.prototype.constructor = mu.BasicSoundFileVoice;
    mu.BasicSoundFileVoice.prototype._load = function(pitch) {
        var elem = this._elem.append('audio')
            .attr('preload', 'auto')
            .attr('loop', 'loop');
        elem.append('source')
            .attr('type', 'audio/ogg')
            .attr('src', this._baseUrl + pitch.octave() + '_' + pitch.index() + '.ogg');
        elem.append('source')
            .attr('type', 'audio/mp4')
            .attr('src', this._baseUrl + pitch.octave() + '_' + pitch.index() + '.m4a');
        return elem;
    };
    mu.BasicSoundFileVoice.prototype._get = function(pitch) {
        var index = pitch.subtract(this._lowest);
        if (this._pitchElems[index])
            return this._pitchElems[index];
        return this._pitchElems[index] = this._load(pitch);
    };
    mu.BasicSoundFileVoice.prototype.toString = function() {
        return 'unknown basic sound file voice';
    };
    mu.BasicSoundFileVoice.prototype.dispose = function() {
        mu.Voice.prototype.dispose.call(this);
        this._elem.remove();
    };
    mu.BasicSoundFileVoice.prototype.ready = function(callback) {
        mu._assert(callback == null || mu._isFunction(callback),
                'invalid stop callback ' + callback);
        if (this._ready) {
            if (callback) callback();
            return;
        }
        this._readyCallbacks.push(callback);
    };
    mu.BasicSoundFileVoice.prototype.lowest = function() {
        return this._lowest;
    };
    mu.BasicSoundFileVoice.prototype.highest = function() {
        return this._highest;
    };
    mu.BasicSoundFileVoice.prototype.silence = function() {
        this._pitchElems.forEach(function(elem) {
            elem.node().pause();
        });
    };
    mu.BasicSoundFileVoice.prototype.startPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                'invalid pitch ' + pitch);
        mu._assert(pitch.subtract(this._lowest) >= 0
                && pitch.subtract(this._highest) <= 0,
                'cannot play ' + pitch + ' with this voice');
        var node = this._get(pitch).node();
        node.currentTime = 0;
        node.play();
    };
    mu.BasicSoundFileVoice.prototype.stopPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                'invalid pitch ' + pitch);
        mu._assert(pitch.subtract(this._lowest) >= 0
                && pitch.subtract(this._highest) <= 0,
                'cannot play ' + pitch + ' with this voice');
        var node = this._get(pitch).node();
        node.pause();
    };

    /**
     * A basic voice using a library of pure sine wave sound files.
     *
     * @class
     * @extends {mu.BasicSoundFileVoice}
     * @memberof mu
     */
    mu.BasicSineVoice = function() {
        if (!(this instanceof mu.BasicSineVoice))
            return new mu.BasicSineVoice();
        mu.BasicSoundFileVoice.call(this, '../audio/sine/sine_', mu.C_1, mu.C_8);
    };
    mu.BasicSineVoice.prototype = Object.create(mu.BasicSoundFileVoice.prototype);
    mu.BasicSineVoice.prototype.constructor = mu.BasicSineVoice;
    mu.BasicSineVoice.prototype.toString = function() {
        return 'basic sine voice';
    };

    /**
     * A basic voice using a library of simple sound files based on
     * pure sine wave with some harmonics thrown in to make it a little
     * easier on the ear.
     *
     * This one only goes up to C7, because the sample rate was kept low
     * (16kHz) to minimize the file size, and the harmonics for some notes in
     * the 7th octave have sampling issues at that rate.
     *
     * @class
     * @extends {mu.BasicSoundFileVoice}
     * @memberof mu
     */
    mu.BasicHarmonicVoice = function() {
        if (!(this instanceof mu.BasicHarmonicVoice))
            return new mu.BasicHarmonicVoice();
        mu.BasicSoundFileVoice.call(this, '../audio/harm/harm_', mu.C_1, mu.C_7);
    };
    mu.BasicHarmonicVoice.prototype = Object.create(mu.BasicSoundFileVoice.prototype);
    mu.BasicHarmonicVoice.prototype.constructor = mu.BasicHarmonicVoice;
    mu.BasicHarmonicVoice.prototype.toString = function() {
        return 'basic harmonic voice';
    };

    /**
     * A simple audio sequencer
     *
     * @example
     * var synth = mu.Synth();
     * // play a C major chord for 1 second
     * synth.play(mu.Chord(mu.C_4, mu.E_4, mu.G_4), 1);
     *
     * @class
     * @param {number} hertz The frequency in hertz; a positive number
     * @memberof mu
     */
    mu.Synth = function() {
    };
    
})();
