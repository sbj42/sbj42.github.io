/* global ThingDB, util */
function ThingEdit(db, elem) {
    if (!(this instanceof ThingEdit))
        return new ThingEdit(db, elem);
    this._db = db;
    this._elem = elem;
    ['name', 'category', 'tags', 'width', 'height'].forEach(function(n) {
        this._elem.find('.info input[name="' + n + '"]')
            .on('input', this._onInput.bind(this));
    }, this);
    ['blocksvision', 'blocksmovement'].forEach(function(n) {
        this._elem.find('.info .' + n + ' input')
            .on('click', this._onInput.bind(this));
    }, this);
    this._elem.find('.info select[name="type"]')
        .on('change', this._onInput.bind(this));
    for (var name in ThingDB.TYPE_INFO) {
        $('<option>').attr('label', name).attr('value', name)
            .appendTo(this._elem.find('.info select[name="type"]'));
    }
    this._elem.find('.info .buttons input[name="new"]')
        .on('click', this._onNew.bind(this));
    this._elem.find('.info .buttons input[name="remove"]')
        .on('click', this._onRemove.bind(this));
    $(window).keydown(function(event) {
        if (event.altKey) {
            if (event.which == 78)
                this._onNew();
            else if (event.which == 46)
                this._onRemove();
        //else console.info('which ' + event.which);
        }
    }.bind(this));
    this._canvas = this._elem.find('.image .canvas')[0];
    this._canon = this._elem.find('.sample .canon')[0];
    this._demo = this._elem.find('.sample .demo')[0];
    this._elem.find('.sample select[name="floor"]')
        .on('change', this._onFloor.bind(this));
    this._elem.find('.sample input[name="flip"]')
        .on('click', this._onFlip.bind(this));
    this._elem.find('.sample input[name="rotate"]')
        .on('click', this._onRotate.bind(this));
    this._elem.find('.image .canvas')
        .on('mousemove', this._onImageMouseMove.bind(this))
        .on('mouseout', this._onImageMouseOut.bind(this))
        .on('mousedown', this._onImageMouseDown.bind(this))
        .on('mouseup', this._onImageMouseUp.bind(this));
    ['lock', 'draw', 'mix', 'sample', 'export'].forEach(function(n) {
        this._elem.find('.tools input[name="' + n + '"]')
            .on('click', this._onTool.bind(this, n));
    }, this);
    var importid = 'imp'+Math.floor(Math.random()*10000000);
    this._elem.find('.tools .importlabel').attr('for', importid);
    this._elem.find('.tools .importfile').attr('id', importid)[0]
        .addEventListener('change', this._onTool.bind(this, 'import'));
    ['h', 's', 'l', 'a'].forEach(function(n) {
        this._elem.find('.tools input[name="' + n + '"]')
            .on('input', this._onHSLA.bind(this));
    }, this);
    for (var i = 0; i < ThingEdit.PALETTE.length; i ++) {
        var r = ThingEdit.PALETTE[i];
        var can = $('<canvas>').addClass('palettecolor')
            .on('click', this._onPalette.bind(this, i))
            .appendTo(this._elem.find('.tools .palette'))[0];
        can.width = 18;
        can.height = 22;
        var ctx = can.getContext('2d');
        ctx.clearRect(0, 0, can.width, can.height);
        ctx.strokeStyle='#666';
        ctx.lineWidth=2;
        var d = can.width/5;
        ctx.strokeRect(d, d, can.width-2*d, can.height-2*d);
        ctx.fillStyle = 'hsla(' + r[0] + ',' + r[1] + '%,' + r[2] + '%,' + (r[3]/100) + ')';
        ctx.fillRect(0, 0, can.width, can.height);
    }
    this._recent = ThingEdit.START_RECENT.slice();
    this._recent.forEach(function(r, i) {
        $('<canvas>').addClass('palettecolor')
            .on('click', this._onRecent.bind(this, i))
            .appendTo(this._elem.find('.tools .recent'));
    }.bind(this));
    this._updateRecent();
    this.select();
    this._onTool(null);
    $(this._db).on('select', function(event, thing) {
        this.select(thing);
    }.bind(this));
}

ThingEdit.START_RECENT = [
    [  0,   0,   0,   0],
    [  0,   0,   0,   0],
    [  0,   0,   0,   0],
    [  0,   0,   0,   0],
    [  0,   0,   0,   0]
];
ThingEdit.PALETTE = [
    [  0,   0,   0,   0],
    [  0,   0,   0, 100],
    [  0,   0,  33, 100],
    [  0,   0,  66, 100],
    [  0,   0, 100, 100],
    [  0,  60,  60, 100],
    [ 60,  60,  60, 100],
    [120,  60,  60, 100],
    [240,  60,  60, 100],
    [300,  60,  60, 100],
    [ 30,  60,  60, 100],
    [ 90,  60,  60, 100],
    [150,  60,  60, 100],
    [270,  60,  60, 100],
    [330,  60,  60, 100]
];

