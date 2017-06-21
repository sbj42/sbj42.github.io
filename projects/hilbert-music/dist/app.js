(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
require("./resolution");
require("./chords");
require("./vis1d");
require("./vis2d");
if (!('AudioContext' in window)) {
    document.getElementById('desc').innerHTML += '<br/><br/><b>Your browser doesn\'t support the Web Audio API.';
}
//# sourceMappingURL=index.js.map
});
___scope___.file("resolution.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var event_1 = require("./event");
var resolution = document.getElementById('resolution');
resolution.innerHTML = 'Resolution: ';
var input = document.createElement('input');
input.type = 'range';
input.min = '2';
input.max = '7';
input.value = '5';
resolution.appendChild(input);
input.oninput = function () {
    event_1.onRestart(+input.value);
};
event_1.onRestart(+input.value);
//# sourceMappingURL=resolution.js.map
});
___scope___.file("event.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var vis1d_1 = require("./vis1d");
var vis2d_1 = require("./vis2d");
var audio_1 = require("./audio");
var scale_1 = require("./scale");
var hilbert_1 = require("./hilbert");
var lastD = null;
function onOut() {
    if (lastD !== null) {
        for (var _i = 0, lastD_1 = lastD; _i < lastD_1.length; _i++) {
            var d = lastD_1[_i];
            vis1d_1.reset(d);
            vis2d_1.reset(d);
        }
    }
    audio_1.stop();
    lastD = null;
}
exports.onOut = onOut;
function onHover(d) {
    if (lastD !== null) {
        for (var _i = 0, lastD_2 = lastD; _i < lastD_2.length; _i++) {
            var d_1 = lastD_2[_i];
            vis1d_1.reset(d_1);
            vis2d_1.reset(d_1);
        }
    }
    vis1d_1.highlight(d);
    vis2d_1.highlight(d);
    audio_1.start([scale_1.getHertz(d)]);
    lastD = [d];
}
exports.onHover = onHover;
window.fix = function (d) {
    vis1d_1.highlight(d);
    vis2d_1.highlight(d);
    audio_1.start([scale_1.getHertz(d)]);
};
// fix(Math.log2(261.626/261.626)*1024); fix(Math.log2(349.228/261.626)*1024); fix(Math.log2(440/261.626)*1024);
// fix(Math.log2(493.88/261.626)*1024); fix(Math.log2(349.228/261.626)*1024); fix(Math.log2(391.995/261.626)*1024);
function onRestart(n) {
    hilbert_1.restart(n);
    vis1d_1.restart();
    vis2d_1.restart();
}
exports.onRestart = onRestart;
function onChord(vs) {
    var ds = [];
    for (var _i = 0, vs_1 = vs; _i < vs_1.length; _i++) {
        var v = vs_1[_i];
        ds.push(Math.floor(v * hilbert_1.HILBERT1D_LENGTH()));
    }
    var hz = [];
    for (var _a = 0, ds_1 = ds; _a < ds_1.length; _a++) {
        var d = ds_1[_a];
        hz.push(scale_1.getHertz(d));
        vis1d_1.highlight(d);
        vis2d_1.highlight(d);
    }
    lastD = ds;
    audio_1.start(hz);
}
exports.onChord = onChord;
//# sourceMappingURL=event.js.map
});
___scope___.file("vis1d.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var hilbert_1 = require("./hilbert");
var gradient_1 = require("./gradient");
var event_1 = require("./event");
var VIS1D_ZOOM = 1;
var VIS1D_HEIGHT = 20;
var TICK_HEIGHT = 15;
var VIS1D_WIDTH = hilbert_1.HILBERT1D_LENGTH() * VIS1D_ZOOM;
var context;
function vis1DColor(d, c) {
    var x = Math.floor(d * VIS1D_ZOOM);
    context.fillStyle = c;
    context.fillRect(x, 0, Math.max(1, VIS1D_ZOOM), VIS1D_HEIGHT);
}
function restart() {
    VIS1D_ZOOM = 512 / hilbert_1.HILBERT1D_LENGTH();
    VIS1D_HEIGHT = 20;
    TICK_HEIGHT = 15;
    VIS1D_WIDTH = hilbert_1.HILBERT1D_LENGTH() * VIS1D_ZOOM;
    var vis1d = document.getElementById('vis1d');
    vis1d.innerHTML = '';
    var canvas = document.createElement('canvas');
    canvas.width = VIS1D_WIDTH + 15;
    canvas.height = VIS1D_HEIGHT + TICK_HEIGHT;
    vis1d.appendChild(canvas);
    context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (var d = 0; d < hilbert_1.HILBERT1D_LENGTH(); d++) {
        vis1DColor(d, gradient_1.getColor(d));
    }
    var NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
    context.font = '14px sans-serif';
    context.fillStyle = '#000';
    for (var i = 0; i <= 12; i++) {
        var x = Math.floor(i * VIS1D_ZOOM * hilbert_1.HILBERT1D_LENGTH() / 12);
        if (i == 12) {
            x--;
        }
        context.fillRect(x, VIS1D_HEIGHT, 1, TICK_HEIGHT);
        context.fillText(NOTE[i], x + 2, canvas.height - 2);
    }
    canvas.addEventListener('mousemove', function (event) {
        var d = Math.floor(event.offsetX / VIS1D_ZOOM);
        if (d < hilbert_1.HILBERT1D_LENGTH()) {
            event_1.onHover(d);
        }
    });
    canvas.addEventListener('mouseout', function (event) {
        event_1.onOut();
    });
}
exports.restart = restart;
function reset(d) {
    vis1DColor(d, gradient_1.getColor(d));
}
exports.reset = reset;
function highlight(d) {
    vis1DColor(d, 'yellow');
}
exports.highlight = highlight;
//# sourceMappingURL=vis1d.js.map
});
___scope___.file("hilbert.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var iterations = 5;
var width2d = Math.pow(2, iterations);
var length1d = Math.pow(width2d, 2);
function HILBERT_ITERATIONS() {
    return iterations;
}
exports.HILBERT_ITERATIONS = HILBERT_ITERATIONS;
function HILBERT2D_WIDTH() {
    return width2d;
}
exports.HILBERT2D_WIDTH = HILBERT2D_WIDTH;
function HILBERT1D_LENGTH() {
    return length1d;
}
exports.HILBERT1D_LENGTH = HILBERT1D_LENGTH;
function restart(i) {
    iterations = i;
    width2d = Math.pow(2, iterations);
    length1d = Math.pow(width2d, 2);
}
exports.restart = restart;
function rot(n, x, y, rx, ry) {
    if (ry === 0) {
        if (rx === 1) {
            x = n - 1 - x;
            y = n - 1 - y;
        }
        var t = x;
        x = y;
        y = t;
    }
    return [x, y];
}
function xy2d(n, x, y) {
    var d = 0;
    for (var s = Math.floor(n / 2); s > 0; s = Math.floor(s / 2)) {
        var rx = (x & s) > 0 ? 1 : 0;
        var ry = (y & s) > 0 ? 1 : 0;
        d += s * s * ((3 * rx) ^ ry);
        _a = rot(s, x, y, rx, ry), x = _a[0], y = _a[1];
    }
    return d;
    var _a;
}
function d2xy(n, d) {
    var t = d;
    var x = 0;
    var y = 0;
    for (var s = 1; s < n; s *= 2) {
        var rx = 1 & Math.floor(t / 2);
        var ry = 1 & (t ^ rx);
        _a = rot(s, x, y, rx, ry), x = _a[0], y = _a[1];
        x += s * rx;
        y += s * ry;
        t /= 4;
    }
    return [x, y];
    var _a;
}
function conv2to1(x, y) {
    return xy2d(width2d, x, y);
}
exports.conv2to1 = conv2to1;
function conv1to2(d) {
    return d2xy(width2d, d);
}
exports.conv1to2 = conv1to2;
//# sourceMappingURL=hilbert.js.map
});
___scope___.file("gradient.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var hilbert_1 = require("./hilbert");
function getColor(d) {
    var p = d / hilbert_1.HILBERT1D_LENGTH();
    var p1 = Math.min(1, Math.max(0, 1 - p * 1.5));
    var p2 = Math.min(1, Math.max(0, 1 - Math.abs(p - 0.5) * 3));
    var p3 = Math.min(1, Math.max(0, 1 - (1 - p) * 1.5));
    var color1 = Math.floor(p1 * 255);
    var color2 = Math.floor(p2 * 255);
    var color3 = Math.floor(p3 * 255);
    return "rgb(" + color1 + ", " + color2 + ", " + color3 + ")";
}
exports.getColor = getColor;
//# sourceMappingURL=gradient.js.map
});
___scope___.file("vis2d.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var hilbert_1 = require("./hilbert");
var gradient_1 = require("./gradient");
var event_1 = require("./event");
var VIS2D_ZOOM = 8;
var VIS2D_WIDTH = hilbert_1.HILBERT2D_WIDTH() * VIS2D_ZOOM;
var context;
function vis2DColor(x, y, c) {
    context.fillStyle = c;
    context.fillRect(x * VIS2D_ZOOM, y * VIS2D_ZOOM, VIS2D_ZOOM, VIS2D_ZOOM);
}
function vis2DLine(d) {
    context.strokeStyle = '#000';
    context.beginPath();
    if (d > 0) {
        var _a = hilbert_1.conv1to2(d - 1), x = _a[0], y = _a[1];
        context.moveTo(x * VIS2D_ZOOM + VIS2D_ZOOM / 2, y * VIS2D_ZOOM + VIS2D_ZOOM / 2);
        var _b = hilbert_1.conv1to2(d), x2 = _b[0], y2 = _b[1];
        context.lineTo(x2 * VIS2D_ZOOM + VIS2D_ZOOM / 2, y2 * VIS2D_ZOOM + VIS2D_ZOOM / 2);
        if (d < hilbert_1.HILBERT1D_LENGTH() - 1) {
            var _c = hilbert_1.conv1to2(d + 1), x3 = _c[0], y3 = _c[1];
            context.lineTo(x3 * VIS2D_ZOOM + VIS2D_ZOOM / 2, y3 * VIS2D_ZOOM + VIS2D_ZOOM / 2);
        }
    }
    else {
        var _d = hilbert_1.conv1to2(d), x = _d[0], y = _d[1];
        context.moveTo(x * VIS2D_ZOOM + VIS2D_ZOOM / 2, y * VIS2D_ZOOM + VIS2D_ZOOM / 2);
        var _e = hilbert_1.conv1to2(d + 1), x2 = _e[0], y2 = _e[1];
        context.lineTo(x2 * VIS2D_ZOOM + VIS2D_ZOOM / 2, y2 * VIS2D_ZOOM + VIS2D_ZOOM / 2);
    }
    context.stroke();
}
function vis2DCircle(d) {
    context.fillStyle = '#fff';
    var _a = hilbert_1.conv1to2(d), x = _a[0], y = _a[1];
    context.fillRect(x * VIS2D_ZOOM + VIS2D_ZOOM / 4, y * VIS2D_ZOOM + VIS2D_ZOOM / 4, VIS2D_ZOOM / 2, VIS2D_ZOOM / 2);
}
function recircle() {
    for (var i = 0; i <= 12; i++) {
        if (i == 12) {
            vis2DCircle(Math.floor(i * hilbert_1.HILBERT1D_LENGTH() / 12) - 1);
        }
        else {
            vis2DCircle(Math.floor(i * hilbert_1.HILBERT1D_LENGTH() / 12));
        }
    }
}
function restart() {
    VIS2D_ZOOM = Math.floor(16 / Math.pow(2, hilbert_1.HILBERT_ITERATIONS() - 5));
    VIS2D_WIDTH = hilbert_1.HILBERT2D_WIDTH() * VIS2D_ZOOM;
    var vis2d = document.getElementById('vis2d');
    vis2d.innerHTML = '';
    var canvas = document.createElement('canvas');
    canvas.width = VIS2D_WIDTH;
    canvas.height = VIS2D_WIDTH;
    vis2d.appendChild(canvas);
    context = canvas.getContext('2d');
    for (var d = 0; d < hilbert_1.HILBERT1D_LENGTH(); d++) {
        var _a = hilbert_1.conv1to2(d), x = _a[0], y = _a[1];
        vis2DColor(x, y, gradient_1.getColor(d));
    }
    for (var d = 0; d < hilbert_1.HILBERT1D_LENGTH(); d++) {
        vis2DLine(d);
    }
    recircle();
    canvas.addEventListener('mousemove', function (event) {
        var x = Math.floor(event.offsetX / VIS2D_ZOOM);
        var y = Math.floor(event.offsetY / VIS2D_ZOOM);
        event_1.onHover(hilbert_1.conv2to1(x, y));
    });
    canvas.addEventListener('mouseout', function (event) {
        event_1.onOut();
    });
}
exports.restart = restart;
function reset(d) {
    var _a = hilbert_1.conv1to2(d), x = _a[0], y = _a[1];
    vis2DColor(x, y, gradient_1.getColor(d));
    vis2DLine(d);
    recircle();
}
exports.reset = reset;
function highlight(d) {
    var _a = hilbert_1.conv1to2(d), x = _a[0], y = _a[1];
    vis2DColor(x, y, 'yellow');
}
exports.highlight = highlight;
//# sourceMappingURL=vis2d.js.map
});
___scope___.file("audio.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var context;
var GAIN = 0.4;
var HARMONICS = [
    [1, 1],
    [2, 0.399],
    [3, 0.299],
    [4, 0.152],
    [5, 0.197],
    [6, 0.094],
    [7, 0.061],
    [8, 0.139],
];
var oscillators = [];
function start(hertz) {
    function setOscillator(index, freq, relAmp) {
        var oscillator;
        var newOsc = oscillators.length <= index;
        if (newOsc) {
            oscillator = context.createOscillator();
        }
        else {
            oscillator = oscillators[index];
        }
        oscillator.frequency.value = freq;
        if (newOsc) {
            var gain = context.createGain();
            gain.gain.value = 0.125 * GAIN * relAmp;
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillators.push(oscillator);
            oscillator.start();
        }
    }
    if (!context) {
        if (!('AudioContext' in window))
            return;
        context = new AudioContext();
    }
    var i = 0;
    for (var _i = 0, hertz_1 = hertz; _i < hertz_1.length; _i++) {
        var hz = hertz_1[_i];
        for (var _a = 0, HARMONICS_1 = HARMONICS; _a < HARMONICS_1.length; _a++) {
            var h = HARMONICS_1[_a];
            setOscillator(i, hz * h[0], h[1]);
            i++;
        }
    }
    while (i < oscillators.length) {
        oscillators.pop().stop();
    }
}
exports.start = start;
function stop() {
    for (var _i = 0, oscillators_1 = oscillators; _i < oscillators_1.length; _i++) {
        var n = oscillators_1[_i];
        n.stop();
    }
    oscillators.length = 0;
    if (context) {
        context.close();
        context = null;
    }
}
exports.stop = stop;
//# sourceMappingURL=audio.js.map
});
___scope___.file("scale.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var hilbert_1 = require("./hilbert");
function getHertz(d) {
    var p = d / hilbert_1.HILBERT1D_LENGTH();
    return 261.626 * Math.pow(2, p);
}
exports.getHertz = getHertz;
//# sourceMappingURL=scale.js.map
});
___scope___.file("chords.js", function(exports, require, module, __filename, __dirname){

"use strict";
exports.__esModule = true;
var event_1 = require("./event");
var chords = document.getElementById('chords');
chords.innerHTML = 'Chords (hold down):<br/>';
function addButton(name, v) {
    var button = document.createElement('div');
    button.style.padding = '3px';
    button.style.border = '1px solid black';
    button.style.margin = '3px';
    button.style.background = '#aaf';
    button.style.width = '100px';
    button.style.display = 'inline-block';
    button.style.cursor = 'pointer';
    button.innerHTML = name;
    chords.appendChild(button);
    button.onmousedown = function () {
        event_1.onChord(v.map(function (v) { return v / 12; }));
        return false;
    };
    button.onmouseup = function () {
        event_1.onOut();
    };
}
addButton('Cmaj', [0, 4, 7]);
addButton('Cmin', [0, 3, 7]);
addButton('Dmin', [2, 5, 9]);
addButton('Ddim', [2, 5, 8]);
addButton('Fmaj', [0, 5, 9]);
addButton('Gmaj', [2, 7, 11]);
addButton('Gmin', [2, 7, 10]);
addButton('Daug', [2, 6, 10]);
//# sourceMappingURL=chords.js.map
});
});

FuseBox.import("default/index.js");
FuseBox.main("default/index.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=h[a];if(!s){if(d&&"electron"!==g.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:v}}function s(e,r,n){if(void 0===n&&(n={}),!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);g.dynamic(a,o),r(g.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=m[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=h[t.pkgName];if(u){var p={};for(var m in u.f)a.test(m)&&(p[m]=c(t.pkgName+"/"+m));return p}}if(!i){var g="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return g?r(e):null},r)}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},w.require.main={filename:d?"./":v.require.main.filename,paths:d?[]:v.require.main.paths};var j=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",j),i.fn.apply(0,j),l("after-import",j),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var h=p.p=p.p||{},m=p.e=p.e||{},g=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){m[e]=m[e]||[],m[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=h[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=h.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(h[e])return n(h[e].s);var t=h[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r}();return g.packages=h,g.isBrowser=d,g.isServer=!d,g.plugins=[],d||(v.FuseBox=g),e.FuseBox=g}(this))