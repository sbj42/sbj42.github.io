'use strict';
define(['lib/underscore', 'util', 'world', 'menu_title', 'menu_player', 'menu_world', 'menu_level', 'menu_the_end'], function(_, util,
        worldmod, menu_titlemod, menu_playermod, menu_worldmod, menu_levelmod, menu_the_endmod) {
    var gamemod = null;
    gamemod = {
        KEYS: {
            13: 'enter',
            27: 'escape',
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            77: 'm',
            107: 'nplus'
        },

        load: function() {
            return util.getJson('data/data.json').then(function(gameSpec) {
                var game = null;
                game = {

                    playerImageBase: 'robot1',

                    NUM_ROBOTS: 4,
                    
                    audioEnabled: true,
                    
                    currentSong: '',

                    imageUrl: function(image) {
                        if (image.substr(0, 2) == './')
                            return 'data/' + image.substr(2) + '.svg';
                        else
                            return 'images/' + image + '.svg';
                    },

                    showCenterDiv: function(name) {
                        var centerNode = document.getElementById('center');
                        _.each(centerNode.childNodes, function(node) {
                            if (node.nodeName == 'DIV')
                                node.style.display = node.id == name ? '' : 'none';
                        });
                    },

                    start: function() {
                        document.onkeydown = _.bind(this.onKey, this);
                        // // hack:
                        // this.currentWorld = 0;
                        // this.currentLevel = 0;
                        this.screen = menu_titlemod.start(this);
                        // var level =
                        // this.worlds[this.currentWorld].levels[this.currentLevel];
                        // this.screen = level.start();
                    },
                    
                    playSong: function(song) {
                        if (this.currentSong == song)
                            return;
                        this.currentSong = song;
                        //var src = 'music/' + song + '.ogg';
                        //this.audio = document.getElementById('audio');
                        //var audio = this.audio;
                        //audio.innerHTML = '';
                        //audio.preload = 'auto';
                        //audio.autobuffer = true;
                        //var source = document.createElement('source');
                        //source.type = 'audio/wav';
                        //source.src = src;
                        //audio.appendChild(source);
                        //audio.load();
                        //if (this.audioEnabled)
                        //    audio.play();
                    },
                    
                    toggleAudio: function() {
                        this.audioEnabled = !this.audioEnabled;
                        //if (this.audioEnabled)
                        //    this.audio.play();
                        //else
                        //    this.audio.pause();
                    },

                    gotoTitleMenu: function() {
                        this.screen = menu_titlemod.start(this);
                    },

                    gotoPlayerMenu: function() {
                        this.screen = menu_playermod.start(this);
                    },

                    gotoWorldMenu: function(back) {
                        if (this.unlockedWorld == 0) {
                            if (back)
                                this.gotoPlayerMenu();
                            else
                                this.gotoLevelMenu(0);
                        } else
                            this.screen = menu_worldmod.start(this);
                    },

                    gotoLevelMenu: function(worldIndex, back) {
                        if (this.unlockedWorld == worldIndex && this.unlockedLevel == 0) {
                            if (back)
                                this.gotoWorldMenu(back);
                            else
                                this.gotoLevel(worldIndex, 0);
                        } else
                            this.screen = menu_levelmod.start(this.worlds[worldIndex]);
                    },

                    gotoTheEndMenu: function() {
                        this.screen = menu_the_endmod.start(this);
                    },

                    gotoLevel: function(worldIndex, levelIndex) {
                        this.worldIndex = worldIndex;
                        this.levelIndex = levelIndex;
                        if (this.worldIndex > this.unlockedWorld) {
                            this.unlockedWorld = this.worldIndex;
                            this.unlockedLevel = 0;
                        } else if (this.worldIndex == this.unlockedWorld && this.levelIndex > this.unlockedLevel)
                            this.unlockedLevel = this.levelIndex;
                        if (!this.testMode) {
                            //chrome.storage.sync.set({
                            //    'unlockedWorld': this.unlockedWorld,
                            //    'unlockedLevel': this.unlockedLevel
                            //});
                        }
                        var level = this.worlds[this.worldIndex].levels[this.levelIndex];
                        console.info('starting ' + (this.worldIndex + 1) + '-' + (this.levelIndex + 1));
                        this.screen = level.start();
                    },

                    nextLevel: function() {
                        if (this.levelIndex + 1 < this.worlds[this.worldIndex].levels.length)
                            this.gotoLevel(this.worldIndex, this.levelIndex + 1);
                        else if (this.worldIndex + 1 < this.worlds.length)
                            this.gotoLevel(this.worldIndex + 1, 0);
                        else
                            this.gotoTheEndMenu();
                    },

                    previousLevel: function() {
                        if (this.levelIndex - 1 >= 0)
                            this.gotoLevel(this.worldIndex, this.levelIndex - 1);
                        else if (this.worldIndex - 1 >= 0)
                            this.gotoLevel(this.worldIndex - 1, this.worlds[this.worldIndex - 1].levels.length - 1);
                    },

                    onKey: function(event) {
                        event = event || window.event;
                        var keyCode = 'which' in event ? event.which : event.keyCode;
                        var key = gamemod.KEYS[keyCode];
                        if (!key)
                            key = 'other';
                        // if (event.altKey)
                        // key = 'alt+' + key;
                        if (event.ctrlKey)
                            key = 'ctrl+' + key;
                        if (event.shiftKey)
                            key = 'shift+' + key;
                        if (key == 'shift+ctrl+up')
                            this.nextLevel();
                        else if (key == 'shift+ctrl+down')
                            this.previousLevel();
                        else if (key == 'm')
                            this.toggleAudio();
                        else if (key == 'shift+ctrl+nplus') {
                            this.testMode = true;
                            this.unlockedWorld = this.worlds.length;
                            this.unlockedLevel = 0;
                        } else
                            this.screen.onKey(key);
                    }
                };
                return Promise.all(_.map(gameSpec.worldIds, function(worldId, worldIndex) {
                    return worldmod.load(worldIndex, worldId, game);
                })).then(function(worlds) {
                    game.worlds = worlds;
                    return new Promise(function(resolve) {
                        //chrome.storage.sync.get({
                        //    'unlockedWorld': 0,
                        //    'unlockedLevel': 0
                        //}, function(data) {
                        //    if (chrome.runtime.lastError) {
                        //        game.unlockedWorld = 0;
                        //        game.unlockedLevel = 0;
                        //    } else {
                        //        game.unlockedWorld = data.unlockedWorld;
                        //        game.unlockedLevel = data.unlockedLevel;
                        //    }
                            game.unlockedWorld = game.worlds.length;
                            game.unlockedLevel = 0;
                            game.worldIndex = 0;//game.unlockedWorld;
                            game.levelIndex = 0;//game.unlockedLevel;
                            console.info('unlocked to ' + (game.unlockedWorld + 1) + '-' + (game.unlockedLevel + 1));
                            resolve();
                        //});
                    });
                }).then(function() {
                    return game;
                });
            });
        }
    };
    return gamemod;
});
