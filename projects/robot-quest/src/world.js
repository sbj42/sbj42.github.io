'use strict';
define(['lib/underscore', 'util', 'level'], function(_, util, levelmod) {
    var worldmod = {
        load: function(worldIndex, worldId, game) {
            var path = 'data/worlds/' + worldId + '/';
            return util.getJson(path + 'data.json').then(function(worldSpec) {
                var world = {
                    game: game,
                    path: path,
                    id: worldId,
                    index: worldIndex,

                    spec: worldSpec,
                    name: worldSpec.name || 'Unnamed',
                    background: './worlds/' + worldId + '/background',
                    
                    playSong: function() {
                        if (this.spec.song)
                            this.game.playSong(this.spec.song);
                    }
                };
                return Promise.all(_.map(worldSpec.levels, function(levelSpec, levelIndex) {
                    return levelmod.create(levelIndex, levelSpec, world);
                })).then(function(levels) {
                    world.levels = levels;
                    return world;
                });
            });
        }
    };
    return worldmod;
});