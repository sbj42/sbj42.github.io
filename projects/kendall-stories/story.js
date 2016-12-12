var sounds = {};

function KSound(node) {
    this.node = node;
    this.duration = node.duration();
}

KSound.prototype.play = function(callback) {
    this.node.play();
    if (callback) setTimeout(callback, this.duration * 1000);
};

function play_sound(soundId, callback) {
    sounds[soundId].play(callback);
}

function load_audio(ids, callback) {
    var loaded = 0;
    function onload(id,  node) {
        return function() {
            sounds[id] = new KSound(node);
            if (++loaded == ids.length && callback)
                callback();
        };
    }
    ids.forEach(function(id) {
        var node = new Howl({
            src: [id+'.ogg', id+'.m4a']
        });
        node.once('load', onload(id, node));
    });
}

var images = {};

function KImage(node) {
    this.node = node;
}

function load_images(ids, callback) {
    var loaded = 0;
    function onload(id,  node) {
        return function() {
            images[id] = new KImage(node);
            if (++loaded == ids.length && callback)
                callback();
        };
    }
    ids.forEach(function(id) {
        var node = new Image();
        node.onload = onload(id,  node);
        node.onerror = onload(id,  node);
        node.onabort = onload(id,  node);
        node.src = id + '.svg';
    });
};

var sprites = {};

function KSprite(imageId) {
    var image = images[imageId];
    this.image = new Image();
    this.image.src = image.node.src;
    this.div = document.createElement('div');
    this.div.className = 'sprite';
    this.div.appendChild(this.image);
}

function new_sprite(imageId) {
    return new KSprite(imageId);
}

var active_sprites = [];

KSprite.prototype.setImage = function(imageId) {
    TweenMax.set(this.image, {src: images[imageId].node.src});
    return this;
};

KSprite.prototype.place = function(x, y) {
    if (!this.active) {
        this.active = true;
        document.getElementById('stage').appendChild(this.div);
        active_sprites.push(this);
    }
    TweenMax.set(this.div, {left: x, top: y});
    this.width = this.image.clientWidth;
    this.height = this.image.clientHeight;
    TweenMax.set(this.image, {left: -this.width/2, top: -this.height/2});
    return this;
};

KSprite.prototype.bottom = function() {
    var stage = document.getElementById('stage');
    stage.insertBefore(this.div, stage.firstChild);
    return this;
};

KSprite.prototype.anchor = function(ax, ay) {
    TweenMax.set(this.image, {left: -ax*this.width, top: -ay*this.height});
    return this;
};

KSprite.prototype.rotate = function(duration, rot, callback) {
    TweenMax.to(this.div, duration, {rotation: rot});
    if (callback) setTimeout(callback, duration*1000);
    return this;
};

KSprite.prototype.hide = function() {
    if (this.active) {
        this.active = false;
        TweenMax.killTweensOf(this.div);
        TweenMax.killTweensOf(this.image);
        document.getElementById('stage').removeChild(this.div);
        for (var i = 0; i < active_sprites.length; i ++) {
            if (active_sprites[i] == this) {
                active_sprites.splice(i, 1);
                break;
            }
        }
    }
    return this;
};

KSprite.prototype.wiggle = function(duration, amount) {
    if (!amount)
        amount = 15;
    TweenMax.set(this.div, {rotation: amount});
    TweenMax.to(this.div, duration, {rotation: -amount, repeat: -1, yoyo: true, ease: Sine.easeInOut});
    return this;
};

KSprite.prototype.talk = function(openImage, openCloseTimes) {
    var closeImageSrc = this.image.src;
    var openImageSrc = images[openImage].node.src;
    for (var i = 0; i < openCloseTimes.length; i += 2) {
        TweenMax.set(this.image, {src: openImageSrc, delay: openCloseTimes[i]});
        TweenMax.set(this.image, {src: closeImageSrc, delay: openCloseTimes[i+1]});
    }
    return this;
};

KSprite.prototype.flip = function(duration, sx, callback) {
    TweenMax.to(this.image, duration, {scaleX: sx});
    if (callback) setTimeout(callback, duration*1000);
    return this;
};

KSprite.prototype.slide = function(duration, x, y, callback) {
    TweenMax.to(this.div, duration, {left: x, top: y, ease: Sine.easeInOut});
    if (callback) setTimeout(callback, duration*1000);
    return this;
};

KSprite.prototype.bounce = function(duration, x, y, callback) {
    TweenMax.to(this.div, duration, {left: x, top: y, ease: Bounce.easeOut});
    if (callback) setTimeout(callback, duration*1000);
    return this;
};

function clear() {
    while (active_sprites.length)
        active_sprites[0].hide();
}

function ready() {
    document.getElementById('start').style.visibility = 'visible';
    document.getElementById('start').onclick = function() {
        document.getElementById('start').style.visibility = 'hidden';
        start();
    };
}

function wait(duration, callback) {
    setTimeout(callback, duration*1000);
}

function done() {
    document.getElementById('reset').style.visibility = 'visible';
    document.getElementById('reset').onclick = function() {
        document.getElementById('reset').style.visibility = 'hidden';
        document.getElementById('start').style.visibility = 'visible';
        reset();
    };
}