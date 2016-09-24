var fpUtil = {
};

fpUtil.addEventListener = function(target, name, callback) {
    var events = target._fpUtil_events;
    if (!events)
        events = target._fpUtil_events = {};
    var listeners = events[name];
    if (!listeners)
        listeners = events[name] = [];
    listeners.push(callback);
},

fpUtil.removeEventListener = function(target, name, callback) {
    var events = target._fpUtil_events;
    var listeners = events[name];
    if (!listeners)
        return;
    for (var i = 0; i < listeners.length; i ++)
        if (listeners[i] === callback) {
            listeners.splice(i, 1);
            break;
        }
    if (!listeners[i].length)
        delete events[name];
};

fpUtil.hasEvent = function(target, name) {
    var events = target._fpUtil_events;
    if (!events)
        return false;
    var listeners = events[name];
    if (!listeners)
        return false;
    return true;
};

fpUtil.fireEvent = function(target, name, args) {
    var events = target._fpUtil_events;
    if (!events)
        return;
    var listeners = events[name];
    if (listeners)
        listeners.forEach(function(callback) { callback.apply(null, args); });
};

module.exports = fpUtil;
