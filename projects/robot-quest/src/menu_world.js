'use strict';
define(['lib/underscore'], function(_) {
    var menu_worldmod = {
        start: function(game) {
            var menu = null;
            menu = {
                game: game,
                selected: game.worldIndex || 0,

                getNode: function() {
                    return document.getElementById('menu_world');
                },

                renderName: function() {
                    var bottomNode = document.getElementById('bottom');
                    bottomNode.innerHTML = 'Choose a world';
                },

                onKey: function(key) {
                    if (key == 'escape')
                        this.game.gotoPlayerMenu();
                    if (key == 'enter' || key == 'space')
                        this.game.gotoLevelMenu(this.selected);
                    if (key == 'up' && this.selected > 0) {
                        this.selected--;
                        this.update();
                    }
                    if (key == 'down' && this.selected < this.worldCount - 1) {
                        this.selected++;
                        this.update();
                    }
                    return Promise.resolve();
                },

                checkScreen: function() {
                    return this.game.screen === this.screen;
                },

                update: function() {
                    var menuNode = this.getNode();
                    for (var i = 0; i < this.worldCount; i++) {
                        var choiceNode = menuNode.childNodes[i];
                        choiceNode.style.background = i == this.selected ? 'rgba(200, 200, 160, 0.7)' : '';
                        if (this.selected == i) {
                            var backgroundUrl = this.game.imageUrl(this.game.worlds[this.selected].background);
                            var backgroundNode = document.getElementById('background');
                            backgroundNode.style.backgroundImage = 'url(' + backgroundUrl + ')';
                            this.game.worlds[i].playSong();
                        }
                    }
                },

                start: function() {
                    this.renderName();
                    var menuNode = this.getNode();
                    while (menuNode.firstChild)
                        menuNode.removeChild(menuNode.firstChild);
                    this.game.showCenterDiv('menu_world');
                    this.worldCount = Math.min(this.game.worlds.length, this.game.unlockedWorld + 1);
                    for (var i = 0; i < this.worldCount; i++) {
                        var choiceNode = document.createElement('div');
                        choiceNode.className = 'world_choice';
                        choiceNode.innerHTML = (i + 1) + ': ' + this.game.worlds[i].name;
                        menuNode.appendChild(choiceNode);
                    }
                    this.update();
                    return this.screen;
                }
            };
            menu.screen = {
                onKey: _.bind(menu.onKey, menu)
            };
            return menu.start();
        }
    };
    return menu_worldmod;
});