ThingEdit.prototype._onInput = function () {
    var name = this._elem.find('.info input[name="name"]').prop('value').trim();
    if (!name) name = this._thing.name;
    var type = this._elem.find('.info select[name="type"]').prop('value').trim().toLowerCase();
    var typeInfo = ThingDB.TYPE_INFO[type];
    var category = this._elem.find('.info input[name="category"]').prop('value').trim();
    var tags = this._elem.find('.info input[name="tags"]').prop('value').trim().split(/\s*,\s*/);
    var width = parseInt(this._elem.find('.info input[name="width"]').prop('value'), 10);
    if (isNaN(width) || width < 1 || width > 7) width = this._thing.width;
    if (typeInfo.width) width = typeInfo.width;
    var height = parseInt(this._elem.find('.info input[name="height"]').prop('value'), 10);
    if (isNaN(height) || height < 1 || height > 7) height = this._thing.height;
    if (typeInfo.height) height = typeInfo.height;
    var blocksVision = typeInfo.canBlockVision && this._elem.find('.info .blocksvision input').prop('checked') || undefined;
    var blocksMovement = typeInfo.canBlockMovement && this._elem.find('.info .blocksmovement input').prop('checked') || undefined;
    if (name == this._thing.name && type == this._thing.type && category == this._thing.category && tags.join(',') == this._thing.tags.join(',') && width == this._thing.width && height == this._thing.height
        && blocksVision == this._thing.blocksVision && blocksMovement == this._thing.blocksMovement)
        return;
    this._thing = this._db.changeThing(this._thing.name, {
        name: name,
        type: type,
        category: category,
        tags: tags,
        width: width,
        height: height,
        blocksVision: blocksVision,
        blocksMovement: blocksMovement
    });
    this._rerender();
};

ThingEdit.prototype._renderCanon = function() {
    if (!this._thing)
        return;
    var thing = this._thing;
    var ctx = this._canon.getContext('2d');
    ctx.clearRect(0, 0, this._canon.width, this._canon.height);
    if (thing.type == ThingDB.TYPE_FLOOR) {
        ctx.fillStyle='#000';
        ctx.fillRect(0, 0, this._canon.width, this._canon.height);
    }
    var image = new Image;
    image.src = this._thing.img;
    ctx.drawImage(image, 0, 0);
};

ThingEdit.prototype._renderDemo = function() {
    if (!this._thing)
        return;
    var thing = this._thing;
    var ctx = this._demo.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, this._demo.width, this._demo.height);
    var image = new Image;
    image.src = this._thing.img;
    if (thing.type == ThingDB.TYPE_FLOOR) {
        for (var x = 0; x <= this._demo.width; x += this._st)
            for (var y = 0; y <= this._demo.height; y += this._st)
                ctx.drawImage(image, x, y);
        this._elem.find('.sample .ifnofloor').hide();
    } else {
        if (this._curfloor) {
            var things = this._db.things();
            var floor = things[this._curfloor];
            if (floor) {
                var floorImage = new Image();
                floorImage.src = floor.img;
                for (var x = 0; x <= this._demo.width; x += this._st)
                    for (var y = 0; y <= this._demo.height; y += this._st)
                        ctx.drawImage(floorImage, x, y);
            }
        }
        if (thing.type == ThingDB.TYPE_WATER) {
            ctx.drawImage(image, 0, 0, this._st * 3, this._st * 3, this._st, this._st, this._st * 3, this._st * 3);
        } else {
            var cx = this._demo.width/2;
            var cy = this._demo.height/2;
            var x = Math.floor((this._demo.width/this._st - this._thing.width)/2) * this._st;
            var y = Math.floor((this._demo.height/this._st - this._thing.height)/2) * this._st;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(this._curRotate * Math.PI / 180);
            if (this._curFlip)
                ctx.scale(-1, 1);
            ctx.translate(-cx, -cy);
            ctx.drawImage(image, x, y);
            ctx.restore();
        }
        this._elem.find('.sample .ifnofloor').show();
    }
};

