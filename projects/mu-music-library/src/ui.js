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

    /**
     * An event indicating that the user has pressed a pitch in a UI.
     *
     * @event pitchpress
     * @property {mu.UI} ui The UI where the action took place
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.UI
     */

    /**
     * An event indicating that the user has released a pitch in a UI.
     *
     * @event pitchrelease
     * @property {mu.UI} ui The UI where the action took place
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.UI
     */

    /**
     * An event indicating that the mouse has entered a pitch in a UI.
     *
     * @event pitchenter
     * @property {mu.UI} ui The UI where the mouse is hovering
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.UI
     */

    /**
     * An event indicating that the mouse has left a pitch in a UI.
     *
     * @event pitchleave
     * @property {mu.UI} ui The UI where the mouse is hovering
     * @property {mu.Pitch} pitch The pitch
     * @memberof mu.UI
     */

    /**
     * An interface for a mu UI.
     *
     * @interface
     * @implements mu.Eventable
     * @memberof mu
     */
    mu.UI = function() {
        if (!(this instanceof mu.UI))
            return new mu.UI();
    };
    mu._eventable(mu.UI.prototype);
    /**
     * Returns a string description of the UI.
     *
     * @return {string} A string description of the voice
     * @memberof mu.UI
     */
    mu.UI.prototype.toString = function() {
        return 'unknown ui';
    };
    /**
     * Closes any resources used by this UI.
     *
     * @memberof mu.UI
     */
    mu.UI.prototype.dispose = function() {
    };
    /**
     * Returns the Element for this UI.
     *
     * @return {Element} The Element for this UI
     * @memberof mu.UI
     */
    mu.UI.prototype.node = function() {
        throw new Error('unimplemented');
    };
    /**
     * Updates the UI to show that a pitch has started.
     *
     * @param {mu.Pitch} pitch The pitch
     * @memberof mu.UI
     */
    mu.UI.prototype.startPitch = function(pitch) {
    };
    /**
     * Updates the UI to show that a pitch has stopped.
     *
     * @param {mu.Pitch} pitch The pitch
     * @memberof mu.UI
     */
    mu.UI.prototype.stopPitch = function(pitch) {
    };

    /**
     * A keyboard UI.
     *
     * @class
     * @extends mu.UI
     * @memberof mu
     */
    mu.Keyboard = function(lowPitch, highPitch) {
        if (!(this instanceof mu.Keyboard))
            return new mu.Keyboard(lowPitch, highPitch);
        mu._assert(lowPitch == null || lowPitch instanceof mu.Pitch,
                   'invalid low pitch ' + lowPitch);
        mu._assert(highPitch == null || highPitch instanceof mu.Pitch,
                   'invalid high pitch ' + highPitch);
        lowPitch = lowPitch || mu.C_1;
        highPitch = highPitch || mu.C_8;
        mu._assert(highPitch.subtract(lowPitch) >= 0,
                   'pitches swapped ' + lowPitch + ' ' + highPitch);
        mu.UI.call(this);
        this._lowPitch = lowPitch;
        this._highPitch = highPitch;
        this._pitches = {};
        this._pitchesPlaying = {};
        this._pitchOver = null;

        var lowWhite = mu.Keyboard._isBlack(lowPitch) ? lowPitch.transpose(-1) : lowPitch;
        var highWhite = mu.Keyboard._isBlack(highPitch) ? highPitch.transpose(1) : highPitch;
        var lowWhiteIndex = mu.Keyboard._whiteIndex(lowWhite);
        var highWhiteIndex = mu.Keyboard._whiteIndex(highWhite);
        var lowOctave = lowWhite.octave();
        var highOctave = highWhite.octave();
        var span = (highOctave - lowOctave) * 7 + highWhiteIndex - lowWhiteIndex + 1;
        var wW = mu.Keyboard._WHITE_WIDTH;
        var wL = mu.Keyboard._WHITE_LENGTH;
        var wB = mu.Keyboard._WHITE_BORDER;
        var wR = mu.Keyboard._WHITE_ROUND;
        var cS = mu.Keyboard._MIDDLE_C_MARK_SIZE;

        this._onKeyDownListener = this._onKeyDown.bind(this);
        document.addEventListener('keydown', this._onKeyDownListener);
        this._onKeyUpListener = this._onKeyUp.bind(this);
        document.addEventListener('keyup', this._onKeyUpListener);
        this._onFocusOutListener = this.stopAll.bind(this);
        document.addEventListener('focusout', this._onFocusOutListener);
        this._onBlurListener = this.stopAll.bind(this);
        window.addEventListener('blur', this._onBlurListener);

        this._svg = mu._html('svg')
            .attr('width', span * (wW + wB) + wB)
            .attr('height', wL + wB * 2);

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

        var bW = mu.Keyboard._BLACK_WIDTH;
        var bL = mu.Keyboard._BLACK_LENGTH;
        var bB = mu.Keyboard._BLACK_BORDER;
        var bR = mu.Keyboard._BLACK_ROUND;
        var bA = mu.Keyboard._BLACK_ADJUST;

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
    mu.Keyboard.prototype = Object.create(mu.UI.prototype);
    mu.Keyboard.prototype.constructor = mu.Keyboard;
    mu.Keyboard._INCH = 21;
    mu.Keyboard._WHITE_WIDTH = mu.Keyboard._INCH * 0.848;
    mu.Keyboard._WHITE_BORDER = mu.Keyboard._WHITE_WIDTH * 0.074;
    mu.Keyboard._WHITE_LENGTH = mu.Keyboard._WHITE_WIDTH * 6.486;
    mu.Keyboard._WHITE_ROUND = mu.Keyboard._WHITE_WIDTH * 0.25;
    mu.Keyboard._BLACK_WIDTH = mu.Keyboard._WHITE_WIDTH * 0.515;
    mu.Keyboard._BLACK_BORDER = mu.Keyboard._WHITE_BORDER;
    mu.Keyboard._BLACK_LENGTH = mu.Keyboard._WHITE_LENGTH * 0.659;
    mu.Keyboard._BLACK_ADJUST = mu.Keyboard._BLACK_WIDTH * 0.18;
    mu.Keyboard._BLACK_ROUND = mu.Keyboard._BLACK_WIDTH * 0.3;
    mu.Keyboard._MIDDLE_C_MARK_SIZE = mu.Keyboard._WHITE_WIDTH * 0.5;
    mu.Keyboard._isBlack = function(pitch) {
        var i = pitch.pitchClass().index();
        return i == 1 || i == 3 || i == 6 || i == 8 || i == 10;
    };
    mu.Keyboard._whiteIndex = function(pitch) {
        return [0, -1, 1, -1, 2, 3, -1, 4, -1, 5, -1, 6][pitch.pitchClass().index()];
    };
    mu.Keyboard.prototype._isPlaying = function(pitch) {
        var num = pitch.toNum();
        return num in this._pitchesPlaying;
    };
    mu.Keyboard.prototype._onKeyDown = function(event) {
        var key = event.key || event.keyIdentifier;
        if (key == 'Shift')
            this._shiftDown = true;
    };
    mu.Keyboard.prototype._onKeyUp = function(event) {
        var key = event.key || event.keyIdentifier;
        if (key == 'Shift') {
            this._shiftDown = false;
            this.stopAll();
        }
    };
    mu.Keyboard.prototype._onMouseOver = function(pitch, event) {
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
    mu.Keyboard.prototype._onMouseOut = function(pitch, event) {
        if (this._disposed)
            return;
        delete this._pitchOver;
        if (this._mouseDown && this._dragPress && !this._shiftDown)
            this._fire('pitchrelease', {ui: this, pitch: pitch});
        this._pitches[pitch.toNum()].classed('mu_keyboard_hover', false);
        this._fire('pitchleave', {ui: this, pitch: pitch});
    };
    mu.Keyboard.prototype._onMouseDown = function(pitch, event) {
        if (this._disposed)
            return;
        event.preventDefault();
        this._mouseDown = true;
        if (this._shiftDown && this._isPlaying(pitch)) {
            this._dragPress = false;
            this._fire('pitchrelease', {ui: this, pitch: pitch});
            return;
        }
        this._dragPress = true;
        this._fire('pitchpress', {ui: this, pitch: pitch});
        var onMouseUpListener;
        function onMouseUp(event) {
            window.removeEventListener('mouseup', onMouseUpListener);
            this._mouseDown = false;
            delete this._dragPress;
            if (!this._shiftDown)
                this._fire('pitchrelease', {ui: this, pitch: this._pitchOver || pitch});
        };
        onMouseUpListener = onMouseUp.bind(this);
        window.addEventListener('mouseup', onMouseUpListener);
    };
    mu.Keyboard.prototype.startPitch = function(pitch) {
        this._pitchesPlaying[pitch.toNum()] = true;
        this._pitches[pitch.toNum()].classed('mu_keyboard_playing', true);
    };
    mu.Keyboard.prototype.stopPitch = function(pitch) {
        delete this._pitchesPlaying[pitch.toNum()];
        this._pitches[pitch.toNum()].classed('mu_keyboard_playing', false);
    };
    mu.Keyboard.prototype.stopAll = function() {
        mu._mapForEach(this._pitchesPlaying, function(x, num) {
            var pitch = mu.Pitch.fromNum(num);
            this._fire('pitchrelease', {ui: this, pitch: pitch});
        }, this);
    };
    mu.Keyboard.prototype.dispose = function() {
        document.removeEventListener('keydown', this._onKeyDownListener);
        document.removeEventListener('keydown', this._onKeyUpListener);
        mu.UI.prototype.dispose.call(this);
        this._disposed = true;
    };
    mu.Keyboard.prototype.node = function() {
        return this._svg.node();
    };

    /**
     * A pitch constellation UI.
     *
     * @class
     * @extends mu.UI
     * @memberof mu
     */
    mu.PitchConstellation = function(root, lowPitch, highPitch) {
        if (!(this instanceof mu.PitchConstellation))
            return new mu.PitchConstellation(root, lowPitch, highPitch);
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
        mu.UI.call(this);
        this._root = root;
        this._lowPitch = lowPitch;
        this._highPitch = highPitch;
        this._lines = [];
        this._labels = [];
        this._pitchesPlaying = {};

        var r = mu.PitchConstellation._RADIUS;
        var tF = mu.PitchConstellation._FONT_FAMILY;
        var tS = mu.PitchConstellation._FONT_SIZE;
        var tH = tS;
        var rT = r - 2*tH;
        var rI = rT - mu.PitchConstellation._TEXT_GAP;

        this._svg = mu._html('svg')
            .attr('width', 2*r)
            .attr('height', 2*r)
            .on('mousemove', this._onMouseMove, this)
            .on('mousedown', this._onMouseDown, this)
            .on('mouseup', this._onMouseUp, this);

        for (var i = 0; i < 12; i ++) {
            var pitchClass = this._root.transpose(i);
            var strings = pitchClass.toStrings();
            var deg = i * 180 / 6;
            var rad = i * Math.PI / 6;
            this._svg.append('line')
                .attr('x1', r)
                .attr('y1', r)
                .attr('x2', r + rI * Math.sin(rad))
                .attr('y2', r - rI * Math.cos(rad))
                .classed('mu_pitchconstellation_ray', true);
            strings.forEach(function(str, line) {
                this._svg.append('text')
                    .attr('x', r)
                    .attr('y', r - rT - tH * (strings.length - line - 1))
                    .attr('text-anchor', 'middle')
                    .attr('font-family', tF)
                    .attr('font-size', tS)
                    .attr('transform', 'rotate(' + deg + ' ' + r + ',' + r + ')')
                    .node().innerHTML = str;
            }, this);
        }
        /*
        this._svg.append('circle')
            .attr('cx', r)
            .attr('cy', r)
            .attr('r', 4)
            .classed('mu_pitchconstellation_center', true);
        */
    };
    mu.PitchConstellation.prototype = Object.create(mu.UI.prototype);
    mu.PitchConstellation.prototype.constructor = mu.PitchConstellation;
    mu.PitchConstellation._RADIUS = 80;
    mu.PitchConstellation._TEXT_GAP = 4;
    mu.PitchConstellation._FONT_FAMILY = 'Verdana';
    mu.PitchConstellation._FONT_SIZE = 13;
    mu.PitchConstellation.prototype.node = function() {
        return this._svg.node();
    };
    mu.PitchConstellation.prototype._onPitchEvent = function(pitchClass, type) {
        if (this._disposed)
            return;
        var hnum = this._highPitch.toNum();
        for (var num = this._lowPitch.toNum(); num <= hnum; num ++) {
            var pitch = mu.Pitch.fromNum(num);
            if (pitch.pitchClass().equals(pitchClass))
                this._fire(type, {ui: this, pitch: pitch});
        }
    };
    mu.PitchConstellation.prototype._onMouseMove = function(event) {
        if (this._disposed)
            return;
        var rect = this._svg.node().getBoundingClientRect();
        var r = mu.PitchConstellation._RADIUS;
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
        if (this._mouseDown)
            this._onPitchEvent(this._pitchClassOver, 'pitchrelease');
        this._pitchClassOver = mu.PitchClass(a);
        if (this._mouseDown)
            this._onPitchEvent(this._pitchClassOver, 'pitchpress');
    };
    mu.PitchConstellation.prototype._onMouseUp = function(event) {
        if (this._disposed)
            return;
        this._mouseDown = false;
        this._onPitchEvent(this._pitchClassOver, 'pitchrelease');
    };
    mu.PitchConstellation.prototype._onMouseDown = function(event) {
        if (this._disposed)
            return;
        event.preventDefault();
        this._mouseDown = true;
        this._onPitchEvent(this._pitchClassOver, 'pitchpress');
    };

    /**
     * A controller - connects one or more UIs to a voice.
     *
     * @class
     * @param {mu.Voice} [voice] The voice to control
     * @implements mu.Eventable
     * @memberof mu
     */
    mu.Controller = function(voice) {
        if (!(this instanceof mu.Controller))
            return new mu.Controller(voice);
        mu._assert(voice == null || voice instanceof mu.Voice,
                   'invalid voice ' + voice);
        this.setVoice(voice);
        this._uis = [];
    };
    mu.Controller.prototype._onPitchPress = function(data) {
        if (this._voice && this._voice.canPlayPitch(data.pitch))
            this._voice.startPitch(data.pitch);
    };
    mu.Controller.prototype._onPitchRelease = function(data) {
        if (this._voice && this._voice.canPlayPitch(data.pitch))
            this._voice.stopPitch(data.pitch);
    };
    mu.Controller.prototype._onPitchStart = function(data) {
        this._uis.forEach(function(ui) {
            ui.startPitch(data.pitch);
        });
    };
    mu.Controller.prototype._onPitchStop = function(data) {
        this._uis.forEach(function(ui) {
            ui.stopPitch(data.pitch);
        });
    };
    /**
     * Returns a string description of the controller.
     *
     * @return {string} A string description of the controller
     * @memberof mu.Controller
     */
    mu.Controller.prototype.toString = function() {
        return 'controller';
    };
    /**
     * Gets the voice controlled by this controller
     *
     * @return {mu.Voice|null} The voice controlled by this controller
     * @memberof mu.Controller
     */
    mu.Controller.prototype.voice = function() {
        return this._voice;
    };
    /**
     * Sets the voice to be controlled.
     *
     * @param {mu.Voice} voice The voice to control
     * @memberof mu.Controller
     */
    mu.Controller.prototype.setVoice = function(voice) {
        mu._assert(voice == null || voice instanceof mu.Voice,
                   'invalid voice ' + voice);
        if (this._disposed)
            return;
        if (this._voice == voice)
            return;
        if (this._voice) {
            this._voice.removeEventListener('pitchstart', this._onPitchStart, this);
            this._voice.removeEventListener('pitchstop', this._onPitchStop, this);
        }
        this._voice = voice;
        if (this._voice) {
            this._voice.addEventListener('pitchstart', this._onPitchStart, this);
            this._voice.addEventListener('pitchstop', this._onPitchStop, this);
        }
    };
    /**
     * Connectes a UI to this controller.
     *
     * @param {mu.UI} ui The ui to connect
     * @memberof mu.Controller
     */
    mu.Controller.prototype.connectUI = function(ui) {
        mu._assert(ui instanceof mu.UI,
                   'invalid ui ' + ui);
        if (this._disposed)
            return;
        for (var i = 0; i < this._uis.length; i ++) {
            if (this._uis === ui)
                return;
        }
        this._uis.push(ui);
        ui.addEventListener('pitchpress', this._onPitchPress, this);
        ui.addEventListener('pitchrelease', this._onPitchRelease, this);
    };
    /**
     * Disconnectes a UI to this controller.
     *
     * @param {mu.UI} ui The ui to disconnect
     * @memberof mu.Controller
     */
    mu.Controller.prototype.disconnectUI = function(ui) {
        mu._assert(ui instanceof mu.UI,
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
    };
    mu.Controller.prototype.dispose = function() {
        _.each(this._uis, this.disconnectUI, this);
        this.setVoice(null);
        this._disposed = true;
    };
    
})();
