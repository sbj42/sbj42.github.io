function assert(pred, message) {
    if (!pred)
        throw Error(message || 'assertion failed');
}

function assertEquals(value, expect, message) {
    if (isNaN(value) && isNaN(expect))
        return;
    assert(value === expect, message || 'expected ' + expect + ', got ' + value);
}

function assertClose(value, expect, delta, message) {
    assert(Math.abs(value - expect) < delta, message || 'expected ' + expect + ' +/- ' + delta + ', got ' + value);
}

function assertThrow(callback, message) {
    try {
        callback();
    } catch (e) {
        return;
    }
    throw Error(message || 'callback didn\'t throw');
}

function assertNoThrow(callback, message) {
    try {
        callback();
    } catch (e) {
        throw Error(message || 'callback threw ' + e);
    }
}
