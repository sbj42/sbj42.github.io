function ThingDB(db, elem) {
    if (!(this instanceof ThingDB))
        return new ThingDB(db, elem);
    this._db = db;
    this._elem = $(elem);
    this._elem.find('.search .buttons input[name="reset"]').on('click', this._onReset.bind(this));
    ['name', 'type', 'category', 'tags'].forEach(function(n) {
        this._elem.find('.search input[name="' + n + '"]')
      .on('input', this._onInput.bind(this));
    }, this);
    ['name', 'type', 'category'].forEach(function(n) {
        this._elem.find('.results th.' + n + 'col')
      .on('click', this._setSort.bind(this, n));
    }, this);
    $(this._db).on('loaded', this._onLoad.bind(this));
    this._sort = 'name';
}

ThingDB.TILE_PIXELS = 10;

ThingDB.TYPE_FLOOR = 'floor';
ThingDB.TYPE_DECORATION = 'decoration';
ThingDB.TYPE_WATER = 'water';
ThingDB.TYPE_WALL = 'wall';

ThingDB.TYPE_INFO = {
    'creature': {
        canRotate: 8,
        canBlockMovement: true
    },
    'decoration': {
        canRotate: 4
    },
    'item': {
        canRotate: 4
    },
    'floor': {
        width: 1,
        height: 1
    },
    'matter': {
        canRotate: 4,
        canBlockVision: true,
        canBlockMovement: true
    },
    'container': {
        canRotate: 4,
        canBlockVision: true,
        canBlockMovement: true,
        container: true
    },
    'tree': {
        canBlockVision: true,
        canBlockMovement: true
    },
    'vehicle': {
        canRotate: 4,
        canBlockVision: true
    },
    'wall': {
        canRotate: 4,
        canBlockVision: true,
        canBlockMovement: true,
        width: 1,
        height: 1
    },
    'door': {
        canRotate: 4,
        canFlip: true,
        canBlockVision: true,
        canBlockMovement: true,
        width: 1,
        height: 2,
        anchorX: 0,
        anchorY: 1
    },
    'water': {
        canBlockMovement: true,
        width: 6,
        height: 3
    }
};

ThingDB.prototype._onLoad = function () {
    this._onSelect(null);
};

ThingDB.prototype._save = function () {
    this._db.save();
};

ThingDB.prototype._update = function () {
    var sname = this._elem.find('.search input[name="name"]').prop('value').trim();
    var stype = this._elem.find('.search input[name="type"]').prop('value').trim().toLowerCase();
    var scategory = this._elem.find('.search input[name="category"]').prop('value').trim().toLowerCase();
    //var stags = this._elem.find('.search input[name="tags"]').prop('value').trim().split(/\s*,\s*/);

    var table = this._elem.find('.results .table tbody').empty();
    var names = [];
    var things = this._db.things();
    for (var name in things)
        names.push(name);
    names.sort(function(a, b) {
        var ta = things[a];
        var tb = things[b];
        if (ta[this._sort] < tb[this._sort]) return -1;
        if (ta[this._sort] > tb[this._sort]) return 1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }.bind(this));
    names.forEach(function(name) {
        var thing = things[name];
        if (sname && thing.name.indexOf(sname) < 0)
            return;
        if (stype && thing.type.indexOf(stype) < 0)
            return;
        if (scategory && thing.category.indexOf(scategory) < 0)
            return;
        var tr = $('<tr>').addClass('result').appendTo(table);
        tr.toggleClass('selected', name == this._selected);
        var imgtd = $('<td>').appendTo(tr);
        $('<img>').appendTo(imgtd).prop('src', thing.img).toggleClass('doubleup', thing.width <= 3);
        $('<td>').appendTo(tr).text(thing.name);
        $('<td>').appendTo(tr).text(thing.type);
        $('<td>').appendTo(tr).text(thing.category);
    //$('<td>').appendTo(tr).text(thing.tags.join(', '));
        tr.on('click', this._onSelect.bind(this, thing));
    }.bind(this));
};

ThingDB.NEW_TEMPLATE = {
    type: 'decoration',
    category: '',
    tags: [],
    width: 1,
    height: 1
};

ThingDB.prototype.newThing = function() {
    var i = 1;
    var things = this._db.things();
    while (('thing' + i) in things)
        i ++;
    var template = this._selected ? things[this._selected] : ThingDB.NEW_TEMPLATE;
    var thing = $.extend({}, template);
    thing.name = 'place' + i;
    if (!this._selected) {
        var c = document.createElement('canvas');
        c.width = ThingDB.TILE_PIXELS * thing.width;
        c.height = ThingDB.TILE_PIXELS * thing.height;
        var ctx = c.getContext('2d');
        if (thing.type == ThingDB.TYPE_FLOOR) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, c.width, c.height);
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
        }
        thing.img = c.toDataURL('image/png');
    }
    things[thing.name] = thing;
    var changed = this._db._changed.things;
    changed[thing.name] = true;
    this.select(thing.name);
    this._save();
    return thing;
};

ThingDB.prototype.removeThing = function(name) {
    if (name == this._selected)
        this._selected = null;
    var things = this._db.things();
    delete things[name];
    this._update();
    var changed = this._db._changed.things;
    changed[name] = true;
    this._save();
};

ThingDB.prototype.changeThing = function(name, data) {
    var things = this._db.things();
    var changed = this._db._changed.things;
    var thing = things[name];
    if (data.name && data.name != name) {
        changed[name] = true;
        if (things[data.name])
            return thing;
        things[data.name] = thing;
        delete things[name];
        if (this._selected == name)
            this._selected = data.name;
    }
    for (var key in data)
        thing[key] = data[key];
    changed[thing.name] = true;
    this.select(thing.name);
    this._update();
    this._save();
    return thing;
};

ThingDB.prototype._onReset = function() {
    this._elem.find('.search input[type="text"]').prop('value', '');
    this._update();
};

ThingDB.prototype._onSelect = function (thing) {
    $(this).trigger('select', [thing]);
    this.select(thing ? thing.name : null);
};

ThingDB.prototype.select = function(name) {
    this._selected = name;
    this._update();
};

ThingDB.prototype._onInput = function () {
    this._update();
};

ThingDB.prototype._setSort = function (sort) {
    this._sort = sort;
    this._update();
};

ThingDB.prototype.things = function () {
    return this._db.things();
};
