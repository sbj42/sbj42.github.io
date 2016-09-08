function ThingEdit(db, elem) {
  if (!(this instanceof ThingEdit))
    return new ThingEdit(db, elem);
  this._db = db;
  this._elem = elem;
  ['name', 'category', 'tags', 'width', 'height'].forEach(function(n) {
    this._elem.find('.info input[name="' + n + '"]')
      .on('input', this._onInput.bind(this));
  }, this);
  this._elem.find('.info select[name="type"]')
    .on('change', this._onInput.bind(this));
  for (var x in ThingDB.TYPE_INFO) {
    if (ThingDB.TYPE_INFO.hasOwnProperty(x)) {
      $('<option>').attr('label', x).attr('value', x)
        .appendTo(this._elem.find('.info select[name="type"]'))
    }
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
  this._sample = this._elem.find('.sample .canvas')[0];
  this._elem.find('.image .canvas')
    .on('mousemove', this._onImageMouseMove.bind(this))
    .on('mouseout', this._onImageMouseOut.bind(this))
    .on('mousedown', this._onImageMouseDown.bind(this))
    .on('mouseup', this._onImageMouseUp.bind(this));
  ['sample', 'draw', 'mix', 'export'].forEach(function(n) {
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
  for (var i = 0; i < this._recent.length; i ++) {
    var r = this._recent[i];
    $('<canvas>').addClass('palettecolor')
      .on('click', this._onRecent.bind(this, i))
      .appendTo(this._elem.find('.tools .recent'));
  }
  this._updateRecent();
  this.select();
  this._onTool('draw');
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

ThingEdit._hslToRgb = function(h, s, l) {
  // based on https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion#9493060
  h /= 360; s /= 100; l /= 100;
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

ThingEdit._rgbToHsl = function(r, g, b) {
  // based on https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion#9493060
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}

ThingEdit.prototype._onInput = function () {
  var name = this._elem.find('.info input[name="name"]').prop('value').trim();
  if (!name) name = this._thing.name;
  var type = this._elem.find('.info select[name="type"]').prop('value').trim().toLowerCase();
  var category = this._elem.find('.info input[name="category"]').prop('value').trim();
  var tags = this._elem.find('.info input[name="tags"]').prop('value').trim().split(/\s+,\s+/);
  var width = parseInt(this._elem.find('.info input[name="width"]').prop('value'), 10);
  if (isNaN(width) || width < 1 || width > 5) width = this._thing.width;
  var height = parseInt(this._elem.find('.info input[name="height"]').prop('value'), 10);
  if (isNaN(height) || height < 1 || height > 5) height = this._thing.height;
  if (name == this._thing.name && type == this._thing.type && category == this._thing.category && tags.join(',') == this._thing.tags.join(',') && width == this._thing.width && height == this._thing.height)
    return;
  this._thing = this._db.changeThing(this._thing.name, {
    name: name,
    type: type,
    category: category,
    tags: tags,
    width: width,
    height: height
  });
  this._rerender();
};

ThingEdit.prototype._renderSample = function() {
  if (!this._thing)
    return;
  var thing = this._thing;
  var ctx = this._sample.getContext('2d');
  ctx.clearRect(0, 0, this._sample.width, this._sample.height);
  if (this._thing.type == ThingDB.TILE_TYPE_FLOOR) {
    ctx.fillStyle='#000';
    ctx.fillRect(0, 0, this._sample.width, this._sample.height);
  }
  var image = new Image;
  image.src = this._thing.img;
  ctx.drawImage(image, 0, 0);
};

ThingEdit.prototype._renderImage = function() {
  if (!this._thing)
    return;
  var thing = this._thing;
  var sctx = this._sample.getContext('2d');
  var ctx = this._canvas.getContext('2d');
  ctx.fillStyle='#000';
  ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  if (this._thing.type != ThingDB.TILE_TYPE_FLOOR) {
    ctx.strokeStyle='#666';
    ctx.lineWidth=2;
    var d = this._p / 5;
    for (var x = 0; x < ThingDB.TILE_PIXELS * thing.width; x ++) {
      for (var y = 0; y < ThingDB.TILE_PIXELS * thing.height; y ++) {
        ctx.strokeRect(x * this._p + d, y * this._p + d, this._p - d * 2, this._p - d * 2);
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
  if (this._x != null) {
    var ctx = this._canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeRect(this._x * this._p, this._y * this._p, this._p, this._p);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.strokeRect(this._x * this._p + 1, this._y * this._p + 1, this._p - 2, this._p - 2);
  }
};

// ThingEdit.prototype.setPixel = function(x, y, color) {
//   var ctx = this._canvas.getContext('2d');
//   ctx.fillStyle=color;
//   ctx.fillRect(x * this._p, y * this._p, this._p, this._p);
// };

ThingEdit.prototype._rerender = function () {
  var body = this._elem.find('.imgarea .image .body')[0];
  this._p = Math.min(20, Math.floor((Math.min(body.clientWidth, body.clientHeight) - 20) / (Math.max(this._thing.width, this._thing.height) * ThingDB.TILE_PIXELS)));
  this._t = ThingDB.TILE_PIXELS * this._p;
  this._st = ThingDB.TILE_PIXELS;
  this._canvas.width = this._thing.width * this._t;
  this._canvas.height = this._thing.height * this._t;
  this._sample.width = this._thing.width * this._st;
  this._sample.height = this._thing.height * this._st;
  this._renderSample();
  this._renderImage();
  var img = this._sample.toDataURL('image/png');
  if (img != this._thing.img) {
    this._thing = this._db.changeThing(this._thing.name, {
      img: img
    });
  }
};

ThingEdit.prototype._activateTool = function () {
  var ctx = this._sample.getContext('2d');
  if (this._tool == 'sample' && this._x != null) {
    var data = ctx.getImageData(this._x, this._y, 1, 1).data;
    var hsl = ThingEdit._rgbToHsl(data[0], data[1], data[2]);
    this._setColor(hsl[0], hsl[1], hsl[2], Math.round(data[3]*100/255));
  } else {
    var hsla = this._getColor();
    this._addRecent();
    if (this._tool == 'draw') {
      ctx.fillStyle = 'hsla(' + hsla[0] + ',' + hsla[1] + '%,' + hsla[2] + '%,' + (hsla[3]/100) + ')';
    } else if (this._tool == 'mix') {
      var cur = ctx.getImageData(this._x, this._y, 1, 1).data;
      var tgt = ThingEdit._hslToRgb(hsla[0], hsla[1], hsla[2]);
      function mix(a, b) {
        var ret = Math.round((a*14 + b)/15);
        a = Math.round(a);
        b = Math.round(b);
        if (ret == a && a != b)
          ret = a + (b > a ? 1 : -1);
        return ret;
      }
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
  var img = this._sample.toDataURL('image/png');
  if (img != this._thing.img) {
    this._thing = this._db.changeThing(this._thing.name, {
      img: img
    });
  }
  if (this._tool == 'sample') {
    this._addRecent();
    this._onTool(null);
  }
  this._rerender();
};

ThingEdit.prototype.select = function (thing) {
  this._thing = thing;
  this._elem.find('.ifthing').toggle(!!thing);
  this._elem.find('.ifnothing').toggle(!thing);
  this._onHSLA();
  if (thing) {
    this._elem.find('.info input[name="name"]').prop('value', thing.name)
        .focus()[0].select();
    this._elem.find('.info select[name="type"]').prop('value', thing.type);
    this._elem.find('.info input[name="category"]').prop('value', thing.category);
    this._elem.find('.info input[name="tags"]').prop('value', thing.tags.join(', '));
    this._elem.find('.info input[name="width"]').prop('value', thing.width);
    this._elem.find('.info input[name="height"]').prop('value', thing.height);
    this._rerender();
    // for (var x = 0; x < ThingDB.TILE_PIXELS * thing.width; x ++) {
    //   for (var y = 0; y < ThingDB.TILE_PIXELS * thing.height; y ++) {
    //     this.setPixel(x, y, ((x + y) & 1 == 1) ? 'white' : 'black');
    //   }
    // }
  } else {
    this._p = this._t = 0;
    this._canvas.width = 0;
    this._canvas.height = 0;
    this._sample.width = 0;
    this._sample.height = 0;
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
  tool = tool || 'draw';
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
