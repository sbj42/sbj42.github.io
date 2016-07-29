/**
 * @file mu sequence library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    if (!mu)
        throw Error('missing mu util library');
    if (!mu.Pitch)
        throw Error('missing mu theory library');

    /**
     * A simple musical sequence composed of chords and rests, with no
     * other events.
     *
     * @class
     * @param {mu.Tempo} tempo The tempo of the sequence
     * @memberof mu
     */
    mu.SimpleChordProgression = function(tempo) {
        if (!(this instanceof mu.SimpleChordProgression))
            return new mu.SimpleChordProgression(tempo);
        mu._assert(tempo == null || tempo instanceof mu.Tempo,
                   'invalid tempo ' + tempo);
        this._tempo = tempo || mu.Tempo(120);
        this._events = [];
        this._length = 0;
    };

    // mu.SimpleChordProgression.prototype._cutAt = function(i, time, duration) {
    //     var end = time + duration;
    //     var event = this._events[i];
    //     if (event.time < time && event.time + event.duration > end) {
    //         this._events.splice(i + 1, 0, {
    //             time: end,
    //             duration: event.time + event.duration - end,
    //             chord: event.chord
    //         });
    //         event.duration = time - event.time;
    //     } else if (event.time < time && event.time + event.duration > time)
    //         event.duration = time - event.time;
    //     else if (event.time < end && event.time + event.duration > end) {
    //         event.duration = event.time + event.duration - end;
    //         event.time = end;
    //     } else if (event.time <= end && event.time + event.duration >= time) {
    //         this._events.splice(i, 1);
    //         i --;
    //     }
    //     return i;
    // };
    // mu.SimpleChordProgression.prototype._set = function(time, chord, duration) {
    //     mu._assert(_.isFinite(time) && time >= 0
    //                'invalid time ' + time);
    //     mu._assert(_.isFinite(duration) && duration > 0
    //                'invalid duration ' + duration);
    //     mu._assert(chord == null || chord instanceof mu.Chord,
    //                'invalid chord ' + chord);
    //     var end = time + duration;
    //     for (var i = 0; i < this._events.length; i ++) {
    //         var event = this._events[i];
    //         if (event.time > end) {
    //             if (chord)
    //                 this._events.splice(i, 0, {
    //                     time: time,
    //                     duration: duration,
    //                     chord: chord
    //                 });
    //             if (end > this._length)
    //                 this._length = end;
    //             break;
    //         } else
    //             i = this._cutAt(i, time, duration);
    //     }
    // };

    /**
     * Returns the tempo of this progression.
     *
     * @return {mu.Tempo} The tempo of this progression
     * @memberof mu.SimpleChordProgression
     */
    mu.SimpleChordProgression.prototype.tempo = function() {
        return this._tempo;
    };

    /**
     * Returns the overall duration of this progression, in beats.
     *
     * @return {number} The overall duration of this progression, in beats
     * @memberof mu.SimpleChordProgression
     */
    mu.SimpleChordProgression.prototype.duration = function() {
        return this._length;
    };

    /**
     * @typedef {object} SimpleChordProgressionChange
     * @property {number} time The time of the change, in beats
     * @property {mu.Chord} [chord] The chord to play, at that time, if any

    /**
     * Returns the next change in this progression, at or after the
     * given `time`.
     *
     * @param {number} [time] The time to start looking for a change
     * @return {SimpleChordProgressionChange|null} The next change, or null
     * if the given time is at or after the end of the progression
     * @memberof mu.SimpleChordProgression
     */
    mu.SimpleChordProgression.prototype.nextChange = function(time) {
        mu._assert(time == null
                   || (mu._isFinite(time) && time >= 0),
                   'invalid time ' + time);
        if (time == null)
            time = 0;
        if (time >= this._length)
            return null;
        var nextTime = NaN;
        var nextChord = null;
        for (var i = 0; i < this._events.length; i ++) {
            var event = this._events[i];
            if (event.time >= time) {
                if (!(nextTime < event.time)) {
                    nextTime = event.time;
                    nextChord = event.chord;
                }
                break;
            } else if (event.time + event.duration >= time) {
                if (!(nextTime < event.time + event.duration))
                    nextTime = event.time + event.duration;
            }
        }
        return {
            time: nextTime,
            chord: nextChord
        };
    };

    /**
     * Describes this chord progression.
     *
     * @return {string} A description of this chord progression
     * @memberof mu.SimpleChordProgression
     */
    mu.SimpleChordProgression.prototype.toString = function() {
        var ret = 'simple chord progression (tempo=' + this._tempo + ' length=' + this._length + ' chords=' + this._events.length + ')';
    };

    // /**
    //  * Places a chord in the progression.
    //  *
    //  * @param {number} time The start time of the chord, in beats
    //  * @param {mu.Chord} chord The chord
    //  * @param {number} duration The duration of the chord, in beats
    //  * @memberof mu.SimpleChordProgression
    //  */
    // mu.SimpleChordProgression.prototype.setChord = function(time, chord, duration) {
    //     mu._assert(chord == null || chord instanceof mu.Chord,
    //                'invalid chord ' + chord);
    //     this._set(time, chord, duration);
    // };

    // /**
    //  * Places a rest in the progression.
    //  *
    //  * @param {number} time The start time of the rest, in beats
    //  * @param {number} duration The duration of the ret, in beats
    //  * @memberof mu.SimpleChordProgression
    //  */
    // mu.SimpleChordProgression.prototype.setRest = function(time, duration) {
    //     this._set(time, null, duration);
    // };

    /**
     * Adds a chord to the end of the progression.
     *
     * @param {mu.Chord} chord The chord
     * @param {number} duration The duration of the chord, in beats
     * @memberof mu.SimpleChordProgression
     */
    mu.SimpleChordProgression.prototype.addChord = function(chord, duration) {
        this._events.push({
            time: this._length,
            duration: duration,
            chord: chord
        });
        this._length += duration;
    };

    /**
     * Adds a rest to the end of the progression.
     *
     * @param {number} duration The duration of the rest, in beats
     * @memberof mu.SimpleChordProgression
     */
    mu.SimpleChordProgression.prototype.addRest = function(duration) {
        this._length += duration;
    };

    /**
     * A sequencer that tracks a position in a sequence and calls a provided
     * callback function when changes occur in the sequence.
     *
     * @class
     * @param {mu.Sequence} sequence The sequence to track
     * @param {Function} callback The change callback
     * @memberof mu
     */
    mu.Cursor = function(sequence, callback) {
        if (!(this instanceof mu.Cursor))
            return new mu.Cursor(sequence, callback);
        mu._assert(sequence != null && mu._isFunction(sequence.nextChange),
                   'invalid sequence ' + sequence);
        mu._assert(mu._isFunction(callback),
                   'invalid callback ' + callback);
        this._sequence = sequence;
        this._callback = callback;
        this._time = 0;
        this._playing = false;
    };
    mu.Cursor.prototype._next = function(change) {
        if (!this._playing)
            return;
        this._time = change.time;
        this._lastChange = change;
        this._callback(change);
        if (!this._continue(true)) {
            delete this._lastChange;
            this._pause();
        }
    };
    mu.Cursor.prototype._continue = function(next) {
        var change = this._sequence.nextChange(this._time + (next ? 1e-6 : 0));
        if (change == null)
            return false;
        this._timerBeats = change.time - this._time;
        this._timerNow = Date.now();
        var ms = 1000 * this._sequence.tempo().beatDuration() * this._timerBeats;
        this._timer = setTimeout(this._next.bind(this, change), ms);
        return true;
    };
    mu.Cursor.prototype._pause = function() {
        this._callback(null);
        this._playing = false;
        clearTimeout(this._timer);
        delete this._timer;
        delete this._timerNow;
        delete this._timerBeats;
    };

    /**
     * Returns true if the cursor is playing.
     *
     * @return {boolean} True if the cursor is playing
     * @memberof mu.Cursor
     */
    mu.Cursor.prototype.playing = function() {
        return this._playing;
    };

    /**
     * Returns the current position of the cursor, in beats.
     *
     * @return {number} The current position of the cursor, in beats
     * @memberof mu.Cursor
     */
    mu.Cursor.prototype.time = function() {
        if (!this._playing)
            return this._time;
        var delta = Date.now() - this._timerNow;
        var beats = Math.min(this._timerBeats, delta / (1000 * this._sequence.tempo().beatDuration()));
        return this._time + beats;
    };

    /**
     * Starts playing the cursor at its current position in the sequence.
     *
     * @return {boolean} True if the cursor has started playing (false
     * indicates that the cursor was already past the end of the sequence).
     * @memberof mu.Cursor
     */
    mu.Cursor.prototype.play = function() {
        if (this._playing)
            return true;
        if (this._lastChange)
            this._callback(this._lastChange);
        if (this._continue(false))
            this._playing = true;
        return this._playing;
    };

    /**
     * Pauses the cursor at its current position in the sequence.
     *
     * @memberof mu.Cursor
     */
    mu.Cursor.prototype.pause = function() {
        if (!this._playing)
            return;
        var delta = Date.now() - this._timerNow;
        var beats = Math.min(this._timerBeats, delta / (1000 * this._sequence.tempo().beatDuration()));
        this._time += beats;
        this._pause();
    };
    // mu.Cursor.prototype.seek = function(time) {
    //     var playing = this._playing;
    //     if (playing)
    //         this.pause();
    //     this._time = time;
    //     if (playing)
    //         this.play();
    // };


    // /**
    //  * Removes time from the progression.
    //  *
    //  * @param {number} time The start time to remove, in beats
    //  * @param {number} duration The duration of the time to remove, in beats
    //  * @memberof mu.SimpleChordProgression
    //  */
    // mu.SimpleChordProgression.prototype.removeTime = function(time, duration) {
    //     mu._assert(_.isFinite(time) && time > 0
    //                'invalid time ' + time);
    //     mu._assert(_.isFinite(duration) && duration > 0
    //                'invalid duration ' + duration);
    //     mu._assert(chord == null || chord instanceof mu.Chord,
    //                'invalid chord ' + chord);
    //     var end = time + duration;
    //     for (var i = 0; i < this._events.length; i ++) {
    //         var event = this._events
    //         if (event.time > end)
    //             event.time -= duration;
    //         else
    //             i = this._cutAt(i, time, duration);
    //     }
    // };

    // /**
    //  * An event in a musical sequence.
    //  *
    //  * @interface
    //  * @class
    //  * @param {number} time The time of the event, measured in beats
    //  * @memberof mu
    //  */
    // mu.Event = function(time) {
    //     if (!(this instanceof mu.Event))
    //         return new mu.Event(time);
    //     this.setTime(time);
    // };

    // /**
    //  * Determines whether this event can occur at the same time as another
    //  * event.  If this returns null, then it can coincide with any event.  If
    //  * this returns a non-null string, then it cannot coincide with an event
    //  * that also returns the same string 
    //  *
    //  * @return {string|null} If non-null, then no other event with the same
    //  * category can coincide with this one.
    //  * @memberof mu.Event
    //  */
    // mu.Event.prototype.category = function() {
    //     return null;
    // };

    // /**
    //  * Returns the time of this event.
    //  *
    //  * @return {number} The time of the event, measured in beats
    //  * @memberof mu.Event
    //  */
    // mu.Event.prototype.time = function() {
    //     return this._time;
    // };

    // /**
    //  * Sets the time of this event.
    //  *
    //  * @param {number} time The new time of this event, measured in beats.
    //  * @memberof mu.Event
    //  */
    // mu.Event.prototype.setTime = function(time) {
    //     mu._assert(_.isFinite(time) && time > 0,
    //                'invalid time ' + time);
    //     this._time = time;
    // };

    // /**
    //  * Moves this event later in the sequence by the given `amount` of beats.
    //  *
    //  * @param {number} amount The number of beats to shift the event
    //  * @memberof mu.Event
    //  */
    // mu.Event.prototype.advance = function(amount) {
    //     mu._assert(_.isFinite(amount),
    //                'invalid amount ' + amount);
    //     this.setTime(this._time + amount);
    // };

    // /**
    //  * Helper for describing this event.
    //  *
    //  * @protected
    //  * @return {string} A description of the type and properties of this event
    //  * @memberof mu.Event
    //  */
    // mu.Event.prototype._describe = function() {
    //     return 'unknown event';
    // };

    // /**
    //  * Describes this event.
    //  *
    //  * @return {string} A description of this event
    //  * @memberof mu.Event
    //  */
    // mu.Event.prototype.toString = function() {
    //     return '[t=' + this._time + ',' + this._describe() + ']';
    // };

    // /**
    //  * A tempo change in a musical sequence.
    //  *
    //  * @class
    //  * @extends {mu.Event}
    //  * @param {number} tempo The tempo to apply after this event
    //  * @memberof mu
    //  */
    // mu.TempoEvent = function(tempo) {
    //     if (!(this instanceof mu.TempoEvent))
    //         return new mu.TempoEvent(tempo);
    //     this.setTempo(tempo);
    // };
    // mu.TempoEvent.prototype = Object.create(mu.Event.prototype);
    // mu.TempoEvent.prototype.constructor = mu.TempoEvent;
    // mu.TempoEvent.prototype.category = function() {
    //     return 'tempo';
    // };
    // mu.TempoEvent.prototype._describe = function() {
    //     return 'tempo=' + this._tempo.toString();
    // };

    // /**
    //  * Returns the tempo to apply after this event.
    //  *
    //  * @return {mu.Tempo} The tempo
    //  * @memberof mu.Event
    //  */
    // mu.TempoEvent.prototype.tempo = function() {
    //     return this._tempo;
    // };

    // /**
    //  * Sets the tempo of this event.
    //  *
    //  * @param {mu.Tempo} tempo The new tempo
    //  * @memberof mu.Event
    //  */
    // mu.TempoEvent.prototype.setTempo = function(tempo) {
    //     mu._assert(tempo instanceof mu.Tempo,
    //                'invalid tempo ' + tempo);
    //     this._tempo = tempo;
    // };

    // /**
    //  * A musical sequence composed entirely of discrete chords
    //  *
    //  * @class
    //  * @memberof mu
    //  */
    // mu.Sequence = function() {
    //     if (!(this instanceof mu.Sequence))
    //         return new mu.Sequence();
    //     this._events = [];
    // };
    // mu.Sequence._DEFAULT_TEMPO = mu.Tempo(120);

    // /**
    //  * Adds an event to this sequence.
    //  *
    //  * @return {mu.Event} The event to add
    //  * @memberof mu.Sequence
    //  */
    // mu.Sequence.prototype.add = function(event) {
    //     mu._assert(event instanceof mu.Event,
    //                'invalid event ' + event);
    // };

    // /**
    //  * Removes an event to this sequence.
    //  *
    //  * @return {mu.Event} The event to add
    //  * @memberof mu.Sequence
    //  */
    // mu.Sequence.prototype.add = function(event) {
    //     mu._assert(event instanceof mu.Event,
    //                'invalid event ' + event);
    // };

})();
