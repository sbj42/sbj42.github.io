$(window).ready(function() {
  var db = new ThingDB($('.thingdb'));
  var edit = new ThingEdit(db, $('.thingedit'));
  $(db).on('select', function(event, thing) {
    edit.select(thing);
  });
});
