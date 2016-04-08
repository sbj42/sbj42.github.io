'use strict';
define(['lib/underscore'], function(_) {
    var menu_levelmod = {
        start: function(world) {
            var menu = null;
            menu = {
                world: world,
                selected: world.game.worldIndex == world.index ? world.game.levelIndex : 0,

                getNode: function() {
                    return document.getElementById('menu_level');
                },

                renderName: function() {
                    var bottomNode = document.getElementById('bottom');
                    bottomNode.innerHTML = 'Choose a level';
                },

                onKey: function(key) {
                    if (key == 'escape')
                        this.world.game.gotoWorldMenu(true);
                    if (key == 'enter' || key == 'space')
                        this.world.game.gotoLevel(this.world.index, this.selected);
                    if (key == 'up' && this.selected > 0) {
                        this.selected--;
                        this.update();
                    }
                    if (key == 'down' && this.selected < this.levelCount - 1) {
                        this.selected++;
                        this.update();
                    }
                    return Promise.resolve();
                },

                checkScreen: function() {
                    return this.world.game.screen === this.screen;
                },

                update: function() {
                    var menuNode = this.getNode();
                    for (var i = 0; i < this.levelCount; i++) {
                        var choiceNode = menuNode.childNodes[i];
                        choiceNode.style.background = i == this.selected ? 'rgba(200, 200, 160, 0.7)' : '';
                    }
                },

                start: function() {
                    this.renderName();
                    var menuNode = this.getNode();
                    while (menuNode.firstChild)
                        menuNode.removeChild(menuNode.firstChild);
                    var backgroundUrl = this.world.game.imageUrl(this.world.background);
                    var backgroundNode = document.getElementById('background');
                    backgroundNode.style.backgroundImage = 'url(' + backgroundUrl + ')';
                    this.world.game.showCenterDiv('menu_level');
                    if (this.world.game.unlockedWorld == this.world.index)
                        this.levelCount = Math.min(this.world.levels.length, this.world.game.unlockedLevel + 1);
                    else
                        this.levelCount = this.world.levels.length;
                    for (var i = 0; i < this.levelCount; i++) {
                        var choiceNode = document.createElement('div');
                        choiceNode.className = 'level_choice';
                        choiceNode.innerHTML = (this.world.index + 1) + '-' + (i + 1) + ': ' +
                                this.world.levels[i].name;
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
    return menu_levelmod;
});