/* global ThingDB, PlaceDB, util */
function PlaceEdit(placedb, thingdb, elem) {
    if (!(this instanceof PlaceEdit))
        return new PlaceEdit(placedb, thingdb, elem);
    this._db = placedb;
    this._thingdb = thingdb;
    this._elem = elem;
    ['name', 'width', 'height'].forEach(function(n) {
        this._elem.find('.info input[name="' + n + '"]')
            .on('input', this._onInput.bind(this));
    }, this);
    this._elem.find('.info select[name="type"]')
        .on('change', this._onInput.bind(this));
    for (var name in PlaceDB.TYPE_INFO) {
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
    this._canvas = this._elem.find('.view canvas')[0];
    this._thingsample = this._elem.find('.toolbar .thing canvas')[0];
    this._elem.find('.view .canvas')
        .on('mousemove', this._onImageMouseMove.bind(this))
        .on('mouseout', this._onImageMouseOut.bind(this))
        .on('mousedown', this._onImageMouseDown.bind(this))
        .on('mouseup', this._onImageMouseUp.bind(this));
    ['lock', 'tile', 'thing'].forEach(function(n) {
        this._elem.find('.tools input[name="' + n + '"]')
            .on('click', this._onTool.bind(this, n));
    }, this);
    this.select();
    this._onTool(null);
    $(this._db).on('select', function(event, place) {
        this.select(place);
    }.bind(this));
    $(this._thingdb).on('select', function(event, thing) {
        this._onThing(thing);
    }.bind(this));
    this._elem.find('.thing input[name="rotate"]')
        .on('click', this._onThingRotate.bind(this));
}

PlaceEdit.prototype._onInput = function () {
    var name = this._elem.find('.info input[name="name"]').prop('value').trim();
    if (!name) name = this._place.name;
    var type = this._elem.find('.info select[name="type"]').prop('value').trim().toLowerCase();
    var typeInfo = PlaceDB.TYPE_INFO[this._place.type];
    var width = parseInt(this._elem.find('.info input[name="width"]').prop('value'), 10);
    if (isNaN(width) || width < 1 || width > 330) width = this._place.width;
    if (typeInfo.width) width = typeInfo.width;
    if (typeInfo.minWidth && width < typeInfo.minWidth) width = typeInfo.minWidth;
    if (typeInfo.maxWidth && width > typeInfo.maxWidth) width = typeInfo.maxWidth;
    var height = parseInt(this._elem.find('.info input[name="height"]').prop('value'), 10);
    if (isNaN(height) || height < 1 || height > 330) height = this._place.height;
    if (typeInfo.height) height = typeInfo.height;
    if (typeInfo.minHeight && height < typeInfo.minHeight) height = typeInfo.minHeight;
    if (typeInfo.maxHeight && height > typeInfo.maxHeight) height = typeInfo.maxHeight;
    if (name == this._place.name && type == this._place.type && width == this._place.width && height == this._place.height)
        return;
    this._place = this._db.changePlace(this._place.name, {
        name: name,
        type: type,
        width: width,
        height: height
    });
    this._rerender();
};

PlaceEdit.prototype._renderView = function() {
    var imageCache = {};
    var self = this;
    function getThingImg(name) {
        if (!(name in imageCache)) {
            var img = new Image();
            img.src = self._thingdb.things()[name].img;
            imageCache[name] = img;
        }
        return imageCache[name];
    }
    if (!this._place)
        return;
    var place = this._place;
    var ctx = this._canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle='#000';
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 1;
    for (var y = 0; y <= place.height; y += 10) {
        var ay = this._margins.top + y;
        ctx.beginPath();
        ctx.moveTo(0, ay * this._t + 0.5);
        ctx.lineTo(this._canvas.width, ay * this._t + 0.5);
        ctx.stroke();
    }
    for (var x = 0; x <= place.width; x += 10) {
        var ax = this._margins.left + x;
        ctx.beginPath();
        ctx.moveTo(ax * this._t + 0.5, 0);
        ctx.lineTo(ax * this._t + 0.5, this._canvas.height);
        ctx.stroke();
    }
    ctx.strokeStyle='#666';
    ctx.lineWidth=1;
    var d = Math.floor(this._t / 5);
    for (var x = 0; x < place.width; x ++) {
        var ax = this._margins.left + x;
        for (var y = 0; y < place.height; y ++) {
            var ay = this._margins.top + y;
            ctx.strokeRect(ax * this._t + 0.5 + d, ay * this._t + 0.5 + d, this._t - 1 - d * 2, this._t - 1 - d * 2);
        }
    }
    if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_FULL || this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_PLOT
            || this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_CORNER) {
        var pavementImg = getThingImg('pavement');
        var whiteLineImg = getThingImg('road line white solid');
        var yellowLineImg = getThingImg('road line yellow dashed');
        var concreteImg = getThingImg('concrete');
        if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_PLOT) {
            for (var x = 0; x < this._margins.left; x ++) {
                ctx.drawImage(concreteImg, x * this._t, 4 * this._t, this._t, this._t);
            }
        }
        if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_CORNER) {
            var bstart = this._margins.top + place.height;
            for (var y = 0; y < this._margins.bottom; y ++) {
                ctx.drawImage(concreteImg, 4 * this._t, (bstart + y) * this._t, this._t, this._t);
            }
        }
        if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_PLOT || this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_CORNER) {
            var rstart = this._margins.left + place.width;
            for (var x = 0; x < this._margins.right; x ++) {
                ctx.drawImage(concreteImg, (rstart + x) * this._t, 4 * this._t, this._t, this._t);
            }
        }
        for (var x = 0; x < place.width + this._margins.left + this._margins.right; x ++) {
            for (var y = 0; y < this._margins.top; y ++) {
                ctx.drawImage(pavementImg, x * this._t, y * this._t, this._t, this._t);
            }
            if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_PLOT
                    || x >= this._margins.left
                    && (this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_CORNER || x < this._margins.left + place.width)) {
                util.drawImageRotate(ctx, whiteLineImg, x * this._t, 0 * this._t, this._t, this._t, Math.PI/2);
                util.drawImageRotate(ctx, yellowLineImg, x * this._t, 2 * this._t, this._t, this._t, Math.PI/2);
                util.drawImageRotate(ctx, whiteLineImg, x * this._t, 3 * this._t, this._t, this._t, -Math.PI/2);
            }
            if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_FULL) {
                var bstart = this._margins.top + place.height;
                for (var y = 0; y < this._margins.bottom; y ++) {
                    ctx.drawImage(pavementImg, x * this._t, (bstart + y) * this._t, this._t, this._t);
                }
                if (x >= this._margins.left && x < this._margins.left + place.width) {
                    util.drawImageRotate(ctx, whiteLineImg, x * this._t, (bstart + 0) * this._t, this._t, this._t, Math.PI/2);
                    util.drawImageRotate(ctx, yellowLineImg, x * this._t, (bstart + 2) * this._t, this._t, this._t, Math.PI/2);
                    util.drawImageRotate(ctx, whiteLineImg, x * this._t, (bstart + 3) * this._t, this._t, this._t, -Math.PI/2);
                }
            }
        }
        if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_FULL || this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_CORNER) {
            var rstart = this._margins.left + place.width;
            var yextra = this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_CORNER ? this._margins.bottom : 0;
            for (var y = this._margins.top; y < place.height + this._margins.top + yextra; y ++) {
                for (var x = 0; x < this._margins.left; x ++) {
                    ctx.drawImage(pavementImg, x * this._t, y * this._t, this._t, this._t);
                }
                util.drawImageRotate(ctx, whiteLineImg, 0 * this._t, y * this._t, this._t, this._t, 0);
                util.drawImageRotate(ctx, yellowLineImg, 2 * this._t, y * this._t, this._t, this._t, 0);
                util.drawImageRotate(ctx, whiteLineImg, 3 * this._t, y * this._t, this._t, this._t, Math.PI);
                if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_FULL) {
                    for (var x = 0; x < this._margins.right; x ++) {
                        ctx.drawImage(pavementImg, (rstart + x) * this._t, y * this._t, this._t, this._t);
                    }
                    util.drawImageRotate(ctx, whiteLineImg, (rstart + 0) * this._t, y * this._t, this._t, this._t, 0);
                    util.drawImageRotate(ctx, yellowLineImg, (rstart + 2) * this._t, y * this._t, this._t, this._t, 0);
                    util.drawImageRotate(ctx, whiteLineImg, (rstart + 3) * this._t, y * this._t, this._t, this._t, Math.PI);
                }
            }
        }
    }
    for (var x = 0; x < place.width; x ++) {
        var ax = this._margins.left + x;
        for (var y = 0; y < place.height; y ++) {
            var ay = this._margins.top + y;
            var tile = this._place.tiles[x + ',' + y];
            if (tile && tile.floor) {
                var img = getThingImg(tile.floor);
                ctx.drawImage(img, ax * this._t, ay * this._t, this._t, this._t);
            }
        }
    }
    for (var x = 0; x < place.width; x ++) {
        var ax = this._margins.left + x;
        for (var y = 0; y < place.height; y ++) {
            var ay = this._margins.top + y;
            var tile = this._place.tiles[x + ',' + y];
            if (tile && tile.things) {
                tile.things.forEach(function(athing) {
                    var img = getThingImg(athing.type);
                    var thing = this._thingdb.things()[athing.type];
                    ctx.save();
                    ctx.translate((ax + 0.5) * this._t, (ay + 0.5) * this._t);
                    ctx.rotate((athing.rotate || 0) * Math.PI / 180);
                    ctx.translate(-(ax + 0.5) * this._t, -(ay + 0.5) * this._t);
                    ctx.drawImage(img, ax * this._t, ay * this._t, thing.width * this._t, thing.height * this._t);
                    ctx.restore();
                }.bind(this));
            }
        }
    }
    if (this._x != null && this._tool != 'lock') {
        var ax = this._margins.left + this._x;
        var ay = this._margins.top + this._y;
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.strokeRect(ax * this._t + 0.5, ay * this._t + 0.5, this._t - 1, this._t - 1);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.strokeRect(ax * this._t + 1.5, ay * this._t + 1.5, this._t - 3, this._t - 3);
    }
    if (this._sx != null) {
        var ax = this._margins.left + this._sx;
        var ay = this._margins.top + this._sy;
        ctx.strokeStyle = 'rgba(128,128,255,1)';
        ctx.strokeRect(ax * this._t - 1.5, ay * this._t - 1.5, this._t + 3, this._t + 3);
        ctx.strokeStyle = 'rgba(255,255,0,1)';
        ctx.strokeRect(ax * this._t - 0.5, ay * this._t - 0.5, this._t + 1, this._t + 1);
    }
};

