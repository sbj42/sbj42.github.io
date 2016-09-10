/* global PlaceDB */
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
    ['lock', 'thing'].forEach(function(n) {
        this._elem.find('.tools input[name="' + n + '"]')
            .on('click', this._onTool.bind(this, n));
    }, this);
    this.select();
    this._onTool(null);
}

PlaceEdit.prototype._onInput = function () {
    var name = this._elem.find('.info input[name="name"]').prop('value').trim();
    if (!name) name = this._place.name;
    var type = this._elem.find('.info select[name="type"]').prop('value').trim().toLowerCase();
    var width = parseInt(this._elem.find('.info input[name="width"]').prop('value'), 10);
    if (isNaN(width) || width < 1 || width > 330) width = this._place.width;
    var height = parseInt(this._elem.find('.info input[name="height"]').prop('value'), 10);
    if (isNaN(height) || height < 1 || height > 330) height = this._place.height;
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

PlaceEdit.prototype._rerender = function () {
    //var typeInfo = PlaceDB.TYPE_INFO[this._place.type];
};

PlaceEdit.prototype._activateTool = function () {
    if (this._tool == 'lock')
        return;
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
    if (this._tool) {
        this._elem.find('.tools input[name="' + this._tool + '"]').removeClass('selected').blur();
    }
    this._tool = tool;
    this._elem.find('.tools input[name="' + this._tool + '"]').addClass('selected');
};