ThingEdit.prototype._renderImage = function() {
    if (!this._thing)
        return;
    var thing = this._thing;
    var sctx = this._canon.getContext('2d');
    var ctx = this._canvas.getContext('2d');
    ctx.fillStyle='#000';
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 1;
    for (var y = 1; y < thing.height; y ++) {
        ctx.beginPath();
        ctx.moveTo(0, y * this._t + 0.5);
        ctx.lineTo(this._canvas.width, y * this._t + 0.5);
        ctx.stroke();
    }
    for (var x = 1; x < thing.width; x ++) {
        ctx.beginPath();
        ctx.moveTo(x * this._t + 0.5, 0);
        ctx.lineTo(x * this._t + 0.5, this._canvas.height);
        ctx.stroke();
    }
    if (thing.type != ThingDB.TYPE_FLOOR) {
        ctx.strokeStyle='#666';
        ctx.lineWidth=2;
        var d = Math.floor(this._p / 5);
        for (var x = 0; x < ThingDB.TILE_PIXELS * thing.width; x ++) {
            for (var y = 0; y < ThingDB.TILE_PIXELS * thing.height; y ++) {
                ctx.strokeRect(x * this._p + 0.5 + d, y * this._p + 0.5 + d, this._p - 1 - d * 2, this._p - 1 - d * 2);
            }
        }
    }
    for (var x = 0; x < ThingDB.TILE_PIXELS * thing.width; x ++) {
        for (var y = 0; y < ThingDB.TILE_PIXELS * thing.height; y ++) {
            var data = sctx.getImageData(x, y, 1, 1).data;
            ctx.fillStyle='rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3]/255 + ')';
            ctx.fillRect(x * this._p, y * this._p, this._p, this._p);
        }
    }
    if (this._x != null && this._tool != 'lock') {
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.strokeRect(this._x * this._p + 0.5, this._y * this._p + 0.5, this._p - 1, this._p - 1);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.strokeRect(this._x * this._p + 1.5, this._y * this._p + 1.5, this._p - 3, this._p - 3);
    }
};

ThingEdit.prototype._rerender = function () {
    var typeInfo = ThingDB.TYPE_INFO[this._thing.type];
    this._elem.find('.ifwidth').toggle(!typeInfo.width);
    this._elem.find('.ifheight').toggle(!typeInfo.height);
    this._elem.find('.info .blocksvision').toggle(!!typeInfo.canBlockVision);
    this._elem.find('.info .blocksmovement').toggle(!!typeInfo.canBlockMovement);
    this._elem.find('.sample .ifflip').toggle(!!typeInfo.canFlip);
    this._elem.find('.sample .ifrotate').toggle(!!typeInfo.canRotate);
    var body = this._elem.find('.notinfo .image .body')[0];
    var pw = Math.floor((body.clientWidth - 20) / (this._thing.width * ThingDB.TILE_PIXELS));
    var ph = Math.floor((body.clientHeight - 20) / (this._thing.height * ThingDB.TILE_PIXELS));
    this._p = Math.min(pw, ph, 20);
    this._t = ThingDB.TILE_PIXELS * this._p;
    this._st = ThingDB.TILE_PIXELS;
    this._canvas.width = this._thing.width * this._t;
    this._canvas.height = this._thing.height * this._t;
    this._canon.width = this._thing.width * this._st;
    this._canon.height = this._thing.height * this._st;
    this._demo.width = 5 * this._st;
    this._demo.height = 5 * this._st;
    this._renderCanon();
    this._renderDemo();
    this._renderImage();
    var img = this._canon.toDataURL('image/png');
    if (img != this._thing.img) {
        this._thing = this._db.changeThing(this._thing.name, {
            img: img
        });
    }
};

ThingEdit.prototype._activateTool = function () {
    function mix(a, b) {
        var ret = Math.round((a*14 + b)/15);
        a = Math.round(a);
        b = Math.round(b);
        if (ret == a && a != b)
            ret = a + (b > a ? 1 : -1);
        return ret;
    }

    if (this._tool == 'lock' || this._x == null)
        return;
    var ctx = this._canon.getContext('2d');
    if (this._tool == 'sample') {
        var data = ctx.getImageData(this._x, this._y, 1, 1).data;
        var hsl = util.rgbToHsl(data[0], data[1], data[2]);
        this._setColor(hsl[0], hsl[1], hsl[2], Math.round(data[3]*100/255));
    } else {
        var hsla = this._getColor();
        this._addRecent();
        if (this._tool == 'draw') {
            ctx.fillStyle = 'hsla(' + hsla[0] + ',' + hsla[1] + '%,' + hsla[2] + '%,' + (hsla[3]/100) + ')';
        } else if (this._tool == 'mix') {
            var cur = ctx.getImageData(this._x, this._y, 1, 1).data;
            var tgt = util.hslToRgb(hsla[0], hsla[1], hsla[2]);
            var nxt = [mix(cur[0], tgt[0]), mix(cur[1], tgt[1]), mix(cur[2], tgt[2]), mix(cur[3]*100/255, hsla[3])];
            ctx.fillStyle = 'rgba(' + nxt[0] + ',' + nxt[1] + ',' + nxt[2] + ',' + (nxt[3]/100) + ')';
        }
        ctx.clearRect(this._x, this._y, 1, 1);
        ctx.fillRect(this._x, this._y, 1, 1);
        this._renderImage();
    }
};

