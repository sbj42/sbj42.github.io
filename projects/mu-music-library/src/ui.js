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
     * A keyboard UI.
     *
     * @class
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
        this._lowPitch = lowPitch;
        this._highPitch = highPitch;
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
        this._svg = mu._html('svg')
            .attr('width', span * (wW + wB) + wB)
            .attr('height', wL + wB * 2);
        var white_indices = [0, 2, 4, 5, 7, 9, 11];
        var x = -1;
        for (var o = lowOctave; o <= highOctave; o ++) {
            for (var i = 0; i < 7; i ++) {
                var pitch = mu.Pitch(o, white_indices[i]);
                if (pitch.subtract(lowWhite) < 0 || pitch.subtract(highWhite) > 0)
                    continue;
                x ++;
                if (pitch.subtract(lowPitch) < 0 || pitch.subtract(highPitch) > 0)
                    continue;
                var g = this._svg.append('g');
                var rect = g.append('rect')
                    .attr('x', x * (wW + wB) + wB/2)
                    .attr('y', wB/2)
                    .attr('width', wW + wB)
                    .attr('height', wL + wB)
                    .attr('rx', wR)
                    .attr('ry', wR)
                    .attr('class', 'mu_keyboard_white')
                    .attr('fill', 'white')
                    .attr('stroke', 'black');
                g.on('mouseover', this._onMouseOver(rect, pitch, false), this)
                    .on('mouseout', this._onMouseOut(rect, pitch, false), this)
                    .on('mousedown', this._onMouseDown(rect, pitch), this)
                    .on('mouseup', this._onMouseUp(rect, pitch), this);
                if (o == 4 && i == 0) {
                    g.append('circle')
                        .attr('cx', x * (wW + wB) + wB + wW / 2)
                        .attr('cy', wB/2 + wL - cS)
                        .attr('r', cS / 2)
                        .attr('fill', '#ccc')
                        .attr('stroke', 'none');
                }
            }
        }
        var bW = mu.Keyboard._BLACK_WIDTH;
        var bL = mu.Keyboard._BLACK_LENGTH;
        var bB = mu.Keyboard._BLACK_BORDER;
        var bR = mu.Keyboard._BLACK_ROUND;
        var bA = mu.Keyboard._BLACK_ADJUST;
        x = -1;
        for (var o = lowOctave; o <= highOctave; o ++) {
            for (var i = 0; i < 7; i ++) {
                var whitePitch = mu.Pitch(o, white_indices[i]);
                if (whitePitch.subtract(lowWhite) < 0 || whitePitch.subtract(highWhite) > 0)
                    continue;
                x ++;
                if (i == 2 || i == 6)
                    continue;
                var pitch = whitePitch.transpose(1);
                if (pitch.subtract(lowPitch) < 0 || pitch.subtract(highPitch) > 0)
                    continue;
                var adj = 0;
                if (i == 0 || i == 3)
                    adj = -bA;
                else if (i == 1 || i == 5)
                    adj = bA;
                var rect = this._svg.append('rect')
                    .attr('x', (x + 1) * (wW + wB) + wB/2 - (bW + bB)/2 + adj)
                    .attr('y', bB/2)
                    .attr('width', bW + bB)
                    .attr('height', bL + bB)
                    .attr('rx', bR)
                    .attr('ry', bR)
                    .attr('class', 'mu_keyboard_black')
                    .attr('fill', 'black')
                    .attr('stroke', 'black');
                rect.on('mouseover', this._onMouseOver(rect, pitch, true), this)
                    .on('mouseout', this._onMouseOut(rect, pitch, true), this)
                    .on('mousedown', this._onMouseDown(rect, pitch), this)
                    .on('mouseup', this._onMouseUp(rect, pitch), this);
            }
        }
    };
    mu._eventable(mu.Keyboard);
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
        var i = pitch.index();
        return i == 1 || i == 3 || i == 6 || i == 8 || i == 10;
    };
    mu.Keyboard._whiteIndex = function(pitch) {
        return [0, -1, 1, -1, 2, 3, -1, 4, -1, 5, -1, 6][pitch.index()];
    };
    mu.Keyboard.prototype._onMouseOver = function(rect, pitch, black) {
        var self = this;
        return function(event) {
            rect.attr('fill', black ? '#ff8' : '#ff8');
            self._fire('keymouseover', pitch);
        };
    };
    mu.Keyboard.prototype._onMouseOut = function(rect, pitch, black) {
        var self = this;
        return function(event) {
            rect.attr('fill', black ? 'black' : 'white');
            self._fire('keymouseout', pitch);
        };
    };
    mu.Keyboard.prototype._onMouseDown = function(rect, pitch) {
        var self = this;
        return function(event) {
            event.preventDefault();
            self._fire('keydown', pitch);
            function onMouseUpListener(event) {
                window.removeEventListener('mouseup', onMouseUpListener);
                self._fire('keyup', pitch);
            };
            window.addEventListener('mouseup', onMouseUpListener);
        };
    };
    mu.Keyboard.prototype._onMouseUp = function(rect, pitch) {
        var self = this;
        return function(event) {
            self._fire('keymouseup', pitch);
        };
    };
    /**
     * Returns the Element for this UI.
     *
     * @return {Element} The Element for this UI
     * @memberof mu
     */
    mu.Keyboard.prototype.node = function() {
        return this._svg.node();
    };
    
})();
