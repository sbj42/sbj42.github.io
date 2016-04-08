'use strict';
define(['lib/underscore'], function(_) {
    var menu_titlemod = {
        start: function(game) {
            var menu = null;
            menu = {
                game: game,

                background: './background-title',

                TICK_SPEED: 0.8,
                MOVE_SPEED: 0.4,

                getNode: function() {
                    return document.getElementById('menu_title');
                },

                renderName: function() {
                    var bottomNode = document.getElementById('bottom');
                    bottomNode.innerHTML = 'Press SPACE to start';
                },

                onKey: function(key) {
                    if (key == 'enter' || key == 'space')
                        this.game.gotoPlayerMenu();
                },

                checkScreen: function() {
                    return this.game.screen === this.screen;
                },

                collision: function(x, y) {
                    for (var i = 0; i < this.guys.length; i++)
                        if (this.guys[i].x == x && this.guys[i].y == y)
                            return true;
                    return false;
                },

                update: function() {
                    var menuNode = this.getNode();
                    for (var i = 0; i < this.game.NUM_ROBOTS; i++) {
                        var guyNode = menuNode.childNodes[i];
                        var guy = this.guys[i];
                        guyNode.style.left = (20 + guy.x * 80) + 'px';
                        guyNode.style.top = (20 + guy.y * 80) + 'px';
                    }
                },

                tick: function() {
                    if (!this.checkScreen())
                        return;
                    for (var i = 0; i < this.guys.length; i++) {
                        var guy = this.guys[i];
                        while (true) {
                            var x = guy.x;
                            var y = guy.y;
                            switch (Math.floor(Math.random() * 5)) {
                                case 0 :
                                    x = -1;
                                    break;
                                case 1 :
                                    x++;
                                    break;
                                case 2 :
                                    y++;
                                    break;
                                case 3 :
                                    x--;
                                    break;
                                case 4 :
                                    y--;
                                    break;
                            }
                            if (x == -1)
                                break;
                            if (x < 0 || y < 0 || x >= 7 || y >= 7)
                                continue;
                            if (!this.collision(x, y)) {
                                this.guys[i] = {
                                    x: x,
                                    y: y
                                };
                                break;
                            }
                        }
                    }
                    this.update();
                    setTimeout(_.bind(this.tick, this), this.TICK_SPEED * 1000);
                },

                start: function() {
                    this.renderName();
                    var menuNode = this.getNode();
                    while (menuNode.firstChild)
                        menuNode.removeChild(menuNode.firstChild);
                    var backgroundUrl = this.game.imageUrl(this.background);
                    var backgroundNode = document.getElementById('background');
                    backgroundNode.style.backgroundImage = 'url(' + backgroundUrl + ')';
                    this.game.showCenterDiv('menu_title');
                    this.guys = [];
                    this.guys.push({
                        x: 0,
                        y: 0
                    });
                    this.guys.push({
                        x: 6,
                        y: 0
                    });
                    this.guys.push({
                        x: 0,
                        y: 6
                    });
                    this.guys.push({
                        x: 6,
                        y: 6
                    });
                    for (var i = 0; i < this.guys.length; i++) {
                        var guyNode = document.createElement('img');
                        guyNode.className = 'title_guy';
                        guyNode.src = this.game.imageUrl('players/robot' + (i + 1));
                        guyNode.style.transition = 'all ' + this.MOVE_SPEED + 's ease-in';
                        menuNode.appendChild(guyNode);
                    }
                    this.update();
                    setTimeout(_.bind(this.tick, this), this.TICK_SPEED * 1000);
                    this.game.playSong('processing');
                    return this.screen;
                }
            };
            menu.screen = {
                onKey: _.bind(menu.onKey, menu)
            };
            return menu.start();
        }
    };
    return menu_titlemod;
});