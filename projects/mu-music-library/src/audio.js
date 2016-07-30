/**
 * @file mu audio library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    if (!mu)
        throw Error('missing mu util library');
    if (!mu.Pitch)
        throw Error('missing mu theory library');

    /**
     * The mu audio library namespace object
     * @namespace mu.audio
     */
    mu.audio = mu.audio || {};

    mu.audio._gain = 0.5; // master volume

    /**
     * Silences all voices.  Emergency stop button.
     *
     * @memberof mu
     */
    mu.audio.silence = function() {
        mu._mapForEach(mu.audio.Voice._activeVoices, function(voice) {
            voice.silence();
        });
    };

    /**
     * An event indicating that a pitch has started playing.
     *
     * @event pitchstart
     * @property {mu.audio.Voice} voice The voice playing the pitch
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.audio.Voice
     */

    /**
     * An event indicating that a pitch has stopped playing.
     *
     * @event pitchstop
     * @property {mu.audio.Voice} voice The voice playing the pitch
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.audio.Voice
     */

    /**
     * An interface for voices for notes played via {@link mu.play}.
     *
     * @interface
     * @implements mu.Eventable
     * @memberof mu
     */
    mu.audio.Voice = function() {
        if (!(this instanceof mu.audio.Voice))
            return new mu.audio.Voice();
        mu.audio.Voice._activateVoice(this);
        this._playing = {};
    };
    mu._eventable(mu.audio.Voice.prototype);
    mu.audio.Voice._activeVoices = [];
    /**
     * Activates a voice, so it can be silenced using
     * {@link mu.silence}.
     *
     * @protected
     * @param {mu.audio.Voice} voice The voice
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice._activateVoice = function(voice) {
        mu._assert(voice instanceof mu.audio.Voice,
                   'invalid voice ' + voice);
        mu.audio.Voice._activeVoices.push(voice);
    };
    /**
     * Deactivates a voice.
     *
     * @protected
     * @param {mu.audio.Voice} voice The voice
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice._deactivateVoice = function(voice) {
        mu._assert(voice instanceof mu.audio.Voice,
                   'invalid voice ' + voice);
        var av = mu.audio.Voice._activeVoices;
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
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.toString = function() {
        return 'unknown voice';
    };
    /**
     * Silences the voice, deactivates it, and closes any resources used by it.
     *
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.dispose = function(pitch) {
        this.silence();
        mu.audio.Voice._deactivateVoice(this);
        this._disposed = true;
    };
    /**
     * Calls the given `callback` when the voice has finished loaded any
     * resources it needs.
     *
     * @param {Function} callback The function to call when the voice is ready
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.ready = function(callback) {
        mu._assert(callback == null || mu._isFunction(callback),
                   'invalid callback ' + callback);
        callback();
    };
    /**
     * Returns the lowest pitch this voice can play, or null if it can play
     * any valid pitch.
     *
     * @return {mu.Pitch|null} The lowest pitch this voice can play, or null
     * if it can play any valid pitch
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.lowest = function() {
        return null;
    };
    /**
     * Returns the highest pitch this voice can play, or null if it can play
     * any valid pitch.
     *
     * @return {mu.Pitch|null} The highest pitch this voice can play, or null
     * if it can play any valid pitch
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.highest = function() {
        return null;
    };
    /**
     * Returns true if this voice can play the given {@mu.Pitch}.
     *
     * @return {boolean} True if this voice can play the given {@mu.Pitch}.
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.canPlayPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        return (this.lowest() == null || pitch.subtract(this.lowest()) >= 0)
                && (this.highest() == null || pitch.subtract(this.highest()) <= 0);
    };
    /**
     * Silences this voice.
     *
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.silence = function(pitch) {
    };
    /**
     * Starts playing a given {@link mu.Pitch}.
     *
     * @param {mu.Pitch} pitch The pitch to play
     * @return {Function} A function which can be called to stop the pitch, equivalent to `{@link mu.audio.Voice#stopPitch}(pitch)`
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.startPitch = function(pitch) {
        this._playing[pitch.toNum()] = true;
        this._fire('pitchstart', {voice: this, pitch: pitch});
    };
    /**
     * Stops playing a given {@link mu.Pitch}.
     *
     * @param {mu.Pitch} pitch The pitch to play
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.stopPitch = function(pitch) {
        delete this._playing[pitch.toNum()];
        this._fire('pitchstop', {voice: this, pitch: pitch});
    };
    /**
     * Returns an array of the pitches that are currently playing.
     *
     * @return {Array.<mu.Pitch>} The pitches that are currently playing
     * @memberof mu.audio.Voice
     */
    mu.audio.Voice.prototype.playing = function() {
        var ret = [];
        mu._mapForEach(this._playing, function(x, num) {
            ret.push(mu.Pitch.fromNum(num));
        });
        return ret;
    };

    /**
     * A simple voice where each pitch is loaded as a one-second audio file
     * from a particular URL.  The sound is looped until the pitch is stopped.
     * This is for browsers that don't support html5 web audio.
     *
     * @class
     * @extends {mu.audio.Voice}
     * @param baseUrl {string} The base URL for the audio files
     * @memberof mu
     */
    mu.audio.BasicSoundFileVoice = function(baseUrl, lowest, highest) {
        if (!(this instanceof mu.audio.BasicSoundFileVoice))
            return new mu.audio.BasicSoundFileVoice(baseUrl, lowest, highest);
        mu._assert(mu._isString(baseUrl),
                   'invalid base URL ' + baseUrl);
        mu._assert(lowest instanceof mu.Pitch,
                   'invalid pitch ' + lowest);
        mu._assert(highest instanceof mu.Pitch,
                   'invalid pitch ' + highest);
        mu.audio.Voice.call(this);
        this._baseUrl = baseUrl;
        this._lowest = lowest;
        this._highest = highest;
        this._pitches = {};
        this._readyCallbacks = [];
        this._elem = mu._html(document.body).append('div')
            .attr('class', 'mu_html5_audio_voice');
        var count = this._highest.subtract(this._lowest) + 1;
        var toload = count;
        var self = this;
        function onload() {
            if (--toload == 0) {
                self._ready = true;
                self._readyCallbacks.forEach(mu.audio.Voice.prototype.ready.bind(this));
            }
        }
        var lowNum = this._lowest.toNum();
        for (var i = lowNum; i < lowNum + count; i ++) {
            var pitch = mu.Pitch.fromNum(i);
            var elem = this._elem.append('audio')
                .attr('preload', 'auto')
                .attr('loop', 'loop');
            elem.append('source')
                .attr('type', 'audio/ogg')
                .attr('src', this._baseUrl + pitch.octave() + '_' + pitch.pitchClass().index() + '.ogg');
            elem.append('source')
                .attr('type', 'audio/mp4')
                .attr('src', this._baseUrl + pitch.octave() + '_' + pitch.pitchClass().index() + '.m4a');
            this._pitches[i] = elem;
            var node = elem.node();
            node.oncanplaythrough = onload;
            node.onerror = onload;
        }
        this._ready = toload == 0;
    };
    mu.audio.BasicSoundFileVoice.prototype = Object.create(mu.audio.Voice.prototype);
    mu.audio.BasicSoundFileVoice.prototype.constructor = mu.audio.BasicSoundFileVoice;
    mu.audio.BasicSoundFileVoice.prototype._getNode = function(pitch) {
        return this._pitches[pitch.toNum()].node();
    };
    mu.audio.BasicSoundFileVoice.prototype.toString = function() {
        return 'unknown basic sound file voice';
    };
    mu.audio.BasicSoundFileVoice.prototype.dispose = function() {
        mu.audio.Voice.prototype.dispose.call(this);
        this._elem.remove();
    };
    mu.audio.BasicSoundFileVoice.prototype.ready = function(callback) {
        mu._assert(callback == null || mu._isFunction(callback),
                   'invalid callback ' + callback);
        if (this._disposed)
            return;
        if (this._ready)
            mu.audio.Voice.prototype.ready.call(this, callback);
        else
            this._readyCallbacks.push(callback);
    };
    mu.audio.BasicSoundFileVoice.prototype.lowest = function() {
        return this._lowest;
    };
    mu.audio.BasicSoundFileVoice.prototype.highest = function() {
        return this._highest;
    };
    mu.audio.BasicSoundFileVoice.prototype.silence = function() {
        if (this._disposed || !this._ready)
            return;
        mu._mapForEach(this._pitches, function(x, num) {
            this.stopPitch(mu.Pitch.fromNum(num));
        }, this);
    };
    mu.audio.BasicSoundFileVoice.prototype.startPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        mu._assert(this._ready,
                   'this voice is not yet ready');
        mu._assert(this.canPlayPitch(pitch),
                   'cannot play ' + pitch + ' with this voice');
        if (this._disposed)
            return;
        var node = this._getNode(pitch);
        if (!node.paused)
            return;
        node.volume = Math.min(mu.audio._gain, 1);
        node.currentTime = 0;
        node.play();
        mu.audio.Voice.prototype.startPitch.call(this, pitch);
    };
    mu.audio.BasicSoundFileVoice.prototype.stopPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        mu._assert(this._ready,
                   'this voice is not yet ready');
        mu._assert(this.canPlayPitch(pitch),
                   'cannot play ' + pitch + ' with this voice');
        if (this._disposed)
            return;
        var node = this._getNode(pitch);
        if (node.paused)
            return;
        node.pause();
        mu.audio.Voice.prototype.stopPitch.call(this, pitch);
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
         * @extends {mu.audio.Voice}
         * @memberof mu
         */
        mu.audio.GeneratorVoice = function(profile) {
            if (!(this instanceof mu.audio.GeneratorVoice))
                return new mu.audio.GeneratorVoice();
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
            mu.audio.Voice.call(this);
            this._profile = profile;
            this._context = new AudioContext();
            this._pitches = {};
        };
        mu.audio.GeneratorVoice.prototype = Object.create(mu.audio.Voice.prototype);
        mu.audio.GeneratorVoice.prototype.constructor = mu.audio.GeneratorVoice;
        mu.audio.GeneratorVoice.prototype.toString = function() {
            return 'unknown generator voice';
        };
        mu.audio.GeneratorVoice.prototype.silence = function() {
            if (this._disposed)
                return;
            mu._mapForEach(this._pitches, function(x, num) {
                this.stopPitch(mu.Pitch.fromNum(num));
            }, this);
            this._pitches = {};
        };
        mu.audio.GeneratorVoice.prototype.startPitch = function(pitch) {
            mu._assert(pitch instanceof mu.Pitch,
                       'invalid pitch ' + pitch);
            if (this._disposed)
                return;
            var num = pitch.toNum();
            if (this._pitches[num])
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
                gain.gain.value = 0.125 * mu.audio._gain * relAmp;
                oscillator.connect(gain);
                gain.connect(context.destination);
                oscillator.start();
                nodes.push(oscillator);
                nodes.push(gain);
            }
            addOscillator(1, 1);
            for (var i = 0; i < this._profile.length; i += 2)
                addOscillator(this._profile[i], this._profile[i+1]);
            this._pitches[num] = nodes;
            mu.audio.Voice.prototype.startPitch.call(this, pitch);
        };
        mu.audio.GeneratorVoice.prototype.stopPitch = function(pitch) {
            mu._assert(pitch instanceof mu.Pitch,
                       'invalid pitch ' + pitch);
            if (this._disposed)
                return;
            var num = pitch.toNum();
            if (!this._pitches[num])
                return;
            var nodes = this._pitches[num];
            nodes.forEach(function(node) {
                node.disconnect();
            });
            delete this._pitches[num];
            mu.audio.Voice.prototype.stopPitch.call(this, pitch);
        };

        /**
         * A pure sine wave generator voice.
         *
         * @class
         * @extends {mu.audio.GeneratorVoice}
         * @memberof mu
         */
        mu.audio.SineVoice = function() {
            if (!(this instanceof mu.audio.SineVoice))
                return new mu.audio.SineVoice();
            mu.audio.GeneratorVoice.call(this);
        };
        mu.audio.SineVoice.prototype = Object.create(mu.audio.GeneratorVoice.prototype);
        mu.audio.SineVoice.prototype.constructor = mu.audio.SineVoice;
        mu.audio.SineVoice.prototype.toString = function() {
            return 'sine voice';
        };

        /**
         * A generator voice with some harmonics thrown in to make it a
         * little easier on the ear.
         *
         * @class
         * @extends {mu.audio.GeneratorVoice}
         * @memberof mu
         */
        mu.audio.HarmonicVoice = function() {
            if (!(this instanceof mu.audio.HarmonicVoice))
                return new mu.audio.HarmonicVoice();
            mu.audio.GeneratorVoice.call(this, [
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
        mu.audio.HarmonicVoice.prototype = Object.create(mu.audio.GeneratorVoice.prototype);
        mu.audio.HarmonicVoice.prototype.constructor = mu.audio.HarmonicVoice;
        mu.audio.HarmonicVoice.prototype.toString = function() {
            return 'harmonic voice';
        };
    } else {
        /**
         * A basic voice using a library of pure sine wave sound files.
         *
         * @class
         * @extends {mu.audio.BasicSoundFileVoice}
         * @memberof mu
         */
        mu.audio.SineVoice = function() {
            if (!(this instanceof mu.audio.SineVoice))
                return new mu.audio.SineVoice();
            mu.audio.BasicSoundFileVoice.call(this, '../audio/sine/sine_', mu.C_1, mu.C_8);
        };
        mu.audio.SineVoice.prototype = Object.create(mu.audio.BasicSoundFileVoice.prototype);
        mu.audio.SineVoice.prototype.constructor = mu.audio.SineVoice;
        mu.audio.SineVoice.prototype.toString = function() {
            return 'sine voice';
        };

        /**
         * A basic voice using a library of simple sound files with some harmonics
         * thrown in to make it a little easier on the ear.
         *
         * This one only goes up to C7, because the sample rate was kept low
         * (16kHz) to minimize the file size, and the harmonics for some notes in
         * the 7th octave have sampling issues at that rate.
         *
         * @class
         * @extends {mu.audio.BasicSoundFileVoice}
         * @memberof mu
         */
        mu.audio.HarmonicVoice = function() {
            if (!(this instanceof mu.audio.HarmonicVoice))
                return new mu.audio.HarmonicVoice();
            mu.audio.BasicSoundFileVoice.call(this, '../audio/harm/harm_', mu.C_1, mu.B_6);
        };
        mu.audio.HarmonicVoice.prototype = Object.create(mu.audio.BasicSoundFileVoice.prototype);
        mu.audio.HarmonicVoice.prototype.constructor = mu.audio.HarmonicVoice;
        mu.audio.HarmonicVoice.prototype.toString = function() {
            return 'harmonic voice';
        };
    }

})();
