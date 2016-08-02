assert(!mu._isFinite(Infinity));
assert(!mu._isFinite(NaN));
assert(!mu._isFinite(-Infinity));
assert(mu._isFinite(0));
assert(mu._isFinite(2e64));
assert(!mu._isFinite('0'));
assert(!mu._isFinite(null));

assert(mu._isInteger(0));
assert(mu._isInteger(-100000));
assert(!mu._isInteger(0.1));
assert(!mu._isInteger(Math.PI));
assert(!mu._isInteger(Infinity));
assert(!mu._isInteger('10'));
assert(!mu._isInteger(null));

assertEquals(mu._log2(2), 1);
assertEquals(mu._log2(1), 0);
assertEquals(mu._log2(0), -Infinity);
assertEquals(mu._log2(-2), NaN);
assertEquals(mu._log2(1024), 10);

(function() {
    var a = mu._argsToArray(arguments);
    assertEquals(a.length, 3);
    assertEquals(a[0], 1);
    assertEquals(a[2], 3);
    assert(a.slice != null);
})(1, 2, 3);

(function() {
    var t = {};
    mu._mapForEach({a: 1, b: 2}, function(value, key) {
        t['x' + key] = 10 + value;
    });
    assertEquals(t.xa, 11);
    assertEquals(t.xb, 12);
})();

assert(mu._isNaN(NaN));
assert(!mu._isNaN(0));
assert(!mu._isNaN(true));
assert(!mu._isNaN([]));
assert(!mu._isNaN(''));
assert(!mu._isNaN('x'));

assert(!mu._isObject('x'));
assert(!mu._isObject(String('x')));
assert(!mu._isObject(1));
assert(mu._isObject([]));
assert(mu._isObject({}));

assert(mu._isString('x'));
assert(mu._isString(String('x')));
assert(!mu._isString(1));
assert(!mu._isString([]));

assert(mu._isFunction(function(){}));
assert(mu._isFunction(Function('return 1;')));
assert(!mu._isFunction(1));
assert(!mu._isFunction('x'));

assertThrow(function() { mu._assert(false, 'x'); });
assertNoThrow(function() { mu._assert(true, 'x'); });

(function() {
    var h = mu._html('#target');
    assert(h instanceof mu._html);
    assertEquals(h.node().childNodes.length, 0);
    h.append('div')
        .attr('style', 'color: green')
        .node().innerHTML = 'one';
    assertEquals(h.node().childNodes.length, 1);
    h.append(mu._html('div')
             .attr('style', 'color: blue')
            ).node().innerHTML = 'two';
    assertEquals(h.node().childNodes.length, 2);
})();

var o = {x: 0, y: 0};
mu._eventable(o);
o.addEventListener('x', function(o) {
    o.x ++;
});
function yFunc(o) {
    o.y ++;
}
o.addEventListener('y', yFunc);
o._fire('x', o);
o._fire('y', o);
o.addEventListener('x', function(o) {
    o.x ++;
});
o.removeEventListener('y', yFunc);
o._fire('x', o);
o._fire('y', o);
assertEquals(o.x, 3);
assertEquals(o.y, 1);

document.write('tests passed');
