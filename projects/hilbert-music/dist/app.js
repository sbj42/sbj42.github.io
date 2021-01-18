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

});
});
FuseBox.pkg("fusebox-hot-reload", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
/**
 * @module listens to `source-changed` socket events and actions hot reload
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Client = require('fusebox-websocket').SocketClient;
exports.connect = function (port, uri) {
    if (FuseBox.isServer) {
        return;
    }
    port = port || window.location.port;
    var client = new Client({
        port: port,
        uri: uri,
    });
    client.connect();
    client.on('source-changed', function (data) {
        console.info("%cupdate \"" + data.path + "\"", 'color: #237abe');
        /**
         * If a plugin handles this request then we don't have to do anything
         **/
        for (var index = 0; index < FuseBox.plugins.length; index++) {
            var plugin = FuseBox.plugins[index];
            if (plugin.hmrUpdate && plugin.hmrUpdate(data)) {
                return;
            }
        }
        if (data.type === 'js') {
            FuseBox.flush();
            FuseBox.dynamic(data.path, data.content);
            if (FuseBox.mainFile) {
                try {
                    FuseBox.import(FuseBox.mainFile);
                }
                catch (e) {
                    if (typeof e === 'string') {
                        if (/not found/.test(e)) {
                            return window.location.reload();
                        }
                    }
                    console.error(e);
                }
            }
        }
        if (data.type === 'css' && __fsbx_css) {
            __fsbx_css(data.path, data.content);
        }
    });
    client.on('error', function (error) {
        console.log(error);
    });
};

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("fusebox-websocket", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require('events');
var SocketClient = (function () {
    function SocketClient(opts) {
        opts = opts || {};
        var port = opts.port || window.location.port;
        var protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
        var domain = location.hostname || 'localhost';
        this.url = opts.host || "" + protocol + domain + ":" + port;
        if (opts.uri) {
            this.url = opts.uri;
        }
        this.authSent = false;
        this.emitter = new events.EventEmitter();
    }
    SocketClient.prototype.reconnect = function (fn) {
        var _this = this;
        setTimeout(function () {
            _this.emitter.emit('reconnect', { message: 'Trying to reconnect' });
            _this.connect(fn);
        }, 5000);
    };
    SocketClient.prototype.on = function (event, fn) {
        this.emitter.on(event, fn);
    };
    SocketClient.prototype.connect = function (fn) {
        var _this = this;
        console.log('%cConnecting to fusebox HMR at ' + this.url, 'color: #237abe');
        setTimeout(function () {
            _this.client = new WebSocket(_this.url);
            _this.bindEvents(fn);
        }, 0);
    };
    SocketClient.prototype.close = function () {
        this.client.close();
    };
    SocketClient.prototype.send = function (eventName, data) {
        if (this.client.readyState === 1) {
            this.client.send(JSON.stringify({ event: eventName, data: data || {} }));
        }
    };
    SocketClient.prototype.error = function (data) {
        this.emitter.emit('error', data);
    };
    /** Wires up the socket client messages to be emitted on our event emitter */
    SocketClient.prototype.bindEvents = function (fn) {
        var _this = this;
        this.client.onopen = function (event) {
            console.log('%cConnected', 'color: #237abe');
            if (fn) {
                fn(_this);
            }
        };
        this.client.onerror = function (event) {
            _this.error({ reason: event.reason, message: 'Socket error' });
        };
        this.client.onclose = function (event) {
            _this.emitter.emit('close', { message: 'Socket closed' });
            if (event.code !== 1011) {
                _this.reconnect(fn);
            }
        };
        this.client.onmessage = function (event) {
            var data = event.data;
            if (data) {
                var item = JSON.parse(data);
                _this.emitter.emit(item.type, item.data);
                _this.emitter.emit('*', item);
            }
        };
    };
    return SocketClient;
}());
exports.SocketClient = SocketClient;

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("events", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
if (FuseBox.isServer) {
    module.exports = global.require("events");
} else {
    function EventEmitter() {
        this._events = this._events || {};
        this._maxListeners = this._maxListeners || undefined;
    }
    module.exports = EventEmitter;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function(n) {
        if (!isNumber(n) || n < 0 || isNaN(n))
            throw TypeError("n must be a positive number");
        this._maxListeners = n;
        return this;
    };

    EventEmitter.prototype.emit = function(type) {
        var er, handler, len, args, i, listeners;

        if (!this._events)
            this._events = {};

        // If there is no 'error' event listener then throw.
        if (type === "error") {
            if (!this._events.error ||
                (isObject(this._events.error) && !this._events.error.length)) {
                er = arguments[1];
                if (er instanceof Error) {
                    throw er; // Unhandled 'error' event
                }
                throw TypeError("Uncaught, unspecified \"error\" event.");
            }
        }

        handler = this._events[type];

        if (isUndefined(handler))
            return false;

        if (isFunction(handler)) {
            switch (arguments.length) {
                // fast cases
                case 1:
                    handler.call(this);
                    break;
                case 2:
                    handler.call(this, arguments[1]);
                    break;
                case 3:
                    handler.call(this, arguments[1], arguments[2]);
                    break;
                    // slower
                default:
                    args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(this, args);
            }
        } else if (isObject(handler)) {
            args = Array.prototype.slice.call(arguments, 1);
            listeners = handler.slice();
            len = listeners.length;
            for (i = 0; i < len; i++)
                listeners[i].apply(this, args);
        }

        return true;
    };

    EventEmitter.prototype.addListener = function(type, listener) {
        var m;

        if (!isFunction(listener))
            throw TypeError("listener must be a function");

        if (!this._events)
            this._events = {};

        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (this._events.newListener)
            this.emit("newListener", type,
                isFunction(listener.listener) ?
                listener.listener : listener);

        if (!this._events[type])
        // Optimize the case of one listener. Don't need the extra array object.
            this._events[type] = listener;
        else if (isObject(this._events[type]))
        // If we've already got an array, just append.
            this._events[type].push(listener);
        else
        // Adding the second element, need to change to array.
            this._events[type] = [this._events[type], listener];

        // Check for listener leak
        if (isObject(this._events[type]) && !this._events[type].warned) {
            if (!isUndefined(this._maxListeners)) {
                m = this._maxListeners;
            } else {
                m = EventEmitter.defaultMaxListeners;
            }

            if (m && m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error("(node) warning: possible EventEmitter memory " +
                    "leak detected. %d listeners added. " +
                    "Use emitter.setMaxListeners() to increase limit.",
                    this._events[type].length);
                if (typeof console.trace === "function") {
                    // not supported in IE 10
                    console.trace();
                }
            }
        }

        return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.once = function(type, listener) {
        if (!isFunction(listener))
            throw TypeError("listener must be a function");

        var fired = false;

        function g() {
            this.removeListener(type, g);

            if (!fired) {
                fired = true;
                listener.apply(this, arguments);
            }
        }

        g.listener = listener;
        this.on(type, g);

        return this;
    };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener = function(type, listener) {
        var list, position, length, i;

        if (!isFunction(listener))
            throw TypeError("listener must be a function");

        if (!this._events || !this._events[type])
            return this;

        list = this._events[type];
        length = list.length;
        position = -1;

        if (list === listener ||
            (isFunction(list.listener) && list.listener === listener)) {
            delete this._events[type];
            if (this._events.removeListener)
                this.emit("removeListener", type, listener);

        } else if (isObject(list)) {
            for (i = length; i-- > 0;) {
                if (list[i] === listener ||
                    (list[i].listener && list[i].listener === listener)) {
                    position = i;
                    break;
                }
            }

            if (position < 0)
                return this;

            if (list.length === 1) {
                list.length = 0;
                delete this._events[type];
            } else {
                list.splice(position, 1);
            }

            if (this._events.removeListener)
                this.emit("removeListener", type, listener);
        }

        return this;
    };

    EventEmitter.prototype.removeAllListeners = function(type) {
        var key, listeners;

        if (!this._events)
            return this;

        // not listening for removeListener, no need to emit
        if (!this._events.removeListener) {
            if (arguments.length === 0)
                this._events = {};
            else if (this._events[type])
                delete this._events[type];
            return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
            for (key in this._events) {
                if (key === "removeListener") continue;
                this.removeAllListeners(key);
            }
            this.removeAllListeners("removeListener");
            this._events = {};
            return this;
        }

        listeners = this._events[type];

        if (isFunction(listeners)) {
            this.removeListener(type, listeners);
        } else if (listeners) {
            // LIFO order
            while (listeners.length)
                this.removeListener(type, listeners[listeners.length - 1]);
        }
        delete this._events[type];

        return this;
    };

    EventEmitter.prototype.listeners = function(type) {
        var ret;
        if (!this._events || !this._events[type])
            ret = [];
        else if (isFunction(this._events[type]))
            ret = [this._events[type]];
        else
            ret = this._events[type].slice();
        return ret;
    };

    EventEmitter.prototype.listenerCount = function(type) {
        if (this._events) {
            var evlistener = this._events[type];

            if (isFunction(evlistener))
                return 1;
            else if (evlistener)
                return evlistener.length;
        }
        return 0;
    };

    EventEmitter.listenerCount = function(emitter, type) {
        return emitter.listenerCount(type);
    };

    function isFunction(arg) {
        return typeof arg === "function";
    }

    function isNumber(arg) {
        return typeof arg === "number";
    }

    function isObject(arg) {
        return typeof arg === "object" && arg !== null;
    }

    function isUndefined(arg) {
        return arg === void 0;
    }
}

});
return ___scope___.entry = "index.js";
});
FuseBox.import("fusebox-hot-reload").connect(4444, "")

FuseBox.import("default/index.js");
FuseBox.main("default/index.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=h[a];if(!s){if(d&&"electron"!==g.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:v}}function s(e,r,n){if(void 0===n&&(n={}),!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);g.dynamic(a,o),r(g.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=m[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=h[t.pkgName];if(u){var p={};for(var m in u.f)a.test(m)&&(p[m]=c(t.pkgName+"/"+m));return p}}if(!i){var g="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return g?r(e):null},r)}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},w.require.main={filename:d?"./":v.require.main.filename,paths:d?[]:v.require.main.paths};var j=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",j),i.fn.apply(0,j),l("after-import",j),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var h=p.p=p.p||{},m=p.e=p.e||{},g=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){m[e]=m[e]||[],m[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=h[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=h.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(h[e])return n(h[e].s);var t=h[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r}();return g.packages=h,g.isBrowser=d,g.isServer=!d,g.plugins=[],d||(v.FuseBox=g),e.FuseBox=g}(this))