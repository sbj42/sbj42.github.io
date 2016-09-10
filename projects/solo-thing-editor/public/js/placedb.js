function PlaceDB(db, elem) {
    if (!(this instanceof PlaceDB))
        return new PlaceDB(db, elem);
    this._db = db;
    this._elem = $(elem);
    this._elem.find('.search .buttons input[name="reset"]').on('click', this._onReset.bind(this));
    ['name', 'type'].forEach(function(n) {
        this._elem.find('.search input[name="' + n + '"]')
      .on('input', this._onInput.bind(this));
    }, this);
    ['name', 'type'].forEach(function(n) {
        this._elem.find('.results th.' + n + 'col')
      .on('click', this._setSort.bind(this, n));
    }, this);
    $(this._db).on('loaded', this._onLoad.bind(this));
    this._sort = 'name';
}

PlaceDB.TYPE_INFO = {
    'city-block-full': {
        width: 60,
        height: 60
    },
    'city-half-block-plot': {
        minWidth: 8,
        maxWidth: 60,
        defWidth: 10,
        height: 30
    }
};

PlaceDB.prototype._onLoad = function () {
    this._onSelect(null);
};

PlaceDB.prototype._save = function () {
    this._db.save();
};

PlaceDB.prototype._update = function () {
    var sname = this._elem.find('.search input[name="name"]').prop('value').trim();
    var stype = this._elem.find('.search input[name="type"]').prop('value').trim().toLowerCase();

    var table = this._elem.find('.results .table tbody').empty();
    var names = [];
    var places = this._db.places();
    for (var name in places)
        names.push(name);
    names.sort(function(a, b) {
        var ta = places[a];
        var tb = places[b];
        if (ta[this._sort] < tb[this._sort]) return -1;
        if (ta[this._sort] > tb[this._sort]) return 1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }.bind(this));
    names.forEach(function(name) {
        var place = places[name];
        if (sname && place.name.indexOf(sname) < 0)
            return;
        if (stype && place.type.indexOf(stype) < 0)
            return;
        var tr = $('<tr>').addClass('result').appendTo(table);
        tr.toggleClass('selected', name == this._selected);
        $('<td>').appendTo(tr).text(place.name);
        $('<td>').appendTo(tr).text(place.type);
        tr.on('click', this._onSelect.bind(this, place));
    }.bind(this));
};

PlaceDB.NEW_TEMPLATE = {
    type: 'city-block',
    width: 60,
    height: 60
};

PlaceDB.prototype.newPlace = function() {
    var i = 1;
    var places = this._db.places();
    while (('place' + i) in places)
        i ++;
    var place = this._selected ? places[this._selected] : PlaceDB.NEW_TEMPLATE;
    place = {
        name: 'place' + i,
        type: place.type,
        width: place.width,
        height: place.height
    };
    places[place.name] = place;
    var changed = this._db._changed.places;
    changed[place.name] = true;
    this.select(place.name);
    this._save();
    return place;
};

PlaceDB.prototype.removePlace = function(name) {
    if (name == this._selected)
        this._selected = null;
    var places = this._db.places();
    delete places[name];
    this._update();
    var changed = this._db._changed.places;
    changed[name] = true;
    this.save();
};

PlaceDB.prototype.changePlace = function(name, data) {
    var places = this._db.places();
    var changed = this._db._changed.places;
    var place = places[name];
    if (data.name && data.name != name) {
        changed[name] = true;
        if (places[data.name])
            return place;
        places[data.name] = place;
        delete places[name];
        if (this._selected == name)
            this._selected = data.name;
    }
    for (var key in data) {
        place[key] = data[key];
    }
    changed[place.name] = true;
    this.select(place.name);
    this._update();
    this._save();
    return place;
};

PlaceDB.prototype._onReset = function() {
    this._elem.find('.search input[type="text"]').prop('value', '');
    this._update();
};

PlaceDB.prototype._onSelect = function (place) {
    $(this).trigger('select', [place]);
    this.select(place ? place.name : null);
};

PlaceDB.prototype.select = function(name) {
    this._selected = name;
    this._update();
};

PlaceDB.prototype._onInput = function () {
    this._update();
};

PlaceDB.prototype._setSort = function (sort) {
    this._sort = sort;
    this._update();
};

PlaceDB.prototype.places = function () {
    return this._db.places();
};
