function DB(elem) {
    if (!(this instanceof DB))
        return new DB(elem);
    this._data = {};
    this._changed = {
        things: {},
        places: {}
    };
}

DB.prototype.load = function () {
    $('.ifwait').removeClass('hide');
    $('.ifnowait').addClass('hide');
    $.ajax({
        method: 'GET',
        url: '/load',
        dataType: 'json'
    }).done(function(data) {
        this._data = data;
        $('.ifwait').addClass('hide');
        $('.ifnowait').removeClass('hide');
        $(this).trigger('loaded');
    }.bind(this));
};

DB.prototype.save = function () {
    // TODO detect failure
    // TODO what if a save takes a while and another save comes in
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(function() {
        $('#status').show().text('Saving...');
        //$('.ifwait').removeClass('hide');
        //$('.ifnowait').addClass('hide');
        var changed = {
            things: {},
            places: {}
        };
        if (this._changed.things) {
            for (var id in this._changed.things)
                changed.things[id] = this._data.things[id] || null;
        }
        if (this._changed.places) {
            for (var id in this._changed.places)
                changed.places[id] = this._data.places[id] || null;
        }
        this._changed = {
            things: {},
            places: {}
        };
        $.ajax({
            method: 'POST',
            url: '/save',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(changed)
        }).done(function() {
            $('#status').hide();
            //$('.ifwait').addClass('hide');
            //$('.ifnowait').removeClass('hide');
        }.bind(this)).fail(function(req, status) {
            $('#status').text('Save Failed: ' + status);
        }.bind(this));
    }.bind(this), 1000);
};

DB.prototype.things = function () {
    return this._data.things || {};
};

DB.prototype.places = function () {
    return this._data.places || {};
};
