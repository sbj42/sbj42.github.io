function Html(nodeName, namespace) {
    if (!(this instanceof Html))
        return new Html(nodeName, namespace);
    if (nodeName.nodeType === 1) {
        this._node = nodeName;
        this._namespace = nodeName.namespaceURI;
    } else if (nodeName[0] == '#') {
        this._node = document.getElementById(nodeName.substr(1));
        this._namespace = this._node.namespaceURI;
    } else {
        this._namespace = namespace || Html._defaultNamespace(nodeName);
        if (this._namespace)
            this._node = document.createElementNS(this._namespace, nodeName);
        else
            this._node = document.createElement(nodeName);
    }
}
Html._SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
Html._defaultNamespace = function(nodeName) {
    if (nodeName == 'svg')
        return Html._SVG_NAMESPACE;
    return null;
};

Html.prototype.node = function() {
    return this._node;
};

Html.prototype.append = function(nodeName, namespace) {
    var child;
    if (nodeName.nodeType === 1) {
        child = Html(nodeName);
    } else if (nodeName instanceof Html) {
        child = nodeName;
    } else {
        child = Html(nodeName, namespace || Html._defaultNamespace(nodeName) || this._namespace);
    }
    this._node.appendChild(child._node);
    return child;
};

Html.prototype.attr = function(name, value) {
    if (value === null)
        this._node.removeAttribute(name);
    else {
        if (typeof value == 'number')
            value = value + 'px';
        this._node.setAttribute(name, value);
    }
    return this;
};

Html.prototype.classed = function(name, value) {
    var classStr = (this._node.getAttribute('class') || '').trim();
    var classes = classStr ? classStr.split(/\s+/) : [];
    if (value) {
        for (var i = 0; i < classes.length; i ++)
            if (classes[i] == name)
                return this;
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

Html.prototype.text = function(text) {
    this._node.textContent = text;
    return this;
};

Html.prototype.html = function(html) {
    this._node.innerHTML = html;
    return this;
};

Html.prototype.clear = function() {
    while (this._node.firstChild)
        this._node.removeChild(this._node.firstChild);
    return this;
};
    
Html.prototype.remove = function() {
    this._node.parentNode.removeChild(this._node);
    return this;
};
    
Html.prototype.on = function(type, callback, thisObj) {
    this._node.addEventListener(type, function(event) {
        return callback.call(thisObj, event);
    }); 
    return this;
};
