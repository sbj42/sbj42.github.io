try {

    function assert(pred, message) {
        if (!pred)
            throw Error(message || 'assertion failed');
    }
    function assertEquals(value, expect, message) {
        assert(value == expect, message || 'expected ' + expect + ', got ' + value);
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

    document.write('tests passed');

} catch (e) {
    document.write(e.toString());
}
