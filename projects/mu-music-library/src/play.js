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
     * An interface for voices for notes played via {@link mu.play}.
     *
     * @interface
     * @memberof mu
     */
    mu.Voice = function() {
        if (!(this instanceof mu.Voice))
            return new mu.Voice();
    };
    mu.Voice._stopCallbacks = {};
    mu.Voice._stopKey = 0;
    /**
     * Adds a callback that can be used to stop a pitch from playing.
     *
     * @protected
     * @param {Function} callback The callback that stops the pitch
     * @param {number} timeout A duration (in seconds) after which the pitch will already have stopped and the callback can be called without affecting the voice; a positive number
     * @memberof mu.Voice
     */
    mu.Voice.addStopCallback = function(callback, duration) {
        mu._assert(mu._isFunction(callback),
                'invalid stop callback ' + callback);
        mu._assert(mu._isFinite(duration) && duration > 0,
                'invalid duration ' + duration);
        var key = mu.Voice._stopKey++;
        var timer = setTimeout(function() {
            mu.Voice._stopCallbacks[key]();
        }, duration * 1000);
        mu.Voice._stopCallbacks[key] = function() {
            clearTimeout(timer);
            delete mu.Voice._stopCallbacks[key];
            callback();
        };
    };
    mu.Voice._stopAll = function() {
        _mapForEach(mu.Voice._stopCallbacks, function(callback) {
            callback();
        });
    };
    /**
     * Returns the lowest pitch this voice can play.
     *
     * @return {mu.Pitch} The lowest pitch this voice can play
     * @memberof mu.Voice
     */
    mu.Voice.prototype.lowest = function() {
        throw Error('unimplemented');
    };
    /**
     * Returns the highest pitch this voice can play.
     *
     * @return {mu.Pitch} The highest pitch this voice can play
     * @memberof mu.Voice
     */
    mu.Voice.prototype.highest = function() {
        throw Error('unimplemented');
    };
    /**
     * Preloads content for this voice if necessary, then calls the given
     * `callback` when the voice is ready to play.
     *
     * @param {Function} callback the function to call when the voice is ready
     * @memberof mu.Voice
     */
    mu.Voice.prototype.ready = function(callback) {
        throw Error('unimplemented');
    };
    /**
     * Plays a given {@link mu.Pitch} for a given `duration`.
     *
     * @param {mu.Pitch} pitch the pitch to play
     * @param {number} duration how long to play it; a positive number
     * @memberof mu.Voice
     */
    mu.Voice.prototype.play = function(pitch, duration) {
        throw Error('unimplemented');
    };

    /**
     * A simple voice where each note is loaded as a one-second audio file
     * from a particular URL.
     *
     * @class
     * @implements {mu.Voice}
     * @param baseUrl {string} The base URL for the audio files
     * @memberof mu
     */
    mu.Html5AudioVoice = function(baseUrl, lowest, highest) {
        if (!(this instanceof mu.Html5AudioVoice))
            return new mu.Html5AudioVoice(baseUrl, lowest, highest);
        mu._assert(mu._isString(baseUrl),
                'invalid base URL ' + baseUrl);
        mu._assert(lowest instanceof mu.Pitch,
                'invalid pitch ' + lowest);
        mu._assert(highest instanceof mu.Pitch,
                'invalid pitch ' + highest);
        this._baseUrl = baseUrl;
        this._lowest = lowest;
        this._highest = highest;
        this._pitchElems = [];
        this._ready = false;
    };
    mu.Html5AudioVoice.prototype = new mu.Voice();
    mu.Html5AudioVoice.prototype.lowest = function() {
        return this._lowest;
    };
    mu.Html5AudioVoice.prototype.highest = function() {
        return this._highest;
    };
    mu.Html5AudioVoice.prototype._load = function(pitch) {
        var elem = mu._html(document.body).append('audio')
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
    mu.Html5AudioVoice.prototype._get = function(pitch) {
        var index = pitch.subtract(this._lowest);
        if (this._pitchElems[index])
            return this._pitchElems[index];
        return this._pitchElems[index] = this._load(pitch);
    };
    mu.Html5AudioVoice.prototype.play = function(pitch, duration) {
        mu._assert(pitch instanceof mu.Pitch,
                'invalid pitch ' + pitch);
        mu._assert(pitch.subtract(this._lowest) >= 0
                && pitch.subtract(this._highest) <= 0,
                'cannot play ' + pitch + ' with this voice');
        mu._assert(mu._isFinite(duration) && duration > 0,
                'invalid duration ' + duration);
        var node = this._get(pitch).node();
        node.playbackRate = Math.min(2, Math.max(0.5, 1.0/duration));
        node.currentTime = 0;
        node.play();
        mu.Voice.addStopCallback(function() {
            node.pause();
        }, duration);
    };
    mu.Html5AudioVoice.prototype.ready = function(callback) {
        mu._assert(callback == null || mu._isFunction(callback),
                'invalid stop callback ' + callback);
        if (this._ready) {
            if (callback) callback();
            return;
        }
        var count = this._highest.subtract(this._lowest) + 1;
        var toload = 0;
        function onload() {
            if (--toload == 0 && callback) {
                this._ready = true;
                callback();
            }
        }
        for (var i = 0; i < count; i ++) {
            if (!this._pitchElems[i] || this._pitchElems[i].readyState == 4) {
                toload ++;
                var node = this._get(this._lowest.transpose(i)).node();
                node.oncanplaythrough = onload;
                node.onerror = onload;
            }
        }
        if (toload == 0 && callback) {
            this._ready = true;
            callback();
        }
    };

    /**
     * A voice for notes played via {@link mu.play}.
     *
     * @class
     * @memberof mu
     */
    mu.SINE = mu.Html5AudioVoice('../audio/sine/sine_', mu.C_1, mu.C_8);

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
