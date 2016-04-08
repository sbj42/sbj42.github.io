'use strict';
define(['lib/underscore', 'thing', 'floor', 'action'], function(_, thingmod, floormod, actionmod) {
    function getTileSpec(level, key) {
        var tileSpec = level.spec.legend && level.spec.legend[key];
        if (!tileSpec) {
            if (key == '@')
                tileSpec = 'player';
            else if (key == '_')
                tileSpec = {
                    floor: 'ice'
                };
            else if (key == '+')
                tileSpec = {
                    floor: 'ladder'
                };
            else if (key == '.')
                tileSpec = {};
            else if (key == '>')
                tileSpec = 'exit';
        }
        if (_.isString(tileSpec)) {
            if (tileSpec.substr(0, 5) == 'item:') {
                var item = tileSpec.substr(5);
                if (!level.script['player meets ' + item])
                    level.script['player meets ' + item] = ['player takes ' + item];
                tileSpec = {
                    thing: tileSpec
                };
            } else {
                tileSpec = {
                    thing: tileSpec
                };
            }
        }
        return tileSpec;
    }

    function createThing(level, x, y, thingSpec) {
        var thing = thingmod.create(thingSpec, x, y, level);
        level.things[thing.id] = thing;
    }

    var levelmod = null;
    levelmod = {

        DEFAULT_MAP_SIZE: 15,
        DEFAULT_TILE_SIZE: 40,

        create: function(levelIndex, levelSpec, world) {
            var level = {
                world: world,
                index: levelIndex,

                spec: levelSpec,
                name: levelSpec.name || 'Unnamed',
                background: levelSpec.background || world.spec.background || './background',
                script: levelSpec.script || [],
                mapWidth: levelmod.DEFAULT_MAP_SIZE,
                mapHeight: levelmod.DEFAULT_MAP_SIZE,
                tileSize: levelmod.DEFAULT_TILE_SIZE,
                variables: {},

                imageUrl: function(image) {
                    if (image.substr(0, 2) == './')
                        return world.path + image.substr(2) + '.svg';
                    else
                        return 'images/' + image + '.svg';
                },

                checkPosition: function(x, y) {
                    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight)
                        return false;
                    return true;
                },

                setFloor: function(x, y, floorSpec) {
                    if (!this.checkPosition(x, y))
                        return;
                    var floorIndex = y * this.mapWidth + x;
                    var floor = this.floors[floorIndex];
                    if (floor)
                        floor.destroy();
                    floor = floormod.create(floorSpec, x, y, this);
                    this.floors[floorIndex] = floor;
                },

                getFloor: function(x, y) {
                    var floorIndex = y * this.mapWidth + x;
                    return this.floors[floorIndex];
                },

                createThing: function(x, y, thingSpec) {
                    if (!this.checkPosition(x, y))
                        return;
                    var thing = thingmod.create(thingSpec, x, y, this);
                    if (thing)
                        this.things[thing.id] = thing;
                },

                getThing: function(thing) {
                    if (_.isString(thing))
                        return this.things[thing];
                    return thing;
                },

                getThingAt: function(x, y) {
                    var found = null;
                    _.each(this.things, function(thing) {
                        if (thing.x == x && thing.y == y)
                            found = thing;
                    });
                    return found;
                },

                getThingsAt: function(x, y) {
                    var ret = [];
                    _.each(this.things, function(thing) {
                        if (thing.x == x && thing.y == y)
                            ret.push(thing);
                    });
                    return ret;
                },

                getNode: function() {
                    return document.getElementById('level');
                },

                renderName: function() {
                    var bottomNode = document.getElementById('bottom');
                    bottomNode.innerHTML = 'Level ' + (this.world.index + 1) + '-' + (this.index + 1) + ': ' +
                            this.name;
                },

                getScript: function(event) {
                    var self = this;
                    var actions = this.script[event];
                    if (!actions) {
                        if (event == 'player meets exit')
                            actions = ["player moves toward exit", "wait 0.2 seconds", "next level"];
                    }
                    while (_.isObject(actions) && !_.isArray(actions)) {
                        var nextActions = _.find(actions, function(actions, condition) {
                            return actionmod.testCondition(self, condition);
                        });
                        if (nextActions)
                            actions = nextActions;
                        else if (actions.otherwise)
                            actions = actions.otherwise;
                        else
                            return null;
                    }
                    return actions;
                },

                setSpaceCallback: function(callback) {
                    this._spaceCallback = callback;
                },

                onKey: function(key) {
                    if (key == 'escape') {
                        this.world.game.gotoLevelMenu(this.world.index, true);
                        return Promise.resolve();
                    }
                    if (this._spaceCallback && (key == 'space' || key == 'enter')) {
                        this._spaceCallback();
                        this._spaceCallback = null;
                        return Promise.resolve();
                    }
                    if (this._blockInput)
                        return Promise.resolve();
                    var action = null;
                    if (key == 'up' || key == 'down' || key == 'left' || key == 'right')
                        action = 'player walks ' + key;
                    return this.run(action);
                },

                run: function(actions) {
                    var self = this;
                    this._blockInput = (this._blockInput || 0) + 1;
                    return actionmod.run(this, actions).then(function() {
                        self._blockInput--;
                    }, function(e) {
                        self._blockInput--;
                        console.error(e.stack || e);
                    });
                },

                checkScreen: function() {
                    return this.world.game.screen === this.screen;
                },

                start: function() {
                    var self = this;
                    this._spaceCallback = null;
                    this._blockInput = 0;
                    this.renderName();
                    var levelNode = this.getNode();
                    while (levelNode.firstChild)
                        levelNode.removeChild(levelNode.firstChild);
                    this.world.game.showCenterDiv('level');
                    this.world.playSong();
                    levelNode.style.width = this.mapWidth * this.tileSize + 'px';
                    levelNode.style.height = this.mapHeight * this.tileSize + 'px';
                    var backgroundUrl = this.imageUrl(this.background);
                    var backgroundNode = document.getElementById('background');
                    backgroundNode.style.backgroundImage = 'url(' + backgroundUrl + ')';
                    this.floors = new Array(this.mapWidth * this.mapHeight);
                    this.things = {};
                    this.variables = {};
                    for (var y = 0; y < this.spec.map.length; y++) {
                        var line = this.spec.map[y];
                        for (var x = 0; x < line.length; x++) {
                            var tileSpec = getTileSpec(this, line[x]);
                            if (!tileSpec)
                                continue;
                            this.setFloor(x, y, tileSpec.floor);
                            var things = tileSpec.things || tileSpec.thing || [];
                            if (!_.isArray(things))
                                things = [things];
                            _.each(things, function(thingSpec) {
                                this.createThing(x, y, thingSpec);
                            }, this);
                        }
                    }
                    if (this.script.start) {
                        this._blockInput = (this._blockInput || 0) + 1;
                        actionmod.run(this, this.script.start).then(function() {
                            self._blockInput--;
                        }, function(e) {
                            self._blockInput--;
                            console.error(e.stack || e);
                        });
                    }
                    return this.screen;
                }
            };
            level.screen = {
                onKey: _.bind(level.onKey, level)
            };
            return level;
        }
    };
    return levelmod;
});