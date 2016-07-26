/**
 * @file mu util library
 * @author James Clark
 * @version 0.1.1
 */
;(function() {

    /** the global object */
    var global = this;

    /**
     * The mu library namespace object
     * @namespace mu
     */
    var mu = global.mu = global.mu || {};

    /**
     * Stand-in for Number.isFinite (from MDN)
     *
     * @private
     * @memberof mu
     */
    mu._isFinite = Number.isFinite || function(value) {
        return typeof value === 'number' && isFinite(value);
    };

    /**
     * Stand-in for Number.isInteger (from MDN)
     *
     * @private
     * @memberof mu
     */
    mu._isInteger = Number.isInteger || function(value) {
        return mu._isFinite(value) && Math.floor(value) === value;
    };

    /**
     * Stand-in for Math.log2 (from MDN)
     *
     * @private
     * @memberof mu
     */
    mu._log2 = Math.log2 || function(value) {
        return Math.log(value) / Math.LN2;
    };

    /**
     * Stand-in for Array.from, but only for the `arguments` object (from MDN).
     *
     * @private
     * @memberof mu
     */
    mu._argsToArray = Array.from || function(args) {
        return args.length === 1 ? [args[0]] : Array.apply(null, args);
    };

    /**
     * Stand-in for Map.prototype.forEach (simplified).
     *
     * @private
     * @memberof mu
     */
    mu._mapForEach = function(map, callback, thisArg) {
        if (map.forEach)
            return map.forEach(callback, thisArg);
        for (var key in map)
            if (map.hasOwnProperty(key))
                callback.call(thisArg, map[key], key, map);
    };

    /**
     * Check if a value is either a string primitive or a String object.
     *
     * @private
     * @memberof mu
     */
    mu._isString = function(value) {
        return typeof value == 'string' ||
            (!!value && typeof value == 'object' && Object.prototype.toString.call(value) == '[object String]');
    };

    /**
     * Check if a value is either a function primitive or a Function object.
     *
     * @private
     * @memberof mu
     */
    mu._isFunction = function (value) {
        return !!value && (typeof value == 'object' || typeof value == 'function') && Object.prototype.toString.call(value) == '[object Function]';
    }

    /**
     * Check if a value is an Element (simplified).
     *
     * @private
     * @memberof mu
     */
    mu._isElement = function (value) {
        return !!value && value.nodeType === 1;
    }

    /**
     * Utility to check for interface violations and runtime invariants
     *
     * @private
     * @memberof mu
     */
    mu._assert = function(pred, message) {
        if (!pred)
            throw Error(message || 'assertion failed');
    };

    /**
     * A utility class for generating and manipulating html and svg nodes.
     *
     * @class
     * @param {string|Element} nodeName A node to wrap, or the name of the node to create, or a id selector like `#id` to find a node.
     * @param {string} namespace When creating a node, the namespace to create it in
     * @private
     * @memberof mu
     */
    mu._html = function(nodeName, namespace) {
        if (!(this instanceof mu._html))
            return new mu._html(nodeName, namespace);
        if (mu._isElement(nodeName)) {
            this._node = nodeName;
            this._namespace = nodeName.namespaceURI;
            return;
        }
        mu._assert(mu._isString(nodeName),
                   'invalid node name ' + nodeName);
        mu._assert(namespace == null || mu._isString(namespace),
                   'invalid namespace ' + namespace);
        if (nodeName[0] == '#') {
            this._node = document.getElementById(nodeName.substr(1));
            if (!this._node)
                throw Error('node not found: ' + nodeName);
        } else {
            this._namespace = namespace || mu._html._defaultNamespace(nodeName);
            if (this._namespace)
                this._node = document.createElementNS(this._namespace, nodeName);
            else
                this._node = document.createElement(nodeName);
        }
    }
    mu._html._SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    mu._html._defaultNamespace = function(nodeName) {
        if (nodeName == 'svg')
            return mu._html._SVG_NAMESPACE;
        return null;
    };

    /**
     * Returns the underlying html or svg node.
     *
     * @return The node
     * @memberof mu._html
     */
    mu._html.prototype.node = function() {
        return this._node;
    };

    /**
     * Adds a new node.
     *
     * @param {string|mu._html} nodeName The name of the node to create
     * @param {string} [namespace] The namespace to create it in
     * @memberof mu._html
     */
    mu._html.prototype.append = function(nodeName, namespace) {
        var child;
        if (mu._isElement(nodeName)) {
            child = mu._html(nodeName);
        } else if (nodeName instanceof mu._html) {
            child = nodeName;
        } else {
            mu._assert(mu._isString(nodeName),
                       'invalid node name ' + nodeName);
            mu._assert(namespace == null || mu._isString(namespace),
                       'invalid namespace ' + namespace);
            child = mu._html(nodeName, namespace || mu._html._defaultNamespace(nodeName) || this._namespace);
        }
        this._node.appendChild(child._node);
        return child;
    };

    /**
     * Sets an attribute on this node.
     *
     * @param {string} name The name of the attribute to set
     * @param {string|null} value The value to set the attribute to, null to remove the attribute
     * @memberof mu._html
     */
    mu._html.prototype.attr = function(name, value) {
        mu._assert(mu._isString(name),
                   'invalid name ' + name);
        mu._assert(value === null || mu._isFinite(value) || mu._isString(value),
                   'invalid value ' + value);
        if (value === null)
            this._node.removeAttribute(name);
        else {
            if (mu._isFinite(value))
                value = value + 'px';
            this._node.setAttribute(name, value);
        }
        return this;
    };

    /**
     * Adds or removes a CSS class on this node.
     *
     * @param {string} name The name of the CSS class
     * @param {boolean} value True if the CSS class is to be added, false to remove it
     * @memberof mu._html
     */
    mu._html.prototype.classed = function(name, value) {
        mu._assert(mu._isString(name),
                   'invalid name ' + name);
        mu._assert(typeof value == 'boolean',
                   'invalid value ' + value);
        var classStr = (this._node.getAttribute('class') || '').trim();
        var classes = classStr ? classStr.split(/\s+/) : [];
        if (value) {
            for (var i = 0; i < classes.length; i ++)
                if (classes[i] == name)
                    return;
            classes.push(name);
        } else {
            for (var i = 0; i < classes.length; i ++)
                if (classes[i] == name) {
                    classes.splice(i, 1);
                    i --;
                }
        }
        this._node.setAttribute('class', classes.join(' '));
        return this;
    };

    /**
     * Removes a node from the document.
     *
     * @memberof mu._html
     */
    mu._html.prototype.remove = function() {
        this._node.parentNode.removeChild(this._node);
        return this;
    };
    
    /**
     * Adds an event listener to a node.
     *
     * @param {string} type The event type (e.g. "click")
     * @param {Function} callback The event listener
     * @param thisObj An object to use as `this` when the listener is called
     * @memberof mu._html
     */
    mu._html.prototype.on = function(type, callback, thisObj) {
        mu._assert(mu._isString(type),
                   'invalid event type ' + type);
        mu._assert(mu._isFunction(callback),
                   'invalid event listener ' + callback);
        this._node.addEventListener(type, function(event) {
            callback.call(thisObj, event);
        }); 
        return this;
    };

    /**
     * An interface for objects which can fire mu events.  Not the same as
     * the browser's built-in events.
     *
     * @interface Eventable
     * @memberof mu
     */

    /**
     * Registers an object as capable of firing events.
     *
     * @private
     * @param {Function} obj The object
     * @memberof mu._html
     */
    mu._eventable = function(obj) {
        if (obj._fire)
            return;

        /**
         * Attaches an event listener.
         *
         * @name addEventListener
         * @param {string} type The type of the event
         * @param {Function} callback The function to call
         * @param thisObj The value of `this` when the function is called
         * @memberof mu.Eventable
         */
        obj.addEventListener = function(type, callback, thisObj) {
            var e = this._eventListeners = this._eventListeners || {};
            var a = e[type] = e[type] || [];
            a.push([callback, thisObj]);
        };

        /**
         * Removes an event listener.
         *
         * @name removeEventListener
         * @param {string} type The type of the event
         * @param {Function} callback The function to call
         * @param thisObj The value of `this` when the function is called
         * @memberof mu.Eventable
         */
        obj.removeEventListener = function(type, callback, thisObj) {
            var e = this._eventListeners = this._eventListeners || {};
            var a = e[type] = e[type] || [];
            for (var i = 0; i < a.length; i ++) {
                if (a[i][0] === callback && a[i][1] === thisObj) {
                    a.splice(i, 1);
                    return;
                }
            }
        };

        /**
         * Fires an event.
         * 
         * @name _fire
         * @protected
         * @param {string} type The type of the event
         * @param {object} data The argument to pass to the listeners
         * @memberof mu.Eventable
         */
        obj._fire = function(type, data) {
            var e = this._eventListeners;
            var a = e && e[type];
            if (!a)
                return;
            a.forEach(function(reg) {
                reg[0].call(reg[1], data);
            });
        };
    };
    mu._eventable(mu);
    
})();
