/**
 * @file mu ui library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    if (!mu)
        throw Error('missing mu util library');
    if (!mu.Pitch)
        throw Error('missing mu theory library');
    if (!mu.audio.Voice)
        throw Error('missing mu player library');

    /**
     * The mu ui library namespace object
     * @namespace mu.ui
     */
    mu.ui = mu.ui || {};

    /**
     * An event indicating that the user has pressed a pitch in a UI.
     *
     * @event pitchpress
     * @property {mu.ui.UI} ui The UI where the action took place
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.ui.UI
     */

    /**
     * An event indicating that the user has released a pitch in a UI.
     *
     * @event pitchrelease
     * @property {mu.ui.UI} ui The UI where the action took place
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.ui.UI
     */

    /**
     * An event indicating that the mouse has entered a pitch in a UI.
     *
     * @event pitchenter
     * @property {mu.ui.UI} ui The UI where the mouse is hovering
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.ui.UI
     */

    /**
     * An event indicating that the mouse has left a pitch in a UI.
     *
     * @event pitchleave
     * @property {mu.ui.UI} ui The UI where the mouse is hovering
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.ui.UI
     */

    /**
     * An event indicating that the user has pressed a frequency in a UI.
     *
     * @event frequencypress
     * @property {mu.ui.UI} ui The UI where the action took place
     * @property {mu.Frequency} frequency The frequency
     * @memberof mu.ui.UI
     */

    /**
     * An event indicating that the user has released a frequency in a UI.
     *
     * @event frequencyrelease
     * @property {mu.ui.UI} ui The UI where the action took place
     * @property {mu.Frequency} frequency The frequency
     * @memberof mu.ui.UI
     */

    mu.ui._colorHelper = function(h, s, l) {
        mu._assert(s == null || (mu._isFinite(s) && s >= 0 && s <= 1),
                   'invalid saturation ' + s);
        mu._assert(l == null || (mu._isFinite(l) && l >= 0 && l <= 1),
                   'invalid lightness ' + l);
        s = s || 0.8;
        l = l || 0.75;
        return 'hsl(' + Math.floor(h) + ', ' + Math.floor(s * 100) + '%, ' + Math.floor(l * 100) + '%)';
    };

    // TODO these should be based on 'degree' in the key
    mu.ui.frequencyColor = function(frequency, s, l) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        var a = mu._log2(frequency.hertz()) - mu._log2(mu.C_4.frequency().hertz());
        a = a % 1;
        if (a < 0)
            a += 1;
        return mu.ui._colorHelper(360 * a, s, l);
    };

    mu.ui.pitchClassColor = function(pitchClass, s, l) {
        mu._assert(pitchClass instanceof mu.PitchClass,
                   'invalid pitch class ' + pitchClass);
        mu._assert(s == null || (mu._isFinite(s) && s >= 0 && s <= 1),
                   'invalid saturation ' + s);
        mu._assert(l == null || (mu._isFinite(l) && l >= 0 && l <= 1),
                   'invalid lightness ' + l);
        var a = pitchClass.index();
        return mu.ui._colorHelper(a * 360 / 12, s, l);
    };

    /**
     * An interface for a mu UI.
     *
     * @interface
     * @implements mu.Eventable
     * @memberof mu
     */
    mu.ui.UI = function() {
        if (!(this instanceof mu.ui.UI))
            return new mu.ui.UI();

        this._onKeyDownListener = this._onKeyDown.bind(this);
        document.addEventListener('keydown', this._onKeyDownListener);
        this._onKeyUpListener = this._onKeyUp.bind(this);
        document.addEventListener('keyup', this._onKeyUpListener);
        this._onFocusOutListener = this._stopAll.bind(this);
        document.addEventListener('focusout', this._onFocusOutListener);
        this._onBlurListener = this._stopAll.bind(this);
        window.addEventListener('blur', this._onBlurListener);

        this._ui_pitchesOnly = false;
    };
    mu._eventable(mu.ui.UI.prototype);
    mu.ui.UI.prototype._pitchesOnly = function() {
        return this._ui_pitcheOnly;
    };
    mu.ui.UI.prototype._onKeyDown = function(event) {
        var key = event.key || event.keyIdentifier;
        if (key == 'Shift')
            this._shiftDown = true;
        if (key == 'Ctrl')
            this._ctrlDown = true;
    };
    mu.ui.UI.prototype._onKeyUp = function(event) {
        var key = event.key || event.keyIdentifier;
        if (key == 'Shift') {
            this._shiftDown = false;
            this._stopAll();
        }
        if (key == 'Ctrl')
            this._ctrlDown = false;
    };
    mu.ui.UI.prototype._stopAll = function() {
    };
    /**
     * Returns a string description of the UI.
     *
     * @return {string} A string description of the voice
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.toString = function() {
        return 'unknown ui';
    };
    /**
     * Closes any resources used by this UI.
     *
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.dispose = function() {
    };
    /**
     * Returns the Element for this UI.
     *
     * @return {Element} The Element for this UI
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.node = function() {
        throw new Error('unimplemented');
    };
    /**
     * Sets 'pitches only' mode on the UI, which means the UI
     * should not attempt to press frequencies.
     *
     * @param {boolean} pitchesOnly Whether to turn on 'pitches only' mode
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.setPitchesOnly = function(pitchesOnly) {
        this._pitchesOnly = pitchesOnly;
    };
    /**
     * Updates the UI to show that a pitch has started.
     *
     * @param {mu.Pitch} pitch The pitch
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.startPitch = function(pitch) {
    };
    /**
     * Updates the UI to show that a pitch has stopped.
     *
     * @param {mu.Pitch} pitch The pitch
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.stopPitch = function(pitch) {
    };
    /**
     * Updates the UI to show that a frequency has started.
     *
     * @param {mu.Frequency} frequency The frequency
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.startFrequency = function(frequency) {
    };
    /**
     * Updates the UI to show that a frequency has stopped.
     *
     * @param {mu.Frequency} frequency The frequency
     * @memberof mu.ui.UI
     */
    mu.ui.UI.prototype.stopFrequency = function(frequency) {
    };

    /**
     * A keyboard UI.
     *
     * @class
     * @extends mu.ui.UI
     * @memberof mu
     */
    mu.ui.Keyboard = function(lowPitch, highPitch) {
        if (!(this instanceof mu.ui.Keyboard))
            return new mu.ui.Keyboard(lowPitch, highPitch);
        mu._assert(lowPitch == null || lowPitch instanceof mu.Pitch,
                   'invalid low pitch ' + lowPitch);
        mu._assert(highPitch == null || highPitch instanceof mu.Pitch,
                   'invalid high pitch ' + highPitch);
        lowPitch = lowPitch || mu.C_1;
        highPitch = highPitch || mu.C_8;
        mu._assert(highPitch.subtract(lowPitch) >= 0,
                   'pitches swapped ' + lowPitch + ' ' + highPitch);
        mu.ui.UI.call(this);
        this._lowPitch = lowPitch;
        this._highPitch = highPitch;
        this._pitches = {};
        this._pitchesPlaying = {};
        this._pitchOver = null;

        var lowWhite = mu.ui.Keyboard._isBlack(lowPitch) ? lowPitch.transpose(-1) : lowPitch;
        var highWhite = mu.ui.Keyboard._isBlack(highPitch) ? highPitch.transpose(1) : highPitch;
        var lowWhiteIndex = mu.ui.Keyboard._whiteIndex(lowWhite);
        var highWhiteIndex = mu.ui.Keyboard._whiteIndex(highWhite);
        var lowOctave = lowWhite.octave();
        var highOctave = highWhite.octave();
        var span = (highOctave - lowOctave) * 7 + highWhiteIndex - lowWhiteIndex + 1;
        var wW = mu.ui.Keyboard._WHITE_WIDTH;
        var wL = mu.ui.Keyboard._WHITE_LENGTH;
        var wB = mu.ui.Keyboard._WHITE_BORDER;
        var wR = mu.ui.Keyboard._WHITE_ROUND;
        var cS = mu.ui.Keyboard._MIDDLE_C_MARK_SIZE;

        this._svg = mu._html('svg')
            .attr('width', span * (wW + wB) + wB)
            .attr('height', wL + wB * 2)
            .classed('mu_keyboard', true);

        var white_keys = [mu.C, mu.D, mu.E, mu.F, mu.G, mu.A, mu.B];
        var x = -1;
        for (var o = lowOctave; o <= highOctave; o ++) {
            white_keys.forEach(function(pitchClass) {
                var pitch = mu.Pitch(pitchClass, o);
                if (pitch.subtract(lowWhite) < 0 || pitch.subtract(highWhite) > 0)
                    return
                x ++;
                if (pitch.subtract(lowPitch) < 0 || pitch.subtract(highPitch) > 0)
                    return;
                var g = this._svg.append('g');
                var rect = g.append('rect')
                    .attr('x', x * (wW + wB) + wB/2)
                    .attr('y', wB/2)
                    .attr('width', wW + wB)
                    .attr('height', wL + wB)
                    .attr('rx', wR)
                    .attr('ry', wR)
                    .classed('mu_keyboard_key', true)
                    .classed('mu_keyboard_white', true);
                this._pitches[pitch.toNum()] = rect;
                g.on('mouseover', this._onMouseOver.bind(this, pitch))
                    .on('mouseout', this._onMouseOut.bind(this, pitch))
                    .on('mousedown', this._onMouseDown.bind(this, pitch));
                if (pitch.equals(mu.C_4)) {
                    g.append('circle')
                        .attr('cx', x * (wW + wB) + wB + wW / 2)
                        .attr('cy', wB/2 + wL - cS)
                        .attr('r', cS / 2)
                        .attr('class', 'mu_keyboard_middle_c_mark');
                }
            }, this);
        }

        var bW = mu.ui.Keyboard._BLACK_WIDTH;
        var bL = mu.ui.Keyboard._BLACK_LENGTH;
        var bB = mu.ui.Keyboard._BLACK_BORDER;
        var bR = mu.ui.Keyboard._BLACK_ROUND;
        var bA = mu.ui.Keyboard._BLACK_ADJUST;

        x = -1;
        for (var o = lowOctave; o <= highOctave; o ++) {
            white_keys.forEach(function(whitePitchClass) {
                var whitePitch = mu.Pitch(whitePitchClass, o);
                if (whitePitch.subtract(lowWhite) < 0 || whitePitch.subtract(highWhite) > 0)
                    return;
                x ++;
                if (whitePitchClass.index() == mu.E.index()
                    || whitePitchClass.index() == mu.B.index())
                    return;
                var pitch = whitePitch.transpose(1);
                if (pitch.subtract(lowPitch) < 0 || pitch.subtract(highPitch) > 0)
                    return;
                var adj = 0;
                if (whitePitchClass.equals(mu.C)
                    || whitePitchClass.equals(mu.F))
                    adj = -bA;
                else if (whitePitchClass.equals(mu.D)
                    || whitePitchClass.equals(mu.A))
                    adj = bA;
                var rect = this._svg.append('rect')
                    .attr('x', (x + 1) * (wW + wB) + wB/2 - (bW + bB)/2 + adj)
                    .attr('y', bB/2)
                    .attr('width', bW + bB)
                    .attr('height', bL + bB)
                    .attr('rx', bR)
                    .attr('ry', bR)
                    .classed('mu_keyboard_key', true)
                    .classed('mu_keyboard_black', true);
                this._pitches[pitch.toNum()] = rect;
                rect.on('mouseover', this._onMouseOver.bind(this, pitch))
                    .on('mouseout', this._onMouseOut.bind(this, pitch))
                    .on('mousedown', this._onMouseDown.bind(this, pitch));
            }, this);
        }
    };
    mu.ui.Keyboard.prototype = Object.create(mu.ui.UI.prototype);
    mu.ui.Keyboard.prototype.constructor = mu.ui.Keyboard;
    mu.ui.Keyboard._INCH = 21;
    mu.ui.Keyboard._WHITE_WIDTH = mu.ui.Keyboard._INCH * 0.848;
    mu.ui.Keyboard._WHITE_BORDER = mu.ui.Keyboard._WHITE_WIDTH * 0.074;
    mu.ui.Keyboard._WHITE_LENGTH = mu.ui.Keyboard._WHITE_WIDTH * 6.486;
    mu.ui.Keyboard._WHITE_ROUND = mu.ui.Keyboard._WHITE_WIDTH * 0.25;
    mu.ui.Keyboard._BLACK_WIDTH = mu.ui.Keyboard._WHITE_WIDTH * 0.515;
    mu.ui.Keyboard._BLACK_BORDER = mu.ui.Keyboard._WHITE_BORDER;
    mu.ui.Keyboard._BLACK_LENGTH = mu.ui.Keyboard._WHITE_LENGTH * 0.659;
    mu.ui.Keyboard._BLACK_ADJUST = mu.ui.Keyboard._BLACK_WIDTH * 0.18;
    mu.ui.Keyboard._BLACK_ROUND = mu.ui.Keyboard._BLACK_WIDTH * 0.3;
    mu.ui.Keyboard._MIDDLE_C_MARK_SIZE = mu.ui.Keyboard._WHITE_WIDTH * 0.5;
    mu.ui.Keyboard._isBlack = function(pitch) {
        var i = pitch.pitchClass().index();
        return i == 1 || i == 3 || i == 6 || i == 8 || i == 10;
    };
    mu.ui.Keyboard._whiteIndex = function(pitch) {
        return [0, -1, 1, -1, 2, 3, -1, 4, -1, 5, -1, 6][pitch.pitchClass().index()];
    };
    mu.ui.Keyboard.prototype._isPlaying = function(pitch) {
        var num = pitch.toNum();
        return num in this._pitchesPlaying;
    };
    mu.ui.Keyboard.prototype._onMouseOver = function(pitch, event) {
        if (this._disposed)
            return;
        this._pitchOver = pitch;
        if (this._mouseDown) {
            if (this._dragPress)
                this._fire('pitchpress', {ui: this, pitch: pitch});
            else
                this._fire('pitchrelease', {ui: this, pitch: pitch});
        }
        this._pitches[pitch.toNum()].classed('mu_keyboard_hover', true);
        this._fire('pitchenter', {ui: this, pitch: pitch});
    };
    mu.ui.Keyboard.prototype._onMouseOut = function(pitch, event) {
        if (this._disposed)
            return;
        delete this._pitchOver;
        if (this._mouseDown && this._dragPress && !this._shiftDown)
            this._fire('pitchrelease', {ui: this, pitch: pitch});
        this._pitches[pitch.toNum()].classed('mu_keyboard_hover', false);
        this._fire('pitchleave', {ui: this, pitch: pitch});
    };
    mu.ui.Keyboard.prototype._onMouseDown = function(pitch, event) {
        if (this._disposed)
            return;
        event.preventDefault();
        this._mouseDown = true;
        if (this._shiftDown && this._isPlaying(pitch)) {
            this._dragPress = false;
            this._fire('pitchrelease', {ui: this, pitch: pitch});
        } else {
            this._dragPress = true;
            this._fire('pitchpress', {ui: this, pitch: pitch});
        }
        var onMouseUpListener;
        function onMouseUp(event) {
            window.removeEventListener('mouseup', onMouseUpListener);
            if (this._dragPress && !this._shiftDown)
                this._fire('pitchrelease', {ui: this, pitch: this._pitchOver || pitch});
            delete this._mouseDown;
            delete this._dragPress;
        };
        onMouseUpListener = onMouseUp.bind(this);
        window.addEventListener('mouseup', onMouseUpListener);
    };
    mu.ui.Keyboard.prototype.startPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        this._pitchesPlaying[pitch.toNum()] = true;
        this._pitches[pitch.toNum()].classed('mu_keyboard_playing', true);
    };
    mu.ui.Keyboard.prototype.stopPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        delete this._pitchesPlaying[pitch.toNum()];
        this._pitches[pitch.toNum()].classed('mu_keyboard_playing', false);
    };
    mu.ui.Keyboard.prototype.startFrequency = function(frequency) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        this.startPitch(mu.Pitch.fromFrequency(frequency));
    };
    mu.ui.Keyboard.prototype.stopFrequency = function(frequency) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        this.stopPitch(mu.Pitch.fromFrequency(frequency));
    };
    mu.ui.Keyboard.prototype._stopAll = function() {
        mu._mapForEach(this._pitchesPlaying, function(x, num) {
            var pitch = mu.Pitch.fromNum(+num);
            this._fire('pitchrelease', {ui: this, pitch: pitch});
        }, this);
    };
    mu.ui.Keyboard.prototype.dispose = function() {
        document.removeEventListener('keydown', this._onKeyDownListener);
        document.removeEventListener('keyup', this._onKeyUpListener);
        document.removeEventListener('focusout', this._onFocusOutListener);
        window.removeEventListener('blur', this._onBlurListener);
        mu.ui.UI.prototype.dispose.call(this);
        this._disposed = true;
    };
    mu.ui.Keyboard.prototype.node = function() {
        return this._svg.node();
    };

    /**
     * A pitch constellation UI.
     *
     * @class
     * @extends mu.ui.UI
     * @memberof mu
     */
    mu.ui.PitchConstellation = function(root, lowPitch, highPitch) {
        if (!(this instanceof mu.ui.PitchConstellation))
            return new mu.ui.PitchConstellation(root, lowPitch, highPitch);
        mu._assert(root instanceof mu.PitchClass,
                   'invalid pitch class ' + root);
        mu._assert(lowPitch == null || lowPitch instanceof mu.Pitch,
                   'invalid low pitch ' + lowPitch);
        mu._assert(highPitch == null || highPitch instanceof mu.Pitch,
                   'invalid high pitch ' + highPitch);
        root = root || mu.C;
        lowPitch = lowPitch || mu.C_1;
        highPitch = highPitch || mu.C_8;
        mu._assert(highPitch.subtract(lowPitch) >= 0,
                   'pitches swapped ' + lowPitch + ' ' + highPitch);
        mu.ui.UI.call(this);
        this._root = root;
        this._lowPitch = lowPitch;
        this._highPitch = highPitch;
        this._lines = [];
        this._marks = [];
        this._pitchClassesPlaying = [];

        var r = mu.ui.PitchConstellation._RADIUS;
        var tS = mu.ui.PitchConstellation._FONT_SIZE;
        var tH = tS;
        var rT = r - 2*tH;
        var rI = rT - mu.ui.PitchConstellation._TEXT_GAP;

        this._svg = mu._html('svg')
            .attr('width', 2*r)
            .attr('height', 2*r)
            .classed('mu_pitchconstellation', true)
            .on('mousemove', this._onMouseMove, this)
            .on('mousedown', this._onMouseDown, this);
        var bottom = this._svg.append('g');

        for (var i = 0; i < 12; i ++) {
            this._pitchClassesPlaying.push(0);
            var pitchClass = this._root.transpose(i);
            var strings = pitchClass.toStrings();
            var deg = i * 180 / 6;
            var rad = i * Math.PI / 6;
            bottom.append('line')
                .attr('x1', r)
                .attr('y1', r)
                .attr('x2', r + rI * Math.sin(rad))
                .attr('y2', r - rI * Math.cos(rad))
                .classed('mu_pitchconstellation_ray', true);
            this._lines.push(this._svg.append('line')
                .attr('x1', r)
                .attr('y1', r)
                .attr('x2', r + rI * Math.sin(rad))
                .attr('y2', r - rI * Math.cos(rad))
                .classed('mu_pitchconstellation_ray2', true));
            strings.forEach(function(str, line) {
                this._svg.append('text')
                    .attr('x', r)
                    .attr('y', r - rT - tH * (strings.length - line - 1))
                    .attr('text-anchor', 'middle')
                    .attr('font-size', tS)
                    .attr('transform', 'rotate(' + deg + ' ' + r + ',' + r + ')')
                    .classed('mu_pitchconstellation_label', true)
                    .text(str);
            }, this);
        }
    };
    mu.ui.PitchConstellation.prototype = Object.create(mu.ui.UI.prototype);
    mu.ui.PitchConstellation.prototype.constructor = mu.ui.PitchConstellation;
    mu.ui.PitchConstellation._RADIUS = 80;
    mu.ui.PitchConstellation._TEXT_GAP = 4;
    mu.ui.PitchConstellation._FONT_SIZE = 14;
    mu.ui.PitchConstellation.prototype._isPlaying = function(pitchClass) {
        return this._pitchClassesPlaying[pitchClass.index()] != 0;
    };
    mu.ui.PitchConstellation.prototype._onPitchEvent = function(pitchClass, type) {
        if (this._disposed)
            return;
        var hnum = this._highPitch.toNum();
        for (var num = this._lowPitch.toNum(); num <= hnum; num ++) {
            var pitch = mu.Pitch.fromNum(num);
            if (pitch.pitchClass().equals(pitchClass))
                this._fire(type, {ui: this, pitch: pitch});
        }
    };
    mu.ui.PitchConstellation.prototype._onMouseMove = function(event) {
        if (this._disposed)
            return;
        var rect = this._svg.node().getBoundingClientRect();
        var r = mu.ui.PitchConstellation._RADIUS;
        var x = event.clientX - rect.left - r;
        var y = event.clientY - rect.top - r;
        var a = Math.round(Math.atan2(x, -y) * 6 / Math.PI);
        if (a < 0)
            a += 12;
        else if (a == 0)
            a = 0;
        var pitchClass = mu.PitchClass(a);
        if (this._pitchClassOver && pitchClass.equals(this._pitchClassOver))
            return;
        if (this._mouseDown && this._dragPress && !this._shiftDown)
            this._onPitchEvent(this._pitchClassOver, 'pitchrelease');
        this._pitchClassOver = pitchClass;
        if (this._mouseDown) {
            if (this._dragPress)
                this._onPitchEvent(this._pitchClassOver, 'pitchpress');
            else
                this._onPitchEvent(this._pitchClassOver, 'pitchrelease');
        }
    };
    mu.ui.PitchConstellation.prototype._onMouseDown = function(event) {
        if (this._disposed)
            return;
        event.preventDefault();
        this._mouseDown = true;
        if (this._shiftDown && this._isPlaying(this._pitchClassOver)) {
            this._dragPress = false;
            this._onPitchEvent(this._pitchClassOver, 'pitchrelease');
        } else {
            this._dragPress = true;
            this._onPitchEvent(this._pitchClassOver, 'pitchpress');
        }
        var onMouseUpListener;
        function onMouseUp(event) {
            if (this._disposed)
                return;
            if (this._dragPress && !this._shiftDown)
                this._onPitchEvent(this._pitchClassOver, 'pitchrelease');
            delete this._mouseDown;
            delete this._dragPress;
        };
        onMouseUpListener = onMouseUp.bind(this);
        window.addEventListener('mouseup', onMouseUpListener);
    };
    mu.ui.PitchConstellation.prototype.startPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        var index = pitch.pitchClass().index();
        var count = this._pitchClassesPlaying[index] ++;
        if (count == 0)
            this._lines[index].classed('mu_pitchconstellation_ray2_playing', true);
    };
    mu.ui.PitchConstellation.prototype.stopPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        var index = pitch.pitchClass().index();
        var count = -- this._pitchClassesPlaying[index];
        if (count == 0)
            this._lines[index].classed('mu_pitchconstellation_ray2_playing', false);
    };
    mu.ui.PitchConstellation.prototype.startFrequency = function(frequency) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        this.startPitch(mu.Pitch.fromFrequency(frequency));
    };
    mu.ui.PitchConstellation.prototype.stopFrequency = function(frequency) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        this.stopPitch(mu.Pitch.fromFrequency(frequency));
    };
    mu.ui.PitchConstellation.prototype._stopAll = function() {
        mu._mapForEach(this._pitchClassesPlaying, function(x, num) {
            this._onPitchEvent(mu.PitchClass(+num), 'pitchrelease');
        }, this);
    };
    mu.ui.PitchConstellation.prototype.dispose = function() {
        document.removeEventListener('focusout', this._onFocusOutListener);
        window.removeEventListener('blur', this._onBlurListener);
        mu.ui.UI.prototype.dispose.call(this);
        this._disposed = true;
    };
    mu.ui.PitchConstellation.prototype.node = function() {
        return this._svg.node();
    };

    /**
     * A waveform UI.
     *
     * @class
     * @extends mu.ui.UI
     * @memberof mu
     */
    mu.ui.Waveform = function(lowFrequency) {
        if (!(this instanceof mu.ui.Waveform))
            return new mu.ui.Waveform(lowFrequency);
        mu._assert(lowFrequency == null || lowFrequency instanceof mu.Frequency,
                   'invalid low frequency ' + lowFrequency);
        lowFrequency = lowFrequency || mu.C_1.frequency();
        mu.ui.UI.call(this);
        this._lowFreq = lowFrequency;
        this._freqs = {};
        this._freqsPlaying = {};

        var w = mu.ui.Waveform._WIDTH;
        var h = mu.ui.Waveform._HEIGHT;
        var lW = mu.ui.Waveform._LINE_WIDTH;
        var wS = mu.ui.Waveform._WAVE_STEPS;
        var tW = mu.ui.Waveform._TICK_WIDTH;
        var tL = mu.ui.Waveform._TICK_LENGTH;

        this._svg = mu._html('svg')
            .attr('width', w)
            .attr('height', h)
            .classed('mu_waveform', true)
            .on('mousemove', this._onMouseMove, this)
            .on('mousedown', this._onMouseDown, this);
        w -= tW / 2;
        this._svg.append('line')
            .attr('x1', 0)
            .attr('y1', h / 2)
            .attr('x2', w)
            .attr('y2', h / 2)
            .attr('stroke-width', lW)
            .classed('mu_waveform_line', true);
        var wavelength = w;
        while (wavelength >= wS) {
            this._svg.append('line')
                .attr('x1', wavelength)
                .attr('y1', h / 2 - tL)
                .attr('x2', wavelength)
                .attr('y2', h / 2 + tL)
                .attr('stroke-width', tW)
                .classed('mu_waveform_line', true);
            wavelength = wavelength / Math.pow(2, 1/12);
        }

        this._waveGroup = this._svg.append('g');
    };
    mu.ui.Waveform.prototype = Object.create(mu.ui.UI.prototype);
    mu.ui.Waveform.prototype.constructor = mu.ui.Waveform;
    mu.ui.Waveform._WIDTH = 950;
    mu.ui.Waveform._HEIGHT = 50;
    mu.ui.Waveform._LINE_WIDTH = 1;
    mu.ui.Waveform._WAVE_STEPS = 16;
    mu.ui.Waveform._WAVE_WIDTH = 2;
    mu.ui.Waveform._TICK_LENGTH = 6;
    mu.ui.Waveform._TICK_WIDTH = 2;
    mu.ui.Waveform._DOT_RADIUS = 5;
    mu.ui.Waveform.prototype._isPlaying = function(frequency) {
        return this._freqsPlaying[frequency.hertz()];
    };
    mu.ui.Waveform.prototype._update = function() {
        if (this._disposed)
            return;
        this._waveGroup.clear();
        var w = mu.ui.Waveform._WIDTH;
        var h = mu.ui.Waveform._HEIGHT;
        var wW = mu.ui.Waveform._WAVE_WIDTH;
        var wS = mu.ui.Waveform._WAVE_STEPS;
        var dR = mu.ui.Waveform._DOT_RADIUS;
        var tW = mu.ui.Waveform._TICK_WIDTH;
        w -= tW / 2;
        mu._mapForEach(this._freqsPlaying, function(freq, x) {
            var wavelength = w * this._lowFreq.hertz() / freq.hertz();
            var stepsize = wavelength / wS;
            var x = 0;
            var d = ['M' + x + ' ' + (h / 2)];
            while (x < w) {
                x += stepsize;
                var y = Math.sin(x * Math.PI * 2 / wavelength) * (h / 2 - wW) + h / 2;
                d.push('L' + x.toFixed(1) + ' ' + y.toFixed(1));
            }
            d.push('L' + x + ' ' + (h / 2), 'z');
            this._waveGroup.append('path')
                .attr('d', d.join(''))
                .attr('stroke-width', wW)
                .attr('fill', mu.ui.frequencyColor(freq, 0.8, 0.6))
                .classed('mu_waveform_wave', true);
        }, this);
        mu._mapForEach(this._freqsPlaying, function(freq, x) {
            var wavelength = w * this._lowFreq.hertz() / freq.hertz();
            this._waveGroup.append('circle')
                .attr('cx', wavelength)
                .attr('cy', h / 2)
                .attr('r', dR)
                .attr('fill', mu.ui.frequencyColor(freq, 0.8, 0.6))
                .classed('mu_waveform_dot', true);
        }, this);
    };
    mu.ui.Waveform.prototype._onEvent = function(frequency, type) {
        if (this._disposed)
            return;
        if (this._pitchesOnly) {
            this._fire('pitch'+type, {ui: this, pitch: mu.Pitch.fromFrequency(frequency)});
        } else {
            this._fire('frequency'+type, {ui: this, frequency: frequency});
        }
    };
    mu.ui.Waveform.prototype._onMouseMove = function(event) {
        if (this._disposed)
            return;
        var w = mu.ui.Waveform._WIDTH;
        var tW = mu.ui.Waveform._TICK_WIDTH;
        w -= tW / 2;
        var wS = mu.ui.Waveform._WAVE_STEPS;
        var rect = this._svg.node().getBoundingClientRect();
        var x = Math.max(event.clientX - rect.left, wS);
        var freq = mu.Frequency(w * this._lowFreq.hertz() / x);
        if (this._freqOver && Math.abs(this._freqOver.hertz() - freq.hertz()) <= 0.0001)
            return;
        if (this._mouseDown)
            this._onEvent(this._freqOver, 'release');
        this._freqOver = freq;
        if (this._mouseDown)
            this._onEvent(this._freqOver, 'press');
    };
    mu.ui.Waveform.prototype._onMouseDown = function(event) {
        if (this._disposed)
            return;
        event.preventDefault();
        this._mouseDown = true;
        if (this._shiftDown && this._isPlaying(this._freqOver)) {
            this._onEvent(this._freqOver, 'release');
        } else {
            this._onEvent(this._freqOver, 'press');
        }
        var onMouseUpListener;
        function onMouseUp(event) {
            if (this._disposed)
                return;
            this._mouseDown = false;
            if (!this._shiftDown)
                this._onEvent(this._freqOver, 'release');
        };
        onMouseUpListener = onMouseUp.bind(this);
        window.addEventListener('mouseup', onMouseUpListener);
    };
    mu.ui.Waveform.prototype.startFrequency = function(frequency) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        var hertz = frequency.hertz();
        this._freqsPlaying[hertz] = frequency;
        this._update();
    };
    mu.ui.Waveform.prototype.stopFrequency = function(frequency) {
        mu._assert(frequency instanceof mu.Frequency,
                   'invalid frequency ' + frequency);
        var hertz = frequency.hertz();
        delete this._freqsPlaying[hertz];
        this._update();
    };
    mu.ui.Waveform.prototype.startPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        this.startFrequency(pitch.frequency());
    };
    mu.ui.Waveform.prototype.stopPitch = function(pitch) {
        mu._assert(pitch instanceof mu.Pitch,
                   'invalid pitch ' + pitch);
        this.stopFrequency(pitch.frequency());
    };
    mu.ui.Waveform.prototype._stopAll = function() {
        mu._mapForEach(this._freqsPlaying, function(freq, x) {
            this._onEvent(freq, 'release');
        }, this);
    };
    mu.ui.Waveform.prototype.dispose = function() {
        document.removeEventListener('focusout', this._onFocusOutListener);
        window.removeEventListener('blur', this._onBlurListener);
        mu.ui.UI.prototype.dispose.call(this);
        this._disposed = true;
    };
    mu.ui.Waveform.prototype.node = function() {
        return this._svg;
    };

    /**
     * A chord progression UI.
     *
     * @class
     * @extends mu.ui.UI
     * @memberof mu
     */
    mu.ui.ChordLine = function(width, prog) {
        if (!(this instanceof mu.ui.ChordLine))
            return new mu.ui.ChordLine(width, prog);
        mu._assert(width == null || (mu._isFinite(width) && width > 0),
                   'invalid width ' + width);
        mu._assert(prog == null || (prog instanceof mu.seq.SimpleChordProgression),
                   'invalid chord progression ' + prog);
        mu.ui.UI.call(this);
        this._prog = prog;
        this._width = width || 800;

        var lW = mu.ui.ChordLine._LINE_WIDTH;
        var h = mu.ui.ChordLine._HEIGHT;

        this._svg = mu._html('svg')
            .attr('width', this._width)
            .attr('height', h)
            .classed('mu_chordline', true);
        this._svg.append('line')
            .attr('x1', lW / 2)
            .attr('y1', h / 2)
            .attr('x2', this._width - lW / 2)
            .attr('y2', h / 2)
            .classed('mu_chordline_base', true)
            .attr('stroke-width', lW);
        this._chordGroup = this._svg.append('g');
        this._tickGroup = this._svg.append('g');
        this._cursorGroup = this._svg.append('g');
        this._update();
    };
    mu.ui.ChordLine._HEIGHT = 50;
    mu.ui.ChordLine._LINE_WIDTH = 4;
    mu.ui.ChordLine._MINORTICK_HEIGHT = 20;
    mu.ui.ChordLine._MINORTICK_WIDTH = 2;
    mu.ui.ChordLine._CHORD_HEIGHT = 40;
    mu.ui.ChordLine._CHORD_ROUND = 4;
    mu.ui.ChordLine._CHORD_BORDER = 0;
    mu.ui.ChordLine._CHORD_FONT_SIZE = 16;
    mu.ui.ChordLine._CURSOR_WIDTH = 3;
    mu.ui.ChordLine.prototype._update = function() {
        this._tickGroup.clear();
        this._chordGroup.clear();
        if (this._prog) {
            var lW = mu.ui.ChordLine._LINE_WIDTH;
            var h = mu.ui.ChordLine._HEIGHT;
            var cH = mu.ui.ChordLine._CHORD_HEIGHT;
            var cR = mu.ui.ChordLine._CHORD_ROUND;
            var cB = mu.ui.ChordLine._CHORD_BORDER;
            var t1H = mu.ui.ChordLine._MINORTICK_HEIGHT;
            var t1W = mu.ui.ChordLine._MINORTICK_WIDTH;
            var cFS = mu.ui.ChordLine._CHORD_FONT_SIZE;
            var lL = this._width - lW;

            var dur = this._prog.duration();
            for (var i = 0; i <= dur; i ++) {
                var x = lL * i / dur;
                this._tickGroup.append('line')
                    .attr('x1', lW / 2 + x)
                    .attr('y1', (h - t1H + t1W) / 2)
                    .attr('x2', lW / 2 + x)
                    .attr('y2', (h + t1H - t1W) / 2)
                    .classed('mu_chordline_minortick', true)
                    .attr('stroke-width', t1W);
            }
            var at = 0;
            while (true) {
                var start = this._prog.nextChange(at);
                if (!start)
                    break;
                var end = this._prog.nextChange(start.time, true);
                at = end.time;
                if (!start.chord)
                    continue;
                mu._assert(end,
                           'missing last change');
                var x1 = lL * start.time / dur;
                var x2 = lL * end.time / dur;
                var rect = this._chordGroup.append('rect')
                    .attr('x', lW / 2 + x1)
                    .attr('y', (h - cH + cB) / 2)
                    .attr('width', x2 - x1)
                    .attr('height', cH - cB)
                    .attr('rx', cR)
                    .attr('ry', cR)
                    .classed('mu_chordline_chord', true)
                    .attr('stroke-width', cB);
                var analyses = start.chord.analyze();
                var analysis = analyses.length > 0 ? analyses[0] : null;
                if (analysis) {
                    rect.attr('fill', mu.ui.pitchClassColor(analysis.root()))
                        .attr('stroke', mu.ui.pitchClassColor(analysis.root(), 0.5, 0.5));
                } else {
                    rect.attr('fill', 'hsl(0, 0%, 85%)')
                        .attr('stroke', 'hsl(0, 0%, 50%)');
                }
                var text = start.chord.abbr();
                if (!text)
                    text = start.chord.pitches().map(function(pitch) {
                        return pitch.pitchClass().toString();
                    }).join(' ');
                this._chordGroup.append('text')
                    .attr('x', lW / 2 + x1 + cB + 3)
                    .attr('y', h / 2)
                    .attr('dy', '0.4em')
                    .attr('font-size', cFS)
                    .classed('mu_chordline_chord_label', true)
                    .text(text);
            }
        }
    };
    mu.ui.ChordLine.prototype.node = function() {
        return this._svg.node();
    };
    /**
     * Returns the chord progression loaded into this chord line.
     *
     * @return {mu.seq.SimpleChordProgression} The chord progression loaded
     * into this chord line
     * @memberof mu.ui.ChordLine
     */
    mu.ui.ChordLine.prototype.chordProgression = function() {
        return this._prog;
    };
    /**
     * Loads a chord progression into this chord line.
     *
     * @param {mu.seq.SimpleChordProgression} prog The chord progression
     * to load into this chord line
     * @memberof mu.ui.ChordLine
     */
    mu.ui.ChordLine.prototype.setChordProgression = function(prog) {
        mu._assert(prog instanceof mu.seq.SimpleChordProgression,
                   'invalid chord progression ' + prog);
        this._prog = prog;
        this._update();
    };
    /**
     * Moves the cursor line to the specified location.
     *
     * @param {number} time The time position, in beats
     * @memberof mu.ui.ChordLine
     */
    mu.ui.ChordLine.prototype.setCursor = function(time) {
        this._cursorGroup.clear();
        if (time != null) {
            var lW = mu.ui.ChordLine._LINE_WIDTH;
            var h = mu.ui.ChordLine._HEIGHT;
            var aW = mu.ui.ChordLine._CURSOR_WIDTH;
            var lL = this._width - lW;
            var dur = this._prog.duration();
            var x = lL * time / dur;
            this._cursorGroup.append('line')
                .attr('x1', lW / 2 + x)
                .attr('y1', 0 - aW / 2)
                .attr('x2', lW / 2 + x)
                .attr('y2', h - aW / 2)
                .classed('mu_chordline_cursor', true)
                .attr('stroke-width', aW);
        }
    };

    /**
     * A key selector/identifier using a circle of fifths diagram.
     *
     * @class
     * @memberof mu
     */
    mu.ui.KeyCircle = function() {
        if (!(this instanceof mu.ui.KeyCircle))
            return new mu.ui.KeyCircle();

        var oR = mu.ui.KeyCircle._OUTER_RADIUS;
        var iR = mu.ui.KeyCircle._INNER_RADIUS;
        var lW = mu.ui.KeyCircle._LINE_WIDTH;
        var dR = mu.ui.KeyCircle._DOT_RADIUS;
        var tS = mu.ui.KeyCircle._FONT_SIZE;
        var tG = mu.ui.KeyCircle._TEXT_GAP;

        var rr = Math.max(dR, lW / 2) + tG;
        var cx = (oR * 11 / 15 + iR * 4 / 15) + rr + tS / 2;
        var cy = (oR * 0.5 + iR * 0.5) + rr + tS / 2;
        var w = cx + (oR * 4 / 15 + iR * 11 / 15) + rr + tS / 2;
        var h = cy + oR + rr + tS / 2;

        this._svg = mu._html('svg')
            .attr('width', w)
            .attr('height', h)
            .classed('mu_keycircle', true);
        var line = this._svg.append('path');
        var linePath = [];
        for (var i = -7; i <= 7; i ++) {
            var r = oR * (7 - i) / 15 + iR * (i + 7) / 15;
            var a = i * Math.PI / 6;
            var deg = i * 180 / 6;
            var majorBase = mu.ui.KeyCircle._BASES[(i + 7) % 7];
            var minorBase = mu.ui.KeyCircle._BASES[(i + 10) % 7];
            var majorAccidental = Math.floor((i + 1) / 7);
            var minorAccidental = Math.floor((i + 4) / 7);
            var majorName = mu.NoteName(majorBase, majorAccidental ? mu.Accidental(majorAccidental) : null);
            var minorName = mu.NoteName(minorBase, minorAccidental ? mu.Accidental(minorAccidental) : null);
            var x = cx + Math.sin(a) * r;
            var y = cy - Math.cos(a) * r;
            if (!linePath.length) {
                linePath.push('M' + x.toFixed(1) + ' ' + y.toFixed(1));
            } else {
                linePath.push('A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + x.toFixed(1) + ' ' + y.toFixed(1));
            }
            linePath.push(linePath.length ? 'L' : 'M');
            linePath.push(x.toFixed(1) + ' ' + y.toFixed(1));
            this._svg.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', dR)
                .classed('mu_keycircle_dot', true);
            this._svg.append('text')
                .attr('x', cx)
                .attr('y', cy - r - rr)
                .attr('dy', '0.4em')
                .attr('text-anchor', 'middle')
                .attr('font-size', tS)
                .attr('transform', 'rotate(' + deg + ' ' + cx + ',' + cy + ')')
                .classed('mu_keycircle_label', true)
                .text(majorName.toString());
            this._svg.append('text')
                .attr('x', cx)
                .attr('y', cy - r + rr)
                .attr('dy', '0.4em')
                .attr('text-anchor', 'middle')
                .attr('font-size', tS)
                .attr('transform', 'rotate(' + deg + ' ' + cx + ',' + cy + ')')
                .classed('mu_keycircle_label', true)
                .text(minorName.toString().toLowerCase());
        }
        line.attr('d', linePath.join(''))
            .attr('stroke-width', lW)
            .classed('mu_keycircle_line', true);
    };
    mu.ui.KeyCircle._BASES = [mu.C, mu.G, mu.D, mu.A, mu.E, mu.B, mu.F];
    mu.ui.KeyCircle._INNER_RADIUS = 70;
    mu.ui.KeyCircle._OUTER_RADIUS = 130;
    mu.ui.KeyCircle._LINE_WIDTH = 3;
    mu.ui.KeyCircle._DOT_RADIUS = 4;
    mu.ui.KeyCircle._TEXT_GAP = 8;
    mu.ui.KeyCircle._FONT_SIZE = 14;
    mu.ui.KeyCircle.prototype.node = function() {
        return this._svg.node();
    };

    /**
     * A controller - connects one or more UIs to a voice.
     *
     * @class
     * @param {mu.audio.Voice} [voice] The voice to control
     * @implements mu.Eventable
     * @memberof mu
     */
    mu.ui.Controller = function(voice) {
        if (!(this instanceof mu.ui.Controller))
            return new mu.ui.Controller(voice);
        mu._assert(voice == null || voice instanceof mu.audio.Voice,
                   'invalid voice ' + voice);
        this._uis = [];
        this.setVoice(voice);
    };
    mu._eventable(mu.ui.Controller.prototype);
    mu.ui.Controller.prototype._onPitchPress = function(data) {
        if (this._voice && this._voice.canPlayPitch(data.pitch))
            this._voice.startPitch(data.pitch);
    };
    mu.ui.Controller.prototype._onPitchRelease = function(data) {
        if (this._voice && this._voice.canPlayPitch(data.pitch))
            this._voice.stopPitch(data.pitch);
    };
    mu.ui.Controller.prototype._onPitchStart = function(data) {
        this._uis.forEach(function(ui) {
            ui.startPitch(data.pitch);
        });
        this._fire('pitchstart', data);
    };
    mu.ui.Controller.prototype._onPitchStop = function(data) {
        this._uis.forEach(function(ui) {
            ui.stopPitch(data.pitch);
        });
        this._fire('pitchstop', data);
    };
    mu.ui.Controller.prototype._onFrequencyPress = function(data) {
        if (this._voice && this._voice.canPlayFrequency())
            this._voice.startFrequency(data.frequency);
    };
    mu.ui.Controller.prototype._onFrequencyRelease = function(data) {
        if (this._voice && this._voice.canPlayFrequency())
            this._voice.stopFrequency(data.frequency);
    };
    mu.ui.Controller.prototype._onFrequencyStart = function(data) {
        this._uis.forEach(function(ui) {
            ui.startFrequency(data.frequency);
        });
        this._fire('frequencystart', data);
    };
    mu.ui.Controller.prototype._onFrequencyStop = function(data) {
        this._uis.forEach(function(ui) {
            ui.stopFrequency(data.frequency);
        });
        this._fire('frequencystop', data);
    };
    /**
     * Returns a string description of the controller.
     *
     * @return {string} A string description of the controller
     * @memberof mu.ui.Controller
     */
    mu.ui.Controller.prototype.toString = function() {
        return 'controller';
    };
    /**
     * Gets the voice controlled by this controller
     *
     * @return {mu.audio.Voice|null} The voice controlled by this controller
     * @memberof mu.ui.Controller
     */
    mu.ui.Controller.prototype.voice = function() {
        return this._voice;
    };
    /**
     * Sets the voice to be controlled.
     *
     * @param {mu.audio.Voice} voice The voice to control
     * @memberof mu.ui.Controller
     */
    mu.ui.Controller.prototype.setVoice = function(voice) {
        mu._assert(voice == null || voice instanceof mu.audio.Voice,
                   'invalid voice ' + voice);
        if (this._disposed)
            return;
        if (this._voice == voice)
            return;
        if (this._voice)
            this._voice.silence();
        if (this._voice) {
            this._voice.removeEventListener('pitchstart', this._onPitchStart, this);
            this._voice.removeEventListener('pitchstop', this._onPitchStop, this);
            this._voice.removeEventListener('frequencystart', this._onFrequencyStart, this);
            this._voice.removeEventListener('frequencystop', this._onFrequencyStop, this);
        }
        this._voice = voice;
        if (this._voice) {
            this._uis.forEach(function(ui) {
                ui.setPitchesOnly(!this._voice.canPlayFrequency());
            }, this);
        }
        if (this._voice) {
            this._voice.addEventListener('pitchstart', this._onPitchStart, this);
            this._voice.addEventListener('pitchstop', this._onPitchStop, this);
            this._voice.addEventListener('frequencystart', this._onFrequencyStart, this);
            this._voice.addEventListener('frequencystop', this._onFrequencyStop, this);
        }
    };
    /**
     * Connectes a UI to this controller.
     *
     * @param {mu.ui.UI} ui The ui to connect
     * @memberof mu.ui.Controller
     */
    mu.ui.Controller.prototype.connectUI = function(ui) {
        mu._assert(ui instanceof mu.ui.UI,
                   'invalid ui ' + ui);
        if (this._disposed)
            return;
        for (var i = 0; i < this._uis.length; i ++) {
            if (this._uis === ui)
                return;
        }
        this._uis.push(ui);
        if (this._voice)
            ui.setPitchesOnly(!this._voice.canPlayFrequency());
        ui.addEventListener('pitchpress', this._onPitchPress, this);
        ui.addEventListener('pitchrelease', this._onPitchRelease, this);
        ui.addEventListener('frequencypress', this._onFrequencyPress, this);
        ui.addEventListener('frequencyrelease', this._onFrequencyRelease, this);
    };
    /**
     * Disconnectes a UI to this controller.
     *
     * @param {mu.ui.UI} ui The ui to disconnect
     * @memberof mu.ui.Controller
     */
    mu.ui.Controller.prototype.disconnectUI = function(ui) {
        mu._assert(ui instanceof mu.ui.UI,
                   'invalid ui ' + ui);
        if (this._disposed)
            return;
        for (var i = 0; i < this._uis.length; i ++) {
            if (this._uis === ui) {
                this.uis.splice(i, 1);
                break;
            }
        }
        if (i == this._uis.length)
            return;
        ui.removeEventListener('pitchpress', this._onPitchPress, this);
        ui.removeEventListener('pitchrelease', this._onPitchRelease, this);
        ui.removeEventListener('frequencypress', this._onFrequencyPress, this);
        ui.removeEventListener('frequencyrelease', this._onFrequencyRelease, this);
    };
    mu.ui.Controller.prototype.dispose = function() {
        _.each(this._uis, this.disconnectUI, this);
        this.setVoice(null);
        this._disposed = true;
    };
    
})();
