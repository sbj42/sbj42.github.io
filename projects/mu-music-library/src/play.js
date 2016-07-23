/**
 * @file mu audio sequencer library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    /** polyfill for Number.isFinite (from MDN) */
    var _isFinite = Number.isFinite || function(value) {
        return typeof value === 'number' && isFinite(value);
    };
    /** polyfill for Map.prototype.forEach (simplified) */
    var _mapForEach = function(map, callback, thisArg) {
        if (map.forEach)
            return map.forEach(callback, thisArg);
        for (var key in map)
            if (map.hasOwnProperty(key))
                callback.call(thisArg, map[key], key, map);
    };

    /** utility to check if a value is a string primitive or a String object */
    function _isString(value) {
        return typeof value == 'string' ||
            (!!value && typeof value == 'object' && Object.prototype.toString.call(value) == '[object String]');
    }
    /** utility to check if a value is a function primitive or a Function object */
    function _isFunction(value) {
        return !!value && (typeof value == 'object' || typeof value == 'function') && Object.prototype.toString.call(value) == '[object Function]';
    }
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
        _assert(callback instanceof Function,
                'invalid stop callback ' + callback);
        _assert(_isFinite(duration) && duration > 0,
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
        _assert(_isString(baseUrl),
                'invalid base URL ' + baseUrl);
        _assert(lowest instanceof mu.Pitch,
                'invalid pitch ' + lowest);
        _assert(highest instanceof mu.Pitch,
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
        var elem = document.createElement('audio');
        elem.setAttribute('preload', 'auto');
        elem.setAttribute('loop', 'loop');
        var ogg = document.createElement('source');
        ogg.setAttribute('type', 'audio/ogg');
        ogg.setAttribute('src', this._baseUrl + pitch.octave() + '_' + pitch.index() + '.ogg');
        elem.appendChild(ogg);
        var m4a = document.createElement('source');
        m4a.setAttribute('type', 'audio/mp4');
        m4a.setAttribute('src', this._baseUrl + pitch.octave() + '_' + pitch.index() + '.m4a');
        elem.appendChild(m4a);
        document.body.appendChild(elem);
        return elem;
    };
    mu.Html5AudioVoice.prototype._get = function(pitch) {
        var index = pitch.subtract(this._lowest);
        if (this._pitchElems[index])
            return this._pitchElems[index];
        return this._pitchElems[index] = this._load(pitch);
    };
    mu.Html5AudioVoice.prototype.play = function(pitch, duration) {
        _assert(pitch instanceof mu.Pitch,
                'invalid pitch ' + pitch);
        _assert(pitch.subtract(this._lowest) >= 0
                && pitch.subtract(this._highest) <= 0,
                'cannot play ' + pitch + ' with this voice');
        _assert(_isFinite(duration) && duration > 0,
                'invalid duration ' + duration);
        var elem = this._get(pitch);
        elem.playbackRate = Math.min(2, Math.max(0.5, 1.0/duration));
        elem.currentTime = 0;
        elem.play();
        mu.Voice.addStopCallback(function() {
            elem.pause();
        }, duration);
    };
    mu.Html5AudioVoice.prototype.ready = function(callback) {
        _assert(callback == null || callback instanceof Function,
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
                var elem = this._get(this._lowest.transpose(i));
                elem.oncanplaythrough = onload;
                elem.onerror = onload;
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