ThingEdit.prototype._onImageMouseMove = function (event) {
    var x = Math.floor(event.offsetX / this._p);
    var y = Math.floor(event.offsetY / this._p);
    if (x < 0 || y < 0 || x >= this._thing.width * ThingDB.TILE_PIXELS || y >= this._thing.height * ThingDB.TILE_PIXELS)
        x = y = null;
    this._x = x;
    this._y = y;
    this._renderImage();
    if (event.buttons == 1) {
        this._activateTool();
    }
};

ThingEdit.prototype._onImageMouseOut = function (event) {
    this._x = this._y = null;
    this._renderImage();
};

ThingEdit.prototype._onImageMouseDown = function (event) {
    this._activateTool();
    event.preventDefault();
    return false;
};

ThingEdit.prototype._onImageMouseUp = function (event) {
    if (this._tool == 'lock')
        return;
    var img = this._canon.toDataURL('image/png');
    if (img != this._thing.img) {
        this._thing = this._db.changeThing(this._thing.name, {
            img: img
        });
    }
    if (this._tool == 'sample') {
        this._addRecent();
        this._onTool('draw');
    }
    this._rerender();
};

ThingEdit.prototype.select = function (thing) {
    this._thing = thing;
    this._curRotate = 0;
    this._curFlip = false;
    this._elem.find('.ifthing').toggle(!!thing);
    this._elem.find('.ifnothing').toggle(!thing);
    this._onHSLA();
    if (thing) {
        this._updateSampleFloors();
        this._elem.find('.info input[name="name"]').prop('value', thing.name)
            .focus()[0].select();
        this._elem.find('.info select[name="type"]').prop('value', thing.type);
        this._elem.find('.info input[name="category"]').prop('value', thing.category);
        this._elem.find('.info input[name="tags"]').prop('value', thing.tags.join(', '));
        this._elem.find('.info input[name="width"]').prop('value', thing.width);
        this._elem.find('.info input[name="height"]').prop('value', thing.height);
        this._elem.find('.info .blocksvision input').prop('checked', !!thing.blocksVision);
        this._elem.find('.info .blocksmovement input').prop('checked', !!thing.blocksMovement);
        this._rerender();
    } else {
        this._p = this._t = 0;
        this._canvas.width = 0;
        this._canvas.height = 0;
        this._canon.width = 0;
        this._canon.height = 0;
    }
    this._onTool(null);
};

ThingEdit.prototype._updateSampleFloors = function () {
    var select = this._elem.find('.sample select[name="floor"]').empty();
    var opt = $('<option>').attr('label', '').attr('value', '')
        .appendTo(select);
    if (!this._curfloor)
        opt.attr('selected', 'selected');
    var things = this._db.things();
    for (var x in things) {
        var thing = things[x];
        if (thing.type == ThingDB.TYPE_FLOOR) {
            opt = $('<option>').attr('label', x).attr('value', x)
                .appendTo(select);
            if (this._curfloor == x)
                opt.attr('selected', 'selected');
        }
    }
};

ThingEdit.prototype._onNew = function(event) {
    this.select(this._db.newThing());
};

ThingEdit.prototype._onRemove = function(event) {
    if (!this._thing)
        return;
    this._db.removeThing(this._thing.name);
    this.select();
};

ThingEdit.prototype._onTool = function (tool, event) {
    if (tool == 'import') {
        var file = event.target.files[0];
        if (file.type.substring(0, 6) == 'image/') {
            var reader = new FileReader();
            reader.onload = function(event) {
                var img = event.target.result;
                if (img != this._thing.img) {
                    this._thing = this._db.changeThing(this._thing.name, {
                        img: img
                    });
                }
                this._rerender();
            }.bind(this);
            reader.readAsDataURL(file);
        }
        return;
    } else if (tool == 'export') {
        var link = document.createElement("a");
        link.download = this._thing.name + '.png';
        link.href = this._thing.img;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }
    tool = tool || 'lock';
    if (this._tool) {
        this._elem.find('.tools input[name="' + this._tool + '"]').removeClass('selected').blur();
        this._elem.find('.image canvas').removeClass(this._tool + '-tool');
    }
    this._tool = tool;
    this._elem.find('.tools input[name="' + this._tool + '"]').addClass('selected');
    this._elem.find('.image canvas').addClass(this._tool + '-tool');
};

