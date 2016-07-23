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
    mu.Keyboard = function(lowCOctave, highCOctave) {
        if (!(this instanceof mu.Keyboard))
            return new mu.Keyboard(lowCOctave, highCOctave);
        mu._assert(lowCOctave == null || mu._isInteger(lowCOctave) && lowCOctave >= 0,
                   'invalid octave ' + lowCOctave);
        mu._assert(highCOctave == null || mu._isInteger(highCOctave) && highCOctave >= 0,
                   'invalid octave ' + highCOctave);
        lowCOctave = lowCOctave || 1;
        highCOctave = highCOctave || 8;
        this._lowCOctave = lowCOctave;
        this._highCOctave = highCOctave;
        var octFC = this._fullOctaves();
        var wW = mu.Keyboard._WHITE_WIDTH;
        var wL = mu.Keyboard._WHITE_LENGTH;
        var wB = mu.Keyboard._WHITE_BORDER;
        var wR = mu.Keyboard._WHITE_ROUND;
        this._svg = mu._html('svg')
            .attr('width', (octFC * 7 + 1) * (wW + wB) + wB)
            .attr('height', wL + wB * 2);
        var white_indices = [0, 2, 4, 5, 7, 9, 11];
        for (var o = 0; o < octFC + 1; o ++) {
            for (var i = 0; i < 7 && o < octFC || i < 1; i ++) {
                var pitch = mu.Pitch(o + this._lowCOctave, white_indices[i]);
                var rect = this._svg.append('rect')
                    .attr('x', (o * 7 + i) * (wW + wB) + wB/2)
                    .attr('y', wB/2)
                    .attr('width', wW + wB)
                    .attr('height', wL + wB)
                    .attr('rx', wR)
                    .attr('ry', wR)
                    .attr('class', 'mu_keyboard_white')
                    .attr('fill', 'white')
                    .attr('stroke', 'black');
                rect.on('mouseover', this._onMouseOver(rect, pitch, false), this)
                    .on('mouseout', this._onMouseOut(rect, pitch, false), this)
                    .on('mousedown', this._onMouseDown(rect, pitch), this)
                    .on('mouseup', this._onMouseUp(rect, pitch), this);
            }
        }
        var bW = mu.Keyboard._BLACK_WIDTH;
        var bL = mu.Keyboard._BLACK_LENGTH;
        var bB = mu.Keyboard._BLACK_BORDER;
        var bR = mu.Keyboard._BLACK_ROUND;
        var bA = mu.Keyboard._BLACK_ADJUST;
        var black_offsets = [1, 2, 4, 5, 6];
        var black_indices = [1, 3, 6, 8, 10];
        for (var o = 0; o < octFC; o ++) {
            for (var i = 0; i < 5; i ++) {
                var adj = 0;
                if (i == 0 || i == 2)
                    adj = -bA;
                else if (i == 1 || i == 4)
                    adj = bA;
                var pitch = mu.Pitch(o + this._lowCOctave, black_indices[i]);
                var rect = this._svg.append('rect')
                    .attr('x', (o * 7 + black_offsets[i]) * (wW + wB) + wB/2 - (bW + bB)/2 + adj)
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
    mu.Keyboard.prototype._fullOctaves = function() {
        return this._highCOctave - this._lowCOctave;
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
            self._fire('keymousedown', pitch);
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
