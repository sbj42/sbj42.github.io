var fpUtil = require('./fpUtil');
var fpConfig = require('./fpConfig');

var fpView = {
};

var SCREEN_CENTER = [0.5, 0.6];

var position = [0, 0];
var offset = [0, 0];
var zoom = fpConfig.zoom ? 1/fpConfig.zoom : 1;
var angle = 0;
var flip = false;

var elem = document.createElement('canvas');

function resize() {
    elem.width = document.body.clientWidth;
    elem.height = document.body.clientHeight;
}

resize();
window.addEventListener('load', resize);
window.addEventListener('resize', resize);
document.body.appendChild(elem);

fpView.screenWidth = function () {
    return elem.width;
};

fpView.screenHeight = function () {
    return elem.height;
};

var context = elem.getContext('2d', {alpha: false});

fpView.context = function () {
    return context;
};

fpView.position = function (v) {
    if (v != null) {
        position = v.slice();
        return fpView;
    }
    return position.slice();
};

fpView.offset = function (v) {
    if (v != null) {
        offset = v.slice();
        return fpView;
    }
    return offset.slice();
};

fpView.zoom = function (v) {
    if (v != null) {
        zoom = v;
        return fpView;
    }
    return zoom;
};

fpView.angle = function (v) {
    if (v != null) {
        angle = v;
        return fpView;
    }
    return angle;
};

fpView.flip = function (v) {
    if (v != null) {
        flip = v;
        return fpView;
    }
    return flip;
};

fpView.getWorldTransform = function() {
    return {
        position: fpView.worldToScreen([0, 0]),
        angle: angle,
        scale: zoom,
        flip: flip
    };
};

fpView.worldToScreenX = function(x) {
    return fpView.screenWidth() * SCREEN_CENTER[0] + (x - position[0]) * zoom + offset[0];
};

fpView.worldToScreenY = function(y) {
    return fpView.screenHeight() * SCREEN_CENTER[1] + (y - position[1]) * zoom + offset[1];
};

fpView.worldToScreen = function(pos) {
    if (pos == null)
        return null;
    return [fpView.worldToScreenX(pos[0]), fpView.worldToScreenY(pos[1])];
};

fpView.screenToWorldX = function(x) {
    return (x - fpView.screenWidth() * SCREEN_CENTER[0] - offset[0]) / zoom + position[0];
};

fpView.screenToWorldY = function(y) {
    return (y - fpView.screenHeight() * SCREEN_CENTER[1] - offset[1]) / zoom + position[1];
};

fpView.screenToWorld = function(pos) {
    if (pos == null)
        return null;
    return [fpView.screenToWorldX(pos[0]), fpView.screenToWorldY(pos[1])];
};

function screenClip(position) {
    if (position == null)
        return null;
    return [
        Math.max(0, Math.min(fpView.screenWidth(), position[0])),
        Math.max(0, Math.min(fpView.screenHeight(), position[1]))
    ];
}

var clientMousePosition = null;
var mouseIsDown = false;

fpView.screenMousePosition = function () {
    return screenClip(clientMousePosition);
};

fpView.mousePosition = function () {
    return fpView.screenToWorld(fpView.screenMousePosition());
};

fpView.mouseIsDown = function() {
    return mouseIsDown;
};

function mouseDown(event) {
    mouseIsDown = true;
    clientMousePosition = [event.clientX, event.clientY];
    fpUtil.fireEvent(fpView, 'mousedown', [event]);
}

function mouseMove(event) {
    clientMousePosition = [event.clientX, event.clientY];
    fpUtil.fireEvent(fpView, 'mousemove', [event]);
}

function mouseUp(event) {
    if (mouseIsDown) {
        fpUtil.fireEvent(fpView, 'mouseup', [event]);
        mouseIsDown = false;
        var client = clientMousePosition;
        var screen = fpView.screenMousePosition();
        if (client[0] != screen[0] || client[1] != screen[1])
            clientMousePosition = null;
    }
}

function mouseOut(event) {
    if (!mouseIsDown)
        clientMousePosition = null;
}

document.addEventListener('mousedown', mouseDown);
document.addEventListener('mousemove', mouseMove, true);
document.addEventListener('mouseup', mouseUp, true);
document.addEventListener('mouseout', mouseOut);

var MOVE_TOWARD_CONST = 22;

fpView.moveToward = function(target) {
    function step(from, to, limits) {
        if (to - from > limits[1])
            from = to - limits[1];
        else if (to - from < limits[0])
            from = to - limits[0];
        return (from * (MOVE_TOWARD_CONST - 1) + to) / MOVE_TOWARD_CONST;
    }
    var xLimits = [150 - fpView.screenWidth() * SCREEN_CENTER[0], fpView.screenWidth() - 150 - fpView.screenWidth() * SCREEN_CENTER[0]];
    var yLimits = [150 - fpView.screenHeight() * SCREEN_CENTER[1], fpView.screenHeight() - 150 - fpView.screenHeight() * SCREEN_CENTER[1]];
    this.position([step(position[0], target[0], xLimits), step(position[1], target[1], yLimits)]);
};

module.exports = fpView;