ThingEdit.prototype._getColor = function () {
    var h = Math.max(0, Math.min(360, this._elem.find('.tools input[name="h"]').prop('value')));
    var s = Math.max(0, Math.min(100, this._elem.find('.tools input[name="s"]').prop('value')));
    var l = Math.max(0, Math.min(100, this._elem.find('.tools input[name="l"]').prop('value')));
    var a = Math.max(0, Math.min(100, this._elem.find('.tools input[name="a"]').prop('value')));
    return [h,s,l,a];
};

ThingEdit.prototype._onHSLA = function () {
    var hsla = this._getColor();
    var colorcss = 'hsla(' + hsla[0] + ',' + hsla[1] + '%,' + hsla[2] + '%,' + (hsla[3]/100) + ')';
    var can = this._elem.find('.tools .curcolor')[0];
    can.width = can.clientWidth;
    can.height = can.clientHeight;
    var ctx = can.getContext('2d');
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.strokeStyle='#666';
    ctx.lineWidth=2;
    var d = can.height/5;
    ctx.strokeRect(d, d, can.width-2*d, can.height-2*d);
    ctx.fillStyle = colorcss;
    ctx.fillRect(0, 0, can.width, can.height);
};

ThingEdit.prototype._setColor = function (h, s, l, a) {
    this._elem.find('.tools input[name="h"]').prop('value', Math.max(0, Math.min(360, h)));
    this._elem.find('.tools input[name="s"]').prop('value', Math.max(0, Math.min(100, s)));
    this._elem.find('.tools input[name="l"]').prop('value', Math.max(0, Math.min(100, l)));
    this._elem.find('.tools input[name="a"]').prop('value', Math.max(0, Math.min(100, a)));
    this._onHSLA();
};

ThingEdit.prototype._onPalette = function(i) {
    var c = ThingEdit.PALETTE[i];
    this._setColor(c[0], c[1], c[2], c[3]);
};

ThingEdit.prototype._onRecent = function(i) {
    var c = this._recent[i];
    this._setColor(c[0], c[1], c[2], c[3]);
};

ThingEdit.prototype._addRecent = function () {
    var hsla = this._getColor();
    var found = false;
    this._recent.forEach(function(c) {
        if (c.join(',') == hsla.join(','))
            found = true;
    });
    if (!found) {
        this._recent = [hsla].concat(this._recent.slice(0,this._recent.length-1));
        this._updateRecent();
    }
};

ThingEdit.prototype._updateRecent = function () {
    for (var i = 0; i < this._recent.length; i ++) {
        var r = this._recent[i];
        var can = this._elem.find('.tools .recent .palettecolor')[i];
        can.width = 18;
        can.height = 22;
        var ctx = can.getContext('2d');
        ctx.clearRect(0, 0, can.width, can.height);
        ctx.strokeStyle='#666';
        ctx.lineWidth=2;
        var d = can.width/5;
        ctx.strokeRect(d, d, can.width-2*d, can.height-2*d);
        ctx.fillStyle = 'hsla(' + r[0] + ',' + r[1] + '%,' + r[2] + '%,' + (r[3]/100) + ')';
        ctx.fillRect(0, 0, can.width, can.height);
    }
};

ThingEdit.prototype._onImport = function (event) {
    var file = event.target.files[0];
    if (file.type.substring(0, 6) == 'image/') {
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = event.target.result;
            if (img != this._thing.img) {
                this._thing = this._db.changeThing(this._thing.name, {
                    img: img
                });
            }
            this._rerender();
        }.bind(this);
        reader.readAsDataURL(file);
    }
};

ThingEdit.prototype._onFloor = function (event) {
    this._curfloor = this._elem.find('.sample select[name="floor"]').prop('value');
    this._renderDemo();
};

ThingEdit.prototype._onFlip = function (event) {
    if (ThingDB.TYPE_INFO[this._thing.type].canFlip)
        this._curFlip = !this._curFlip;
    this._renderDemo();
};

ThingEdit.prototype._onRotate = function (event) {
    var canRotate = ThingDB.TYPE_INFO[this._thing.type].canRotate || 1;
    this._curRotate = (this._curRotate + (360 / canRotate)) % 360;
    this._renderDemo();
};
