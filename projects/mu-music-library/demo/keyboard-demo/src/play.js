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
     * Silences the voice, deactivates it, and closes any resources used by it.
     *
     * @memberof mu.Voice
     */
    mu.Voice.prototype.dispose = function(pitch) {
        this.silence();
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
     * Returns true if this voice can play the given {@mu.Pitch}.
     *
     * @return {boolean} True if this voice can play the given {@mu.Pitch}.
     * @memberof mu.Voice
     */
    mu.Voice.prototype.canPlayPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                'invalid pitch ' + pitch);
        return (this.lowest() == null || pitch.subtract(this.lowest()) >= 0)
                && (this.highest() == null || pitch.subtract(this.highest()) <= 0);
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
     * @param {mu.Pitch} pitch The pitch to play
     * @return {Function} A function which can be called to stop the pitch, equivalent to `{@link mu.Voice#stopPitch}(pitch)`
     * @memberof mu.Voice
     */
    mu.Voice.prototype.startPitch = function(pitch) {
        throw Error('unimplemented');
    };
    /**
     * Stops playing a given {@link mu.Pitch}.
     *
     * @abtract
     * @param {mu.Pitch} pitch The pitch to play
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
                'invalid callback ' + callback);
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
        mu._assert(this.canPlayPitch(pitch),
                'cannot play ' + pitch + ' with this voice');
        var node = this._get(pitch).node();
        node.currentTime = 0;
        node.play();
        return function() {
            node.pause();
        };
    };
    mu.BasicSoundFileVoice.prototype.stopPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                'invalid pitch ' + pitch);
        mu._assert(this.canPlayPitch(pitch),
                'cannot play ' + pitch + ' with this voice');
        var node = this._get(pitch).node();
        node.pause();
    };

    if (window.AudioContext) {

        /**
         * A voice that generates tones using html5 web audio.  It always has
         * an oscillator with relative frequency 1 and relative amplitude 1.
         * Others can be added using the `profile` argument.
         *
         * @class
         * @param {number[]} [profile] An array of values to set up additional
         * oscillators.  The array needs two entries per oscillator: the first
         * is the relative frequency and the second is the relative amplitude.
         * @extends {mu.Voice}
         * @memberof mu
         */
        mu.GeneratorVoice = function(profile) {
            if (!(this instanceof mu.GeneratorVoice))
                return new mu.GeneratorVoice();
            profile = profile || [];
            mu._assert(Array.isArray(profile),
                       'invalid profile ' + profile);
            mu._assert(profile.length % 2 == 0,
                       'invalid profile length ' + profile.length);
            for (var i = 0; i < profile.length; i += 2) {
                mu._assert(mu._isFinite(profile[i]) && profile[i] > 0,
                           'invalid relative frequency ' + profile[i]);
                mu._assert(mu._isFinite(profile[i+1]) && profile[i+1] >= 0,
                           'invalid relative amplitude ' + profile[i+1]);
            }
            mu.Voice.call(this);
            this._profile = profile;
            this._context = new AudioContext();
            this._pitches = {};
        };
        mu.GeneratorVoice.prototype = Object.create(mu.Voice.prototype);
        mu.GeneratorVoice.prototype.constructor = mu.GeneratorVoice;
        mu.GeneratorVoice.prototype._stopPitchIndex = function(index) {
            if (!this._pitches[index])
                return;
            var nodes = this._pitches[index];
            nodes.forEach(function(node) {
                node.disconnect();
            });
            delete this._pitches[index];
        };
        mu.GeneratorVoice.prototype.toString = function() {
            return 'unknown generator voice';
        };
        mu.GeneratorVoice.prototype.dispose = function() {
            mu.Voice.prototype.dispose.call(this);
        };
        mu.GeneratorVoice.prototype.ready = function(callback) {
            mu._assert(callback == null || mu._isFunction(callback),
                       'invalid callback ' + callback);
            callback();
        };
        mu.GeneratorVoice.prototype.silence = function() {
            mu._mapForEach(this._pitches, function(nodes, index) {
                this._stopPitchIndex(index);
            }, this);
            this._pitches = {};
        };
        mu.GeneratorVoice.prototype.startPitch = function(pitch) {
            mu._assert(pitch instanceof mu.Pitch,
                       'invalid pitch ' + pitch);
            var index = pitch.subtract(mu.C_0);
            if (this._pitches[index])
                return;
            var nodes = [];
            var context = this._context;
            function addOscillator(relFreq, relAmp) {
                var freq = pitch.frequency().hertz() * relFreq;
                if (freq > context.sampleRate / 2) // avoid aliasing
                    return;
                var oscillator = context.createOscillator();
                oscillator.frequency.value = freq;
                var gain = context.createGain();
                gain.gain.value = 0.125 * relAmp;
                oscillator.connect(gain);
                gain.connect(context.destination);
                oscillator.start();
                nodes.push(oscillator);
                nodes.push(gain);
            }
            addOscillator(1, 1);
            for (var i = 0; i < this._profile.length; i += 2)
                addOscillator(this._profile[i], this._profile[i+1]);
            this._pitches[index] = nodes;
        };
        mu.GeneratorVoice.prototype.stopPitch = function(pitch) {
            mu._assert(pitch instanceof mu.Pitch,
                       'invalid pitch ' + pitch);
            this._stopPitchIndex(pitch.subtract(mu.C_0));
        };

        /**
         * A generator voice with some harmonics thrown in to make it a
         * little easier on the ear.
         *
         * @class
         * @extends {mu.GeneratorVoice}
         * @memberof mu
         */
        mu.HarmonicVoice = function() {
            if (!(this instanceof mu.HarmonicVoice))
                return new mu.HarmonicVoice();
            mu.GeneratorVoice.call(this, [
                2, 0.399,
                3, 0.299,
                4, 0.152,
                5, 0.197,
                6, 0.094,
                7, 0.061,
                8, 0.139,
                10, 0.071
            ]);
        };
        mu.HarmonicVoice.prototype = Object.create(mu.GeneratorVoice.prototype);
        mu.HarmonicVoice.prototype.constructor = mu.HarmonicVoice;
        mu.HarmonicVoice.prototype.toString = function() {
            return 'sine voice';
        };
    } else {
        /**
         * A basic voice using a library of simple sound files with some harmonics
         * thrown in to make it a little easier on the ear.
         *
         * This one only goes up to C7, because the sample rate was kept low
         * (16kHz) to minimize the file size, and the harmonics for some notes in
         * the 7th octave have sampling issues at that rate.
         *
         * @class
         * @extends {mu.BasicSoundFileVoice}
         * @memberof mu
         */
        mu.HarmonicVoice = function() {
            if (!(this instanceof mu.HarmonicVoice))
                return new mu.HarmonicVoice();
            mu.BasicSoundFileVoice.call(this, '../audio/harm/harm_', mu.C_1, mu.B_6);
        };
        mu.HarmonicVoice.prototype = Object.create(mu.BasicSoundFileVoice.prototype);
        mu.HarmonicVoice.prototype.constructor = mu.HarmonicVoice;
        mu.HarmonicVoice.prototype.toString = function() {
            return 'harmonic voice';
        };
    }

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
