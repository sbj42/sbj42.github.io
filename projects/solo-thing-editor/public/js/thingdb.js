function ThingDB(elem) {
  if (!(this instanceof ThingDB))
    return new ThingDB(elem);
  this._elem = $(elem);
  this._elem.find('.search .buttons input[name="reset"]').on('click', this._onReset.bind(this));
  ['name', 'type', 'category', 'tags'].forEach(function(n) {
    this._elem.find('.search input[name="' + n + '"]')
      .on('input', this._onInput.bind(this));
  }, this);
  this._things = {};
  this._changed = {};
  this.load();
}

ThingDB.TILE_PIXELS = 10;

ThingDB.TYPE_FLOOR = 'floor';

ThingDB.TYPE_INFO = {
  'floor': {
  },
  'decoration': {
    canRotate: 4
  },
  'furniture': {
    canRotate: 4,
		canBlockVision: true,
		canBlockMovement: true
  },
  'tree': {
		canBlockVision: true,
		canBlockMovement: true
  },
  'creature': {
    canRotate: 8,
		canBlockMovement: true
  },
  'wall': {
    canRotate: 4,
		canBlockVision: true,
		canBlockMovement: true
  }
}

ThingDB.prototype.load = function () {
  $('.ifwait').removeClass('hide');
  $('.ifnowait').addClass('hide');
  $.ajax({
    method: 'GET',
    url: '/load',
    dataType: 'json'
  }).done(function(data) {
    this._things = data.things;
    this._onSelect(null);
    $('.ifwait').addClass('hide');
    $('.ifnowait').removeClass('hide');
  }.bind(this));
};

ThingDB.prototype.save = function () {
  clearTimeout(this._saveTimeout);
  this._saveTimeout = setTimeout(function() {
    //$('.ifwait').removeClass('hide');
    //$('.ifnowait').addClass('hide');
    var changed = {};
    for (var id in this._changed) {
      if (this._changed.hasOwnProperty(id)) {
        changed[id] = this._things[id] || null;
      }
    }
    this._changed = {};
    $.ajax({
      method: 'POST',
      url: '/save',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        things: changed
      })
    }).done(function(data) {
      //$('.ifwait').addClass('hide');
      //$('.ifnowait').removeClass('hide');
    }.bind(this));
  }.bind(this), 1000);
};

ThingDB.prototype._update = function () {
  var name = this._elem.find('.search input[name="name"]').prop('value').trim();
  var type = this._elem.find('.search input[name="type"]').prop('value').trim().toLowerCase();
  var category = this._elem.find('.search input[name="category"]').prop('value').trim().toLowerCase();
  var tags = this._elem.find('.search input[name="tags"]').prop('value').trim().split(/\s*,\s*/);

  var table = this._elem.find('.results .table tbody').empty();
  for (var x in this._things) {
    if (this._things.hasOwnProperty(x)) {
      var thing = this._things[x];
      if (name && thing.name.indexOf(name) < 0)
        continue;
      if (type && thing.type.indexOf(type) < 0)
        continue;
      if (category && thing.category.indexOf(category) < 0)
        continue;
      var tr = $('<tr>').addClass('result').appendTo(table);
      tr.toggleClass('selected', x == this._selected);
      var imgtd = $('<td>').appendTo(tr);
      $('<img>').appendTo(imgtd).prop('src', thing.img).toggleClass('doubleup', thing.width <= 3);
      $('<td>').appendTo(tr).text(thing.name);
      $('<td>').appendTo(tr).text(thing.type);
      $('<td>').appendTo(tr).text(thing.category);
      //$('<td>').appendTo(tr).text(thing.tags.join(', '));
      tr.on('click', this._onSelect.bind(this, thing));
    }
  }
};

ThingDB.NEWTILE_TEMPLATE = {
  type: 'decoration',
  category: '',
  tags: [],
  width: 1,
  height: 1
};

ThingDB.prototype.newThing = function() {
  var i = 1;
  while (('thing' + i) in this._things)
    i ++;
  var thing = this._selected ? this._things[this._selected] : ThingDB.NEWTILE_TEMPLATE;
  thing = {
    name: 'thing' + i,
    type: thing.type,
    category: thing.category,
    tags: thing.tags.slice(),
    width: thing.width,
    height: thing.height,
    img: thing.img
  };
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
  this._things[thing.name] = thing;
  this._changed[thing.name] = true;
  this.select(thing.name);
  this.save();
  return thing;
};

ThingDB.prototype.removeThing = function(name) {
  if (name == this._selected)
    this._selected = null;
  delete this._things[name];
  this._update();
  this._changed[name] = true;
  this.save();
};

ThingDB.prototype.changeThing = function(name, data) {
  var thing = this._things[name];
  if (data.name && data.name != name) {
    this._changed[name] = true;
    if (this._things[data.name])
      return thing;
    this._things[data.name] = thing;
    delete this._things[name];
    if (this._selected == name)
      this._selected = data.name;
  }
  for (var x in data) {
    if (data.hasOwnProperty(x))
      thing[x] = data[x];
  }
  this._changed[thing.name] = true;
  this.select(thing.name);
  this._update();
  this.save();
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