PlaceEdit.prototype._renderThingSample = function () {
    var ctx = this._thingsample.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, this._thingsample.width, this._thingsample.height);
    if (!this._thing)
        return;
    var image = new Image;
    image.src = this._thing.img;
    var cx = this._thingsample.width/2;
    var cy = this._thingsample.height/2;
    var x = Math.floor((this._thingsample.width/ThingDB.TILE_PIXELS - this._thing.width)/2) * ThingDB.TILE_PIXELS;
    var y = Math.floor((this._thingsample.height/ThingDB.TILE_PIXELS - this._thing.height)/2) * ThingDB.TILE_PIXELS;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this._thingRotate * Math.PI / 180);
    ctx.translate(-cx, -cy);
    ctx.drawImage(image, x, y);
    ctx.restore();
};

PlaceEdit.prototype._rerender = function () {
    if (!this._place)
        return;
    if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_FULL) {
        this._margins = {top: 4, left: 4, right: 4, bottom: 4};
    } else if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_PLOT) {
        this._margins = {top: 4, left: 1, right: 1, bottom: 0};
    } else if (this._place.type == PlaceDB.TYPE_CITY_BLOCK_HALF_CORNER) {
        this._margins = {top: 4, left: 4, right: 1, bottom: 1};
    } else
        this._margins = {top: 0, left: 0, right: 0, bottom: 0};
    var typeInfo = PlaceDB.TYPE_INFO[this._place.type];
    this._elem.find('.ifwidth').toggle(!typeInfo.width);
    this._elem.find('.ifheight').toggle(!typeInfo.height);
    this._t = ThingDB.TILE_PIXELS * 2;
    this._canvas.width = (this._place.width + this._margins.left + this._margins.right) * this._t;
    this._canvas.height = (this._place.height + this._margins.top + this._margins.bottom) * this._t;
    this._renderView();
    this._thingsample.width = ThingDB.TILE_PIXELS * 5;
    this._thingsample.height = ThingDB.TILE_PIXELS * 5;
    this._renderThingSample();
};

