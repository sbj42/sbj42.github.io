'use strict';
define(['lib/underscore'], function(_) {
    var menu_playermod = {
        start: function(game) {
            var menu = null;
            menu = {
                game: game,
                selected: 1,

                background: './background-player',

                getNode: function() {
                    return document.getElementById('menu_player');
                },

                renderName: function() {
                    var bottomNode = document.getElementById('bottom');
                    bottomNode.innerHTML = 'Choose a robot';
                },

                onKey: function(key) {
                    if (key == 'escape')
                        this.game.gotoTitleMenu();
                    if (key == 'enter' || key == 'space')
                        this.game.gotoWorldMenu();
                    if (key == 'up' && this.selected > 1) {
                        this.selected--;
                        this.update();
                    }
                    if (key == 'down' && this.selected < this.game.NUM_ROBOTS) {
                        this.selected++;
                        this.update();
                    }
                },

                checkScreen: function() {
                    return this.game.screen === this.screen;
                },

                update: function() {
                    var menuNode = this.getNode();
                    for (var n = 1; n <= this.game.NUM_ROBOTS; n++) {
                        var choiceNode = menuNode.childNodes[n - 1];
                        choiceNode.style.background = n == this.selected ? 'rgba(220, 220, 180, 0.7)' : '';
                    }
                    this.game.playerImageBase = 'robot' + this.selected;
                },

                start: function() {
                    this.renderName();
                    var menuNode = this.getNode();
                    while (menuNode.firstChild)
                        menuNode.removeChild(menuNode.firstChild);
                    var backgroundUrl = this.game.imageUrl(this.background);
                    var backgroundNode = document.getElementById('background');
                    backgroundNode.style.backgroundImage = 'url(' + backgroundUrl + ')';
                    this.game.showCenterDiv('menu_player');
                    for (var n = 1; n <= this.game.NUM_ROBOTS; n++) {
                        var choiceDiv = document.createElement('div');
                        choiceDiv.className = 'player_choice';
                        var imageDiv = document.createElement('img');
                        imageDiv.src = this.game.imageUrl('players/robot' + n);
                        choiceDiv.appendChild(imageDiv);
                        menuNode.appendChild(choiceDiv);
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
    return menu_playermod;
});