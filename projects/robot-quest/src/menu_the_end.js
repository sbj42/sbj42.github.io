'use strict';
define(['lib/underscore'], function(_) {
    var menu_the_endmod = {
        start: function(game) {
            var menu = null;
            menu = {
                game: game,
                
                background: './background-the-end',
                
                TICK_SPEED: 4,
                PEEK_SPEED: 3,
                
                GUYS: [
                   'players/robot1',
                   'players/robot1-dizzy',
                   'players/robot2',
                   'players/robot3',
                   'players/robot4',
                   'characters/dog',
                   'characters/farmer',
                   'characters/fox',
                   'characters/fox-frozen',
                   'characters/frog',
                   'characters/goose',
                   'characters/monkey',
                   'characters/pig',
                   'characters/pig-glasses',
                   'characters/pig-muddy',
                   'characters/puppy',
                   'characters/rabbit',
                   'characters/rabbit-pig',
                   'characters/sheep-purple',
                   'characters/sheep-orange',
                   'characters/sheep-white',
                   'characters/snake',
                   'characters/snowman'
                ],

                getNode: function() {
                    return document.getElementById('menu_the_end');
                },

                renderName: function() {
                    var bottomNode = document.getElementById('bottom');
                    bottomNode.innerHTML = 'Press SPACE to keep playing';
                },

                onKey: function(key) {
                    if (key == 'escape' || key == 'enter' || key == 'space') {
                        if (this.timer)
                            clearTimeout(this.timer);
                        this.timer = null;
                        var top = document.getElementById('top');
                        top.style.visiblilty = '';
                        this.game.gotoTitleMenu();
                    }
                    return Promise.resolve();
                },

                checkScreen: function() {
                    return this.game.screen === this.screen;
                },
                
                peek_start: function() {
                    if (!this.checkScreen())
                        return;
                    var guy = this.GUYS[Math.floor(Math.random() * this.GUYS.length)];
                    this.peek_left = Math.random() > 0.5;
                    var node = this.getNode();
                    var guyNode = document.getElementById('the_end_guy');
                    if (guyNode)
                        guyNode.parentNode.removeChild(guyNode);
                    var guyNode = document.createElement('img');
                    guyNode.id = 'the_end_guy';
                    guyNode.src = this.game.imageUrl(guy);
                    guyNode.style.transition = 'all ' + this.PEEK_SPEED + 's ease-in-out';
                    if (this.peek_left) {
                        if (Math.random() < 0.1)
                            guyNode.style.transform = 'scale(16) rotate(80deg)';
                        else
                            guyNode.style.transform = 'scale(16) rotate(40deg)';
                        guyNode.style.left = '-450px';
                    } else {
                        if (Math.random() < 0.1)
                            guyNode.style.transform = 'scale(16) rotate(-80deg)';
                        else
                            guyNode.style.transform = 'scale(16) rotate(-40deg)';
                        guyNode.style.right = '-450px';
                    }
                    node.appendChild(guyNode);
                    this.timer = setTimeout(_.bind(this.peek_in, this), 0);
                },
                
                peek_in: function() {
                    if (!this.checkScreen())
                        return;
                    var guyNode = document.getElementById('the_end_guy');
                    if (!guyNode)
                        return;
                    if (this.peek_left) {
                        guyNode.style.left = '20px';
                    } else {
                        guyNode.style.right = '20px';
                    }
                    this.timer = setTimeout(_.bind(this.peek_out, this), this.TICK_SPEED * 1000);
                },
                
                peek_out: function() {
                    if (!this.checkScreen())
                        return;
                    var guyNode = document.getElementById('the_end_guy');
                    if (!guyNode)
                        return;
                    if (this.peek_left) {
                        guyNode.style.left = '-450px';
                    } else {
                        guyNode.style.right = '-450px';
                    }
                    this.timer = setTimeout(_.bind(this.peek_start, this), this.TICK_SPEED * 1000);
                },

                start: function() {
                    this.renderName();
                    var guyNode = document.getElementById('the_end_guy');
                    if (guyNode)
                        guyNode.parentNode.removeChild(guyNode);
                    var node = this.getNode();
                    node.style.visibility = 'visible';
                    var top = document.getElementById('top');
                    top.style.visibility = 'hidden';
                    var backgroundUrl = this.game.imageUrl(this.background);
                    var backgroundNode = document.getElementById('background');
                    backgroundNode.style.backgroundImage = 'url(' + backgroundUrl + ')';
                    this.game.showCenterDiv('menu_the_end');
                    this.timer = setTimeout(_.bind(this.peek_start, this), this.TICK_SPEED * 1000 / 2);
                    return this.screen;
                }
            };
            menu.screen = {
                onKey: _.bind(menu.onKey, menu)
            };
            return menu.start();
        }
    };
    return menu_the_endmod;
});