PlaceEdit.prototype._activateTool = function () {
    if (this._tool == 'lock' || this._x == null)
        return;
    if (this._tool == 'thing') {
        var thing = this._thing;
        if (!thing)
            return;
        var coord = this._x + ',' + this._y;
        this._place.tiles[coord] = this._place.tiles[coord] || {};
        if (thing.type == ThingDB.TYPE_FLOOR) {
            this._place.tiles[coord].floor = thing.name;
        } else {
            if (coord in this._tcoords)
                return;
            this._tcoords[coord] = true;
            this._place.tiles[coord].things = this._place.tiles[coord].things || [];
            var athing = {
                type: thing.name
            };
            if (this._thingRotate)
                athing.rotate = this._thingRotate;
            this._place.tiles[coord].things.push(athing);
        }
    } else if (this._tool == 'tile') {
        this._sx = this._x;
        this._sy = this._y;
    }
};

PlaceEdit.prototype._onImageMouseMove = function (event) {
    var x = Math.floor(event.offsetX / this._t) - this._margins.left;
    var y = Math.floor(event.offsetY / this._t) - this._margins.top;
    if (x < 0 || y < 0 || x >= this._place.width || y >= this._place.height)
        x = y = null;
    this._x = x;
    this._y = y;
    this._renderView();
    if (event.buttons == 1) {
        if (this._tool == 'lock') {
            var body = this._elem.find('.view .body')[0];
            body.scrollLeft += this._vx - event.offsetX;
            body.scrollTop += this._vy - event.offsetY;
        }
        this._activateTool();
    }
};

