assertEquals(mu._isFinite(Infinity), false);
assertEquals(mu._isFinite(NaN), false);
assertEquals(mu._isFinite(-Infinity), false);
assertEquals(mu._isFinite(0), true);
assertEquals(mu._isFinite(2e64), true);
assertEquals(mu._isFinite('0'), false);
assertEquals(mu._isFinite(null), false);

assertEquals(mu._isInteger(0), true);
assertEquals(mu._isInteger(-100000), true);
assertEquals(mu._isInteger(0.1), false);
assertEquals(mu._isInteger(Math.PI), false);
assertEquals(mu._isInteger(Infinity), false);
assertEquals(mu._isInteger('10'), false);
assertEquals(mu._isInteger(null), false);

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
    assertEquals(a.slice != null, true);
})(1, 2, 3);

(function() {
    var t = {};
    mu._mapForEach({a: 1, b: 2}, function(value, key) {
        t['x' + key] = 10 + value;
    });
    assertEquals(t.xa, 11);
    assertEquals(t.xb, 12);
})();

assertEquals(mu._isString('x'), true);
assertEquals(mu._isString(String('x')), true);
assertEquals(mu._isString(1), false);
assertEquals(mu._isString([]), false);

assertEquals(mu._isFunction(function(){}), true);
assertEquals(mu._isFunction(Function('return 1;')), true);
assertEquals(mu._isFunction(1), false);
assertEquals(mu._isFunction('x'), false);

assertThrow(function() { mu._assert(false, 'x'); });
assertNoThrow(function() { mu._assert(true, 'x'); });

(function() {
    var h = mu._html('#target');
    assertEquals(h instanceof mu._html, true);
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

document.write('tests passed');