PlaceEdit.prototype._onImageMouseOut = function (event) {
    this._x = this._y = null;
    this._renderView();
};

PlaceEdit.prototype._onImageMouseDown = function (event) {
    this._vx = event.offsetX;
    this._vy = event.offsetY;
    this._tcoords = {};
    this._activateTool();
    event.preventDefault();
    return false;
};

PlaceEdit.prototype._onImageMouseUp = function (event) {
    if (this._tool == 'lock')
        return;
    this._place = this._db.changePlace(this._place.name, this._place);
    this._rerender();
};

PlaceEdit.prototype.select = function (place) {
    this._place = place;
    this._elem.find('.ifplace').toggle(!!place);
    this._elem.find('.ifnoplace').toggle(!place);
    if (place) {
        this._elem.find('.info input[name="name"]').prop('value', place.name)
            .focus()[0].select();
        this._elem.find('.info select[name="type"]').prop('value', place.type);
        this._elem.find('.info input[name="width"]').prop('value', place.width);
        this._elem.find('.info input[name="height"]').prop('value', place.height);
        this._margins = {top: 0, left: 0, right: 0, bottom: 0};
        this._rerender();
    }
    this._onTool(null);
};

PlaceEdit.prototype._onNew = function(event) {
    this.select(this._db.newPlace());
};

PlaceEdit.prototype._onRemove = function(event) {
    if (!this._place)
        return;
    this._db.removePlace(this._place.name);
    this.select();
};

PlaceEdit.prototype._onTool = function (tool, event) {
    tool = tool || 'lock';
    this._sx = this._sy = null;
    if (this._tool) {
        this._elem.find('.tools input[name="' + this._tool + '"]').removeClass('selected').blur();
        this._elem.find('.view canvas').removeClass(this._tool + '-tool');
    }
    this._tool = tool;
    this._elem.find('.tools input[name="' + this._tool + '"]').addClass('selected');
    this._elem.find('.view canvas').addClass(this._tool + '-tool');
    this._elem.find('.toolbar .thing').toggle(this._place && this._tool == 'thing');
    this._elem.find('.toolbar .thingdb').toggle(this._place && this._tool == 'thing');
    this._elem.find('.toolbar .tile').toggle(this._place && this._tool == 'tile');
};

PlaceEdit.prototype._onThing = function (thing) {
    this._thing = thing;
    this._thingRotate = 0;
    this._onTool('thing');
    this._rerender();
};

PlaceEdit.prototype._onThingRotate = function () {
    var canRotate = ThingDB.TYPE_INFO[this._thing.type].canRotate || 1;
    this._thingRotate = (this._thingRotate + (360 / canRotate)) % 360;
    this._renderThingSample();
};
